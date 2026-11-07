import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.resolve(ROOT_DIR, 'dist');

console.log('--- Anamorph Production Build Started ---');

// 1. Clean and recreate dist
if (fs.existsSync(DIST_DIR)) {
  fs.rmSync(DIST_DIR, { recursive: true, force: true });
}
fs.mkdirSync(DIST_DIR, { recursive: true });

function copyRecursive(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else {
      try {
        fs.linkSync(srcPath, destPath);
      } catch {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }
}

// 2. Copy static files to dist
fs.copyFileSync(path.join(ROOT_DIR, 'index.html'), path.join(DIST_DIR, 'index.html'));
fs.copyFileSync(path.join(ROOT_DIR, 'f2c-sw.js'), path.join(DIST_DIR, 'f2c-sw.js'));
copyRecursive(path.join(ROOT_DIR, 'work'), path.join(DIST_DIR, 'work'));
copyRecursive(path.join(ROOT_DIR, 'terms'), path.join(DIST_DIR, 'terms'));
copyRecursive(path.join(ROOT_DIR, 'privacy'), path.join(DIST_DIR, 'privacy'));
copyRecursive(path.join(ROOT_DIR, 'assets'), path.join(DIST_DIR, 'assets'));

console.log('Static files successfully assembled in dist/');

// 3. Verification of critical output files
const criticalFiles = [
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
  path.join('assets', 'framerusercontent.com', 'assets', '14Fkw8fup8bYItIGOUCPzpC8QCc.mp4')
];

let hasErrors = false;
for (const file of criticalFiles) {
  const fullPath = path.join(DIST_DIR, file);
  if (!fs.existsSync(fullPath)) {
    console.error(`MISSING in dist: ${file}`);
    hasErrors = true;
  }
}

const totalDistFiles = fs.readdirSync(DIST_DIR, { recursive: true }).length;
console.log(`Dist contains ${totalDistFiles} files.`);

if (hasErrors) {
  console.error('\nBuild verification FAILED.');
  process.exit(1);
} else {
  console.log('\nBuild verification SUCCESSFUL. dist is ready for deployment.');
}
