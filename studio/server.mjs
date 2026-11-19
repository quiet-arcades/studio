import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { execFile, spawn } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath, pathToFileURL } from 'node:url';

const execFileAsync = promisify(execFile);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_ROOT = path.resolve(__dirname, '..');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
};

async function readStudioConfig(rootDir) {
  const raw = await fs.readFile(path.join(rootDir, 'studio.json'), 'utf8');
  return JSON.parse(raw);
}

async function getGitInfo(gameDir) {
  try {
    await fs.access(gameDir);
  } catch {
    return { exists: false, branch: null, lastCommit: null, dirtyCount: 0 };
  }

  try {
    const [{ stdout: branchOut }, { stdout: logOut }, { stdout: statusOut }] = await Promise.all([
      execFileAsync('git', ['-C', gameDir, 'rev-parse', '--abbrev-ref', 'HEAD'], { timeout: 5000 }),
      execFileAsync('git', ['-C', gameDir, 'log', '-1', '--format=%h %s (%cr)'], { timeout: 5000 }),
      execFileAsync('git', ['-C', gameDir, 'status', '--short'], { timeout: 5000 }),
    ]);

    const dirtyLines = statusOut.trim() ? statusOut.trim().split(/\r?\n/) : [];
    return {
      exists: true,
      branch: branchOut.trim(),
      lastCommit: logOut.trim(),
      dirtyCount: dirtyLines.length,
    };
  } catch {
    return { exists: true, branch: null, lastCommit: null, dirtyCount: 0 };
  }
}

function runAllowlistedCheck(command, cwd) {
  return new Promise((resolve) => {
    const start = Date.now();
    // Commands in studio.json are allowlisted by the studio config, not user input.
    const child = spawn(command, {
      cwd,
      shell: true,
      windowsHide: true,
    });

    let output = '';
    const append = (chunk) => {
      if (output.length < 16000) {
        output += chunk.toString();
      }
    };

    child.stdout.on('data', append);
    child.stderr.on('data', append);

    const timer = setTimeout(() => {
      child.kill();
      resolve({
        ok: false,
        exitCode: -1,
        durationMs: Date.now() - start,
        output: `${output}\n[Timed out after 30s]`.trim(),
      });
    }, 30000);

    child.on('error', (err) => {
      clearTimeout(timer);
      resolve({
        ok: false,
        exitCode: -1,
        durationMs: Date.now() - start,
        output: err.message,
      });
    });

    child.on('close', (code) => {
      clearTimeout(timer);
      resolve({
        ok: code === 0,
        exitCode: code ?? -1,
        durationMs: Date.now() - start,
        output: output.trim(),
      });
    });
  });
}

async function readJsonBody(req) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > 65536) {
      throw new Error('Request body too large');
    }
    chunks.push(chunk);
  }
  const text = Buffer.concat(chunks).toString('utf8');
  return text ? JSON.parse(text) : {};
}

function sendJson(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(data));
}

export function createStudioServer(rootDir = DEFAULT_ROOT) {
  const publicDir = path.join(rootDir, 'studio', 'public');

  return http.createServer(async (req, res) => {
    const url = new URL(req.url || '/', 'http://127.0.0.1');

    if (req.method === 'GET' && url.pathname === '/api/portfolio') {
      try {
        const config = await readStudioConfig(rootDir);
        const games = await Promise.all(
          (config.games || []).map(async (game) => {
            const gameDir = path.resolve(rootDir, game.path);
            const git = await getGitInfo(gameDir);
            return { ...game, git };
          }),
        );
        sendJson(res, 200, { studio: config.studio, games });
      } catch (err) {
        sendJson(res, 500, { error: err.message });
      }
      return;
    }

    if (req.method === 'POST' && url.pathname === '/api/check') {
      try {
        const body = await readJsonBody(req);
        const config = await readStudioConfig(rootDir);
        const game = (config.games || []).find((g) => g.id === body.gameId);
        if (!game) {
          sendJson(res, 404, { error: `Unknown game: ${body.gameId ?? ''}` });
          return;
        }

        const checksToRun = body.checkId
          ? (game.checks || []).filter((c) => c.id === body.checkId)
          : (game.checks || []);

        if (checksToRun.length === 0) {
          sendJson(res, 404, { error: 'No matching checks found' });
          return;
        }

        const gameDir = path.resolve(rootDir, game.path);
        const results = [];
        for (const check of checksToRun) {
          const outcome = await runAllowlistedCheck(check.command, gameDir);
          results.push({
            id: check.id,
            label: check.label,
            command: check.command,
            ...outcome,
          });
        }

        sendJson(res, 200, { gameId: game.id, results });
      } catch (err) {
        sendJson(res, 400, { error: err.message });
      }
      return;
    }

    if (req.method === 'GET') {
      const relPath = url.pathname === '/' ? 'index.html' : url.pathname.replace(/^\/+/, '');
      const filePath = path.resolve(publicDir, relPath);
      if (!filePath.startsWith(publicDir + path.sep) && filePath !== publicDir) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
      }

      try {
        const data = await fs.readFile(filePath);
        const ext = path.extname(filePath);
        res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
        res.end(data);
      } catch {
        res.writeHead(404);
        res.end('Not found');
      }
      return;
    }

    res.writeHead(405);
    res.end('Method not allowed');
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const port = Number(process.env.PORT || 4173);
  const server = createStudioServer(DEFAULT_ROOT);
  server.listen(port, '127.0.0.1', () => {
    console.log(`Prignano Games Studio Dashboard listening at http://127.0.0.1:${port}`);
  });
}
