# ThinCab 3D-Printable Parts (`hardware/3d-prints/`)

**Principle:** Don't reinvent standard parts. Most of ThinCab's printable parts already have battle-tested, free community models on Printables and Thingiverse. We only design custom `.scad`/`.stl` files for ThinCab-specific cutouts or clearances.

All parts are **optional** (wood cleats or off-the-shelf hardware work too), and printing them in **PETG or PLA+** costs ~\$3–\$5 in filament while saving ~\$15–\$25 in hardware.

---

## 1. Reuse Existing Public Models

| Part | Recommended Public Models | Material & Infill |
| :--- | :--- | :--- |
| **VESA 100×100 Tilt Mount** | • [Simple VESA mount](https://www.printables.com/model/231114-simple-vesa-mount) (Maverick0197, Printables)<br>• [Tiltable VESA mount - 100x100](https://www.printables.com/model/1034142-tiltable-vesa-mount-100x100) (rorys3D, Printables)<br>• [VESA 100 adjustable tilt mount](https://www.printables.com/model/874496-vesa-100-adjustable-tilt-mount) (Tim Fechner, Printables) | **PETG, 40%+ infill** (load-bearing) |
| **Sanwa Drill / Layout Jig** | • *Arcade Button Template Collection* (marmermakes, Thingiverse — Slagcoin layouts)<br>• *Arcade Cabinet 6-button Hole Template* (MidkiffAries, Thingiverse — 6× 30mm + 24mm stick)<br>• *Arcade controls template button jig* (Christopher Ortega, Printables) | PLA, 20% infill |
| **Under-Deck Keyboard Mount** | • *Logitech K400+ Underdesk Mount* (Zachary Ragsdale, Printables)<br>• *Logitech K400 Holder / Under Table Mount* (Cederb, Printables) | PLA+ or PETG, 25% infill |
| **RP2040 / Pico Encoder Mount** | • Standard *Raspberry Pi Pico mount* or *GP2040-CE* snap-in trays on Printables | PLA / PETG, 20% infill |
| **90° Corner Assembly Cleats** | • Standard *90 degree corner bracket / wood cleat* models on Printables (M4/wood screw) | PETG, 35% infill |

---

## 2. Custom ThinCab Prints (Only What Doesn't Exist)

We only need to maintain custom OpenSCAD (`.scad` + `.stl`) files here for parts tied to our exact BOM:
- `io-trim-bezel` — Combined front/side snap-in bezel for the exact USB-A extension + master rocker switch cutout (hides rough jigsaw edges).
- `speaker-grille` — Press-fit grille sized for the chosen \$10–\$15 USB speakers/soundbar.
