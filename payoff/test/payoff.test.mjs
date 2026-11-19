import test from 'node:test';
import assert from 'node:assert/strict';
import { BOTS, playMatch, resolveRound } from '../engine/payoff.mjs';

test('resolveRound computes Prisoner Dilemma and Stag Hunt payoffs', () => {
  assert.deepEqual(resolveRound('prisonersDilemma', 'cooperate', 'cooperate'), {
    playerAction: 'cooperate',
    botAction: 'cooperate',
    playerPayoff: 3,
    botPayoff: 3,
  });
  assert.deepEqual(resolveRound('prisonersDilemma', 'cooperate', 'defect'), {
    playerAction: 'cooperate',
    botAction: 'defect',
    playerPayoff: 0,
    botPayoff: 5,
  });
  assert.deepEqual(resolveRound('stagHunt', 'stag', 'stag'), {
    playerAction: 'stag',
    botAction: 'stag',
    playerPayoff: 4,
    botPayoff: 4,
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
