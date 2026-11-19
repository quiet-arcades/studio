import { BOTS, GAMES, LESSONS, playRound } from '/engine/payoff.mjs';
import { isMuted, playLessonComplete, playMatrixReveal, playMoveClick, setMuted } from '/audio.js';

const STORAGE_KEY = 'payoff-progress-v1';

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { completed: [], eli5: false };
  } catch {
    return { completed: [], eli5: false };
  }
}

function saveProgress(progress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Ignore storage quota errors in restricted contexts.
  }
}

const el = (tag, attrs = {}, ...children) => {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'className') node.className = v;
    else node.setAttribute(k, v);
  }
  for (const child of children) {
    if (child != null) node.append(typeof child === 'string' ? document.createTextNode(child) : child);
  }
  return node;
};

const progress = loadProgress();
let activeLessonIndex = 0;
let activeBotIndex = 0;
let history = [];
let playerTotal = 0;
let botTotal = 0;

const eli5Toggle = document.getElementById('eli5-toggle');
eli5Toggle.checked = Boolean(progress.eli5);

const muteToggle = document.getElementById('mute-toggle');
if (muteToggle) {
  muteToggle.checked = isMuted();
}

function resetMatch() {
  history = [];
  playerTotal = 0;
  botTotal = 0;
  render();
}

function selectLesson(index) {
  activeLessonIndex = index;
  activeBotIndex = 0;
  resetMatch();
}

function selectBot(index) {
  activeBotIndex = index;
  resetMatch();
}

function handleMove(actionId) {
  const lesson = LESSONS[activeLessonIndex];
  if (history.length >= lesson.rounds) return;

  const botMeta = lesson.bots[activeBotIndex];
  const round = playRound(lesson.gameId, history, actionId, BOTS[botMeta.id]);
  history.push(round);
  playerTotal += round.playerPayoff;
  botTotal += round.botPayoff;

  playMoveClick();
  playMatrixReveal(round.playerPayoff, round.botPayoff);

  if (history.length >= lesson.rounds) {
    if (!progress.completed.includes(lesson.id)) {
      progress.completed.push(lesson.id);
      saveProgress(progress);
    }
    playLessonComplete();
  }
  render();
}

function renderMatrix(game, lastRound) {
  const wrap = document.getElementById('matrix-wrap');
  if (game.kind === 'ultimatum') {
    const rows = game.actions.map((act) => {
      const [p, b] = game.offers[act.id];
      const hitAccept = lastRound && lastRound.playerAction === act.id && lastRound.botAction === 'accept';
      const hitReject = lastRound && lastRound.playerAction === act.id && lastRound.botAction === 'reject';
      return el(
        'tr',
        {},
        el('th', { scope: 'row' }, act.label),
        el('td', { className: hitAccept ? 'cell-hit' : '' }, `Accept: You ${p} · Bot ${b}`),
        el('td', { className: hitReject ? 'cell-hit' : '' }, 'Reject: You 0 · Bot 0'),
      );
    });
    wrap.replaceChildren(
      el(
        'table',
        { className: 'matrix' },
        el('thead', {}, el('tr', {}, el('th', {}, 'Your Offer'), el('th', {}, 'Bot Accepts'), el('th', {}, 'Bot Rejects'))),
        el('tbody', {}, ...rows),
      ),
    );
    return;
  }

  const headCells = [el('th', {}, 'You \\ Bot'), ...game.actions.map((a) => el('th', {}, a.label))];
  const bodyRows = game.actions.map((pAct) => {
    const cells = game.actions.map((bAct) => {
      const [p, b] = game.matrix[pAct.id][bAct.id];
      const isHit = lastRound && lastRound.playerAction === pAct.id && lastRound.botAction === bAct.id;
      return el('td', { className: isHit ? 'cell-hit' : '' }, `You ${p} · Bot ${b}`);
    });
    return el('tr', {}, el('th', { scope: 'row' }, pAct.label), ...cells);
  });

  wrap.replaceChildren(
    el('table', { className: 'matrix' }, el('thead', {}, el('tr', {}, ...headCells)), el('tbody', {}, ...bodyRows)),
  );
}

function render() {
  const lesson = LESSONS[activeLessonIndex];
  const game = GAMES[lesson.gameId];
  const botMeta = lesson.bots[activeBotIndex];
  const finished = history.length >= lesson.rounds;
  const lastRound = history[history.length - 1] || null;

  document.getElementById('progress-pill').textContent = `${progress.completed.length} / ${LESSONS.length} done`;

  const lessonList = document.getElementById('lesson-list');
  lessonList.replaceChildren(
    ...LESSONS.map((l, idx) => {
      const btn = el(
        'button',
        { type: 'button', className: 'lesson-btn', 'aria-current': String(idx === activeLessonIndex) },
        el('span', {}, `${l.number}. ${l.title}`),
        progress.completed.includes(l.id) ? el('span', { className: 'done-mark' }, '✓') : null,
      );
      btn.addEventListener('click', () => selectLesson(idx));
      return el('li', {}, btn);
    }),
  );

  document.getElementById('lesson-subtitle').textContent = `Lesson ${lesson.number} · ${lesson.subtitle}`;
  document.getElementById('lesson-title').textContent = lesson.title;
  document.getElementById('bot-hint').textContent = `${botMeta.name}: ${botMeta.hint}`;
  document.getElementById('bot-score-label').textContent = botMeta.name;

  const botPicker = document.getElementById('bot-picker');
  botPicker.replaceChildren(
    ...lesson.bots.map((b, idx) => {
      const btn = el(
        'button',
        { type: 'button', className: idx === activeBotIndex ? 'btn btn-active' : 'btn' },
        b.name,
      );
      btn.addEventListener('click', () => selectBot(idx));
      return btn;
    }),
  );

  document.getElementById('player-score').textContent = String(playerTotal);
  document.getElementById('bot-score').textContent = String(botTotal);
  document.getElementById('round-counter').textContent = finished
    ? `Finished (${lesson.rounds} / ${lesson.rounds})`
    : `Round ${history.length + 1} / ${lesson.rounds}`;
  document.getElementById('match-status').textContent = finished
    ? playerTotal > botTotal
      ? 'You led'
      : playerTotal < botTotal
        ? `${botMeta.name} led`
        : 'Tied'
    : 'Pick a move';

  const actionWrap = document.getElementById('action-buttons');
  actionWrap.replaceChildren(
    ...game.actions.map((act) => {
      const btn = el('button', { type: 'button', className: 'btn btn-primary' }, act.label);
      btn.disabled = finished;
      btn.addEventListener('click', () => handleMove(act.id));
      return btn;
    }),
  );

  renderMatrix(game, lastRound);

  const takeawayCard = document.getElementById('takeaway-card');
  takeawayCard.classList.toggle('hidden', !finished);
  document.getElementById('takeaway-text').textContent = progress.eli5 ? lesson.eli5Takeaway : lesson.takeaway;

  const historyList = document.getElementById('history-list');
  historyList.replaceChildren(
    ...history.map((r, i) =>
      el(
        'li',
        {},
        `Round ${i + 1}: You chose ${r.playerAction}, ${botMeta.name} chose ${r.botAction} → You ${r.playerPayoff}, Bot ${r.botPayoff}`,
      ),
    ),
  );
}

eli5Toggle.addEventListener('change', () => {
  progress.eli5 = eli5Toggle.checked;
  saveProgress(progress);
  render();
});

if (muteToggle) {
  muteToggle.addEventListener('change', () => {
    setMuted(muteToggle.checked);
  });
}

document.getElementById('replay-btn').addEventListener('click', resetMatch);

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch(() => {});
}

render();
