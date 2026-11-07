import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('--- Anamorph Production Build Verification ---');

const requiredFiles = [
  'index.html',
  'f2c-sw.js',
  path.join('work', 'citadel', 'index.html'),
  path.join('work', 'meridian', 'index.html'),
  path.join('work', 'karama', 'index.html'),
  'vercel.json',
  'package.json'
];

let hasErrors = false;

for (const file of requiredFiles) {
  const fullPath = path.join(__dirname, file);
  if (!fs.existsSync(fullPath)) {
    console.error(`MISSING: ${file}`);
    hasErrors = true;
  } else {
    const size = fs.statSync(fullPath).size;
    console.log(`OK: ${file} (${size} bytes)`);
  }
}

// Check assets directory
const assetsDir = path.join(__dirname, 'assets');
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
  console.log('\nBuild verification SUCCESSFUL. Site is ready for deployment.');
}
