# ThinCab M3 — Software & Thin-Client Stack (Windows 11)

ThinCab standardizes on **Windows 11 Pro** so it can run the **official Microsoft Windows App (AVD)** alongside Citrix, Horizon, WorkSpaces, Moonlight, and Playnite natively—at **\$0 OS cost** using the embedded OEM UEFI license on most used Dell/Lenovo/HP enterprise Micro PCs.

## Quickstart

1. Install **Windows 11 Pro** with a local **Admin** account (for setup/updates) and a **Standard (non-Admin) local user** (e.g., `thincab`) for daily arcade/thin-client use. Configure auto-login (`Autologon`) on the Standard user only if the cabinet is in a trusted space.
2. In PowerShell, install the stack (pass `-WithDrivers` to auto-install Dell Command Update / Lenovo System Update for BIOS, chipset, and Intel QuickSync drivers) and apply kiosk hardening:
   ```powershell
   Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
   .\windows\setup.ps1 -WithDrivers
   ```
   Then run as **Administrator**:
   ```powershell
   .\windows\harden-kiosk.ps1
   ```
   *(Use Sysinternals `Autologon`, a solid black wallpaper, and auto-hide taskbar for a clean appliance boot without breaking Windows App. GP2040-CE XInput uses Windows 11's built-in Xbox 360 driver—no third-party controller driver needed.)*
3. Configure **Playnite** as your appliance shell:
   - Open Playnite → **Settings → General**: enable *Start in Fullscreen Mode* and *Launch when Windows starts*.
   - Add **Windows App (AVD)**, **Moonlight**, and [`windows/wol-host.ps1`](./windows/wol-host.ps1) as Playnite entries so they launch directly from the arcade stick.
4. Confirm **GP2040-CE** is in **XInput** mode so arcade inputs never interfere with typing inside AVD or terminal sessions.

> **Optional Linux Track:** If you don't need the native Microsoft Windows App for AVD (e.g., you only use Moonlight, Citrix, Horizon, or the AVD Web Client), [`setup.sh`](./setup.sh) and [`scripts/`](./scripts/) provide an Ubuntu/Debian alternative.
