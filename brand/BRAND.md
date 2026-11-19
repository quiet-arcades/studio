# Quiet Arcades — Brand Identity Guidelines

**Version:** 1.0.0  
**Studio Name:** Quiet Arcades  
**Tagline:** *"Calm, clever games that respect your time."*

---

## 1. Brand Essence & Player Covenant

**Quiet Arcades** is an independent game studio building original, craft-first browser and installable games spanning Go, chess, game theory, logic puzzles, and tactile arcade mechanics. Every release feels like sitting down at a well-lit wooden table with heavy paper, crisp sumi ink, and a single decisive stone.

### The Four Commitments
1. **Zero Ads & Zero Tracking:** No ad networks, analytics beacons, third-party font CDNs, or behavioral telemetry. What happens on the board stays on the device.
2. **No Dark Patterns:** No daily-streak guilt, artificial energy timers, loot boxes, red notification badges, or manipulative retention loops.
3. **Kid-Safe by Construction:** Safe for curious minds of every age—no unmoderated chat, external purchase traps, or noisy pop-ups.
4. **Respect for Attention:** Games start immediately, pause cleanly, communicate rules clearly, and let players leave satisfied rather than drained.

---

## 2. Voice & Tone

Quiet Arcades sounds like a **thoughtful game maker and patient host**—warm, dry-witted, concise, and precise. Never hype-driven, infantilizing, or punitive.

### Voice Attributes
- **Calm, not sterile:** Warm and grounded, like margin notes in a classic strategy book.
- **Clever, not smug:** Celebrate elegant play without talking down to beginners.
- **Direct, not abrupt:** Respect reading time; prefer one crisp sentence over three paragraphs of tutorial modal text.

### Copy Examples Across Contexts

| Context | Write This (Quiet Arcades) | Not This (Noisy Convention) |
| :--- | :--- | :--- |
| **Landing Hero** | Play a five-minute match of corner Go. No account required. | PLAY FREE NOW! Join 50,000+ players and climb the global season pass! |
| **Win State** | Checkmate in 19 moves. Clean endgame. | EPIC VICTORY!! +500 XP! Share your streak now! |
| **Loss / Stalemate** | Mutual defection—both sides take 1 point. Try another round? | YOU LOST! Watch a 30s video to revive your streak! |
| **Pause / Exit** | Game saved locally. Pick up whenever you're ready. | Wait! If you leave now, you'll forfeit your daily bonus! |
| **Error / Offline** | Offline mode active. Local play and puzzles work normally. | Whoopsie! Something went super wrong with the network! |

---

## 3. Logo System & Clearspace

### The Mark: *The Cornerstone Matrix*
The Quiet Arcades mark (`svg/logo-mark.svg`) distills our four design pillars into a single `64×64` geometric emblem built on a strict `4px` integer grid (scaling cleanly down to `32×32` and `16×16` without sub-pixel blur):

- **2×2 Grid Architecture:** References the canonical **2×2 game-theory payoff matrix**, tactical board quadrants, and pixel-grid arcade precision.
- **Alternating Ink Diagonal:** A solid ink tile (`TL`) paired with two crisp stroked territory cells (`TR`, `BL`) evokes **chess squares** and **open Go territory**.
- **The Vermilion Stone (`BR`):** A solid circular **Hanko Vermilion** token (`0.5px` optical overshoot) anchors the bottom-right corner—acting simultaneously as a **Go stone**, an **arcade action button**, a **Japanese hanko seal**, and the tail of a subtle monogram **Q**.

### Asset Inventory

| File | Dimensions / ViewBox | Primary Usage |
| :--- | :--- | :--- |
| `svg/logo-mark.svg` | `64×64` | Standalone app icon, nav bar mark, loading screen emblem (`currentColor` + vermilion). |
| `svg/logo-lockup-horizontal.svg` | `360×64` | Primary website header, documentation masthead, desktop title bars. |
| `svg/logo-lockup-stacked.svg` | `320×184` | About pages, splash screens, press kits, centered hero headers (includes tagline). |
| `svg/favicon.svg` | `32×32` | Browser tab icon (`16×16` / `32×32`); includes adaptive paper/slate tile for universal tab contrast. |
| `svg/stamp-badge.svg` | `208×44` | Tactile hanko-inspired footer colophon badge embedded inside individual games. |
| `social/og-card.svg` | `1200×630` | Open Graph / social link preview template for studio and game launches. |

### Clearspace & Minimum Scale
- **Clearspace (`X`):** Maintain a minimum clearspace around all marks and lockups equal to **one grid cell (`X = 37.5%` of mark height, or `24u` on the `64u` mark)**. No borders, UI controls, or text may enter this zone.
- **Minimum Sizes:**
  - `favicon.svg`: **16 × 16 px** (pixel-hinted `2px` gutter at `16px`).
  - `logo-mark.svg`: **20 × 20 px** digital / **6 mm** print.
  - `logo-lockup-horizontal.svg`: **130 px** wide.
  - `logo-lockup-stacked.svg`: **160 px** wide (switch to horizontal lockup or standalone mark below `160px`).
- **Color Modes:**
  - **Standard (Two-Tone):** `currentColor` (`#161618` Light / `#f0eee9` Dark) + Vermilion (`#d9381e` Light / `#ff6b4a` Dark).
  - **Monochrome Stamp (Single-Color):** All paths set to solid Ink or solid Hanko Vermilion for embossed print, e-ink displays, or laser etching.

---

## 4. Color System: *Ink, Paper & Hanko Vermilion*

Quiet Arcades pairs warm, low-glare **Washi Paper** and **Sumi Ink** neutrals with a single decisive accent: **Hanko Vermilion**. In dark mode, paper inverts to **Sumi Slate** (`#111214`) while vermilion lifts in lightness (`58.5%` → `70.7%` OKLCH) to preserve luminous contrast without neon eye strain.

### Core Surface & Ink Tokens

| Token | Role | Light Hex | Light OKLCH | Dark Hex | Dark OKLCH | Contrast (L / D) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `--qa-bg` | Primary page & game canvas | `#f7f5f0` | `oklch(97.0% 0.007 88.6)` | `#111214` | `oklch(18.2% 0.004 264.5)` | Base surface |
| `--qa-surface` | Cards, panels, active boards | `#ffffff` | `oklch(100.0% 0.000 0.0)` | `#181a1d` | `oklch(21.7% 0.007 258.4)` | Elevated card |
| `--qa-surface-sunken` | Wells, move trays, code blocks | `#edeae2` | `oklch(93.7% 0.011 89.7)` | `#0b0c0e` | `oklch(15.4% 0.005 264.4)` | Recessed well |
| `--qa-surface-raised` | Modals, tooltips, popovers | `#fcfbf8` | `oklch(98.8% 0.004 91.4)` | `#202327` | `oklch(25.5% 0.009 255.6)` | Floating layer |
| `--qa-ink` | Primary text, wordmark, dark stones | `#161618` | `oklch(20.1% 0.004 286.0)` | `#f0eee9` | `oklch(94.9% 0.007 88.6)` | **16.6:1** / **16.2:1** (AAA) |
| `--qa-ink-secondary` | Body prose, rules, subtitles | `#4a4946` | `oklch(40.5% 0.005 91.5)` | `#b8b5ad` | `oklch(77.3% 0.012 89.7)` | **8.3:1** / **9.2:1** (AAA) |
| `--qa-ink-muted` | Coordinates, captions, metadata | `#6b6963` | `oklch(52.1% 0.010 91.6)` | `#8d8a82` | `oklch(63.4% 0.012 89.8)` | **5.0:1** / **5.4:1** (AA) |
| `--qa-border` | Hairline dividers & grid lines | `#dcd8ce` | `oklch(88.3% 0.014 88.7)` | `#2a2d32` | `oklch(29.6% 0.010 260.7)` | Subtle rule |
| `--qa-border-strong` | Tactile card & button edges | `#b5b0a4` | `oklch(75.8% 0.018 88.0)` | `#43474f` | `oklch(39.7% 0.014 264.4)` | Structural edge |

### Brand & Tactile Board Pigments

| Token | Role | Light Hex | Light OKLCH | Dark Hex | Dark OKLCH | Usage Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `--qa-vermilion` | Hanko seal, stone emblem, primary CTA | `#d9381e` | `oklch(58.5% 0.201 31.9)` | `#ff6b4a` | `oklch(70.7% 0.187 34.1)` | Reserve `< 10%` of viewport area |
| `--qa-vermilion-ink` | Small inline vermilion links & labels | `#b82b14` | `oklch(51.4% 0.181 31.9)` | `#ff856a` | `oklch(74.8% 0.154 33.7)` | **5.7:1+** AA normal text contrast |
| `--qa-vermilion-subtle` | Stamp wash, active row highlight | `#fbeae7` | `oklch(95.0% 0.019 29.5)` | `#2d1916` | `oklch(23.9% 0.033 29.0)` | Soft tint surface |
| `--qa-ochre` | Kaya board wood, draw state, P2 token | `#a86f18` | `oklch(58.8% 0.119 71.3)` | `#eab354` | `oklch(79.9% 0.128 78.7)` | Warm mineral ochre |
| `--qa-moss` | Solved state, legal move indicator | `#246b49` | `oklch(47.4% 0.090 159.0)` | `#52b788` | `oklch(70.6% 0.118 160.9)` | **5.9:1+** AA accessible green |
| `--qa-cobalt` | Keyboard focus ring, analysis line | `#23538a` | `oklch(43.8% 0.105 253.9)` | `#6ba4e8` | `oklch(70.8% 0.117 253.6)` | **7.2:1+** AAA accessible blue |

---

## 5. Typography

To uphold our **zero-tracking** promise, Quiet Arcades **never fetches fonts from third-party CDNs** (such as Google Fonts). Products either rely directly on our calibrated native OS font stacks below (`0 KB` network cost) or self-host subsetted `.woff2` files from the same origin.

### Three-Tier Font Pairing

1. **UI & Wordmark Sans (`--qa-font-sans`)**  
   `'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`  
   *Role:* Wordmark (`600–700`, `-0.025em` tracking), headings, buttons, HUD labels, and navigation.
2. **Editorial & Rulebook Serif (`--qa-font-serif`)**  
   `'Newsreader', 'Charter', 'Bitstream Charter', 'Iowan Old Style', 'Sitka Text', Cambria, Georgia, serif`  
   *Role:* Studio tagline, game introductions, strategy essays, and rulebook explanations. Gives digital screens the calm warmth of printed paper.
3. **Notation & Telemetry Mono (`--qa-font-mono`)**  
   `'JetBrains Mono', ui-monospace, 'SFMono-Regular', 'Cascadia Code', 'IBM Plex Mono', 'DejaVu Sans Mono', Menlo, Consolas, monospace`  
   *Role:* Algebraic chess notation (`1. e4 c5`), Go coordinates (`Q16`), game-theory payoff cells (`+3, +3`), seed IDs, and match clocks. Always pair with `font-variant-numeric: tabular-nums`.

### Type Scale & Rhythm

| Role | Token | Size | Line Height | Weight & Features |
| :--- | :--- | :--- | :--- | :--- |
| **Display Hero** | `--qa-text-3xl` | `clamp(2rem, 4vw, 2.75rem)` | `1.12` | Sans `700`, tracking `-0.03em` |
| **Section Title** | `--qa-text-2xl` | `1.75rem` (`28px`) | `1.20` | Sans `650`, tracking `-0.02em` |
| **Game Title / H3** | `--qa-text-xl` | `1.25rem` (`20px`) | `1.30` | Sans `600`, tracking `-0.015em` |
| **Editorial Lead / Tagline** | `--qa-text-lg` | `1.125rem` (`18px`) | `1.55` | Serif `400` (italic optional for tagline) |
| **Body Copy** | `--qa-text-base` | `1rem` (`16px`) | `1.60` | Sans or Serif `400`, max measure `65ch` |
| **UI Control / Label** | `--qa-text-sm` | `0.875rem` (`14px`) | `1.40` | Sans `500` |
| **Coordinates / Badge** | `--qa-text-xs` | `0.75rem` (`12px`) | `1.35` | Mono `500`, `tabular-nums`, tracking `+0.04em` |

---

## 6. Do's & Don'ts

### Do
- **Treat Vermilion like hanko ink:** Use `--qa-vermilion` sparingly (`< 10%` of screen area) for the brand stone, primary play action, or decisive move marker so it commands calm authority.
- **Honor tactile geometry:** Use crisp `1px`–`1.5px` structural borders (`--qa-border`) and flat or hard-offset paper shadows rather than blurry glassmorphism or neon glows.
- **Keep motion calm and interruptible:** Use fast, zero-bounce transitions (`120ms–180ms cubic-bezier(0.2, 0, 0, 1)`) and honor `prefers-reduced-motion: reduce`.
- **Use `stamp-badge.svg` as a quiet colophon:** Place it in game footers or "About" drawers at `28px–36px` height—never as an intrusive floating watermark over active boards.

### Don't
- **Never pulse or blink the Vermilion Stone** as an unread badge, countdown alarm, or attention trap.
- **Never recolor the stone** to neon green, cyan, or gradients, or swap the positions of the 2×2 grid quadrants.
- **Never place the standard dark-ink mark on low-contrast surfaces** without switching `color` (which drives `currentColor`) to `--qa-ink` (`#f0eee9` in dark mode).
- **Never load external Google Fonts or third-party scripts** that leak player IP addresses, or introduce artificial loading delays before gameplay begins.
