# ThinCab

**An open-source, minimum-viable-cost, dual-purpose arcade cabinet and thin-client workstation.**

> **Status:** v0.2 Spec (incubating in `games/thincab` until built and proven, then splitting to its own open-source repo).

## What It Is

ThinCab is a compact 1-player bartop arcade cabinet designed to double as a crisp, low-latency thin-client workstation (Moonlight/Sunshine, RDP/AVD, browser kiosk, local terminal).

The core constraint is **minimum viable cost without sacrificing UX**:
- **Target BOM:** ~\$210–\$275 using secondhand enterprise hardware and a single 2'×4' sheet of plywood/MDF.
- **No mushy controls:** Genuine Sanwa or IL/Happ joystick & buttons wired to an RP2040 running **GP2040-CE** in native XInput mode.
- **No TN washout:** Used 24" 1080p IPS matte office monitor mounted at a dual-purpose angle.
- **Single-switch appliance boot:** BIOS `AC Power Recovery = Power On` + one switched power strip.

## Docs

- [`docs/SPEC.md`](./docs/SPEC.md) — Full hardware, electrical, ergonomic, and software specification.
- [`docs/BOM.md`](./docs/BOM.md) — Target Bill of Materials, sourcing tips, and where to save vs. never cheap out.
- [`docs/WIRING.md`](./docs/WIRING.md) — M1 bench prototype wiring, GP2040-CE pinout, and verification checklist.
- [`docs/CUTSHEET.md`](./docs/CUTSHEET.md) — M2 single-sheet (`24"×48"`) panel cut list and ergonomic geometry.
- [`docs/PRIOR_ART.md`](./docs/PRIOR_ART.md) — Prior art, name check, and reusable open-source CAD/firmware/3D models.
- [`AGENTS.md`](./AGENTS.md) — Working rules for this directory.
