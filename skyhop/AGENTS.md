# Instructions for AI Assistants — Skyhop

Skyhop is an original Prignano Games Roblox obby (`skyhop/`). Read [docs/SPEC.md](docs/SPEC.md) first.

## Rules

- **Original work only.** Original level design, naming, and Luau scripts.
- **Kid-safe & privacy-first.** No external HTTP calls, no analytics, no chat/LLM integrations, no monetization prompts.
- **Single source of truth.** Level geometry and stage definitions live in `src/shared/LevelData.luau`. Both the Roblox runtime (`ObbyBuilder.server.luau`) and the `.rbxlx` builder (`scripts/build-rbxlx.mjs`) use the same scripts/data.
- **Verify before done.** Run `npm test` inside `skyhop/` before calling any change complete.

## Checks to Run

```powershell
npm test
```
