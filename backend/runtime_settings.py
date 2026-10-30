"""Versioned defaults, with the existing private config.py kept as an override."""

import os

__all__ = [
    "MAX_QUEUE_SIZE",
    "MAX_MESSAGE_HISTORY",
    "VOICE_STABILITY",
    "VOICE_SIMILARITY",
    "POLL_INTERVAL_ACTIVE",
    "POLL_INTERVAL_IDLE",
    "RECONNECT_DELAY",
    "CORS_ORIGINS",
]

try:
    from config import (
        MAX_QUEUE_SIZE,
        MAX_MESSAGE_HISTORY,
        VOICE_STABILITY,
        VOICE_SIMILARITY,
        POLL_INTERVAL_ACTIVE,
        POLL_INTERVAL_IDLE,
        RECONNECT_DELAY,
        CORS_ORIGINS,
    )
except ModuleNotFoundError as error:
    if error.name != "config":
        raise

    MAX_QUEUE_SIZE = 10
    MAX_MESSAGE_HISTORY = 100
    VOICE_STABILITY = 0.7
    VOICE_SIMILARITY = 0.8
    POLL_INTERVAL_ACTIVE = 0.01
    POLL_INTERVAL_IDLE = 0.05
    RECONNECT_DELAY = 5
    _origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").strip()
    CORS_ORIGINS = [origin.strip() for origin in _origins.split(",") if origin.strip()]
