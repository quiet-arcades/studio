# Quiet Arcade — Studio Charter

> Calm, clever games that respect your time. (Configured in [`studio.json`](./studio.json).)

**Quiet Arcade** is an indie game studio building original, craft-first web and installable games.

## Brand Identity

Full brand kit in [`brand/`](./brand/):
- **Guidelines & Tokens:** [`brand/BRAND.md`](./brand/BRAND.md), [`brand/tokens.css`](./brand/tokens.css), and [`brand/preview.html`](./brand/preview.html).
- **Aesthetic:** Crisp & tactile — Ink & Paper (`#f7f5f0` / `#111214`) with **Hanko Vermilion** (`#d9381e` light / `#ff6b4a` dark).
- **Mark (*The Cornerstone Matrix*):** [`brand/svg/logo-mark.svg`](./brand/svg/logo-mark.svg), horizontal/stacked lockups, `favicon.svg`, `stamp-badge.svg`, and `social/og-card.svg`.
- **Voice:** Calm, honest, zero-hype. No dark patterns, no tracking, no accounts required.

## Studio Principles

1. **Original work only.** Every game uses original names, rules explanations, art, sounds, and puzzles. Any external inspiration or test material is documented and verified.
2. **Kid-safe & privacy-respecting.** Kids may play our games. No third-party analytics, no ad trackers, no free-text LLM prompts for minors, and progress stays on the player's device unless explicitly required for multiplayer.
3. **Deterministic core.** Game rules and state transitions live in one authoritative, tested module (e.g., Go/TinyGo WASM). UI and servers consume that module rather than duplicating logic.
4. **Fail-closed operations.** Any networked feature or AI integration uses hard spend caps, strict allowlists, and deterministic output filters. Secrets live only in deployment secrets, never in git.
5. **Verify before shipping.** Every game defines deterministic checks in [`studio.json`](./studio.json) and its own `AGENTS.md`. No milestone is done until all checks pass.

## Studio Layout

```text
c:\antigravity\games\
├── studio.json          # Portfolio registry, milestones, and allowlisted checks
├── STUDIO.md            # This charter and operating manual
├── AGENTS.md            # Studio-wide AI assistant rules
├── package.json         # Root scripts (`npm run studio`, `npm test`)
├── studio/              # Local Studio Dashboard (server, UI, tests)
├── .agents/skills/      # Studio role skills (Producer, Game Designer, Gameplay QA)
└── goodtogo/            # Flagship title: Good to Go (go.prignano.ai)
```

## Studio Roles

Work in the studio maps to three core roles (available as workspace skills in `.agents/skills/`):

| Role | Skill | Owns |
| --- | --- | --- |
| **Producer** | `studio-producer` | Portfolio status in `studio.json`, milestone sequencing, onboarding new games, owner-action tracking. |
| **Game Designer** | `game-designer` | Game specs (`docs/SPEC.md`), learning curves, rules clarity, accessibility, audio/visual feel. |
| **Gameplay QA** | `gameplay-qa` | Rules/engine verification, deterministic check suites, privacy/kid-safety/spend-control audits. |

## Adding a New Game

1. Create a folder `<game-id>/` under `c:\antigravity\games\`.
2. Add `<game-id>/docs/SPEC.md` and `<game-id>/AGENTS.md` (with its "Checks to run" section).
3. Register the game in [`studio.json`](./studio.json) with its `id`, `name`, `path`, `stage`, `checks`, and `milestones`.
4. Run `npm run studio` and verify the game appears on the Studio Dashboard with passing checks.
