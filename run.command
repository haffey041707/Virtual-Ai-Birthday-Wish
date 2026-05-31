#!/bin/zsh

cd "$(dirname "$0")" || exit 1

echo "Starting Birthday AI Python server..."
echo ""

if ! command -v python3 >/dev/null 2>&1; then
  echo "Error: python3 not found on this Mac."
  echo "Install Python 3, then try again."
  echo ""
  read -r "?Press Enter to close..."
  exit 1
fi

python3 app.py
exit_code=$?

echo ""
if [ $exit_code -ne 0 ]; then
  echo "Server exited with code $exit_code."
else
  echo "Server stopped."
fi
echo ""
read -r "?Press Enter to close..."
