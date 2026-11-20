# ThinCab M2 — Single-Sheet Cut Layout (`24" × 48"`)

Every structural wood panel fits cleanly on **one standard 24" × 48" × 1/2" (12mm) Baltic birch or MDF project sheet**, plus **one 8ft 1×2 pine strip** (`3/4" × 1-1/2"`) for internal assembly cleats and the VESA monitor cross-brace.

> **Before making any cross-cuts:** Measure your exact 24" monitor's outer width (`W_mon`). Set your internal width `W = W_mon + 0.5"` (e.g., `21.75"–22.0"`).

---

## 1. Panel Cut List

| Panel | Qty | Dimensions | Notes |
| :--- | :--- | :--- | :--- |
| **Side Panels (L & R)** | 2 | `16.5" D × 21.5" H` (profiled) | `7.0"` top depth, `16.5"` bottom depth, `6.0"` front height, `15°` monitor slope. |
| **Bottom Base** | 1 | `W × 10.0"` | Holds the Micro PC (`~7.2"` deep) + power strip; leaves open front space for the keyboard dock. |
| **Control Deck (Top)** | 1 | `W × 7.5"` | Houses 1× Sanwa JLF + 8× 30mm buttons. |
| **Control Front Apron** | 1 | `W × 2.5"` | Front face below the control deck. |
| **Top Rail / Marquee Cap** | 1 | `W × 3.5"` | Ties the top of the two side panels together above the monitor. |
| **Internal Cleats & VESA Brace** | — | From 1× 8ft `1×2` pine strip | `3/4" × 1-1/2"` solid wood for screw cleats and the horizontal VESA 100×100 monitor mount. |

*Back panel:* Leave the lower rear open for passive airflow around the Micro PC and monitor PSU.

---

## 2. `24" × 48"` Sheet Nesting Diagram

See the exact-scale SVG diagrams in [`hardware/cutsheet-24x48.svg`](../hardware/cutsheet-24x48.svg) and [`hardware/side-profile.svg`](../hardware/side-profile.svg) (open in any browser to inspect or print).

1. **First cut:** Split the `24" × 48"` sheet at **`24.5"`** into Half A (`24.5" × 24"`) and Half B (`23.5" × 24"`).
2. **Half A (`24.5" × 24"`):** Nest **Side L** and **Side R** (flipped 180°). `16.5" + 7.0" = 23.5"` width × `21.5"` height (leaves `1.0"` clearance between/around the angled faces).
3. **Half B (`23.5" × 24"`):** Rip to width `W` (`~22.0"`), then cross-cut: `10.0" + 7.5" + 2.5" + 3.2" = 23.2"` (leaves `0.8"` for saw kerfs).

```text
0"                        24"                                            48"
┌──────────────────────────┬──────────────────────────────────────────────┐ 0"
│  Side L (7" top/16.5"bot)│  Bottom Base (W x 10.0")                     │
│     nested w/            ├──────────────────────────────────────────────┤
│  Side R (flipped 180°)   │  Control Deck (W x 7.5")                     │
│                          ├──────────────────────────────────────────────┤
│                          │  Control Front Apron (W x 2.5")              │
│  (21.5" H)               ├──────────────────────────────────────────────┤
│                          │  Top Rail (W x 3.5")                         │
└──────────────────────────┴──────────────────────────────────────────────┘ 24"
```

---

## 3. Side Panel Profile Coordinates

Plot from the **bottom-rear corner `(0", 0")`**:
- `(0", 0")` → `(16.5", 0")` — Flat bottom
- `(16.5", 0")` → `(16.5", 6.0")` — Front vertical face
- `(16.5", 6.0")` → `(9.5", 6.5")` — Control deck ledge (`~5°` tilt)
- `(9.5", 6.5")` → `(5.5", 21.5")` — Screen slope (`~15°` back from vertical)
- `(5.5", 21.5")` → `(0", 21.5")`? *Note: Extend top edge to `(7.0", 21.5")` if you want a `1.5"` top visor above the screen, then drop to `(5.5", 20.5")`; otherwise keep `(0", 21.5")` → `(7.0", 21.5")` and angle down to `(9.5", 6.5")` (`~10°`–`15°` slope).*

---

## 4. M2 Verification Checklist

- [ ] Monitor fits between the two side panels with ~1/4" side clearance.
- [ ] VESA 100×100 cleats hold the monitor securely at ~15° with no flex when pressing buttons.
- [ ] Logitech K400+ slides smoothly into the under-deck dock without hitting the Bottom Base.
- [ ] Micro PC + switched surge strip sit cleanly on the `10.0"` Bottom Base with rear cable access.
