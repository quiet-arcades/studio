# Skyhop — Game Spec

**Skyhop** is an original 5-stage 3D obstacle course (obby) built for Roblox using a Rojo-compatible project structure and a deterministic `.rbxlx` build script.

## Core Loop

1. Player spawns at Stage 1 on the starting island.
2. Player jumps across floating platforms, avoids glowing hazard blocks, and rides moving platforms.
3. Touching a checkpoint pad saves the player's current stage (`leaderstats.Stage`) and updates their respawn point.
4. Falling below the course (`Y < -20`) or touching a hazard block respawns the player at their latest checkpoint.
5. Reaching the Stage 5 summit beacon triggers a celebration banner and lets the player replay from Stage 1.

## Stages

| Stage | Name | Mechanics |
| --- | --- | --- |
| 1 | Stepping Stones | Basic anchored platforms with comfortable gaps |
| 2 | Lava Crossing | Platforms with glowing red hazard strips to jump over |
| 3 | Sky Bridges | Narrower walkways and elevation climbs |
| 4 | Moving Islands | Horizontally oscillating platforms |
| 5 | Summit Ascent | Final climb combining gaps, hazards, and a moving bridge to the finish beacon |

## Kid-Safe & Studio Principles

- Original name, level layout, and Luau code.
- No third-party analytics, no external HTTP requests (`HttpService` not used), no microtransactions or paid prompts.
- Deterministic level validation in `test/level.test.mjs`.
