import asyncio
import logging
from typing import Optional

from elevenlabs import VoiceSettings
from elevenlabs.client import ElevenLabs

from config import VOICE_STABILITY, VOICE_SIMILARITY

logger = logging.getLogger(__name__)


class ElevenLabsProvider:
    """TTS provider backed by the ElevenLabs SDK.

    Wraps the (synchronous) ElevenLabs client and exposes the async
    ``TTSProvider`` interface; the blocking convert call runs in a thread so the
    event loop is never stalled.
    """

    name = "elevenlabs"

    def __init__(self, api_key: str, model_id: str):
        self._client = ElevenLabs(api_key=api_key)
        self._model_id = model_id

    async def synthesize(
        self, text: str, voice_id: str, speed: float
    ) -> Optional[bytes]:
        if not text:
            return None
        return await asyncio.to_thread(self._convert, text, voice_id, speed)

    def _convert(self, text: str, voice_id: str, speed: float) -> Optional[bytes]:
        try:
            audio = self._client.text_to_speech.convert(
                text=text,
                voice_id=voice_id,
                model_id=self._model_id,
                output_format="mp3_44100_128",
                voice_settings=VoiceSettings(
                    stability=VOICE_STABILITY,
                    similarity_boost=VOICE_SIMILARITY,
                    speed=speed,
                ),
            )
            return b"".join(audio)
        except Exception as e:
            logger.error(f"ElevenLabs TTS conversion failed: {e}")
            return None
