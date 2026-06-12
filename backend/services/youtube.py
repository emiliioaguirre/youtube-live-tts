import re
import time
import asyncio
import logging
from datetime import datetime

import pytchat

from models import ChatMessage
from config import (
    MAX_MESSAGE_HISTORY,
    POLL_INTERVAL_ACTIVE,
    POLL_INTERVAL_IDLE,
    RECONNECT_DELAY,
)
from .websocket import broadcast
from .tts import play_audio

logger = logging.getLogger(__name__)


def extract_video_id(url_or_id: str) -> str:
    patterns = [
        r"(?:youtube\.com\/live\/)([a-zA-Z0-9_-]{11})",
        r"(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})",
        r"(?:youtu\.be\/)([a-zA-Z0-9_-]{11})",
    ]
    for pattern in patterns:
        match = re.search(pattern, url_or_id)
        if match:
            return match.group(1)
    return url_or_id


def is_on_cooldown(author_id: str, user_cooldowns: dict, cooldown_seconds: int) -> bool:
    if author_id not in user_cooldowns:
        return False
    return (time.time() - user_cooldowns[author_id]) < cooldown_seconds


def is_valid_message(
    text: str,
    author_id: str,
    tts_prefix: str,
    max_message_length: int,
    user_cooldowns: dict,
    cooldown_seconds: int,
) -> bool:
    if tts_prefix and not text.lower().startswith(tts_prefix.lower()):
        return False
    content = text[len(tts_prefix) :].strip() if tts_prefix else text.strip()
    if not content:
        return False
    if len(content) > max_message_length:
        return False
    if is_on_cooldown(author_id, user_cooldowns, cooldown_seconds):
        return False
    return True


def extract_text_only(message_parts: list) -> str:
    text_parts = []
    for part in message_parts:
        if isinstance(part, str):
            text_parts.append(part)
    return " ".join("".join(text_parts).split()).strip()


async def speaker_loop(bot_status, message_queue, config, provider):
    while bot_status.running:
        try:
            author, text = await asyncio.wait_for(message_queue.get(), timeout=1.0)
            bot_status.queue_size = message_queue.qsize()
            await broadcast("queue_update", {"size": bot_status.queue_size})

            audio = None
            if provider:
                audio = await provider.synthesize(text, config.voice_id, config.speed)
            if audio:
                await asyncio.to_thread(play_audio, audio, config.volume)
                bot_status.messages_read += 1
                await broadcast(
                    "message_read",
                    {"author": author, "total": bot_status.messages_read},
                )
        except asyncio.TimeoutError:
            continue
        except Exception as e:
            logger.error(f"Speaker loop error: {e}")


async def listener_loop(
    bot_status, message_queue, config, message_history, user_cooldowns
):
    video_id = extract_video_id(config.video_id)

    while bot_status.running:
        try:
            chat = pytchat.create(video_id=video_id)
            bot_status.connected = True
            await broadcast("status", {"connected": True})

            while chat.is_alive() and bot_status.running:
                has_messages = False
                for c in chat.get().sync_items():
                    has_messages = True
                    if not bot_status.running:
                        break

                    text = c.message
                    message_parts = c.messageEx
                    author_name = c.author.name
                    author_id = c.author.channelId
                    avatar_url = c.author.imageUrl or ""

                    msg = ChatMessage(
                        author=author_name,
                        message=text,
                        message_parts=message_parts,
                        timestamp=datetime.now().strftime("%H:%M:%S"),
                        was_read=False,
                        avatar_url=avatar_url,
                        is_owner=getattr(c.author, "isOwner", False),
                        is_moderator=getattr(c.author, "isModerator", False),
                        is_member=getattr(c.author, "isChatSponsor", False),
                        is_verified=getattr(c.author, "isVerified", False),
                    )

                    if is_valid_message(
                        text,
                        author_id,
                        config.tts_prefix,
                        config.max_message_length,
                        user_cooldowns,
                        config.cooldown_seconds,
                    ):
                        tts_text = extract_text_only(message_parts)
                        if config.tts_prefix and tts_text.lower().startswith(
                            config.tts_prefix.lower()
                        ):
                            tts_text = tts_text[len(config.tts_prefix) :].strip()

                        if tts_text:
                            formatted = config.tts_template.format(
                                author=author_name, message=tts_text
                            )
                            try:
                                await message_queue.put_nowait((author_name, formatted))
                                user_cooldowns[author_id] = time.time()
                                bot_status.queue_size = message_queue.qsize()
                                msg.was_read = True
                                logger.debug(f"Queued: {formatted[:50]}...")
                                await broadcast(
                                    "queue_update", {"size": bot_status.queue_size}
                                )
                            except Exception as e:
                                logger.warning(f"Queue full, skipping message: {e}")
                    else:
                        logger.debug(f"Skipped message from {author_name}")

                    message_history.append(msg)
                    if len(message_history) > MAX_MESSAGE_HISTORY:
                        message_history.pop(0)

                    await broadcast("new_message", msg.model_dump())

                await asyncio.sleep(
                    POLL_INTERVAL_ACTIVE if has_messages else POLL_INTERVAL_IDLE
                )

            bot_status.connected = False
            await broadcast("status", {"connected": False})

            if bot_status.running:
                await asyncio.sleep(RECONNECT_DELAY)

        except Exception as e:
            logger.error(f"Listener loop error: {e}")
            bot_status.connected = False
            await asyncio.sleep(RECONNECT_DELAY)
