# ThinCab M1 — Bench Prototype & Wiring Guide

Build and test the entire electronics stack **on a table before cutting any wood**.

---

## 1. Power Architecture (Single-Switch Boot)

No custom relays or smart-home plugs required:

```text
Wall Outlet
   │
   ▼
[ Switched Surge Strip ]  ◄── Single master power switch
   ├──► Micro PC PSU (19V brick)
   ├──► 24" IPS Monitor AC cord
   └──► USB Speakers (powered from Monitor USB hub or PC USB port)
```

### Required BIOS Setting (Micro PC)
1. Boot into BIOS (`F2` on Dell, `F1` on Lenovo, `F10` on HP).
2. Find **Power Management → AC Power Recovery** (or *Restore on AC Power Loss*).
3. Set to **Power On** (not *Last State* or *Off*).
4. Save and exit. Flipping the power strip switch now boots the PC, monitor, and speakers together.

---

## 2. RP2040 / GP2040-CE Control Wiring (Solderless)

Use a Raspberry Pi Pico (or pre-made RP2040 arcade breakout board) flashed with **GP2040-CE**, plus standard **0.110" (2.8mm)** quick-disconnect female crimp wires for Sanwa OBSF-30 buttons and a **5-pin JST-XH** harness for the Sanwa JLF joystick.

### Standard Pinout (Default GP2040-CE Pico Mapping)

| Input | Arcade Function | GP2040-CE Pin | XInput Mapping |
| :--- | :--- | :--- | :--- |
| **Joystick Up** | Up | `GPIO 2` | D-Pad Up (or Left Stick) |
| **Joystick Down** | Down | `GPIO 3` | D-Pad Down |
| **Joystick Left** | Left | `GPIO 4` | D-Pad Left |
| **Joystick Right** | Right | `GPIO 5` | D-Pad Right |
| **Button 1 (Top-Left)** | Light Punch / A | `GPIO 6` | `X` (or `Y`—see 6-button layout below) |
| **Button 2 (Top-Mid)** | Med Punch / B | `GPIO 7` | `Y` |
| **Button 3 (Top-Right)** | Heavy Punch / C | `GPIO 8` | `RB` |
| **Button 4 (Bot-Left)** | Light Kick / D | `GPIO 9` | `A` |
| **Button 5 (Bot-Mid)** | Med Kick / E | `GPIO 10` | `B` |
| **Button 6 (Bot-Right)** | Heavy Kick / F | `GPIO 11` | `RT` |
| **Utility 1** | `Start` | `GPIO 16` | `Start` |
| **Utility 2** | `Coin / Hotkey` | `GPIO 17` | `Back / Select` (+ Hotkey) |
| **Common Ground** | Daisy-chain GND | `GND` | Ground |

> **6-Button Street Fighter / Modern Layout:**
> Top row: `X` · `Y` · `RB`
> Bottom row: `A` · `B` · `RT`
> Every switch connects one terminal to its `GPIO` pin and the other terminal to the shared `GND` daisy-chain. Polarity on mechanical switches does not matter.

---

## 3. GP2040-CE Configuration

See [`software/gp2040-ce/README.md`](../software/gp2040-ce/README.md) for the exact web-configurator settings:
- **Input Mode:** `XInput` (critical—prevents joystick/buttons from sending keyboard keys during thin-client work).
- **D-Pad Mode:** `Left Analog` or `D-Pad` (toggleable via hotkey if needed; `D-Pad` is best for arcade menus/2D games).
- **Hotkey Combo:** `Back/Select (Coin) + Start` → `Home / Guide` (used to exit emulators or return to the ThinCab launcher).

---

## 4. M1 Bench Verification Checklist

Before moving to M2 (cutting wood), verify all 5 items on your desk:

- [ ] **Single-switch boot:** Turning the power strip off and back on boots the PC, wakes the monitor, and powers the speakers with zero button presses on the PC itself.
- [ ] **XInput isolation:** Open a terminal or text editor on the PC, mash the Sanwa joystick and all 8 buttons—**zero characters** should appear in the editor.
- [ ] **Control test:** Run `jstest-gtk` or `evtest` (or Gamepad Tester in browser) and verify all 4 stick directions, 6 action buttons, `Start`, `Coin`, and `Coin + Start` (`Guide`) register cleanly with zero ghosting.
- [ ] **Thin-client input & A/V:** Pair/plug in the Logitech K400+ (or wireless keyboard+trackpad) and **USB webcam/mic**, confirming smooth cursor/typing and clean camera/mic passthrough in Windows App (AVD) alongside the arcade encoder.
- [ ] **Streaming latency:** Plug in Gigabit Ethernet and test a Moonlight/Sunshine or FreeRDP session to confirm hardware decode is active and latency feels crisp.
