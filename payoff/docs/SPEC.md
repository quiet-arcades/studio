# Payoff — Game Design Spec

**One-liner:** Bite-size game theory lessons, with tiny games against bots.  
**Target URL:** `payoff.prignano.ai`  
**Audience:** All ages (kid-safe, no accounts, 100% offline-capable).

## Core Loop

1. **Pick a lesson** (2–3 minutes each).
2. **Play a tiny game** against a named bot (1 to 7 rounds, clear two-button choices).
3. **See the payoff matrix light up** with both players' choices and scores.
4. **Read the 1-sentence takeaway** (with an optional *Plain Language / ELI5* toggle) explaining *why* the bot beat you or why cooperation worked, then **replay** against a different bot.

## Initial Curriculum (6 Lessons)

| # | Lesson | Core Idea | Bots |
| --- | --- | --- | --- |
| 1 | **The Dilemma** | Dominant strategy vs. mutual gain (Prisoner's Dilemma) | *Always Cooperate*, *Always Defect* |
| 2 | **Shadow of the Future** | Iterated rounds reward reciprocity & forgiveness | *Tit-for-Tat*, *Grim Trigger* |
| 3 | **Stag Hunt** | Coordination & trust vs. safe solo play | *Cautious Hare*, *Bold Stag* |
| 4 | **Brinkmanship** | Chicken (Hawk–Dove) and credible commitment | *Stubborn Hawk*, *Cautious Dove* |
| 5 | **Stay Unpredictable** | Mixed strategies (Matching Pennies) punish patterns | *Pattern Spotter* |
| 6 | **Fairness & Rejections** | Ultimatum game & why "irrational" rejections work | *Fair Split*, *Tough Bargainer* |

## Technical Architecture

- **Engine (`engine/payoff.mjs`):** Pure, deterministic state machine for 2-player normal-form & iterated games, payoff matrix evaluation, and bot strategy functions. Zero external runtime dependencies.
- **UI (Build 2):** Responsive SVG/HTML cards, keyboard-navigable choices, colorblind-safe matrix highlights, local-only progress (`localStorage`), PWA offline support.
- **Audio (Build 3):** Minimal synthesized Web Audio clicks/chimes (no external audio assets).

## Build Plan

1. **Build 1 — Spec & Deterministic Engine:** `docs/SPEC.md`, `engine/payoff.mjs` (Prisoner's Dilemma, Stag Hunt, Chicken, Matching Pennies, and core bots), and unit tests (`npm test`).
2. **Build 2 — Interactive Lessons & UI:** Lesson selector, animated payoff matrix, round history, Plain Language toggle, local save, PWA.
3. **Build 3 — Polish & Launch:** Remaining lessons (Ultimatum), sound effects, deploy to `payoff.prignano.ai`, and update `prignanodotai-web/content/games.json` (`status: "live"`).
