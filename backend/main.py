import asyncio
import logging
from typing import Optional

import httpx
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from models import Config, BotStatus, VoiceFilters
from config import MAX_QUEUE_SIZE, CORS_ORIGINS
from services.websocket import websocket_clients
from services.youtube import listener_loop, speaker_loop
from services.providers import TTSProvider, build_provider, sixtydb_api_key

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger(__name__)

config = Config()
bot_status = BotStatus()
message_history = []
message_queue = asyncio.Queue(maxsize=MAX_QUEUE_SIZE)
user_cooldowns: dict[str, float] = {}
tts_provider: Optional[TTSProvider] = None
bot_task: Optional[asyncio.Task] = None


async def run_bot():
    await asyncio.gather(
        listener_loop(
            bot_status, message_queue, config, message_history, user_cooldowns
        ),
        speaker_loop(bot_status, message_queue, config, tts_provider),
    )


app = FastAPI(title="YouTube TTS Bot")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/status")
async def get_status():
    return {
        "running": bot_status.running,
        "connected": bot_status.connected,
        "messages_read": bot_status.messages_read,
        "queue_size": bot_status.queue_size,
    }


@app.get("/api/config")
async def get_config():
    return {
        "tts_provider": config.tts_provider,
        "voice_id": config.voice_id,
        "model_id": config.model_id,
        "video_id": config.video_id,
        "tts_prefix": config.tts_prefix,
        "tts_template": config.tts_template,
        "max_message_length": config.max_message_length,
        "cooldown_seconds": config.cooldown_seconds,
        "speed": config.speed,
        "volume": config.volume,
        "has_api_key": bool(config.elevenlabs_api_key),
        # 60db's key lives in the server environment, not the frontend.
        "has_sixtydb_key": bool(sixtydb_api_key()),
    }


@app.post("/api/config")
async def update_config(new_config: Config):
    global config, tts_provider

    # Validate the ElevenLabs key whenever one is supplied (provider-independent
    # so the UI's key indicator works regardless of the active provider).
    api_key_valid = None
    if new_config.elevenlabs_api_key:
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(
                    "https://api.elevenlabs.io/v1/voices",
                    headers={"xi-api-key": new_config.elevenlabs_api_key},
                )
                api_key_valid = response.status_code == 200
                if not api_key_valid:
                    logger.warning(
                        f"ElevenLabs API validation failed: status={response.status_code}"
                    )
        except httpx.TimeoutException:
            logger.error("ElevenLabs API validation timeout")
            api_key_valid = None
        except Exception as e:
            logger.error(f"ElevenLabs API validation error: {e}")

    config = new_config
    tts_provider = build_provider(config)

    return {"success": True, "api_key_valid": api_key_valid}


@app.post("/api/start")
async def start_bot():
    global bot_task, tts_provider

    if bot_status.running:
        return {"error": "Bot already running"}

    if not config.video_id:
        return {"error": "Missing video ID"}

    tts_provider = build_provider(config)
    if tts_provider is None:
        if config.tts_provider == "60db":
            return {"error": "SIXTYDB_API_KEY is not configured on the server"}
        return {"error": "Missing API key"}

    bot_status.running = True
    bot_status.messages_read = 0
    bot_task = asyncio.create_task(run_bot())

    return {"success": True}


@app.post("/api/stop")
async def stop_bot():
    global bot_task

    bot_status.running = False
    bot_status.connected = False

    if bot_task:
        bot_task.cancel()
        bot_task = None

    return {"success": True}


@app.get("/api/voices")
async def get_voices():
    if not config.elevenlabs_api_key:
        return {"error": "API key not configured", "voices": []}

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "https://api.elevenlabs.io/v1/voices",
                headers={"xi-api-key": config.elevenlabs_api_key},
            )
            if response.status_code == 200:
                data = response.json()
                return {"voices": data.get("voices", [])}
            else:
                return {"error": "Failed to fetch voices", "voices": []}
    except Exception as e:
        return {"error": str(e), "voices": []}


@app.post("/api/voices/library")
async def get_library_voices(filters: VoiceFilters):
    if not config.elevenlabs_api_key:
        return {"error": "API key not configured", "voices": [], "has_more": False}

    try:
        params = {"page_size": min(filters.page_size, 100)}
        filter_fields = {
            "search": filters.search,
            "gender": filters.gender,
            "age": filters.age,
            "accent": filters.accent,
            "language": filters.language,
            "category": filters.category,
        }
        params.update({k: v for k, v in filter_fields.items() if v})
        if filters.use_cases:
            params["use_cases"] = ",".join(filters.use_cases)

        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(
                "https://api.elevenlabs.io/v1/shared-voices",
                headers={"xi-api-key": config.elevenlabs_api_key},
                params=params,
            )
            if response.status_code == 200:
                data = response.json()
                voices = data.get("voices", [])
                normalized_voices = [
                    {
                        "voice_id": v.get("voice_id"),
                        "public_owner_id": v.get("public_owner_id"),
                        "name": v.get("name"),
                        "preview_url": v.get("preview_url"),
                        "category": v.get("category"),
                        "image_url": v.get("image_url"),
                        "labels": {
                            "language": v.get("language"),
                            "gender": v.get("gender"),
                            "age": v.get("age"),
                            "accent": v.get("accent"),
                            "locale": v.get("locale"),
                            "use_case": v.get("use_case"),
                            "description": v.get("description") or v.get("descriptive"),
                        },
                    }
                    for v in voices
                ]
                return {
                    "voices": normalized_voices,
                    "has_more": data.get("has_more", False),
                }
            else:
                logger.error(f"Voices API error: {response.status_code}")
                return {
                    "error": f"Failed to fetch voices: {response.status_code}",
                    "voices": [],
                    "has_more": False,
                }
    except Exception as e:
        logger.error(f"Voices API exception: {e}")
        return {"error": str(e), "voices": [], "has_more": False}


@app.get("/api/history")
async def get_history():
    return message_history[-50:]


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    websocket_clients.append(websocket)

    try:
        await websocket.send_json(
            {
                "event": "connected",
                "data": {
                    "status": bot_status.model_dump(),
                    "history": [m.model_dump() for m in message_history[-20:]],
                },
            }
        )

        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        if websocket in websocket_clients:
            websocket_clients.remove(websocket)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
