import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createStudioServer } from '../server.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..', '..');

async function withServer(fn) {
  const server = createStudioServer(ROOT_DIR);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const addr = server.address();
  const baseUrl = `http://127.0.0.1:${addr.port}`;
  try {
    await fn(baseUrl);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

test('GET /api/portfolio returns studio and onboarded goodtogo game', async () => {
  await withServer(async (baseUrl) => {
    const res = await fetch(`${baseUrl}/api/portfolio`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.studio.name, 'Prignano Games');
    assert.equal(data.games.length, 1);
    const gtg = data.games[0];
    assert.equal(gtg.id, 'goodtogo');
    assert.equal(gtg.git.exists, true);
    assert.equal(gtg.milestones.length, 4);
    assert.equal(gtg.checks.length, 3);
  });
});

test('POST /api/check rejects unknown gameId and runs allowlisted go-test check', async () => {
  await withServer(async (baseUrl) => {
    const badRes = await fetch(`${baseUrl}/api/check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gameId: 'not-a-game' }),
    });
    assert.equal(badRes.status, 404);

    const okRes = await fetch(`${baseUrl}/api/check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gameId: 'goodtogo', checkId: 'go-test' }),
    });
    assert.equal(okRes.status, 200);
    const payload = await okRes.json();
    assert.equal(payload.gameId, 'goodtogo');
    assert.equal(payload.results.length, 1);
    assert.equal(payload.results[0].ok, true);
  });
});

test('GET / serves dashboard HTML with color-scheme meta', async () => {
  await withServer(async (baseUrl) => {
    const res = await fetch(`${baseUrl}/`);
    assert.equal(res.status, 200);
    const html = await res.text();
    assert.match(html, /<meta name="color-scheme" content="light dark">/);
  });
});
