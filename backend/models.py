from pydantic import BaseModel, field_validator


class Config(BaseModel):
    elevenlabs_api_key: str = ""
    voice_id: str = "FGY2WhTYpPnrIDTdsKH5"
    model_id: str = "eleven_flash_v2_5"
    video_id: str = ""
    tts_prefix: str = ""
    tts_template: str = "{author} says: {message}"
    max_message_length: int = 200
    cooldown_seconds: int = 5
    speed: float = 0.85
    volume: float = 1.0

    @field_validator("tts_template")
    @classmethod
    def validate_tts_template(cls, v: str) -> str:
        if "{message}" not in v:
            raise ValueError("TTS template must contain {message} placeholder")
        return v


class BotStatus(BaseModel):
    running: bool = False
    connected: bool = False
    messages_read: int = 0
    queue_size: int = 0


class ChatMessage(BaseModel):
    author: str
    message: str
    message_parts: list = []
    timestamp: str
    was_read: bool = False
    avatar_url: str = ""
    is_owner: bool = False
    is_moderator: bool = False
    is_member: bool = False
    is_verified: bool = False


class VoiceFilters(BaseModel):
    search: str = ""
    gender: str = ""
    age: str = ""
    accent: str = ""
    language: str = ""
    use_cases: list[str] = []
    category: str = ""
    page_size: int = 100
