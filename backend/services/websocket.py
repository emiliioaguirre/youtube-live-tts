import logging
from fastapi import WebSocket, WebSocketDisconnect

logger = logging.getLogger(__name__)

websocket_clients: list[WebSocket] = []


async def broadcast(event: str, data: dict):
    disconnected = []
    for ws in websocket_clients:
        try:
            await ws.send_json({"event": event, "data": data})
        except (WebSocketDisconnect, RuntimeError, ConnectionError) as e:
            logger.debug(f"WebSocket send failed: {e}")
            disconnected.append(ws)
    for ws in disconnected:
        if ws in websocket_clients:
            websocket_clients.remove(ws)
