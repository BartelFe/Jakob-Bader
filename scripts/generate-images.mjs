#!/usr/bin/env node
/**
 * Image asset pipeline.
 *
 * 1. Generates a `.webp` next to every JPG in /public/{projekte,portraits},
 *    skipping when the WebP is already newer than its source.
 * 2. Generates the favicon set + maskable-icon from /jba-logo.svg.
 *
 * Run with:  pnpm images
 */
import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.resolve(__dirname, '..', 'public');
const ROOT = path.resolve(__dirname, '..');

const PHOTO_ROOTS = ['projekte', 'portraits'];
const WEBP_QUALITY = 82;

let webpGen = 0;
let webpSkip = 0;

async function maybeMakeWebp(filepath) {
  const ext = path.extname(filepath).toLowerCase();
  if (!['.jpg', '.jpeg', '.png'].includes(ext)) return;
  const base = filepath.slice(0, -ext.length);
  const webpPath = base + '.webp';

  try {
    const [src, dst] = await Promise.all([fs.stat(filepath), fs.stat(webpPath).catch(() => null)]);
    if (dst && dst.mtimeMs >= src.mtimeMs) {
      webpSkip++;
      return;
    }
  } catch {
    /* source missing — skip silently */
  }

  await sharp(filepath).webp({ quality: WEBP_QUALITY, effort: 5 }).toFile(webpPath);
  const rel = path.relative(ROOT, webpPath).replace(/\\/g, '/');
  console.log(`  → ${rel}`);
  webpGen++;
}

async function walk(dir, fn) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(full, fn);
    else await fn(full);
  }
}

/* ─── Photos ────────────────────────────────────────────────────────── */
console.log('Generating WebP photos...');
for (const root of PHOTO_ROOTS) {
  await walk(path.join(PUBLIC, root), maybeMakeWebp);
}
console.log(`  ${webpGen} generated · ${webpSkip} unchanged\n`);

/* ─── Favicon set ───────────────────────────────────────────────────── */
console.log('Generating favicon set from jba-logo.svg...');

const SVG_PATH = path.join(PUBLIC, '..', 'jba-logo.svg');
const svgRaw = await fs.readFile(path.join(ROOT, 'jba-logo.svg'), 'utf8');

// Light variant: stroke is dark on a light background. Use for apple-touch
// (iOS prefers light icons that look good on home screens).
const svgLight = svgRaw.replace(/stroke="#0d0d0c"/g, 'stroke="#0d0d0c"');
// Dark variant: white stroke on dark background (for theme-dark contexts).
const svgDark = svgRaw.replace(/stroke="#0d0d0c"/g, 'stroke="#f4ede0"');

async function renderToPng(svgString, size, outName, { background = null } = {}) {
  const buf = Buffer.from(svgString);
  let pipeline = sharp(buf, { density: 384 }).resize(size, size, { fit: 'contain' });
  if (background) {
    pipeline = pipeline.flatten({ background });
  }
  const outPath = path.join(PUBLIC, outName);
  await pipeline.png({ compressionLevel: 9 }).toFile(outPath);
  console.log(`  → public/${outName}`);
}

// Browser favicons — light bg, dark stroke
await renderToPng(svgLight, 16, 'favicon-16.png', { background: '#f4ede0' });
await renderToPng(svgLight, 32, 'favicon-32.png', { background: '#f4ede0' });
await renderToPng(svgLight, 48, 'favicon-48.png', { background: '#f4ede0' });

// Apple touch — needs solid background, light scheme
await renderToPng(svgLight, 180, 'apple-touch-icon.png', { background: '#f4ede0' });

// PWA maskable — dark scheme matches our theme color #0d0d0c
await renderToPng(svgDark, 192, 'icon-192.png', { background: '#0d0d0c' });
await renderToPng(svgDark, 512, 'icon-512.png', { background: '#0d0d0c' });
await renderToPng(svgDark, 512, 'icon-512-maskable.png', { background: '#0d0d0c' });

/* ─── Open Graph image (1200×630 PNG from og-doppelzwiebel.svg) ─── */
console.log('\nRendering Open Graph image...');
const ogSrc = path.join(PUBLIC, 'og-doppelzwiebel.svg');
try {
  const ogSvg = await fs.readFile(ogSrc);
  await sharp(ogSvg, { density: 192 })
    .resize(1200, 630, { fit: 'contain', background: '#0d0d0c' })
    .png({ compressionLevel: 9 })
    .toFile(path.join(PUBLIC, 'og-doppelzwiebel.png'));
  console.log('  → public/og-doppelzwiebel.png');
} catch (err) {
  console.warn(`  (skipped: ${err instanceof Error ? err.message : err})`);
}

console.log('\n✓ Image pipeline complete.');
console.log(`  Source: ${SVG_PATH}`);
