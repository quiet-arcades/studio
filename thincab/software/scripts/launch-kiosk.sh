#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="${SCRIPT_DIR}/../.env"

if [[ -f "$ENV_FILE" ]]; then
  # shellcheck disable=SC1090
  source "$ENV_FILE"
fi

URL="${KIOSK_URL:-https://example.com}"
BROWSER=""

for bin in chromium chromium-browser google-chrome; do
  if command -v "$bin" >/dev/null 2>&1; then
    BROWSER="$bin"
    break
  fi
done

if [[ -z "$BROWSER" ]]; then
  echo "No Chromium/Chrome binary found. Install chromium first."
  exit 1
fi

exec "$BROWSER" --kiosk --no-first-run "$URL"
