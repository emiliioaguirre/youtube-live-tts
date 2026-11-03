import sys
import unittest

# Run against the versioned defaults, like a fresh clone without config.py.
sys.modules["config"] = None

from fastapi.testclient import TestClient  # noqa: E402

from main import app  # noqa: E402
from services.websocket import websocket_clients  # noqa: E402


class ApiTests(unittest.TestCase):
    def setUp(self) -> None:
        self.client = TestClient(app).__enter__()
        self.addCleanup(self.client.__exit__, None, None, None)

    def test_status_starts_idle(self) -> None:
        response = self.client.get("/api/status")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.json(),
            {"running": False, "connected": False, "messages_read": 0, "queue_size": 0},
        )

    def test_config_hides_api_key(self) -> None:
        config = self.client.get("/api/config").json()

        self.assertFalse(config["has_api_key"])
        self.assertNotIn("elevenlabs_api_key", config)

    def test_start_requires_api_key_and_video(self) -> None:
        response = self.client.post("/api/start")

        self.assertEqual(response.json(), {"error": "Missing API key or video ID"})

    def test_history_starts_empty(self) -> None:
        self.assertEqual(self.client.get("/api/history").json(), [])

    def test_websocket_connects_and_cleans_up(self) -> None:
        with self.client.websocket_connect("/ws") as ws:
            self.assertEqual(ws.receive_json()["event"], "connected")

        self.assertEqual(websocket_clients, [])


if __name__ == "__main__":
    unittest.main()
