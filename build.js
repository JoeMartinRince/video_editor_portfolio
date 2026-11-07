import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = fs.existsSync(path.join(__dirname, 'index.html')) ? __dirname : path.resolve(__dirname, '..');

console.log('--- Anamorph Production Build & Verification ---');

// Ensure assets/f2c-sw.js is synchronized with root f2c-sw.js
try {
  const rootSw = path.join(ROOT_DIR, 'f2c-sw.js');
  const assetsSw = path.join(ROOT_DIR, 'assets', 'f2c-sw.js');
  if (fs.existsSync(rootSw)) {
    fs.copyFileSync(rootSw, assetsSw);
    console.log('Synchronized assets/f2c-sw.js');
  }
} catch (e) {
  console.warn('Notice: could not sync assets/f2c-sw.js:', e.message);
}

const criticalFiles = [
  'index.html',
  'f2c-sw.js',
  path.join('assets', 'f2c-sw.js'),
  path.join('work', 'index.html'),
  path.join('work', 'citadel', 'index.html'),
  path.join('work', 'flora', 'index.html'),
  path.join('work', 'karama', 'index.html'),
  path.join('work', 'meridian', 'index.html'),
  path.join('terms', 'index.html'),
  path.join('privacy', 'index.html'),
  path.join('assets', 'framerusercontent.com', 'cms', '2qmWttDgFLDl0chTsGZB', 'FtWT2LZRoEsKJtjAH6pF', 'AKY6DYKHo-indexes-default-0.framercms'),
  path.join('assets', 'framerusercontent.com', 'cms', '2qmWttDgFLDl0chTsGZB', 'FtWT2LZRoEsKJtjAH6pF', 'AKY6DYKHo-chunk-default-0.framercms'),
  path.join('assets', 'framerusercontent.com', 'assets', 'DuKTHiXQ5PBLddRdWvYF1azGcc8.mp4'),
  path.join('assets', 'framerusercontent.com', 'assets', 'giTLgTG1Xb4gSWKMSMwml7NXZw.mp4'),
  path.join('assets', 'framerusercontent.com', 'assets', '94fUd6REGZb4Oo12LAButtB6VVY.mp4'),
  path.join('assets', 'framerusercontent.com', 'assets', '14Fkw8fup8bYItIGOUCPzpC8QCc.mp4'),
  'vercel.json',
  'package.json'
];

let hasErrors = false;
for (const file of criticalFiles) {
  const fullPath = path.join(ROOT_DIR, file);
  if (!fs.existsSync(fullPath)) {
    console.error(`MISSING: ${file}`);
    hasErrors = true;
  } else {
    const size = fs.statSync(fullPath).size;
    console.log(`OK: ${file} (${size} bytes)`);
  }
}

const assetsDir = path.join(ROOT_DIR, 'assets');
const totalFiles = fs.readdirSync(assetsDir, { recursive: true }).length;
console.log(`Assets directory contains ${totalFiles} items.`);

if (hasErrors) {
  console.error('\nVerification FAILED.');
  process.exit(1);
} else {
  console.log('\nVerification SUCCESSFUL. Site is complete and ready for deployment.');
}
