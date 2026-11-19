const MUTE_STORAGE_KEY = 'payoff-muted-v1';

let audioCtx = null;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return null;
  if (!audioCtx) {
    audioCtx = new Ctx();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function isMuted() {
  try {
    return typeof localStorage !== 'undefined' && localStorage.getItem(MUTE_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setMuted(muted) {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(MUTE_STORAGE_KEY, muted ? 'true' : 'false');
    }
  } catch {
    // Ignore storage errors in restricted contexts.
  }
}

function playTone(ctx, { freq, endFreq = freq, startOffset = 0, duration = 0.08, gain = 0.08, type = 'sine' }) {
  const now = ctx.currentTime + startOffset;
  const osc = ctx.createOscillator();
  const amp = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);
  if (endFreq !== freq) {
    osc.frequency.exponentialRampToValueAtTime(endFreq, now + duration);
  }

  amp.gain.setValueAtTime(0.0001, now);
  amp.gain.exponentialRampToValueAtTime(gain, now + 0.01);
  amp.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  osc.connect(amp);
  amp.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + duration + 0.01);
}

export function playMoveClick() {
  if (isMuted()) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    playTone(ctx, { freq: 520, endFreq: 360, duration: 0.05, gain: 0.07, type: 'triangle' });
  } catch {
    // Ignore Web Audio errors.
  }
}

export function playMatrixReveal(playerPayoff = 0, botPayoff = 0) {
  if (isMuted()) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const base = playerPayoff >= botPayoff ? 440 : 370;
    const second = playerPayoff >= botPayoff ? 554.37 : 440;
    playTone(ctx, { freq: base, startOffset: 0.04, duration: 0.11, gain: 0.06, type: 'sine' });
    playTone(ctx, { freq: second, startOffset: 0.1, duration: 0.14, gain: 0.06, type: 'sine' });
  } catch {
    // Ignore Web Audio errors.
  }
}

export function playLessonComplete() {
  if (isMuted()) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const notes = [523.25, 659.25, 783.99];
    notes.forEach((freq, idx) => {
      playTone(ctx, { freq, startOffset: idx * 0.08, duration: 0.22, gain: 0.07, type: 'sine' });
    });
  } catch {
    // Ignore Web Audio errors.
  }
}
