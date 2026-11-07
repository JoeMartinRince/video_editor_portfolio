import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

console.log('--- Anamorph Production Build Verification ---');

const requiredFiles = [
  'index.html',
  'f2c-sw.js',
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

for (const file of requiredFiles) {
  const fullPath = path.join(ROOT_DIR, file);
  if (!fs.existsSync(fullPath)) {
    console.error(`MISSING: ${file}`);
    hasErrors = true;
  } else {
    const size = fs.statSync(fullPath).size;
    console.log(`OK: ${file} (${size} bytes)`);
  }
}

// Check assets directory
const assetsDir = path.join(ROOT_DIR, 'assets');
if (!fs.existsSync(assetsDir)) {
  console.error('MISSING: assets directory');
  hasErrors = true;
} else {
  const assetCount = fs.readdirSync(assetsDir, { recursive: true }).length;
  console.log(`OK: assets directory contains ${assetCount} items`);
}

if (hasErrors) {
  console.error('\nBuild verification FAILED.');
  process.exit(1);
} else {
  console.log('\nBuild verification SUCCESSFUL. Site is complete and ready for deployment.');
}
