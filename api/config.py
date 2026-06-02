from __future__ import annotations

import json
from http.server import BaseHTTPRequestHandler

from birthday_config import CONFIG_PAYLOAD


class handler(BaseHTTPRequestHandler):
    def do_GET(self) -> None:
        data = json.dumps(CONFIG_PAYLOAD).encode("utf-8")

        self.send_response(200)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)
