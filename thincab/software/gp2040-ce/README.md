# GP2040-CE Setup for ThinCab

ThinCab uses **GP2040-CE** (open-source RP2040 firmware) in **XInput mode**.

## Why XInput?
If your arcade encoder emulates a USB keyboard, bumping the joystick or resting a hand on a button while using the cabinet as a thin client will type stray characters into your terminal, IDE, or RDP session. In **XInput** mode, the OS sees a standard Xbox-style gamepad—desktop apps ignore it completely unless a game or launcher is focused.

## Flashing & Configuring

1. **Flash GP2040-CE:**
   - Download the latest `.uf2` for your RP2040 board (e.g., `GP2040-CE_x.x.x_Pico.uf2`) from the official GP2040-CE releases.
   - Hold `BOOTSEL` on the Pico, plug it into USB, and drag-and-drop the `.uf2` onto the `RPI-RP2` drive.
2. **Open the Web Configurator:**
   - Hold the `Start` button (or short `GPIO 16` to `GND`) while plugging the USB cable into your PC.
   - Open `http://192.168.7.1` in a browser.
3. **Apply ThinCab Settings:**
   - **Settings → Input Mode:** `XInput`
   - **Settings → D-Pad Mode:** `D-Pad` (enable `SOCD Cleaning: Neutral` for fighting games)
   - **Configuration → Pin Mapping:** Match [`docs/WIRING.md`](../../docs/WIRING.md)
   - **Configuration → Hotkey Settings:**
     - `Hotkey 1`: `Fn` = `Back/Select` (`GPIO 17`) + `Start` (`GPIO 16`) → Action: `Home / Guide`
     - `Hotkey 2` (optional): `Fn` + `Up` → Action: `Left Analog` (handy for twin-stick/analog indie games)
     - `Hotkey 3` (optional): `Fn` + `Down` → Action: `D-Pad`
4. **Save** and reboot the board.
