// Generates the VERA launcher icon (a cold, glowing cyan "eye" — the assistant
// watching) into all Android mipmap densities, plus a web favicon. No external
// assets; the art is an inline SVG rasterised with sharp.
//
// Run: node scripts/gen-icon.mjs

import sharp from 'sharp'
import { mkdir, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const resDir = join(root, 'android', 'app', 'src', 'main', 'res')

// The eye, drawn centred in a `S`-sized viewbox. `scale` controls how big the
// eye is relative to the canvas (smaller for the adaptive foreground safe zone).
function eye(S, scale) {
  const c = S / 2
  const R = (S * scale) / 2 // outer radius
  return `
    <g>
      <!-- outer glow -->
      <circle cx="${c}" cy="${c}" r="${R * 1.25}" fill="url(#glow)"/>
      <!-- iris ring -->
      <circle cx="${c}" cy="${c}" r="${R}" fill="none" stroke="#22d3ee" stroke-width="${R * 0.11}" opacity="0.92"/>
      <circle cx="${c}" cy="${c}" r="${R * 0.78}" fill="none" stroke="#0e7490" stroke-width="${R * 0.05}" opacity="0.8"/>
      <!-- iris core -->
      <circle cx="${c}" cy="${c}" r="${R * 0.66}" fill="url(#iris)"/>
      <!-- slit pupil (the unsettling, non-human part) -->
      <rect x="${c - R * 0.1}" y="${c - R * 0.52}" width="${R * 0.2}" height="${R * 1.04}" rx="${R * 0.1}" fill="#04141c"/>
      <!-- catch-light -->
      <circle cx="${c - R * 0.22}" cy="${c - R * 0.26}" r="${R * 0.09}" fill="#e7feff" opacity="0.85"/>
    </g>`
}

function svg(S, { bg }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" viewBox="0 0 ${S} ${S}">
    <defs>
      <radialGradient id="bg" cx="50%" cy="42%" r="75%">
        <stop offset="0%" stop-color="#0b1622"/>
        <stop offset="60%" stop-color="#070a12"/>
        <stop offset="100%" stop-color="#04050a"/>
      </radialGradient>
      <radialGradient id="iris" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#a5f3fc"/>
        <stop offset="45%" stop-color="#22d3ee"/>
        <stop offset="100%" stop-color="#0e7490"/>
      </radialGradient>
      <radialGradient id="glow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#22d3ee" stop-opacity="0.55"/>
        <stop offset="55%" stop-color="#0891b2" stop-opacity="0.18"/>
        <stop offset="100%" stop-color="#0891b2" stop-opacity="0"/>
      </radialGradient>
    </defs>
    ${bg ? `<rect width="${S}" height="${S}" fill="url(#bg)"/>` : ''}
    ${eye(S, bg ? 0.62 : 0.5)}
  </svg>`
}

const LEGACY = { mdpi: 48, hdpi: 72, xhdpi: 96, xxhdpi: 144, xxxhdpi: 192 }
const FOREGROUND = { mdpi: 108, hdpi: 162, xhdpi: 216, xxhdpi: 324, xxxhdpi: 432 }

async function png(svgStr, size, outPath) {
  await sharp(Buffer.from(svgStr)).resize(size, size).png().toFile(outPath)
}

for (const [d, size] of Object.entries(LEGACY)) {
  const dir = join(resDir, `mipmap-${d}`)
  await mkdir(dir, { recursive: true })
  await png(svg(size, { bg: true }), size, join(dir, 'ic_launcher.png'))
  await png(svg(size, { bg: true }), size, join(dir, 'ic_launcher_round.png'))
  console.log(`✓ mipmap-${d} ic_launcher(${size})`)
}
for (const [d, size] of Object.entries(FOREGROUND)) {
  const dir = join(resDir, `mipmap-${d}`)
  await png(svg(size, { bg: false }), size, join(dir, 'ic_launcher_foreground.png'))
  console.log(`✓ mipmap-${d} foreground(${size})`)
}

// Adaptive background colour -> deep near-black.
await writeFile(
  join(resDir, 'values', 'ic_launcher_background.xml'),
  `<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">#070A12</color>\n</resources>\n`,
)

// Web favicon + an in-app copy (public/ is bundled and served offline).
await mkdir(join(root, 'public'), { recursive: true })
await png(svg(256, { bg: true }), 256, join(root, 'public', 'icon.png'))

console.log('\nIcon generated for all densities + web favicon.')
