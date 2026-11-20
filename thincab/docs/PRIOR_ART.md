# ThinCab Prior Art & Reuse Notes

**Principle:** Reuse proven open-source firmware, launchers, CAD patterns, and 3D models rather than reinventing them.

## 1. Name Check
- Searches across GitHub and maker communities found no existing open-source arcade or thin-client project named **ThinCab**.

## 2. Software & Firmware We Directly Reuse
- **[GP2040-CE](https://gp2040-ce.info/)** — Open-source RP2040 firmware; gives us sub-1ms XInput, SOCD cleaning, web configuration, and `Coin + Start` hotkeys with zero custom firmware code.
- **[Playnite](https://playnite.link/)** — Open-source Windows fullscreen launcher; acts as the appliance shell for both games and thin-client tiles (Windows App / AVD, Moonlight).
- **[Moonlight](https://moonlight-stream.org/)** — Open-source low-latency streaming client.

## 3. 3D-Printable Models We Reuse
Instead of designing standard brackets from scratch, we reference existing Printables/Thingiverse models in [`hardware/3d-prints/README.md`](../hardware/3d-prints/README.md):
- **VESA 100×100 Tilt Mounts:** *Simple VESA mount* (Maverick0197), *Tiltable VESA mount - 100x100* (rorys3D), and *VESA 100 adjustable tilt mount* (Tim Fechner) on Printables.
- **Sanwa Drill Templates:** *Arcade Button Template Collection* (marmermakes) and *Arcade Cabinet 6-button Hole Template* (MidkiffAries) on Thingiverse; *Arcade controls template button jig* (Christopher Ortega) on Printables.
- **Logitech K400+ Under-Desk Mounts:** *Logitech K400+ Underdesk Mount* (Zachary Ragsdale) and *Logitech K400 Holder* (Cederb) on Printables.

## 4. Open-Source Cabinet CAD & Plans to Reference / Adopt
- **`glikely/openscad-arcade` (GitHub):** Parametric OpenSCAD scripts (`cabinet.scad`, `control_panel.scad`, `control_box.scad`) that output `.dxf` files for CNC/laser cutting. **Best candidate to adopt/adapt** if we generate parametric `.dxf` cut files in OpenSCAD rather than hand-drawing them.
- **`maxvfischer/DIY-arcade` (GitHub):** Reference for clean multi-format CAD repo organization (`.f3d`, `.step`, `.dxf`, `.stl`).
- **`NaNo211/Arcade-Machine` (GitHub):** Reference for compact bartop proportions and wiring documentation.
- **Single-Sheet Bartops (*I Like To Make Stuff*, *The Geek Pub / Wood Whisperer*):** Proven cleat-and-screw assembly without dadoes or routered T-molding.

## 5. What ThinCab Adds (The Gap)
Existing open-source bartop plans target **17"–19" 4:3 screens**, **Raspberry Pis**, and **arcade-only ergonomics** (steep 25°–30° screen tilt, keyboard-emulating encoders, no keyboard dock). ThinCab combines:
1. A **24" 16:9 matte IPS** monitor at a **15°–20° workstation angle** nested onto a **single `24"×48"` sheet**.
2. **Under-deck K400+ dock** + **XInput-isolated GP2040-CE** controls + **1080p privacy-shutter webcam**.
3. **Hardened Windows 11 Pro (`winget` scripts)** for official **Microsoft Windows App (AVD)**, Citrix/Horizon, Moonlight, and Playnite.
