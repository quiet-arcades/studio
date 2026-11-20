#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="${SCRIPT_DIR}/../.env"

if [[ -f "$ENV_FILE" ]]; then
  # shellcheck disable=SC1090
  source "$ENV_FILE"
fi

if [[ -z "${RDP_HOST:-}" || -z "${RDP_USER:-}" ]]; then
  echo "Set RDP_HOST and RDP_USER in thincab/software/.env first."
  exit 1
fi

exec xfreerdp \
  /v:"$RDP_HOST" \
  /u:"$RDP_USER" \
  /f \
  /dynamic-resolution \
  /gfx:AVC444 \
  /sound:sys:pulse \
  +clipboard
