#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="${SCRIPT_DIR}/../.env"

if [[ -f "$ENV_FILE" ]]; then
  # shellcheck disable=SC1090
  source "$ENV_FILE"
fi

if [[ -z "${HOST_MAC:-}" || "${HOST_MAC}" == "00:00:00:00:00:00" ]]; then
  echo "Set HOST_MAC in thincab/software/.env first."
  exit 1
fi

wakeonlan -i "${HOST_BROADCAST:-255.255.255.255}" "$HOST_MAC"
echo "Sent Wake-on-LAN packet to $HOST_MAC."
