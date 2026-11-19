# Instructions for AI Assistants — Payoff

Payoff is an original Prignano Games title: bite-size game theory lessons with tiny games against deterministic bots (`payoff.prignano.ai`). Read [docs/SPEC.md](docs/SPEC.md) first.

## Rules

- **Original work only.** Write original lesson copy, bot names, visuals, and sound.
- **Kid-safe & privacy-first.** No analytics, no tracking, no accounts, no external API calls. All progress stays on the device.
- **Deterministic core.** Payoff matrices, round resolution, and bot strategies live in `engine/` and are never duplicated in UI code.
- **Verify before done.** Run `npm test` before calling any change complete.

## Checks to Run

```powershell
npm test
```
