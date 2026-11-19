import test from 'node:test';
import assert from 'node:assert/strict';
import { createSiteServer } from '../server.mjs';

test('quietarcades-web serves index, games.json, and brand SVGs', async () => {
  const server = createSiteServer();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();

  try {
    const htmlRes = await fetch(`http://127.0.0.1:${port}/`);
    assert.equal(htmlRes.status, 200);
    const html = await htmlRes.text();
    assert.match(html, /<meta name="color-scheme" content="light dark">/);
    assert.match(html, /quiet arcades/);

    const gamesRes = await fetch(`http://127.0.0.1:${port}/games.json`);
    assert.equal(gamesRes.status, 200);
    const games = await gamesRes.json();
    assert.equal(games.length, 5);

    const favRes = await fetch(`http://127.0.0.1:${port}/favicon.svg`);
    assert.equal(favRes.status, 200);

    const roadmapRes = await fetch(`http://127.0.0.1:${port}/roadmap`);
    assert.equal(roadmapRes.status, 200);
    const roadmapHtml = await roadmapRes.text();
    assert.match(roadmapHtml, /<meta name="color-scheme" content="light dark">/);
    assert.match(roadmapHtml, /Studio Roadmap/);

    const roadmapJsonRes = await fetch(`http://127.0.0.1:${port}/roadmap.json`);
    assert.equal(roadmapJsonRes.status, 200);
    const roadmap = await roadmapJsonRes.json();
    assert.equal(roadmap.length, 14);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
