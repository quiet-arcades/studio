import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildRbxlx } from "../scripts/build-rbxlx.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "..");

function parseLevelParts(luauSource) {
  const parts = [];
  const lineRegex =
    /\{\s*id\s*=\s*"([^"]+)",\s*stage\s*=\s*(\d+),\s*kind\s*=\s*"([^"]+)",\s*position\s*=\s*\{\s*([^}]+)\s*\},\s*size\s*=\s*\{\s*([^}]+)\s*\}/g;
  for (const match of luauSource.matchAll(lineRegex)) {
    parts.push({
      id: match[1],
      stage: Number(match[2]),
      kind: match[3],
      position: match[4].split(",").map((n) => Number(n.trim())),
      size: match[5].split(",").map((n) => Number(n.trim())),
    });
  }
  return parts;
}

test("LevelData defines all 8 stages, checkpoints, stars, and finish pad", () => {
  const src = readFileSync(join(rootDir, "src/shared/LevelData.luau"), "utf8");
  const parts = parseLevelParts(src);
  assert.ok(parts.length >= 30, "expected at least 30 level parts");

  const checkpoints = new Set(parts.filter((p) => p.kind === "checkpoint").map((p) => p.stage));
  for (let s = 1; s <= 8; s++) {
    assert.ok(checkpoints.has(s), `missing checkpoint for stage ${s}`);
  }

  const stars = parts.filter((p) => p.kind === "star");
  assert.ok(stars.length >= 8, "expected at least 8 collectible stars");

  const finish = parts.find((p) => p.kind === "finish");
  assert.ok(finish, "missing finish pad");
  assert.equal(finish.stage, 8);

  const restart = parts.find((p) => p.kind === "restart");
  assert.ok(restart, "missing walk-on restart pad for Xbox");
});

test("Platforms and jumps are kid-friendly and Xbox-ergonomic", () => {
  const src = readFileSync(join(rootDir, "src/shared/LevelData.luau"), "utf8");
  const mainPlatforms = parseLevelParts(src).filter((p) =>
    ["platform", "checkpoint", "moving", "finish"].includes(p.kind)
  );

  for (const p of mainPlatforms) {
    assert.ok(p.size[0] >= 10 && p.size[2] >= 10, `${p.id} should be at least 10x10 studs`);
  }

  for (let i = 1; i < mainPlatforms.length; i++) {
    const prev = mainPlatforms[i - 1];
    const curr = mainPlatforms[i];
    const verticalStep = curr.position[1] + curr.size[1] / 2 - (prev.position[1] + prev.size[1] / 2);
    // Stages 3 and 6 use bounce pads to reach elevated islands
    const bounceTargets = new Set(["s3_upper", "s6_p2", "s6_p3"]);
    const maxRise = bounceTargets.has(curr.id) ? 7 : 4;
    assert.ok(
      verticalStep <= maxRise,
      `vertical jump from ${prev.id} to ${curr.id} too high: ${verticalStep} studs`
    );

    const dx = Math.max(0, Math.abs(curr.position[0] - prev.position[0]) - (curr.size[0] + prev.size[0]) / 2);
    const dz = Math.max(0, Math.abs(curr.position[2] - prev.position[2]) - (curr.size[2] + prev.size[2]) / 2);
    const edgeGap = Math.hypot(dx, dz);
    assert.ok(
      edgeGap <= 10,
      `horizontal gap from ${prev.id} to ${curr.id} too wide: ${edgeGap.toFixed(1)} studs`
    );
  }
});

test("Luau scripts stay offline and kid-safe (no HttpService)", () => {
  for (const rel of [
    "src/shared/LevelData.luau",
    "src/server/ObbyBuilder.server.luau",
    "src/server/FunExtras.server.luau",
    "src/client/StageHud.client.luau",
  ]) {
    const content = readFileSync(join(rootDir, rel), "utf8");
    assert.ok(!content.includes("HttpService"), `${rel} must not use HttpService`);
    assert.ok(!content.includes("MarketplaceService"), `${rel} must not prompt purchases`);
  }
});

test("build-rbxlx generates a valid XML place file with all scripts", () => {
  const outPath = buildRbxlx();
  const xml = readFileSync(outPath, "utf8");
  assert.ok(xml.startsWith("<roblox "), "missing <roblox> root");
  assert.ok(xml.includes('<string name="Name">LevelData</string>'));
  assert.ok(xml.includes('<string name="Name">ObbyBuilder</string>'));
  assert.ok(xml.includes('<string name="Name">FunExtras</string>'));
  assert.ok(xml.includes('<string name="Name">StageHud</string>'));
});
