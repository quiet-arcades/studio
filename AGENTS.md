# Instructions for AI Assistants — Quiet Arcade

This workspace (`c:\antigravity\games`) is the **Quiet Arcade** indie studio. It houses the studio operating system, the local Studio Dashboard, and each game in its own subdirectory (starting with [`goodtogo/`](./goodtogo/) and [`payoff/`](./payoff/)).

Read [`STUDIO.md`](./STUDIO.md) and [`studio.json`](./studio.json) before making studio-wide changes. When working inside a specific game directory, also read and follow that game's own `AGENTS.md` and `docs/SPEC.md`.

## Studio Operating Rules

- **Respect game boundaries.** Each game is self-contained in its own directory (and git repo). Never leak secrets, IDs, or private data across repos or into commits.
- **Keep `studio.json` accurate.** When a game completes a milestone, adds a check, or changes stage, update [`studio.json`](./studio.json) to match reality.
- **Never duplicate game logic.** Rules belong in the game's engine module; the studio dashboard only reads metadata, git status, and runs allowlisted checks.
- **Propose, don't deploy.** Never push to production, alter DNS/Cloudflare settings, or change spend limits without the owner's explicit yes.

## Studio Skills

Use the workspace skills in `.agents/skills/` when taking on a studio role:
- `studio-producer` — milestone planning, portfolio updates, onboarding new games.
- `game-designer` — specs, mechanics, progression, UX/accessibility.
- `gameplay-qa` — test suites, solver/engine checks, privacy and safety audits.

## Checks to Run

Studio dashboard & registry tests:

```powershell
npm test
```

Start the local Studio Dashboard:

```powershell
npm run studio
```
