// Formatting helpers for story timestamps. The sentinel "NOW" resolves to the
// player's live device time — used for the photos/locations that are stamped
// "right now" in the final acts (the core fourth-wall scare).

export function isNow(ts: string): boolean {
  return ts === 'NOW'
}

function parse(ts: string): Date {
  if (ts === 'NOW') return new Date()
  return new Date(ts)
}

/** "23:40" */
export function fmtTime(ts: string): string {
  const d = parse(ts)
  return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false })
}

/** "Sat 6 Jun" */
export function fmtDate(ts: string): string {
  if (ts === 'NOW') return 'now'
  const d = parse(ts)
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
}

/** "Sat 6 Jun, 23:40" — full stamp for headers and EXIF. */
export function fmtFull(ts: string): string {
  if (ts === 'NOW') return 'Today, ' + fmtTime('NOW')
  return `${fmtDate(ts)}, ${fmtTime(ts)}`
}

/** Chat-style day separator label. */
export function fmtDayLabel(ts: string): string {
  if (ts === 'NOW') return 'Today'
  const d = parse(ts)
  return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })
}

/** mm:ss from seconds. */
export function fmtClock(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}
