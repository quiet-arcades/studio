import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
};

export function createPayoffServer(rootDir = __dirname) {
  const webDir = path.join(rootDir, 'web');
  const engineDir = path.join(rootDir, 'engine');

  return http.createServer(async (req, res) => {
    const url = new URL(req.url || '/', 'http://127.0.0.1');
    const pathname = url.pathname === '/' ? '/index.html' : url.pathname;

    let filePath;
    if (pathname.startsWith('/engine/')) {
      filePath = path.resolve(engineDir, pathname.slice('/engine/'.length));
      if (!filePath.startsWith(engineDir + path.sep)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
      }
    } else {
      filePath = path.resolve(webDir, pathname.replace(/^\/+/, ''));
      if (!filePath.startsWith(webDir + path.sep)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
      }
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
  const port = Number(process.env.PORT || 4174);
  createPayoffServer(__dirname).listen(port, '127.0.0.1', () => {
    console.log(`Payoff dev server listening at http://127.0.0.1:${port}`);
  });
}
