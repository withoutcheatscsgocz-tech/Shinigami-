// Build-time photo fetcher for the Photos app.
//
// WHY build-time (not runtime): the game should feel like a real phone that
// "just works" offline. Hot-linking external images at runtime is unreliable
// (hotlink protection, rate limits, broken links, needs network). So we download
// a curated set of ROYALTY-FREE images ONCE and bundle them into public/photos,
// which Capacitor packages into the APK as local assets.
//
// WHY NOT Pinterest: Pinterest pins are third-party copyrighted content with
// hotlink protection (its CDN i.pinimg.com is blocked here, 403), and bundling
// them would be a licensing problem. We use Unsplash / Pexels instead, whose
// licenses permit free use and redistribution within a product.
//
// Only non-sensitive, scene-appropriate photos get a real image; evidence /
// crime-scene / screenshot entries stay stylised by design.
//
// Run: node scripts/fetch-photos.mjs   (re-run any time to re-curate)

import { mkdir, writeFile, readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, 'public', 'photos')

// photoId (matches caseData) -> { url, by, src, subject }
// URLs are direct royalty-free image files (Unsplash / Pexels).
const MAP = {
  ph1: { subject: 'city sunset from a balcony', src: 'Unsplash', url: 'https://images.unsplash.com/photo-1495567720989-cebdbdd97913?w=600&q=70' },
  ph2: { subject: 'house exterior / property listing', src: 'Unsplash', url: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&q=70' },
  ph3: { subject: 'home-cooked pasta', src: 'Unsplash', url: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600&q=70' },
  ph5: { subject: 'celebration cake', src: 'Unsplash', url: 'https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=600&q=70' },
  ph6: { subject: 'gym / dumbbells', src: 'Unsplash', url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=70' },
  ph7: { subject: 'cabin in the woods', src: 'Unsplash', url: 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=600&q=70' },
  'ph-dog': { subject: 'dog in a park', src: 'Unsplash', url: 'https://images.unsplash.com/photo-1453227588063-bb302b62f50b?w=600&q=70' },
  'ph-studio': { subject: 'design / art studio', src: 'Unsplash', url: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=600&q=70' },
}

const credits = []
let ok = 0
let failed = 0

await mkdir(outDir, { recursive: true })

for (const [id, m] of Object.entries(MAP)) {
  try {
    const res = await fetch(m.url, { redirect: 'follow' })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const type = res.headers.get('content-type') ?? ''
    if (!type.startsWith('image/')) throw new Error(`not an image (${type})`)
    const buf = Buffer.from(await res.arrayBuffer())
    if (buf.length < 6000) throw new Error(`too small (${buf.length}b)`)
    const file = `${id}.jpg`
    await writeFile(join(outDir, file), buf)
    credits.push(`- photos/${file} — ${m.subject} — ${m.src} (royalty-free) — ${m.url}`)
    console.log(`✓ ${id}  ${buf.length} bytes  (${m.subject})`)
    ok++
  } catch (e) {
    console.warn(`✗ ${id}  ${m.url}\n    ${e.message} — will fall back to stylised render`)
    failed++
  }
}

// Write a credits/licence note next to the assets.
const header = `# Photos — image credits & licences

These images are royalty-free stock (Unsplash / Pexels licences: free to use,
incl. inside this app; no attribution legally required, credited here anyway).
They are used as in-game flavour, NOT presented as original artwork. This is a
non-commercial personal project. If any specific image raises a licensing
concern, replace it via scripts/fetch-photos.mjs.

Sensitive/abstract photos (evidence, crime-scene, screenshots) intentionally use
no real image and stay stylised.

`
await writeFile(join(outDir, 'CREDITS.md'), header + credits.join('\n') + '\n')

// Emit a tiny manifest the app/validation can read (which ids actually fetched).
await writeFile(join(outDir, 'manifest.json'), JSON.stringify({ fetched: credits.length, ids: Object.keys(MAP).filter((_, i) => i < credits.length) }, null, 2))

console.log(`\nDone: ${ok} fetched, ${failed} failed. Assets in public/photos/.`)
void readFile // (reserved)
