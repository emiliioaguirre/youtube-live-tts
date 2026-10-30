import asyncio
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
from types import SimpleNamespace
import unittest
from unittest.mock import patch

from models import BotStatus, Config
from services import youtube


class CleanCheckoutTests(unittest.TestCase):
    def test_api_starts_without_private_config(self) -> None:
        backend = Path(__file__).resolve().parents[1]
        with tempfile.TemporaryDirectory() as directory:
            checkout = Path(directory) / "backend"
            shutil.copytree(
                backend,
                checkout,
                ignore=shutil.ignore_patterns(
                    "config.py", "__pycache__", ".env", "tests"
                ),
            )
            result = subprocess.run(
                [
                    sys.executable,
                    "-c",
                    "from fastapi.testclient import TestClient\n"
                    "from main import app\n"
                    "from services.websocket import websocket_clients\n"
                    "with TestClient(app) as client:\n"
                    "    status = client.get('/api/status')\n"
                    "    assert status.status_code == 200\n"
                    "    assert status.json() == dict(running=False, connected=False, messages_read=0, queue_size=0)\n"
                    "    config = client.get('/api/config').json()\n"
                    "    assert config['has_api_key'] is False\n"
                    "    assert 'elevenlabs_api_key' not in config\n"
                    "    assert client.post('/api/start').json() == {'error': 'Missing API key or video ID'}\n"
                    "    assert client.get('/api/history').json() == []\n"
                    "    with client.websocket_connect('/ws') as ws:\n"
                    "        assert ws.receive_json()['event'] == 'connected'\n"
                    "assert websocket_clients == []\n",
                ],
                cwd=checkout,
                capture_output=True,
                text=True,
                timeout=30,
            )
        self.assertEqual(result.returncode, 0, result.stderr)


class MessageQueueTests(unittest.IsolatedAsyncioTestCase):
    async def run_listener(self, queue: asyncio.Queue, messages: list[str]) -> tuple:
        status = BotStatus(running=True)
        history = []
        cooldowns = {}
        author = SimpleNamespace(name="Viewer", channelId="viewer-id", imageUrl="")
        items = [
            SimpleNamespace(message=text, messageEx=[text], author=author)
            for text in messages
        ]

        def finish_stream() -> bool:
            status.running = False
            return False

        # The second is_alive call ends this finite fixture without network access.
        calls = 0

        def is_alive() -> bool:
            nonlocal calls
            calls += 1
            if calls == 1:
                return True
            return finish_stream()

        chat = SimpleNamespace(
            is_alive=is_alive,
            get=lambda: SimpleNamespace(sync_items=lambda: items),
        )
        with patch.object(youtube.pytchat, "create", return_value=chat):
            await asyncio.wait_for(
                youtube.listener_loop(status, queue, Config(), history, cooldowns),
                timeout=2,
            )
        return status, history, cooldowns

    async def test_enqueued_message_sets_cooldown_before_next_message(self) -> None:
        queue = asyncio.Queue(maxsize=10)
        status, history, cooldowns = await self.run_listener(queue, ["Hello", "Again"])

        self.assertEqual(queue.qsize(), 1)
        self.assertEqual(queue.get_nowait(), ("Viewer", "Viewer says: Hello"))
        self.assertIn("viewer-id", cooldowns)
        self.assertEqual(status.queue_size, 1)
        self.assertEqual([message.was_read for message in history], [True, False])

    async def test_full_queue_keeps_message_out_of_cooldown(self) -> None:
        queue = asyncio.Queue(maxsize=1)
        queue.put_nowait(("Earlier viewer", "Already waiting"))
        with self.assertLogs("services.youtube", level="WARNING"):
            _, history, cooldowns = await self.run_listener(queue, ["Hello"])

        self.assertEqual(queue.get_nowait(), ("Earlier viewer", "Already waiting"))
        self.assertEqual(cooldowns, {})
        self.assertFalse(history[0].was_read)


if __name__ == "__main__":
    unittest.main()
