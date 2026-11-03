import asyncio
import sys
from types import SimpleNamespace
import unittest
from unittest.mock import patch

# Run against the versioned defaults, like a fresh clone without config.py.
sys.modules["config"] = None

from models import BotStatus, Config  # noqa: E402
from services import youtube  # noqa: E402


def fake_chat(messages: list[str], status: BotStatus) -> SimpleNamespace:
    """A chat that returns one batch of messages, then stops the bot."""
    author = SimpleNamespace(name="Viewer", channelId="viewer-id", imageUrl="")
    items = [
        SimpleNamespace(message=text, messageEx=[text], author=author)
        for text in messages
    ]
    batches_left = [items]

    def is_alive() -> bool:
        if batches_left:
            return True
        status.running = False
        return False

    def get() -> SimpleNamespace:
        batch = batches_left.pop()
        return SimpleNamespace(sync_items=lambda: batch)

    return SimpleNamespace(is_alive=is_alive, get=get)


class QueueTests(unittest.IsolatedAsyncioTestCase):
    async def listen(self, queue: asyncio.Queue, messages: list[str]):
        status = BotStatus(running=True)
        history, cooldowns = [], {}
        chat = fake_chat(messages, status)

        with patch.object(youtube.pytchat, "create", return_value=chat):
            await asyncio.wait_for(
                youtube.listener_loop(status, queue, Config(), history, cooldowns),
                timeout=2,
            )
        return status, history, cooldowns

    async def test_cooldown_skips_second_message_from_same_user(self) -> None:
        queue = asyncio.Queue(maxsize=10)

        status, history, cooldowns = await self.listen(queue, ["Hello", "Again"])

        self.assertEqual(queue.get_nowait(), ("Viewer", "Viewer says: Hello"))
        self.assertTrue(queue.empty())
        self.assertIn("viewer-id", cooldowns)
        self.assertEqual(status.queue_size, 1)
        self.assertEqual([m.was_read for m in history], [True, False])

    async def test_full_queue_drops_message_without_cooldown(self) -> None:
        queue = asyncio.Queue(maxsize=1)
        queue.put_nowait(("Earlier viewer", "Already waiting"))

        with self.assertLogs("services.youtube", level="WARNING"):
            _, history, cooldowns = await self.listen(queue, ["Hello"])

        self.assertEqual(queue.get_nowait(), ("Earlier viewer", "Already waiting"))
        self.assertEqual(cooldowns, {})
        self.assertFalse(history[0].was_read)


if __name__ == "__main__":
    unittest.main()
