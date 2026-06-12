import asyncio
import base64
import io
import json
import logging
import os
import uuid
import wave
from typing import Optional

import websockets

from config import VOICE_STABILITY, VOICE_SIMILARITY

logger = logging.getLogger(__name__)

# Defaults can be overridden via environment without touching code.
SIXTYDB_WS_URL = os.getenv("SIXTYDB_WS_URL", "ws://api.60db.ai/ws/tts")
# Voice used when no voice_id is configured (from the 60db websocket docs example).
SIXTYDB_DEFAULT_VOICE_ID = os.getenv(
    "SIXTYDB_VOICE_ID", "fbb75ed2-975a-40c7-9e06-38e30524a9a1"
)
# LINEAR16 (raw 16-bit PCM, mono) at one of the supported sample rates.
SIXTYDB_SAMPLE_RATE = int(os.getenv("SIXTYDB_SAMPLE_RATE", "24000"))

_HANDSHAKE_TIMEOUT = 15.0
_RECV_TIMEOUT = 30.0


def _to_percent(value: float) -> int:
    """Map a stability/similarity setting onto 60db's 0-100 scale.

    ElevenLabs uses 0.0-1.0 floats while 60db expects 0-100, so accept either:
    values <= 1 are treated as a 0-1 ratio, anything larger is assumed to be a
    0-100 value already. Result is clamped to [0, 100].
    """
    scaled = value * 100 if value <= 1 else value
    return max(0, min(100, int(round(scaled))))


class SixtyDBProvider:
    """TTS provider backed by the 60db streaming websocket API.

    Drives the full context lifecycle (create -> send_text -> flush -> close),
    buffers the streamed LINEAR16 PCM chunks, and wraps them into an in-memory
    WAV container so the returned bytes are decodable by ``soundfile`` exactly
    like the ElevenLabs (mp3) output. This keeps the provider interface uniform;
    incremental/live playback would require a streaming audio sink and is left as
    a future enhancement.
    """

    name = "60db"

    def __init__(
        self,
        api_key: str,
        ws_url: str = SIXTYDB_WS_URL,
        default_voice_id: str = SIXTYDB_DEFAULT_VOICE_ID,
        sample_rate: int = SIXTYDB_SAMPLE_RATE,
    ):
        self._api_key = api_key
        self._ws_url = ws_url
        self._default_voice_id = default_voice_id
        self._sample_rate = sample_rate

    async def synthesize(
        self, text: str, voice_id: str, speed: float
    ) -> Optional[bytes]:
        if not self._api_key or not text:
            return None

        voice = voice_id or self._default_voice_id
        context_id = str(uuid.uuid4())
        url = f"{self._ws_url}?apiKey={self._api_key}"

        try:
            async with websockets.connect(url, max_size=None) as ws:
                await self._wait_for(ws, "connection_established", _HANDSHAKE_TIMEOUT)

                await ws.send(
                    json.dumps(
                        {
                            "create_context": {
                                "context_id": context_id,
                                "voice_id": voice,
                                "audio_config": {
                                    "audio_encoding": "LINEAR16",
                                    "sample_rate_hertz": self._sample_rate,
                                },
                                "speed": speed,
                                "stability": _to_percent(VOICE_STABILITY),
                                "similarity": _to_percent(VOICE_SIMILARITY),
                            }
                        }
                    )
                )
                await self._wait_for(ws, "context_created", _HANDSHAKE_TIMEOUT)

                await ws.send(
                    json.dumps(
                        {"send_text": {"context_id": context_id, "text": text}}
                    )
                )
                await ws.send(
                    json.dumps({"flush_context": {"context_id": context_id}})
                )

                pcm = bytearray()
                while True:
                    msg = json.loads(
                        await asyncio.wait_for(ws.recv(), timeout=_RECV_TIMEOUT)
                    )
                    if "audio_chunk" in msg:
                        content = msg["audio_chunk"].get("audioContent")
                        if content:
                            pcm += base64.b64decode(content)
                    elif "flush_completed" in msg:
                        break
                    elif "error" in msg:
                        logger.error(f"60db TTS error: {msg['error']}")
                        return None

                # Best-effort cleanup; the context closes with the socket anyway.
                try:
                    await ws.send(
                        json.dumps({"close_context": {"context_id": context_id}})
                    )
                except Exception:
                    pass

            if not pcm:
                logger.error("60db TTS returned no audio")
                return None

            return self._pcm_to_wav(bytes(pcm))
        except asyncio.TimeoutError:
            logger.error("60db TTS timed out waiting for audio")
            return None
        except Exception as e:
            logger.error(f"60db TTS conversion failed: {e}")
            return None

    async def _wait_for(self, ws, key: str, timeout: float) -> dict:
        """Read messages until one containing ``key`` arrives, ignoring others
        (e.g. the initial ``connecting`` heartbeat)."""
        while True:
            msg = json.loads(await asyncio.wait_for(ws.recv(), timeout=timeout))
            if key in msg:
                return msg
            if "error" in msg:
                raise RuntimeError(f"60db error while awaiting {key}: {msg['error']}")

    def _pcm_to_wav(self, pcm: bytes) -> bytes:
        buf = io.BytesIO()
        with wave.open(buf, "wb") as wf:
            wf.setnchannels(1)
            wf.setsampwidth(2)  # LINEAR16 = 16-bit signed
            wf.setframerate(self._sample_rate)
            wf.writeframes(pcm)
        return buf.getvalue()
