import fs from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const studioRoot = path.resolve(rootDir, '..');
const studioPath = path.join(studioRoot, 'studio.json');
const outPath = path.join(rootDir, 'public', 'roadmap.json');

const STUDIO_REPO = 'https://github.com/quiet-arcades/studio';

function resolveLinks(game) {
  if (game.repoUrl || game.specUrl) {
    return { repoUrl: game.repoUrl || null, specUrl: game.specUrl || null };
  }

  const gameDir = path.resolve(studioRoot, game.path);
  if (!existsSync(gameDir)) {
    return { repoUrl: null, specUrl: null };
  }

  const hasSpec = existsSync(path.join(gameDir, 'docs', 'SPEC.md'));
  const hasOwnGit = existsSync(path.join(gameDir, '.git'));

  if (hasOwnGit) {
    try {
      const remote = execFileSync('git', ['-C', gameDir, 'remote', 'get-url', 'origin'], {
        encoding: 'utf8',
      })
        .trim()
        .replace(/\.git$/, '');
      const branch = execFileSync('git', ['-C', gameDir, 'rev-parse', '--abbrev-ref', 'HEAD'], {
        encoding: 'utf8',
      }).trim();
      return {
        repoUrl: remote || null,
        specUrl: hasSpec && remote ? `${remote}/blob/${branch}/docs/SPEC.md` : null,
      };
    } catch {
      return { repoUrl: null, specUrl: null };
    }
  }

  const rel = game.path.replace(/^\.\//, '');
  return {
    repoUrl: `${STUDIO_REPO}/tree/master/${rel}`,
    specUrl: hasSpec ? `${STUDIO_REPO}/blob/master/${rel}/docs/SPEC.md` : null,
  };
}

const studio = JSON.parse(await fs.readFile(studioPath, 'utf8'));
const publicGames = (studio.games || []).map((g) => {
  const { repoUrl, specUrl } = resolveLinks(g);
  return {
    id: g.id,
    name: g.name,
    tagline: g.tagline,
    stage: g.stage,
    url: g.stage.startsWith('Live') || g.stage.startsWith('v1 Live') ? g.url : null,
    repoUrl,
    specUrl,
    milestones: (g.milestones || []).map((m) => ({
      title: m.title,
      status: m.status,
      summary: m.summary,
    })),
  };
});

await fs.writeFile(outPath, JSON.stringify(publicGames, null, 2) + '\n');
console.log(`Synced ${publicGames.length} games to public/roadmap.json`);
