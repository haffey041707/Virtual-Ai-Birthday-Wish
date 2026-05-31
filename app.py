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

try:
    from flask import Flask, jsonify, send_from_directory  # type: ignore
except Exception:  # pragma: no cover - fallback path
    Flask = None  # type: ignore
    jsonify = None  # type: ignore
    send_from_directory = None  # type: ignore


ROOT_DIR = Path(__file__).resolve().parent
HOST = "0.0.0.0"
PREFERRED_PORT = int(os.getenv("PORT", "5000"))

APP_CONFIG = {
    "birthdayName": "Aapi Jaan",
    "relation": "dearest sister",
}

BIRTHDAY_SEQUENCE = [
    {"text": "Happy Birthday, {name}", "revealName": True},
    {
        "text": (
            "Today is not just another date on the calendar. "
            "Today is the day my world received one of its brightest lights, and my heart "
            "received one of its greatest blessings."
        )
    },
    {
        "text": (
            "My {relation}, your smile has always felt like a soft sunrise after a long night. "
            "Your voice brings calm to my storms, your kindness heals hidden wounds, and your "
            "pure heart spreads warmth wherever you go."
        )
    },
    {
        "text": (
            "Every moment you believed in me when I doubted myself, every prayer you whispered "
            "for me quietly, and every time you stood beside me like a shield of love and loyalty "
            "means more to me than words can ever say."
        )
    },
    {
        "text": (
            "You are grace, you are strength, you are gentleness, and you are courage all in one soul. "
            "You carry love with dignity, and you carry pain with patience. That is what makes you truly beautiful."
        )
    },
    {
        "text": (
            "I pray that this year wraps you in peace, fills your days with laughter, and places ease "
            "in every path ahead of you. May your health stay strong, your heart stay light, and your dreams "
            "grow bigger every day."
        )
    },
    {
        "text": (
            "May Allah bless your life with barakah that never fades, rizq that keeps increasing, and joy "
            "that keeps multiplying. May every tear turn into relief, every fear turn into faith, and every "
            "delay turn into something better."
        )
    },
    {
        "text": (
            "You deserve gentle mornings, beautiful surprises, sincere people, and endless reasons to smile. "
            "You deserve a life where your effort is honored, your goodness is returned, and your pure intentions "
            "are rewarded beyond imagination."
        )
    },
    {
        "text": (
            "If love could be measured, mine for you would be endless. If prayers could be counted, mine for you "
            "would never stop. If gratitude had a voice, it would speak your name with respect, affection, and pride."
        )
    },
    {
        "text": (
            "You are not just family to me. You are my comfort place, my trusted person, my safe corner in this noisy "
            "world. You make ordinary days meaningful and hard days survivable, simply by being who you are."
        )
    },
    {
        "text": (
            "On your birthday, I want you to remember this forever: you are deeply loved, truly admired, and endlessly "
            "appreciated. Your presence is a gift, your heart is precious, and your story is written with honor."
        )
    },
    {
        "text": (
            "May this new year of your life bring success without stress, happiness without limits, and love without "
            "conditions. May doors open for you in the right places, at the right time, with the right blessings."
        )
    },
    {
        "text": (
            "I pray your smile stays bright, your soul stays peaceful, and your confidence stays unshakable. "
            "May every step you take lead you toward beauty, dignity, and fulfillment in both dunya and akhirah."
        )
    },
    {
        "text": (
            "And as always, my promise remains forever: I will celebrate you loudly, respect you deeply, stand by you "
            "faithfully, and keep praying for your happiness every single day. Happy birthday once again, {name}."
        )
    },
]

MIC_REPLIES = [
    {"pattern": "thank you|thanks", "reply": "Always. You deserve every bit of joy today."},
    {"pattern": "love you|i love you", "reply": "I love you too. Happy Birthday, star of the day."},
    {"pattern": "how are you|you there", "reply": "Online and celebrating. Standing by for your next command."},
]

CONFIG_PAYLOAD = {
    "appConfig": APP_CONFIG,
    "birthdaySequence": BIRTHDAY_SEQUENCE,
    "micReplies": MIC_REPLIES,
}


def find_available_port(start_port: int, attempts: int = 40) -> int:
    for port in range(start_port, start_port + attempts):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
            try:
                sock.bind(("127.0.0.1", port))
                return port
            except OSError:
                continue
    raise RuntimeError("No free port found for Birthday AI server.")


PORT = find_available_port(PREFERRED_PORT)


def open_browser_once() -> None:
    url = f"http://127.0.0.1:{PORT}"
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

    httpd = ThreadingHTTPServer((HOST, PORT), BirthdayRequestHandler)
    print(f"Birthday AI server running at http://127.0.0.1:{PORT}")
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

    @app.get("/api/config")
    def config() -> object:
        return jsonify(CONFIG_PAYLOAD)

    def run_server() -> None:
        print(f"Birthday AI server running at http://127.0.0.1:{PORT}")
        open_browser_once()
        app.run(host=HOST, port=PORT, debug=False, use_reloader=False)

else:
    app = None

    def run_server() -> None:
        run_stdlib_server()


if __name__ == "__main__":
    run_server()
