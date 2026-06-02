from __future__ import annotations

import json
import mimetypes
import os
import socket
import threading
import webbrowser
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse

from birthday_config import CONFIG_PAYLOAD

try:
    from flask import Flask, jsonify, send_from_directory  # type: ignore
except Exception:  # pragma: no cover - fallback path
    Flask = None  # type: ignore
    jsonify = None  # type: ignore
    send_from_directory = None  # type: ignore


ROOT_DIR = Path(__file__).resolve().parent
HOST = "0.0.0.0"
PREFERRED_PORT = int(os.getenv("PORT", "5000"))


def find_available_port(start_port: int, attempts: int = 40) -> int:
    for port in range(start_port, start_port + attempts):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
            try:
                sock.bind(("127.0.0.1", port))
                return port
            except OSError:
                continue
    raise RuntimeError("No free port found for Birthday AI server.")


PORT: int | None = None


def get_port() -> int:
    global PORT

    if PORT is None:
        PORT = find_available_port(PREFERRED_PORT)

    return PORT


def open_browser_once() -> None:
    url = f"http://127.0.0.1:{get_port()}"
    # Small delay ensures server starts before browser request.
    threading.Timer(0.8, lambda: webbrowser.open(url, new=2)).start()


def run_stdlib_server() -> None:
    class BirthdayRequestHandler(SimpleHTTPRequestHandler):
        def _write_json(self, payload: dict) -> None:
            data = json.dumps(payload).encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Cache-Control", "no-store")
            self.send_header("Content-Length", str(len(data)))
            self.end_headers()
            self.wfile.write(data)

        def _write_file(self, file_path: Path) -> None:
            mime_type = mimetypes.guess_type(str(file_path))[0] or "application/octet-stream"
            data = file_path.read_bytes()
            self.send_response(200)
            self.send_header("Content-Type", mime_type)
            self.send_header("Cache-Control", "no-store, no-cache, must-revalidate")
            self.send_header("Content-Length", str(len(data)))
            self.end_headers()
            self.wfile.write(data)

        def do_GET(self) -> None:  # noqa: N802
            request_path = urlparse(self.path).path

            if request_path == "/api/config":
                self._write_json(CONFIG_PAYLOAD)
                return

            if request_path == "/":
                request_path = "/index.html"

            safe_target = (ROOT_DIR / request_path.lstrip("/")).resolve()
            if not safe_target.exists() or not str(safe_target).startswith(str(ROOT_DIR)):
                self.send_error(404, "Not Found")
                return

            self._write_file(safe_target)

    port = get_port()
    httpd = ThreadingHTTPServer((HOST, port), BirthdayRequestHandler)
    print(f"Birthday AI server running at http://127.0.0.1:{port}")
    open_browser_once()
    httpd.serve_forever()


if Flask is not None:
    app = Flask(__name__)

    @app.after_request
    def no_cache_headers(response):  # type: ignore[no-untyped-def]
        response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate"
        return response

    @app.get("/")
    def index() -> object:
        return send_from_directory(ROOT_DIR, "index.html")

    @app.get("/styles.css")
    def styles() -> object:
        return send_from_directory(ROOT_DIR, "styles.css")

    @app.get("/script.js")
    def script() -> object:
        return send_from_directory(ROOT_DIR, "script.js")

    @app.get("/assets/<path:filename>")
    def assets(filename: str) -> object:
        return send_from_directory(ROOT_DIR / "assets", filename)

    @app.get("/api/config")
    def config() -> object:
        return jsonify(CONFIG_PAYLOAD)

    def run_server() -> None:
        port = get_port()
        print(f"Birthday AI server running at http://127.0.0.1:{port}")
        open_browser_once()
        app.run(host=HOST, port=port, debug=False, use_reloader=False)

else:
    app = None

    def run_server() -> None:
        run_stdlib_server()


if __name__ == "__main__":
    run_server()
