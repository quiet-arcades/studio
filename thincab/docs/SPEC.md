# ThinCab Specification (v0.2)

**An open-source, minimum-viable-cost, dual-purpose arcade cabinet and thin-client workstation.**

---

## 1. Design Goals

1. **Minimum viable cost, zero UX compromise:** Target **~\$210–\$275** total build cost by sourcing secondhand enterprise compute/displays and open-source firmware, while spending where it is felt every second (controls, IPS display, wired Ethernet).
2. **Appliance-first boot:** Flipping a single external power switch boots the entire cabinet into a controller-navigable launcher in under 15 seconds.
3. **First-class thin client:** Plays retro and indie games locally *and* streams low-latency remote desktop/workstation sessions (Moonlight/Sunshine, FreeRDP/AVD, kiosk browser).
4. **No-clash input model:** Arcade controls run in native **XInput** mode so bumping the joystick or buttons never spams keystrokes into a terminal or remote session.
5. **Single-sheet reproducibility:** All cabinet panels fit on **one 2'×4' (24"×48") project sheet** of 1/2" (12mm) Baltic birch or MDF, buildable with basic hand/power tools (jigsaw/circular saw + drill).

## 2. Non-Goals (v0.2)

- No CRT high-voltage wiring (16:9 matte IPS LCD only for thin-client legibility).
- No custom PCB fabrication required (uses off-the-shelf RP2040 / GP2040-CE boards).
- No built-in trackball or coin door in the base spec (keeps cost low and deck compact; wireless keyboard+trackpad handles desktop pointer input).
- No 2-player deck in v0.2 (keeps width under ~22" for desk ergonomics).

---

## 3. Cost-Optimization Principles

| Save Aggressively Here (Zero UX Loss) | Never Cheap Out Here (Protects UX) |
| :--- | :--- |
| **Used Enterprise Micro PC (\$65–\$90)** instead of new N100/Pi 5 | **Genuine Sanwa or IL/Happ stick & buttons (\$42–\$50)** |
| **Used 24" IPS Office Monitor (\$45–\$70)** instead of new | **Matte IPS 1080p panel** (no TN viewing-angle washout) |
| **RP2040 + GP2040-CE (\$10–\$18)** instead of \$50 commercial encoders | **XInput-native firmware** with hardware hotkey layers |
| **BIOS AC Power Recovery + \$12 switched strip** instead of relays | **Wired Gigabit Ethernet** for sub-5ms streaming |
| **1/2" birch/MDF + iron-on edge banding** instead of T-molding routing | **Compact wireless keyboard + trackpad (\$20)** |
| **1-Player control deck** (half the wood, half the buttons) | **Single external power switch** |

---

## 4. Mechanical & Ergonomic Spec

### 4.1 Form Factor: Desk-First 1P Bartop
- **Target footprint:** ~22" W × 17" D × 22" H (fits comfortably on a standard sitting or standing desk).
- **Material:** 1× 24"×48"×1/2" (12mm) Baltic birch plywood or MDF sheet, joined with wood glue + pocket screws/cleats, finished with iron-on edge banding (no router required).
- **Display mount:** Internal 100×100mm VESA bracket, tilted ~15°–20° back—steep enough for comfortable desktop reading without neck strain, angled enough for arcade play.

### 4.2 Thin-Client Ergonomics & I/O
- **Under-deck keyboard dock:** A simple 3/4" open slot (via 3D-printed slide rails or wood cleats) directly under the control panel overhang holds a compact wireless keyboard+trackpad flush during arcade play and pulls out onto the desk/lap for thin-client work.
- **Accessible I/O:**
  - 1× front/side **USB 3.0 panel-mount extension** (for flash drives, YubiKey, or wired peripherals).
  - 1× rear **RJ45 Gigabit Ethernet** + **IEC power inlet / switched power strip**.

### 4.3 Optional 3D-Printed Parts (`hardware/3d-prints/`)
All 3D-printed parts are **optional** (wood/off-the-shelf alternatives exist), but using a friend's printer cuts hardware cost further and hides rough hand-tool cuts:
- **Control Deck Drill Jig:** Drop-on template for accurate 30mm button and Sanwa JLF joystick hole spacing with a standard hand drill.
- **15°–20° VESA 100×100 Mount Cleats:** Replaces a \$15–\$25 metal VESA bracket; bolts to the monitor and screws into the internal cross-brace.
- **Under-Deck Keyboard Rails:** Two-piece slide-in rails for the wireless keyboard dock.
- **I/O & Switch Bezels:** Snap-in trim plates that cover rough jigsaw cutouts for the USB port, rocker switch, and speaker holes.
- **GP2040-CE Snap-In Tray & Corner Gussets:** Tool-free encoder mount with zip-tie strain relief, plus internal 90° assembly cleats.

---

## 5. Electrical & Hardware Spec

- **Compute:** Used x86-64 enterprise micro PC (e.g., Dell OptiPlex 3060/3070 Micro, Lenovo ThinkCentre M720q, HP EliteDesk 800 G4) with Intel 8th-gen+ QuickSync (H.264/HEVC hardware decode), 8GB+ RAM, 128GB+ NVMe/SSD, Gigabit Ethernet.
- **Display:** Used 24" 1080p matte IPS monitor with 100×100mm VESA mount (e.g., Dell P2419H / P2422H).
- **Controls (1P):**
  - 1× Sanwa JLF-TP-8YT (or IL Eurojoystick)
  - 6× 30mm action buttons + 2× utility buttons (`Start`, `Coin/Hotkey`) — Sanwa OBSF-30 or IL/Happ.
- **Encoder:** RP2040 board running **GP2040-CE** in **XInput mode**, wired with solderless 0.110" / 0.187" quick-disconnect harnesses.
  - Hotkey layer: `Coin/Hotkey + Start` = exit active app / return to launcher.
- **Audio & Webcam:**
  - Compact USB-powered stereo speakers/soundbar mounted internally behind speaker holes.
  - **USB UVC Webcam (1080p + built-in mic + physical privacy shutter)** mounted on the upper monitor bezel or recessed into the top cap for AVD/Teams/Zoom calls (redirects natively through Windows App).
- **Power:** BIOS configured for `AC Power Recovery = Power On`. PC, monitor, and speakers plug into one internal switched surge strip with a single accessible master switch.

---

## 6. Software & Thin-Client Architecture

### 6.1 Base OS & Provisioning (Windows 11 Pro)
- **OS:** **Windows 11 Pro** (using the embedded OEM UEFI digital license included on most used Dell/Lenovo/HP enterprise Micro PCs, \$0 extra) with auto-login enabled.
- **Why Windows 11:** Runs the **official Microsoft Windows App (AVD)**, **Citrix Workspace**, **Omnissa Horizon**, **Amazon WorkSpaces**, **Parsec**, and **Moonlight** natively with full audio/mic/USB redirection and hardware video decode. *(Linux remains an optional alternative for pure open-source/Moonlight/Citrix/Horizon builds where AVD Web Client is sufficient.)*
- **Provisioning:** Declarative PowerShell script [`software/windows/setup.ps1`](../software/windows/setup.ps1) via `winget`.

### 6.2 Launcher & Mode Switching
- **Primary Shell:** Controller-first fullscreen launcher (**Playnite Fullscreen** on Windows, **ES-DE** or **Pegasus** on Linux) set to auto-start on login.
- **Thin-Client Tiles (First-Class Citizens):**
  1. **Microsoft Windows App (AVD)** — Official Azure Virtual Desktop / Windows 365 / RDP client (Windows).
  2. **Moonlight** — Low-latency GPU/desktop streaming from a host workstation running Sunshine.
  3. **Kiosk Browser** — Fullscreen Edge/Chromium profile for web apps and AVD Web Client.
  4. **Local Terminal / Desktop** — Drops to desktop with a single hotkey to return to the launcher.
- **Wake-on-LAN:** Dedicated launcher tile (or hotkey) sends a WoL magic packet to wake the remote host workstation.

---

## 7. Planned Repo Layout (When Ready to Split)

```text
thincab/
├── LICENSE                  # MIT (software) + CERN-OHL-P v2 (hardware/CAD)
├── README.md
├── docs/
│   ├── SPEC.md
│   ├── BOM.md
│   ├── WIRING.md
│   └── ERGONOMICS.md
├── hardware/
│   ├── cad/                 # Parametric FreeCAD source
│   ├── dxf/                 # Single 24"x48" cut sheet
│   └── 3d-prints/           # Optional STL/STEP brackets & bezels
└── software/
    ├── setup.sh             # Reproducible Linux + launcher + thin-client setup
    ├── gp2040-ce/           # Exported XInput + hotkey profile JSON
    └── scripts/             # WoL trigger & mode-switch helpers
```

---

## 8. Build & Proof Milestones

1. **M1 — Bench Prototype:** Wire RP2040 (GP2040-CE) + Sanwa controls to used micro PC + 24" IPS monitor; verify XInput isolation, single-switch boot, and <5ms Moonlight streaming over Ethernet.
2. **M2 — Cut Sheet & Enclosure:** Finalize single 24"×48" panel layout, assemble bartop, validate viewing angle and under-deck keyboard dock ergonomics.
3. **M3 — Reproducible Software:** Automate Linux + launcher + thin-client setup into a clean script and export GP2040-CE config.
4. **M4 — Open-Source Split:** Publish `thincab` to its own public repository with build photos, cut files, and tested BOM.
