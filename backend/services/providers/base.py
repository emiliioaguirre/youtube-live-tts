from typing import Optional, Protocol, runtime_checkable


@runtime_checkable
class TTSProvider(Protocol):
    """A text-to-speech provider.

    Every provider returns audio as a self-describing, container-formatted byte
    string (mp3/wav/ogg/flac) that ``services.tts.play_audio`` can decode with
    ``soundfile``. This keeps the rest of the app provider-agnostic: callers only
    deal in ``bytes`` and never need to know which backend produced them.
    """

    name: str

    async def synthesize(
        self, text: str, voice_id: str, speed: float
    ) -> Optional[bytes]:
        """Synthesize ``text`` and return decodable audio bytes, or ``None`` on failure."""
        ...
