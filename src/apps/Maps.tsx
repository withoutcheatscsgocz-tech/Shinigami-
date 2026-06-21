// Maps: a "Location History" timeline. A fake static map panel plus a list of
// visited places. The cabin, the quarry, and finally "Current location" (stamped
// NOW, resolving to the live clock) drive the late-game scares.

import { AppFrame } from '../components/AppFrame'
import { caseData } from '../game/caseData'
import { useGame } from '../game/state'
import { fmtFull, isNow } from '../ui/format'

export function Maps() {
  const { state } = useGame()
  const locations = caseData.locations
    .filter((l) => l.act <= state.act)
    .sort((a, b) => (resolveTs(a.ts) < resolveTs(b.ts) ? 1 : -1))

  return (
    <AppFrame title="Location History">
      {/* faux map */}
      <div className="relative m-3 h-44 overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-900/40 via-zinc-800 to-zinc-900">
        <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,.15)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.15)_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-400 ring-4 ring-sky-400/30" />
        <div className="absolute bottom-2 left-3 text-[11px] text-white/50">Ashford · Blackmoor</div>
      </div>

      <ul className="px-4 pb-6">
        {locations.map((l) => (
          <li key={l.id} className="relative flex gap-3 pb-5">
            <div className="flex flex-col items-center">
              <span className={`mt-1 h-3 w-3 rounded-full ${l.isNow ? 'bg-red-500 animate-flicker' : l.evidence ? 'bg-amber-400' : 'bg-sky-400'}`} />
              <span className="w-px flex-1 bg-white/15" />
            </div>
            <div className="min-w-0 flex-1">
              <div className={`text-[15px] ${l.isNow ? 'text-red-400' : 'text-white'}`}>{l.place}</div>
              <div className="text-[12px] text-white/45">{l.address}</div>
              <div className="text-[12px] text-white/40">{isNow(l.ts) ? 'now' : fmtFull(l.ts)}</div>
              {l.note && <div className={`mt-0.5 text-[11px] ${l.evidence ? 'text-amber-400/80' : 'text-white/40'}`}>{l.note}</div>}
            </div>
          </li>
        ))}
      </ul>
    </AppFrame>
  )
}

function resolveTs(ts: string): string {
  return ts === 'NOW' ? new Date().toISOString() : ts
}
