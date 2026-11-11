/**
 * Convierte JPG/PNG locales de public/assets a WebP y elimina el original.
 * Favicons PNG de public/ se dejan intactos (compatibilidad de navegadores).
 * Uso: node scripts/convert-assets-to-webp.mjs
 */
import { readdir, stat, unlink } from 'node:fs/promises';
import { join, extname, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'assets');
const QUALITY = 78;
const exts = new Set(['.jpg', '.jpeg', '.png']);

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(full)));
    } else if (exts.has(extname(entry.name).toLowerCase())) {
      files.push(full);
    }
  }
  return files;
}

const files = await walk(root);
let converted = 0;
let skipped = 0;
let bytesIn = 0;
let bytesOut = 0;

for (const input of files) {
  const out = join(dirname(input), `${basename(input, extname(input))}.webp`);
  const before = (await stat(input)).length;
  await sharp(input).webp({ quality: QUALITY, effort: 4 }).toFile(out);
  const after = (await stat(out)).length;
  await unlink(input);
  converted += 1;
  bytesIn += before;
  bytesOut += after;
  const rel = input.replace(/\\/g, '/').split('/public/')[1] ?? input;
  console.log(`OK ${rel}  ${(before / 1024).toFixed(1)}KB → ${(after / 1024).toFixed(1)}KB`);
}

console.log(
  `\nConverted=${converted} skipped=${skipped} ` +
    `in=${(bytesIn / 1024 / 1024).toFixed(2)}MB out=${(bytesOut / 1024 / 1024).toFixed(2)}MB ` +
    `saved=${(((bytesIn - bytesOut) / bytesIn) * 100).toFixed(1)}%`,
);
