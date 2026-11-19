import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { BOTS, LESSONS, playMatch, resolveRound } from '../engine/payoff.mjs';
import { createPayoffServer } from '../server.mjs';
import { isMuted, playLessonComplete, playMatrixReveal, playMoveClick, setMuted } from '../web/audio.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

test('resolveRound computes matrix and ultimatum payoffs', () => {
  assert.deepEqual(resolveRound('prisonersDilemma', 'cooperate', 'cooperate'), {
    playerAction: 'cooperate',
    botAction: 'cooperate',
    playerPayoff: 3,
    botPayoff: 3,
  });
  assert.deepEqual(resolveRound('chicken', 'straight', 'straight'), {
    playerAction: 'straight',
    botAction: 'straight',
    playerPayoff: -5,
    botPayoff: -5,
  });
  assert.deepEqual(resolveRound('ultimatum', 'offer90', 'reject'), {
    playerAction: 'offer90',
    botAction: 'reject',
    playerPayoff: 0,
    botPayoff: 0,
  });
  assert.deepEqual(resolveRound('ultimatum', 'offer70', 'accept'), {
    playerAction: 'offer70',
    botAction: 'accept',
    playerPayoff: 7,
    botPayoff: 3,
  });
});

test('Tit-for-Tat mirrors previous player action and Grim Trigger never forgives', () => {
  const tft = playMatch('prisonersDilemma', ['cooperate', 'defect', 'cooperate'], BOTS.titForTat);
  assert.deepEqual(
    tft.history.map((r) => r.botAction),
    ['cooperate', 'cooperate', 'defect'],
  );
  assert.equal(tft.playerTotal, 8);
  assert.equal(tft.botTotal, 8);

  const grim = playMatch(
    'prisonersDilemma',
    ['cooperate', 'defect', 'cooperate', 'cooperate'],
    BOTS.grimTrigger,
  );
  assert.deepEqual(
    grim.history.map((r) => r.botAction),
    ['cooperate', 'cooperate', 'defect', 'defect'],
  );
});

test('Pattern Spotter exploits predictable Matching Pennies picks', () => {
  const match = playMatch('matchingPennies', ['heads', 'heads', 'heads'], BOTS.patternSpotter);
  assert.deepEqual(
    match.history.map((r) => r.botAction),
    ['tails', 'tails', 'tails'],
  );
  assert.equal(match.playerTotal, -3);
  assert.equal(match.botTotal, 3);
});

test('All 6 lessons reference valid games and bot strategies', () => {
  assert.equal(LESSONS.length, 6);
  for (const lesson of LESSONS) {
    assert.ok(lesson.bots.length >= 1);
    for (const bot of lesson.bots) {
      assert.equal(typeof BOTS[bot.id], 'function');
    }
  }
});

test('createPayoffServer serves web UI and engine module', async () => {
  const server = createPayoffServer();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();
  try {
    const htmlRes = await fetch(`http://127.0.0.1:${port}/`);
    assert.equal(htmlRes.status, 200);
    const html = await htmlRes.text();
    assert.match(html, /<meta name="color-scheme" content="light dark">/);
    assert.match(html, /id="mute-toggle"/);
    assert.match(html, /Quiet Arcade/);

    const cssRes = await fetch(`http://127.0.0.1:${port}/styles.css`);
    assert.equal(cssRes.status, 200);
    const css = await cssRes.text();
    assert.match(css, /#d9381e/);
    assert.match(css, /#ff6b4a/);
    assert.match(css, /#f7f5f0/);
    assert.match(css, /#111214/);

    const audioRes = await fetch(`http://127.0.0.1:${port}/audio.js`);
    assert.equal(audioRes.status, 200);
    assert.match(audioRes.headers.get('content-type') || '', /text\/javascript/);

    const engRes = await fetch(`http://127.0.0.1:${port}/engine/payoff.mjs`);
    assert.equal(engRes.status, 200);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('audio module no-ops safely without browser AudioContext and wrangler.jsonc targets ./web', async () => {
  assert.equal(isMuted(), false);
  setMuted(true);
  playMoveClick();
  playMatrixReveal(3, 3);
  playLessonComplete();

  const wranglerRaw = await fs.readFile(path.join(rootDir, 'wrangler.jsonc'), 'utf8');
  const wrangler = JSON.parse(wranglerRaw);
  assert.equal(wrangler.name, 'payoff');
  assert.equal(wrangler.assets?.directory, './web');
});
