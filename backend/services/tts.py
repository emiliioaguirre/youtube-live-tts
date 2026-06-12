import io
import logging

import sounddevice as sd
import soundfile as sf

logger = logging.getLogger(__name__)


def play_audio(audio_bytes: bytes, volume: float = 1.0) -> None:
    try:
        data, samplerate = sf.read(io.BytesIO(audio_bytes))
        data = data * volume
        sd.play(data, samplerate)
        sd.wait()
    except Exception as e:
        logger.error(f"Audio playback failed: {e}")
