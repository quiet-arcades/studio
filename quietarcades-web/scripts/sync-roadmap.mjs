import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const studioPath = path.resolve(rootDir, '..', 'studio.json');
const outPath = path.join(rootDir, 'public', 'roadmap.json');

const studio = JSON.parse(await fs.readFile(studioPath, 'utf8'));
const publicGames = (studio.games || []).map((g) => ({
  id: g.id,
  name: g.name,
  tagline: g.tagline,
  stage: g.stage,
  url: g.stage.startsWith('Live') || g.stage.startsWith('v1 Live') ? g.url : null,
  milestones: (g.milestones || []).map((m) => ({
    title: m.title,
    status: m.status,
    summary: m.summary,
  })),
}));

await fs.writeFile(outPath, JSON.stringify(publicGames, null, 2) + '\n');
console.log(`Synced ${publicGames.length} games to public/roadmap.json`);
