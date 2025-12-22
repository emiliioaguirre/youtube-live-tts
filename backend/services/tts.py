import io
import logging
from typing import Optional

import sounddevice as sd
import soundfile as sf
from elevenlabs import VoiceSettings

from config import VOICE_STABILITY, VOICE_SIMILARITY

logger = logging.getLogger(__name__)


def play_audio(audio_bytes: bytes, volume: float = 1.0) -> None:
    try:
        data, samplerate = sf.read(io.BytesIO(audio_bytes))
        data = data * volume
        sd.play(data, samplerate)
        sd.wait()
    except Exception as e:
        logger.error(f"Audio playback failed: {e}")


def text_to_speech(client, voice_id: str, model_id: str, speed: float, text: str) -> Optional[bytes]:
    if not client:
        return None
    try:
        audio = client.text_to_speech.convert(
            text=text,
            voice_id=voice_id,
            model_id=model_id,
            output_format="mp3_44100_128",
            voice_settings=VoiceSettings(
                stability=VOICE_STABILITY,
                similarity_boost=VOICE_SIMILARITY,
                speed=speed,
            )
        )
        return b"".join(audio)
    except Exception as e:
        logger.error(f"TTS conversion failed: {e}")
        return None
