# Jarvis-Style Birthday AI (Python)

This project runs with Python and serves your futuristic birthday UI.
It now includes an unzip intro screen before the main assistant appears.

## Run With Python

1. Start the app:

```bash
python3 app.py
```

2. Open the URL shown in terminal:

Example: `http://127.0.0.1:5000`

If port `5000` is busy, the app automatically starts on the next free port (`5001`, `5002`, etc.).

## Where To Edit Content

Edit these Python variables inside `app.py`:

- `APP_CONFIG` for name/relation
- `BIRTHDAY_SEQUENCE` for all spoken lines
- `MIC_REPLIES` for voice reply rules

The frontend auto-loads this data from `/api/config`.

## Notes

- Works even without Flask installed (auto-fallback to Python built-in server).
- If Flask is installed, it uses Flask automatically.
- Voice output still uses browser Speech Synthesis (best in Chrome/Edge).
- The first screen is an unzip intro. Pull/click the zipper handle to reveal the main UI.
- On macOS you can also double-click `run.command` to launch quickly.
