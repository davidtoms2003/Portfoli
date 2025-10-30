#!/usr/bin/env node
import { readdir, stat, unlink } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const inputDirs = [
  path.join(root, 'public', 'gallery'),
  path.join(root, 'public', 'thumbnails'),
];

// Remove high-res suffixed variants we no longer want to keep
const patterns = [/\.w2160\.webp$/i, /\.w3840\.webp$/i];

async function cleanDir(dir) {
  let removed = 0; let skipped = 0; let missing = 0;
  const entries = await readdir(dir, { withFileTypes: true }).catch(() => []);
  for (const e of entries) {
    if (!e.isFile()) continue;
    const full = path.join(dir, e.name);
    if (patterns.some((rx) => rx.test(full))) {
      try {
        await unlink(full);
        removed++;
      } catch {
        missing++;
      }
    } else {
      skipped++;
    }
  }
  console.log(`${path.basename(dir)} large variants removed: ${removed}, skipped: ${skipped}, missing: ${missing}`);
}

async function run() {
  for (const dir of inputDirs) await cleanDir(dir);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
