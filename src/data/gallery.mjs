// Dynamic gallery list: automatically include all .webp originals in /public/gallery
// (excluding responsive size variants like .w720.webp). Keeps manual maintenance low.
import { readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const galleryDirUrl = new URL('../../public/gallery/', import.meta.url);
const galleryDirPath = fileURLToPath(galleryDirUrl);
const files = await readdir(galleryDirPath).catch(() => []);

const isBaseWebp = (name) => name.endsWith('.webp') && !/\.w\d+\.webp$/i.test(name);
// Ensure COLORS1.webp stays at the top if present.
const priority = ['COLORS1.webp'];
const prioritySet = new Set(priority);

const autos = files.filter(isBaseWebp).sort((a, b) => a.localeCompare(b, 'en')); // alphabetical

const formatCaption = (filename) => {
  const base = path.basename(filename, path.extname(filename));
  const withoutParens = base.replace(/\s*\([^)]*\)\s*/g, ' ');
  const cleaned = withoutParens.replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim();
  return cleaned ? cleaned.toUpperCase() : base.toUpperCase();
};

const mapped = autos.map((name) => {
  const src = `/gallery/${name}`;
  let alt = formatCaption(name);
  if (name.toLowerCase().startsWith('colors1')) alt = 'COLORS';
  else if (name.includes('2025-10-11')) alt = 'BALI';
  else if (name.includes('2025-11-10')) alt = 'VALL DE NÚRIA';
  else if (name.includes('2025-10-15')) alt = 'ARMENIA I GEORGIA';
  else if (name.toUpperCase().startsWith('VILAMANISCLE')) alt = 'VILAMANISCLE';
  return { src, alt, credit: '' };
});

// Reorder: priority first, then rest without duplicates.
const ordered = [
  ...priority.filter(f => autos.includes(f)).map(f => mapped.find(m => m.src.endsWith(f))),
  ...mapped.filter(m => !prioritySet.has(path.basename(m.src))),
].filter(Boolean);

export const frames = ordered;
