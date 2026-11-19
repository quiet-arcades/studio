import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
};

export function createSiteServer(rootDir = __dirname) {
  const publicDir = path.join(rootDir, 'public');

  return http.createServer(async (req, res) => {
    const url = new URL(req.url || '/', 'http://127.0.0.1');
    let rel = url.pathname === '/' ? 'index.html' : url.pathname.replace(/^\/+/, '');
    if (rel === 'roadmap' || rel === 'roadmap/') {
      rel = 'roadmap/index.html';
    }
    const filePath = path.resolve(publicDir, rel);

    if (!filePath.startsWith(publicDir + path.sep)) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }

    try {
      const data = await fs.readFile(filePath);
      const ext = path.extname(filePath);
      res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
      res.end(data);
    } catch {
      res.writeHead(404);
      res.end('Not found');
    }
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const port = Number(process.env.PORT || 4175);
  createSiteServer(__dirname).listen(port, '127.0.0.1', () => {
    console.log(`quietarcades-web listening at http://127.0.0.1:${port}`);
  });
}
