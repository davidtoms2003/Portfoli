#!/usr/bin/env node
import { readdir, stat, mkdir } from 'node:fs/promises';
import { createReadStream, createWriteStream } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const inputDirs = [
  path.join(root, 'public', 'gallery'),
  path.join(root, 'public', 'thumbnails'),
];

const exts = new Set(['.jpg', '.jpeg', '.png']);
// Responsive widths for downscaled variants only. The original (no suffix)
// remains the full-resolution master (e.g., 4K). Do NOT generate 2K/4K
// suffixed variants to avoid duplicating the master.
const widths = [480, 720, 1080, 1440];

async function ensureDir(p) {
  await mkdir(p, { recursive: true }).catch(() => {});
}

async function convertFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (!exts.has(ext)) return { skipped: true };
  const outPath = filePath.replace(/\.(jpe?g|png)$/i, '.webp');
  try {
    const [inStat, outStat] = await Promise.allSettled([stat(filePath), stat(outPath)]);
    if (outStat.status === 'fulfilled' && outStat.value.mtimeMs >= inStat.value.mtimeMs) {
      // continue to ensure sized variants exist even if base webp is up-to-date
    }
  } catch {}
  // Create base WebP
  await sharp(filePath).webp({ quality: 82 }).toFile(outPath);
  // Create sized variants
  const inMeta = await sharp(filePath).metadata().catch(() => ({}));
  const maxWidth = inMeta?.width || Infinity;
  for (const w of widths) {
    if (w > maxWidth) continue; // skip variants larger than the source
    const target = w;
    const variantPath = outPath.replace(/\.webp$/i, `.w${w}.webp`);
    try {
      const [inS, outS] = await Promise.allSettled([stat(filePath), stat(variantPath)]);
      if (outS.status === 'fulfilled' && outS.value.mtimeMs >= inS.value.mtimeMs) continue;
    } catch {}
    await sharp(filePath).resize({ width: target, withoutEnlargement: true }).webp({ quality: 82 }).toFile(variantPath);
  }
  return { converted: true, outPath };
}

async function processDir(dir) {
  const entries = await readdir(dir, { withFileTypes: true }).catch(() => []);
  let converted = 0; let skipped = 0;
  for (const e of entries) {
    if (!e.isFile()) continue;
    const full = path.join(dir, e.name);
    const res = await convertFile(full);
    if (res?.converted) converted++; else skipped++;
  }
  console.log(`${path.basename(dir)} WebP: converted ${converted}, skipped ${skipped}`);
}

async function run() {
  const args = process.argv.slice(2);
  if (args.length > 0) {
    let converted = 0; let skipped = 0; let missing = 0;
    for (const raw of args) {
      const p = path.isAbsolute(raw) ? raw : path.join(root, raw);
      try {
        const s = await stat(p);
        if (s.isDirectory()) {
          await processDir(p);
          continue;
        }
        if (s.isFile()) {
          const res = await convertFile(p);
          if (res?.converted) converted++; else skipped++;
          continue;
        }
        skipped++;
      } catch {
        console.warn(`Not found or inaccessible: ${raw}`);
        missing++;
      }
    }
    if (converted + skipped + missing > 0) {
      console.log(`Selective WebP: converted ${converted}, skipped ${skipped}, missing ${missing}`);
    }
    return;
  }
  // Default: process both folders
  for (const dir of inputDirs) await processDir(dir);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
