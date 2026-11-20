# ThinCab Bill of Materials (v0.2)

Target total cost: **~\$210–\$275** (assuming secondhand/refurbished compute and display).

| # | Subsystem | Part / Spec | Sourcing Notes | Est. Cost (USD) |
| :--- | :--- | :--- | :--- | :--- |
| 1 | **Compute** | Used x86-64 Micro PC (Dell OptiPlex 3060/3070 Micro, Lenovo M720q, or HP 800 G4), i3/i5 8th-gen+, 8GB RAM, 128GB+ SSD | eBay / local refurbisher (verify power brick included) | \$65–\$90 |
| 2 | **Display** | Used 24" 1080p Matte IPS Monitor w/ 100×100mm VESA (e.g., Dell P2419H / P2422H) | Local Marketplace / refurbisher (avoid TN panels) | \$45–\$70 |
| 3 | **Joystick** | 1× Sanwa JLF-TP-8YT (or IL Eurojoystick) | Arcade Shock / Focus Attack / Paradise Arcade | \$22–\$26 |
| 4 | **Buttons** | 8× Sanwa OBSF-30 (6 action + `Start` + `Coin/Hotkey`) | Same vendor as joystick to save shipping | \$20–\$24 |
| 5 | **Encoder & Wire** | RP2040 GP2040-CE breakout board + 0.110" quick-disconnect harness (or Pi Pico + crimp wires) | AliExpress / Amazon / maker shop | \$10–\$18 |
| 6 | **Thin-Client Input** | Compact wireless keyboard w/ built-in trackpad (e.g., Logitech K400+) | Amazon / Best Buy / used | \$20 |
| 7 | **Enclosure** | 1× 24"×48"×1/2" (12mm) Baltic birch or MDF project panel + glue, screws, iron-on edge banding | Home Depot / Lowe's / local lumberyard | \$30–\$45 |
| 8 | **Audio** | Compact USB-powered stereo speakers or mini soundbar | Amazon / salvaged | \$10–\$15 |
| 9 | **Webcam + Mic** | 1080p USB UVC webcam w/ built-in mic & **physical privacy shutter** | Amazon / Logitech C270/C920 or generic UVC | \$15–\$25 |
| 10 | **Power & I/O** | Switched surge strip + 1× USB 3.0 panel-mount extension cable | Amazon / hardware store | \$15 |
| | **Total** | | | **\$252–\$338** |

> **Zero-dollar savings:** If you already have a spare 24" IPS monitor or wireless keyboard, the build drops to **~\$165–\$220**.

## Optional 3D-Printed Cost-Savers & Build Helpers

If you have access to a 3D printer (PLA+ or PETG, ~\$3–\$5 in filament total), see [`hardware/3d-prints/README.md`](../hardware/3d-prints/README.md) for printable parts that replace store-bought brackets and simplify woodworking:
- **VESA 100×100 Tilt Cleats** (saves ~\$15–\$20 vs. a metal VESA mount)
- **Control Deck Drill Jig** (accurate Sanwa button/stick spacing with a hand drill)
- **Under-Deck Keyboard Slide Rails** (clean slide-in dock without drawer hardware)
- **I/O Bezels, Speaker Grilles, & GP2040-CE Mount Tray** (clean finish over rough wood cuts)

## What Not to Substitute

- **Do not swap the IPS monitor for a TN panel** — standing vs. sitting viewing angles will invert colors and ruin thin-client text legibility.
- **Do not swap the RP2040 (GP2040-CE) for a generic keyboard-emulating USB encoder** — XInput mode is what keeps arcade stick/button inputs from interfering with desktop typing.
- **Do not buy \$15 knockoff button/stick bundles** — poor microswitches double-trigger or stick within weeks.
