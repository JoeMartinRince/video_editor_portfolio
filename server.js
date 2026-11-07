import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = parseInt(process.env.PORT, 10) || 3000;
const ROOT_DIR = fs.existsSync(path.join(__dirname, 'index.html')) ? __dirname : path.resolve(__dirname, '..');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.framercms': 'application/octet-stream',
  '.wasm': 'application/wasm'
};

const server = http.createServer((req, res) => {
  try {
    const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    let pathname = decodeURIComponent(parsedUrl.pathname);

    // Resolve file path with rewrite support
    let filePath = path.join(ROOT_DIR, pathname);

    // Rewrite rules matching vercel.json
    if (!fs.existsSync(filePath)) {
      if (pathname === '/f2c-sw.js') {
        filePath = path.join(ROOT_DIR, 'assets', 'f2c-sw.js');
      } else if (pathname.startsWith('/images/')) {
        filePath = path.join(ROOT_DIR, 'assets', 'framerusercontent.com', pathname);
      } else if (pathname.startsWith('/sites/')) {
        filePath = path.join(ROOT_DIR, 'assets', 'framerusercontent.com', pathname);
      } else if (pathname.startsWith('/modules/')) {
        filePath = path.join(ROOT_DIR, 'assets', 'framerusercontent.com', pathname);
      } else if (pathname.startsWith('/cms/')) {
        filePath = path.join(ROOT_DIR, 'assets', 'framerusercontent.com', pathname);
      } else if (pathname.startsWith('/third-party-assets/')) {
        filePath = path.join(ROOT_DIR, 'assets', 'framerusercontent.com', pathname);
      } else if (pathname.startsWith('/assets/') && !pathname.startsWith('/assets/framerusercontent.com') && !pathname.startsWith('/assets/app.framerstatic.com') && !pathname.startsWith('/assets/site-') && !pathname.startsWith('/assets/unpkg.com')) {
        filePath = path.join(ROOT_DIR, 'assets', 'framerusercontent.com', pathname);
      } else {
        const framerStaticPath = path.join(ROOT_DIR, 'assets', 'app.framerstatic.com', pathname);
        if (fs.existsSync(framerStaticPath)) {
          filePath = framerStaticPath;
        }
      }
    }

    // Directory lookup (serve index.html)
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    } else if (!fs.existsSync(filePath) && fs.existsSync(filePath + '.html')) {
      filePath = filePath + '.html';
    } else if (!fs.existsSync(filePath) && fs.existsSync(path.join(filePath, 'index.html'))) {
      filePath = path.join(filePath, 'index.html');
    }

    // 404 handler
    if (!fs.existsSync(filePath)) {
      res.writeHead(404, { 'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*' });
      res.end('404 Not Found: ' + pathname);
      return;
    }

    const stat = fs.statSync(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    // Handle range in query params for framercms (e.g. ?range=537-716)
    const rangeParam = parsedUrl.searchParams.get('range');
    if (rangeParam && ext === '.framercms') {
      const parts = rangeParam.split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
      const chunksize = (end - start) + 1;
      res.writeHead(200, {
        'Content-Type': 'application/octet-stream',
        'Content-Length': chunksize,
        'Access-Control-Allow-Origin': '*'
      });
      fs.createReadStream(filePath, { start, end }).pipe(res);
      return;
    }

    // HTTP 206 Partial Content (essential for video seek & media playback)
    const range = req.headers.range;
    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;

      if (start >= stat.size || end >= stat.size) {
        res.writeHead(416, {
          'Content-Range': `bytes */${stat.size}`,
          'Access-Control-Allow-Origin': '*'
        });
        res.end();
        return;
      }

      const chunksize = (end - start) + 1;
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${stat.size}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*'
      });
      fs.createReadStream(filePath, { start, end }).pipe(res);
    } else {
      res.writeHead(200, {
        'Content-Length': stat.size,
        'Content-Type': contentType,
        'Accept-Ranges': 'bytes',
        'Access-Control-Allow-Origin': '*'
      });
      fs.createReadStream(filePath).pipe(res);
    }
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Server Error: ' + err.message);
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Anamorph local server running at http://localhost:${PORT}`);
});
