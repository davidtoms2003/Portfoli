#!/usr/bin/env node
import { readdir, rm } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const targets = [
  path.join(root, 'public', 'gallery'),
  path.join(root, 'public', 'thumbnails'),
];
const removeExts = new Set(['.jpg', '.jpeg', '.png']);

async function removeOriginals(dir) {
  const entries = await readdir(dir, { withFileTypes: true }).catch(() => []);
  let removed = 0;
  for (const e of entries) {
    if (!e.isFile()) continue;
    const ext = path.extname(e.name).toLowerCase();
    if (!removeExts.has(ext)) continue;
    const full = path.join(dir, e.name);
    await rm(full, { force: true }).catch(() => {});
    removed++;
  }
  console.log(`${path.basename(dir)} originals removed: ${removed}`);
}

async function run() {
  for (const d of targets) await removeOriginals(d);
}

run().catch((err) => { console.error(err); process.exit(1); });
