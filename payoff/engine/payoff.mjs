/**
 * Deterministic 2-player payoff matrix and bot strategy engine for Payoff.
 */

export const GAMES = {
  prisonersDilemma: {
    id: 'prisonersDilemma',
    actions: ['cooperate', 'defect'],
    // [playerPayoff, botPayoff]
    matrix: {
      cooperate: { cooperate: [3, 3], defect: [0, 5] },
      defect: { cooperate: [5, 0], defect: [1, 1] },
    },
  },
  stagHunt: {
    id: 'stagHunt',
    actions: ['stag', 'hare'],
    matrix: {
      stag: { stag: [4, 4], hare: [0, 2] },
      hare: { stag: [2, 0], hare: [2, 2] },
    },
  },
  chicken: {
    id: 'chicken',
    actions: ['swerve', 'straight'],
    matrix: {
      swerve: { swerve: [0, 0], straight: [-1, 1] },
      straight: { swerve: [1, -1], straight: [-5, -5] },
    },
  },
};

export const BOTS = {
  alwaysCooperate: () => 'cooperate',
  alwaysDefect: () => 'defect',
  titForTat: (history) => {
    if (history.length === 0) return 'cooperate';
    return history[history.length - 1].playerAction;
  },
  grimTrigger: (history) => {
    const betrayed = history.some((round) => round.playerAction === 'defect');
    return betrayed ? 'defect' : 'cooperate';
  },
};

export function resolveRound(gameId, playerAction, botAction) {
  const game = GAMES[gameId];
  if (!game) {
    throw new Error(`Unknown game: ${gameId}`);
  }
  const row = game.matrix[playerAction];
  if (!row || !row[botAction]) {
    throw new Error(`Invalid actions (${playerAction}, ${botAction}) for ${gameId}`);
  }
  const [playerPayoff, botPayoff] = row[botAction];
  return { playerAction, botAction, playerPayoff, botPayoff };
}

export function playMatch(gameId, playerActions, botStrategy) {
  const history = [];
  let playerTotal = 0;
  let botTotal = 0;

  for (const playerAction of playerActions) {
    const botAction = botStrategy(history);
    const round = resolveRound(gameId, playerAction, botAction);
    history.push(round);
    playerTotal += round.playerPayoff;
    botTotal += round.botPayoff;
  }

  return { history, playerTotal, botTotal };
}
