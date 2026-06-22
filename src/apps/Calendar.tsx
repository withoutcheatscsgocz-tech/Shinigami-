// Calendar: an agenda list of events -> event detail. Deleted/edited events are
// still shown (struck through / flagged) because the "investigator" is
// recovering them — the manipulation of the timeline is itself a clue.

import { useState } from 'react'
import { AppFrame } from '../components/AppFrame'
import { caseData } from '../game/caseData'
import { useGame } from '../game/state'
import type { CalendarEvent } from '../game/types'

export function Calendar() {
  const { state } = useGame()
  const [sel, setSel] = useState<CalendarEvent | null>(null)
  const events = caseData.calendar
    .filter((e) => e.act <= state.act)
    .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : (a.time ?? '') < (b.time ?? '') ? -1 : 1))

  if (sel) {
    return (
      <AppFrame title="Event" onBack={() => setSel(null)}>
        <div className="px-5 py-5">
          <div className={`flex items-center gap-2 ${sel.deleted ? 'text-white/50' : 'text-white'}`}>
            <span className={`h-3 w-3 rounded-sm ${sel.deleted ? 'bg-red-500' : 'bg-sky-500'}`} />
            <h1 className={`text-[22px] font-bold ${sel.deleted ? 'line-through' : ''}`}>{sel.title}</h1>
          </div>
          <ul className="mt-4 overflow-hidden rounded-2xl bg-white/5 text-[14px]">
            <Row k="Date" v={prettyDate(sel.date)} />
            <Row k="Time" v={sel.time ?? 'All day'} />
            {sel.location && <Row k="Location" v={sel.location} />}
            <Row k="Status" v={sel.deleted ? 'Deleted' : sel.edited ? 'Edited' : 'Scheduled'} flag={sel.deleted || sel.edited} />
            {sel.note && <Row k="Note" v={sel.note} flag />}
          </ul>
        </div>
      </AppFrame>
    )
  }

  // group by date
  const groups = new Map<string, CalendarEvent[]>()
  for (const e of events) {
    const arr = groups.get(e.date) ?? []
    arr.push(e)
    groups.set(e.date, arr)
  }

  return (
    <AppFrame title="Calendar" subtitle="Agenda">
      <div className="px-4 py-3">
        {[...groups.entries()].map(([date, evs]) => (
          <div key={date} className="mb-5">
            <div className="mb-2 text-[13px] font-semibold uppercase tracking-wide text-sky-400">{prettyDate(date)}</div>
            <ul className="space-y-2">
              {evs.map((e) => (
                <li key={e.id}>
                  <button
                    onClick={() => setSel(e)}
                    className={`flex w-full items-start gap-3 rounded-xl border-l-4 bg-white/5 px-3 py-2 text-left active:bg-white/10 ${
                      e.deleted ? 'border-red-500/60' : 'border-sky-500/60'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className={`text-[15px] ${e.deleted ? 'text-white/45 line-through' : 'text-white'}`}>{e.title}</div>
                      <div className="text-[12px] text-white/45">
                        {e.time ? `${e.time}` : 'All day'}
                        {e.location ? ` · ${e.location}` : ''}
                      </div>
                      {(e.deleted || e.edited || e.note) && (
                        <div className="mt-1 text-[11px] text-amber-400/80">
                          {e.deleted ? 'Deleted · ' : ''}
                          {e.edited ? 'Edited · ' : ''}
                          {e.note ?? ''}
                        </div>
                      )}
                    </div>
                    <span className="text-white/25">›</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </AppFrame>
  )
}

function Row({ k, v, flag }: { k: string; v: string; flag?: boolean }) {
  return (
    <li className="flex items-start justify-between gap-3 border-b border-white/5 px-4 py-3 last:border-0">
      <span className="shrink-0 text-white/45">{k}</span>
      <span className={`text-right ${flag ? 'text-amber-400/90' : 'text-white/90'}`}>{v}</span>
    </li>
  )
}

function prettyDate(date: string): string {
  return new Date(date + 'T00:00').toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
