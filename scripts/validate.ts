// Data integrity / solvability QA for the case content.
// Run: node --experimental-strip-types scripts/validate.ts
//
// caseData.ts has no runtime imports (only `import type`), so Node's type
// stripping can load it directly without a bundler.

import { caseData } from '../src/game/caseData.ts'

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

// Act 3 -> open calculator vault (PIN clue available by Act 3)
const calcNote = caseData.notes.find((n) => n.id === 'n-calc')
check(!!calcNote && calcNote.act <= 3, 'calc PIN clue note visible by Act 3')
const numbers = caseData.notes.find((n) => n.id === 'n-numbers')
check(!!numbers && numbers.act <= 3, 'cab number note visible by Act 3')

// Act 4 -> play the evidence recording
const evidence = caseData.voicemails.find((v) => v.id === 'vm-evidence')
check(!!evidence && evidence.locked === true && evidence.act <= 4, 'evidence recording locked + visible by Act 4')
check(!!evidence && evidence.passwordId === 'calc', 'evidence recording gated by calc vault')

// --- content volume meets the design minimums (bible §4) ------------------
const totalMessages = caseData.threads.reduce((n, t) => n + t.messages.length, 0)
check(caseData.threads.length >= 15, `>=15 threads (have ${caseData.threads.length})`)
check(totalMessages >= 15, `>=15 messages (have ${totalMessages})`)
check(caseData.notes.length >= 10, `>=10 notes (have ${caseData.notes.length})`)
const totalPhotos = caseData.albums.reduce((n, a) => n + a.photos.length, 0)
check(totalPhotos >= 15, `>=15 photos (have ${totalPhotos})`)
check(caseData.voicemails.length >= 5, `>=5 voicemails (have ${caseData.voicemails.length})`)

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

console.log(
  `\n${errors === 0 ? '✓ PASS' : '✗ FAIL'} — ${checks - errors}/${checks} checks ok` +
    (errors ? `, ${errors} error(s)` : ''),
)
process.exit(errors === 0 ? 0 : 1)
