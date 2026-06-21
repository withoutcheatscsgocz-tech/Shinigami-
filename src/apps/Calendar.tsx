// Calendar: an agenda list of events. Deleted/edited events are still shown
// (struck through / flagged) because the "investigator" is recovering them —
// the manipulation of the timeline is itself a clue.

import { AppFrame } from '../components/AppFrame'
import { caseData } from '../game/caseData'
import { useGame } from '../game/state'

export function Calendar() {
  const { state } = useGame()
  const events = caseData.calendar
    .filter((e) => e.act <= state.act)
    .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : (a.time ?? '') < (b.time ?? '') ? -1 : 1))

  // group by date
  const groups = new Map<string, typeof events>()
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
                <li
                  key={e.id}
                  className={`flex items-start gap-3 rounded-xl border-l-4 bg-white/5 px-3 py-2 ${
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
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </AppFrame>
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
