#!/usr/bin/env bash
set -euo pipefail

# ThinCab M3 — Minimal Ubuntu/Debian Thin-Client & Arcade Provisioning
# Installs core thin-client tools, input diagnostics, and Intel QuickSync VAAPI support.

if [[ $EUID -eq 0 ]]; then
  echo "Run as your normal user (sudo will be used where needed)."
  exit 1
fi

echo "[1/4] Updating apt and installing core packages..."
sudo apt-get update
sudo apt-get install -y \
  curl \
  wakeonlan \
  freerdp2-x11 \
  joystick \
  evtest \
  intel-media-va-driver \
  vainfo \
  flatpak

echo "[2/4] Enabling Flathub and installing Moonlight..."
sudo flatpak remote-add --if-not-exists flathub https://flathub.org/repo/flathub.flatpakrepo
sudo flatpak install -y flathub com.moonlight_stream.Moonlight

echo "[3/4] Checking hardware video decode (VAAPI)..."
vainfo || echo "Warning: vainfo reported an issue; check Intel iGPU drivers."

echo "[4/4] Done! Next steps:"
echo "  1. Copy .env.example to .env and set your HOST_MAC, RDP_HOST, and KIOSK_URL."
echo "  2. Set your desktop session to auto-start your controller launcher (ES-DE / Pegasus / Steam)."
echo "  3. Add Moonlight and software/scripts/*.sh as launcher tiles."
