import logging
import os
from typing import Optional

from .base import TTSProvider
from .elevenlabs import ElevenLabsProvider
from .sixtydb import SixtyDBProvider

logger = logging.getLogger(__name__)


def sixtydb_api_key() -> str:
    """The 60db API key, supplied via the environment (never the frontend)."""
    return os.getenv("SIXTYDB_API_KEY", "")


def build_provider(config) -> Optional[TTSProvider]:
    """Construct the active TTS provider from ``config.tts_provider``.

    Returns ``None`` when the selected provider is missing its credentials, so
    callers can surface a clear "not configured" error instead of crashing.
    """
    if config.tts_provider == "60db":
        api_key = sixtydb_api_key()
        if not api_key:
            logger.warning("60db selected but SIXTYDB_API_KEY is not set")
            return None
        return SixtyDBProvider(api_key=api_key)

    # Default: ElevenLabs.
    if not config.elevenlabs_api_key:
        return None
    return ElevenLabsProvider(
        api_key=config.elevenlabs_api_key, model_id=config.model_id
    )


__all__ = [
    "TTSProvider",
    "ElevenLabsProvider",
    "SixtyDBProvider",
    "build_provider",
    "sixtydb_api_key",
]
