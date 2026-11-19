/**
 * Deterministic 2-player payoff matrix, ultimatum, and bot strategy engine for Payoff.
 */

export const GAMES = {
  prisonersDilemma: {
    id: 'prisonersDilemma',
    kind: 'matrix',
    actions: [
      { id: 'cooperate', label: 'Cooperate' },
      { id: 'defect', label: 'Defect' },
    ],
    matrix: {
      cooperate: { cooperate: [3, 3], defect: [0, 5] },
      defect: { cooperate: [5, 0], defect: [1, 1] },
    },
  },
  stagHunt: {
    id: 'stagHunt',
    kind: 'matrix',
    actions: [
      { id: 'stag', label: 'Hunt Stag' },
      { id: 'hare', label: 'Catch Hare' },
    ],
    matrix: {
      stag: { stag: [4, 4], hare: [0, 2] },
      hare: { stag: [2, 0], hare: [2, 2] },
    },
  },
  chicken: {
    id: 'chicken',
    kind: 'matrix',
    actions: [
      { id: 'swerve', label: 'Swerve' },
      { id: 'straight', label: 'Go Straight' },
    ],
    matrix: {
      swerve: { swerve: [0, 0], straight: [-1, 1] },
      straight: { swerve: [1, -1], straight: [-5, -5] },
    },
  },
  matchingPennies: {
    id: 'matchingPennies',
    kind: 'matrix',
    actions: [
      { id: 'heads', label: 'Heads' },
      { id: 'tails', label: 'Tails' },
    ],
    // Player (Matcher) wins +1 on match; Bot (Mismatcher) wins +1 on mismatch.
    matrix: {
      heads: { heads: [1, -1], tails: [-1, 1] },
      tails: { heads: [-1, 1], tails: [1, -1] },
    },
  },
  ultimatum: {
    id: 'ultimatum',
    kind: 'ultimatum',
    actions: [
      { id: 'offer50', label: 'Offer 50 / 50' },
      { id: 'offer70', label: 'Offer 70 / 30' },
      { id: 'offer90', label: 'Offer 90 / 10' },
    ],
    // Bot responds with 'accept' or 'reject'. Total pot is 10.
    offers: {
      offer50: [5, 5],
      offer70: [7, 3],
      offer90: [9, 1],
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
  cautiousHare: () => 'hare',
  boldStag: () => 'stag',
  stubbornHawk: () => 'straight',
  cautiousDove: () => 'swerve',
  patternSpotter: (history) => {
    // Mismatcher bot: predicts player's most common recent choice and picks the opposite.
    if (history.length === 0) return 'tails';
    let heads = 0;
    let tails = 0;
    for (const r of history) {
      if (r.playerAction === 'heads') heads += 1;
      else if (r.playerAction === 'tails') tails += 1;
    }
    return heads >= tails ? 'tails' : 'heads';
  },
  fairSplit: (offerId) => (offerId === 'offer50' ? 'accept' : 'reject'),
  toughBargainer: (offerId) => (offerId === 'offer90' ? 'reject' : 'accept'),
};

export const LESSONS = [
  {
    id: 'dilemma',
    number: 1,
    title: 'The Dilemma',
    subtitle: "Prisoner's Dilemma",
    gameId: 'prisonersDilemma',
    rounds: 1,
    bots: [
      { id: 'alwaysDefect', name: 'Always Defect', hint: 'Never trusts, always grabs the safe edge.' },
      { id: 'alwaysCooperate', name: 'Always Cooperate', hint: 'Always shares, even when betrayed.' },
    ],
    takeaway: 'Defecting is a dominant strategy in a one-shot dilemma, even though mutual cooperation pays better overall.',
    eli5Takeaway: 'When you only play once, being selfish protects you—even if both players would get more by teaming up.',
  },
  {
    id: 'shadow',
    number: 2,
    title: 'Shadow of the Future',
    subtitle: 'Iterated Dilemma',
    gameId: 'prisonersDilemma',
    rounds: 5,
    bots: [
      { id: 'titForTat', name: 'Tit-for-Tat', hint: 'Starts kind, then mirrors your last move.' },
      { id: 'grimTrigger', name: 'Grim Trigger', hint: 'Kind until betrayed once, then defects forever.' },
    ],
    takeaway: 'Repeated rounds create accountability: reciprocity and forgiveness outperform short-term betrayal.',
    eli5Takeaway: 'When you play again tomorrow, being nice pays off—because bots remember what you did last turn.',
  },
  {
    id: 'stag-hunt',
    number: 3,
    title: 'Stag Hunt',
    subtitle: 'Coordination & Trust',
    gameId: 'stagHunt',
    rounds: 3,
    bots: [
      { id: 'boldStag', name: 'Bold Stag', hint: 'Aims for the big shared prize.' },
      { id: 'cautiousHare', name: 'Cautious Hare', hint: 'Plays it safe alone.' },
    ],
    takeaway: 'Both (Stag, Stag) and (Hare, Hare) are equilibria—trust unlocks the higher payoff.',
    eli5Takeaway: 'You can catch a small snack by yourself, or team up for a feast—if you trust your partner.',
  },
  {
    id: 'chicken',
    number: 4,
    title: 'Brinkmanship',
    subtitle: 'Chicken (Hawk–Dove)',
    gameId: 'chicken',
    rounds: 3,
    bots: [
      { id: 'stubbornHawk', name: 'Stubborn Hawk', hint: 'Never swerves.' },
      { id: 'cautiousDove', name: 'Cautious Dove', hint: 'Always yields to avoid a crash.' },
    ],
    takeaway: 'Going straight wins against a Dove, but two Hawks crash hard (-5 each).',
    eli5Takeaway: 'Acting tough only works if the other player backs down—if neither backs down, both lose big.',
  },
  {
    id: 'pennies',
    number: 5,
    title: 'Stay Unpredictable',
    subtitle: 'Matching Pennies',
    gameId: 'matchingPennies',
    rounds: 5,
    bots: [
      { id: 'patternSpotter', name: 'Pattern Spotter', hint: 'Counts your favorite pick and chooses the opposite.' },
    ],
    takeaway: 'In zero-sum games with no pure equilibrium, you must mix 50/50 so opponents cannot exploit habits.',
    eli5Takeaway: 'If you pick the same side too often, a smart bot will read your habit and beat you.',
  },
  {
    id: 'ultimatum',
    number: 6,
    title: 'Fairness & Rejections',
    subtitle: 'Ultimatum Game',
    gameId: 'ultimatum',
    rounds: 3,
    bots: [
      { id: 'toughBargainer', name: 'Tough Bargainer', hint: 'Accepts 50/50 or 70/30, rejects 90/10.' },
      { id: 'fairSplit', name: 'Fair Split', hint: 'Only accepts 50/50.' },
    ],
    takeaway: 'People reject unfair splits even at a cost to themselves, forcing proposers to share.',
    eli5Takeaway: 'Offering too little can make the other player say "no deal," leaving both of you with zero.',
  },
];

export function resolveRound(gameId, playerAction, botActionOrStrategy) {
  const game = GAMES[gameId];
  if (!game) {
    throw new Error(`Unknown game: ${gameId}`);
  }

  if (game.kind === 'ultimatum') {
    const split = game.offers[playerAction];
    if (!split) {
      throw new Error(`Invalid offer (${playerAction}) for ${gameId}`);
    }
    const botAction =
      typeof botActionOrStrategy === 'function' ? botActionOrStrategy(playerAction) : botActionOrStrategy;
    if (botAction !== 'accept' && botAction !== 'reject') {
      throw new Error(`Invalid ultimatum response: ${botAction}`);
    }
    const [playerPayoff, botPayoff] = botAction === 'accept' ? split : [0, 0];
    return { playerAction, botAction, playerPayoff, botPayoff };
  }

  const row = game.matrix[playerAction];
  if (!row || !row[botActionOrStrategy]) {
    throw new Error(`Invalid actions (${playerAction}, ${botActionOrStrategy}) for ${gameId}`);
  }
  const [playerPayoff, botPayoff] = row[botActionOrStrategy];
  return { playerAction, botAction: botActionOrStrategy, playerPayoff, botPayoff };
}

export function playRound(gameId, history, playerAction, botStrategy) {
  const game = GAMES[gameId];
  if (!game) {
    throw new Error(`Unknown game: ${gameId}`);
  }
  const botAction = game.kind === 'ultimatum' ? botStrategy(playerAction, history) : botStrategy(history);
  return resolveRound(gameId, playerAction, botAction);
}

export function playMatch(gameId, playerActions, botStrategy) {
  const history = [];
  let playerTotal = 0;
  let botTotal = 0;

  for (const playerAction of playerActions) {
    const round = playRound(gameId, history, playerAction, botStrategy);
    history.push(round);
    playerTotal += round.playerPayoff;
    botTotal += round.botPayoff;
  }

  return { history, playerTotal, botTotal };
}
