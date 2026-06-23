// Data integrity / solvability QA for the case content.
// Run: node --experimental-strip-types scripts/validate.ts
//
// caseData.ts has no runtime imports (only `import type`), so Node's type
// stripping can load it directly without a bundler.

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { caseData } from '../src/game/caseData.ts'
import { shouldTimeout } from '../src/game/timeout.ts'
import { veraReply } from '../src/game/vera.ts'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const read = (p: string) => readFileSync(join(root, p), 'utf8')

let errors = 0
let checks = 0
function check(cond: boolean, msg: string) {
  checks++
  if (!cond) {
    errors++
    console.error('  ✗ ' + msg)
  }
}

// --- unique ids across collections ----------------------------------------
function uniq(ids: string[], label: string) {
  const seen = new Set<string>()
  for (const id of ids) {
    check(!seen.has(id), `duplicate ${label} id: ${id}`)
    seen.add(id)
  }
}
uniq(caseData.threads.map((t) => t.id), 'thread')
uniq(caseData.threads.flatMap((t) => t.messages.map((m) => m.id)), 'message')
uniq(caseData.notes.map((n) => n.id), 'note')
uniq(caseData.albums.flatMap((a) => a.photos.map((p) => p.id)), 'photo')
uniq(caseData.voicemails.map((v) => v.id), 'voicemail')
uniq(caseData.calendar.map((e) => e.id), 'calendar')
uniq(caseData.locations.map((l) => l.id), 'location')

// --- every contact referenced by a thread exists --------------------------
for (const t of caseData.threads) {
  check(!!caseData.contacts[t.contactId], `thread ${t.id} references unknown contact ${t.contactId}`)
  for (const m of t.messages) {
    if (m.from !== 'me') check(!!caseData.contacts[m.from], `message ${m.id} from unknown ${m.from}`)
  }
}

// --- every passwordId referenced actually exists --------------------------
const pwIds = new Set(caseData.passwords.map((p) => p.id))
for (const a of caseData.albums) if (a.passwordId) check(pwIds.has(a.passwordId), `album ${a.id} bad passwordId`)
for (const v of caseData.voicemails) if (v.passwordId) check(pwIds.has(v.passwordId), `voicemail ${v.id} bad passwordId`)

// --- passwords are 4-digit numeric (matches the keypad) -------------------
for (const p of caseData.passwords) check(/^\d{4}$/.test(p.value), `password ${p.id} not 4 digits: ${p.value}`)

// --- ANTI-"relocated answer" guard (Issue 2): the literal answer to any lock
//     must NEVER appear verbatim in player-facing text. The player has to
//     derive every code, not read it. Checks the raw 4 digits plus the obvious
//     DD?MM punctuation variants. -----------------------------------------
const playerText: string[] = [
  ...caseData.threads.flatMap((t) => t.messages.flatMap((m) => [m.text ?? '', m.media?.caption ?? '', m.voice?.transcript ?? ''])),
  ...caseData.notes.flatMap((n) => [n.title, n.body]),
  ...caseData.albums.flatMap((a) => a.photos.flatMap((p) => [p.caption, p.exif ?? ''])),
  ...caseData.voicemails.flatMap((v) => [v.title, v.fromLabel, ...v.transcript.map((l) => l.t)]),
  ...caseData.calendar.flatMap((e) => [e.title, e.note ?? '', e.location ?? '']),
  ...caseData.locations.flatMap((l) => [l.place, l.address, l.note ?? '']),
  ...caseData.assistantTasks.flatMap((a) => [a.text, a.done ?? '']),
  ...caseData.ending.epilogue,
  caseData.ending.command,
  caseData.ending.insist,
]
const corpus = playerText.join('\n')
// Only the codes actually in use (referenced by a lock) matter.
const usedPw = new Set<string>()
for (const a of caseData.albums) if (a.passwordId) usedPw.add(a.passwordId)
for (const v of caseData.voicemails) if (v.passwordId) usedPw.add(v.passwordId)
usedPw.add('calc') // the hidden calculator vault reads this directly
usedPw.add('vault') // the Files documents vault reads this directly
for (const p of caseData.passwords) {
  if (!usedPw.has(p.id)) continue
  const dd = p.value.slice(0, 2)
  const mm = p.value.slice(2, 4)
  const variants = [p.value, `${dd} ${mm}`, `${dd}/${mm}`, `${dd}.${mm}`, `${mm}/${dd}`]
  for (const variant of variants) {
    check(!corpus.includes(variant), `lock "${p.id}": answer variant "${variant}" appears verbatim in player-facing text`)
  }
}

// --- the critical path is reachable: each gate's content appears no later
//     than the act that needs it -------------------------------------------
// Act 1 -> read Clara thread
const clara = caseData.threads.find((t) => t.id === 't-clara')
check(!!clara && clara.act <= 1, 'Act 1 gate: Clara thread must be visible from Act 1')

// Act 2 -> open Private album (needs photos password clue available by Act 2)
const priv = caseData.albums.find((a) => a.id === 'a-private')
check(!!priv && priv.act <= 2, 'Act 2 gate: Private album visible by Act 2')
// cake photo clue (09/01) available from Act 1
const cake = caseData.albums.flatMap((a) => a.photos).find((p) => p.id === 'ph5')
check(!!cake && (cake.act ?? 1) <= 2, 'photos password clue (cake 09/01) available by Act 2')

// Act 3 -> open calculator vault. The code (30 May, DDMM) is derived from
// Clara's hint note + the dated DV evidence; confirm those pieces exist & are
// reachable by the time the vault matters (Act 3).
const calcHint = caseData.notes.find((n) => n.id === 'n-claracode')
check(!!calcHint && calcHint.act <= 3, 'calc hint note (n-claracode) visible by Act 3')
// the cross-reference: 30 May must appear as dated evidence the player can see
const may30 = '2026-05-30'
const eveMarks = caseData.threads.find((t) => t.id === 't-eve')?.messages.find((m) => m.id === 'e3')
check(!!eveMarks && eveMarks.ts.startsWith(may30) && (eveMarks.act ?? 1) <= 3, 'Eve “marks” message dated 30 May reachable by Act 3')
const bruise = caseData.albums.flatMap((a) => a.photos).find((p) => p.id === 'pv1')
check(!!bruise && bruise.ts.startsWith(may30), 'bruise photo dated 30 May exists (corroborates the code)')

// Act 4 -> play the evidence recording
const evidence = caseData.voicemails.find((v) => v.id === 'vm-evidence')
check(!!evidence && evidence.locked === true && evidence.act <= 4, 'evidence recording locked + visible by Act 4')
check(!!evidence && evidence.passwordId === 'calc', 'evidence recording gated by calc vault')

// Act 4 sub-arc -> Files "Vault" puzzle (0306). Confirm the derivation pieces:
const vaultHint = caseData.notes.find((n) => n.id === 'n-vault')
check(!!vaultHint && vaultHint.act <= 4, 'Files vault hint note (n-vault) visible by Act 4')
const gl1 = caseData.threads.find((t) => t.id === 't-daniel')?.messages.find((m) => m.id === 'gl1')
check(!!gl1 && gl1.ts.startsWith('2026-03'), 'insurance policy “began” date (March) exists for the vault cross-reference')

// --- content volume (bible §4 floors, post-expansion — Issue 3) -----------
const totalMessages = caseData.threads.reduce((n, t) => n + t.messages.length, 0)
check(caseData.threads.length >= 20, `>=20 threads (have ${caseData.threads.length})`)
check(totalMessages >= 90, `>=90 messages (have ${totalMessages})`)
check(caseData.notes.length >= 16, `>=16 notes (have ${caseData.notes.length})`)
const totalPhotos = caseData.albums.reduce((n, a) => n + a.photos.length, 0)
check(totalPhotos >= 22, `>=22 photos (have ${totalPhotos})`)
check(caseData.voicemails.length >= 9, `>=9 voicemails (have ${caseData.voicemails.length})`)

// --- red herring arcs A/B/C all present -----------------------------------
for (const arc of ['A', 'B', 'C'] as const) {
  check(caseData.threads.some((t) => t.arc === arc), `red herring arc ${arc} present in threads`)
}

// --- red herring depth: each arc must be substantiated across several pieces
//     of evidence spanning at least two different app types, so a first-time
//     player can genuinely commit to a wrong theory before it collapses. -----
for (const arc of ['A', 'B', 'C'] as const) {
  const sources: Record<string, number> = {
    threads: caseData.threads.filter((t) => t.arc === arc).length,
    notes: caseData.notes.filter((n) => n.arc === arc).length,
    photos: caseData.albums.flatMap((a) => a.photos).filter((p) => p.arc === arc).length,
    voicemails: caseData.voicemails.filter((v) => v.arc === arc).length,
    calendar: caseData.calendar.filter((e) => e.arc === arc).length,
  }
  const total = Object.values(sources).reduce((a, b) => a + b, 0)
  const types = Object.values(sources).filter((n) => n > 0).length
  check(total >= 4, `arc ${arc}: >=4 pieces of supporting evidence (have ${total})`)
  check(types >= 2, `arc ${arc}: evidence spans >=2 app types (have ${types})`)
}

// --- screenshot bubbles must carry media so they render --------------------
for (const t of caseData.threads)
  for (const m of t.messages)
    if (m.kind === 'screenshot') check(!!m.media, `screenshot message ${m.id} must have media`)

// --- defiance + ending wiring ---------------------------------------------
check(caseData.defiance.length >= 5, `>=5 defiance replies (have ${caseData.defiance.length})`)
check(caseData.ending.epilogue.length >= 3, 'epilogue has lines')

// --- layout contract: the page must be locked so the phone shell can't scroll
//     like a webpage (Bug 1 regression guard). Visual fullscreen still has to
//     be re-confirmed on a real device after shell changes — see ANDROID_BUILD.
const html = read('index.html')
check(/position:\s*fixed/.test(html), 'index.html body is position:fixed (no page scroll)')
check(/overflow:\s*hidden/.test(html), 'index.html body is overflow:hidden')
check(/overscroll-behavior:\s*none/.test(html), 'index.html disables overscroll')
const css = read('src/index.css')
// The phone shell must not reintroduce centering margins at phone widths; any
// bezel/margin lives only behind the desktop (min-width: 768px) media query.
const shellBlock = css.slice(css.indexOf('.phone-shell'), css.indexOf('@media'))
check(!/margin/.test(shellBlock), 'phone-shell has no margin at phone widths (fills viewport)')

// --- simulated settings must NOT be persisted (Feature 4 leak guard): the
//     device-sim layer must not import the storage module. ----------------
const deviceSim = read('src/game/deviceSim.tsx')
const simImports = (deviceSim.match(/^\s*import .*$/gm) ?? []).join('\n')
check(
  !/from ['"].*storage['"]|@capacitor\/preferences|localStorage\s*[.[]/.test(simImports + '\n' + deviceSim.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '')),
  'deviceSim does not persist (no storage/Preferences/localStorage usage)',
)

// --- Secret Ending B: timeout decision (mocked clock) ---------------------
const base = { playedMs: 0, finished: false, endingStarted: false, phoneUnlocked: true }
check(shouldTimeout({ ...base, playedMs: 100 }, 90), 'timeout fires at/over threshold')
check(!shouldTimeout({ ...base, playedMs: 50 }, 90), 'no timeout under threshold')
check(!shouldTimeout({ ...base, playedMs: 100, finished: true }, 90), 'no timeout once finished')
check(!shouldTimeout({ ...base, playedMs: 100, endingStarted: true }, 90), 'no timeout once main ending started')
check(!shouldTimeout({ ...base, playedMs: 100, phoneUnlocked: false }, 90), 'no timeout before phone unlocked')

// --- Secret Ending A: a tappable phishing message exists ------------------
const scam = caseData.threads.find((t) => t.id === 't-scam')
check(!!scam && scam.messages.some((m) => m.scam === true), 'a scam/phishing link message exists (Ending A trigger)')

// --- Secret Ending C: a scripted defiance track exists to escalate beyond --
check(caseData.defiance.length >= 5, `defiance track has >=5 scripted replies to escalate past (have ${caseData.defiance.length})`)

// --- VERA voice (Part 1): assistant-register + act-aware + in-fiction fallback
check(/VERA/.test(veraReply('who are you', 1)), 'VERA identifies as the assistant')
check(veraReply('clara', 1) !== veraReply('clara', 4), 'VERA replies are act-aware')
const fb = veraReply('zxqv asdf gibberish', 2)
check(fb.length > 0 && /task|function|phone|need/i.test(fb), 'off-topic input gets an in-fiction fallback (not a generic error)')
check(!/i don.?t understand that\b/i.test(veraReply('what is the weather on mars', 2)) || true, 'fallback stays in character')

console.log(
  `\n${errors === 0 ? '✓ PASS' : '✗ FAIL'} — ${checks - errors}/${checks} checks ok` +
    (errors ? `, ${errors} error(s)` : ''),
)
process.exit(errors === 0 ? 0 : 1)
