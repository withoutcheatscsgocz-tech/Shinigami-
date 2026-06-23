// Page-2 flavor apps. Light, but lived-in — and a couple carry quiet clues
// (the 06:00 alarm, the activity spike the night of the murder).

import { useState } from 'react'
import { AppFrame } from '../components/AppFrame'
import { useClock } from '../game/useDevice'
import { useGame } from '../game/state'

// --- Clock -----------------------------------------------------------------
export function Clock() {
  const { hh, mm } = useClock()
  return (
    <AppFrame title="Clock">
      <div className="px-4 py-5">
        <div className="mb-6 text-center">
          <div className="text-6xl font-thin tabular-nums text-white">
            {hh}:{mm}
          </div>
          <div className="text-[13px] text-white/40">Ashford · today</div>
        </div>
        <div className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-white/40">Alarms</div>
        <ul className="overflow-hidden rounded-2xl bg-white/5">
          {[
            { t: '06:00', label: 'six', on: true, note: 'set Sat 23:38' },
            { t: '07:30', label: 'Gym', on: false },
            { t: '08:15', label: 'Work', on: false },
          ].map((a) => (
            <li key={a.t} className="flex items-center justify-between border-b border-white/5 px-4 py-3 last:border-0">
              <div>
                <div className={`text-2xl font-light tabular-nums ${a.on ? 'text-white' : 'text-white/35'}`}>{a.t}</div>
                <div className="text-[12px] text-white/40">
                  {a.label}
                  {a.note ? ` · ${a.note}` : ''}
                </div>
              </div>
              <span className={`relative h-6 w-11 rounded-full ${a.on ? 'bg-green-500' : 'bg-white/20'}`}>
                <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white ${a.on ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-3 px-1 text-[11px] text-white/30">The 06:00 alarm was set at 23:38 on Saturday — the same minute as the recording.</p>
      </div>
    </AppFrame>
  )
}

// --- Health ----------------------------------------------------------------
export function Health() {
  const { state } = useGame()
  // Steps per day; a huge late spike on the murder night, then near-flatline.
  const days = [
    { d: 'Wed 3', steps: 6120 },
    { d: 'Thu 4', steps: 5890 },
    { d: 'Fri 5', steps: 7240 },
    { d: 'Sat 6', steps: 18430, flag: true },
    { d: 'Sun 7', steps: 14110, flag: true },
    { d: 'Mon 8', steps: 410 },
    { d: 'Tue 9', steps: 230 },
  ]
  const max = Math.max(...days.map((x) => x.steps))
  return (
    <AppFrame title="Health" subtitle="Activity">
      <div className="px-4 py-4">
        <div className="mb-4 rounded-2xl bg-white/5 p-4">
          <div className="text-[12px] text-white/40">Steps — this week</div>
          <div className="mt-3 flex items-end justify-between gap-1.5" style={{ height: 140 }}>
            {days.map((x) => (
              <div key={x.d} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className={`w-full rounded-t ${x.flag ? 'bg-red-500/80' : 'bg-sky-500/70'}`}
                  style={{ height: `${Math.max(4, (x.steps / max) * 110)}px` }}
                />
                <span className="text-[9px] text-white/35">{x.d.split(' ')[1]}</span>
              </div>
            ))}
          </div>
        </div>
        <ul className="overflow-hidden rounded-2xl bg-white/5 text-[14px]">
          {days.map((x) => (
            <li key={x.d} className="flex items-center justify-between border-b border-white/5 px-4 py-2.5 last:border-0">
              <span className="text-white/70">{x.d}</span>
              <span className={`tabular-nums ${x.flag ? 'text-red-300' : 'text-white'}`}>{x.steps.toLocaleString('en-GB')}</span>
            </li>
          ))}
        </ul>
        {state.act >= 3 && (
          <p className="mt-3 px-1 text-[11px] text-amber-400/70">
            18,000 steps on Saturday night — then almost nothing. Whatever the walking was for, it stopped.
          </p>
        )}
      </div>
    </AppFrame>
  )
}

// --- Camera ----------------------------------------------------------------
export function Camera() {
  const [front, setFront] = useState(true)
  return (
    <AppFrame title="Camera">
      <div className="flex h-full flex-col">
        <div className="relative m-3 flex flex-1 items-center justify-center overflow-hidden rounded-2xl bg-black">
          {/* a dead, dark viewfinder — front camera "sees" only you */}
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/40 to-black" />
          <div className="absolute left-3 top-3 flex items-center gap-1 text-[11px] text-red-500">
            <span className="h-2 w-2 animate-flicker rounded-full bg-red-500" /> REC
          </div>
          <p className="z-10 px-8 text-center text-[13px] text-white/30">
            {front ? 'Front camera · no face detected' : 'Rear camera · lens covered'}
          </p>
        </div>
        <div className="flex items-center justify-around pb-6">
          <button onClick={() => setFront((f) => !f)} className="text-[13px] text-white/50 active:opacity-60">
            Flip
          </button>
          <span className="h-16 w-16 rounded-full border-4 border-white/70" />
          <span className="text-[13px] text-white/20">Library</span>
        </div>
      </div>
    </AppFrame>
  )
}

// --- Reminders -------------------------------------------------------------
export function Reminders() {
  const { state } = useGame()
  const items = [
    { t: 'Pick up dry cleaning', done: true, act: 1 },
    { t: 'Cancel the joint holiday', done: true, act: 2 },
    { t: 'Move the money before the 8th', done: true, act: 2 },
    { t: 'Return the spade to the shed', done: true, act: 4, flag: true },
    { t: 'Change the story if anyone asks', done: false, act: 4, flag: true },
    { t: 'Delete the cloud backup', done: false, act: 3, flag: true },
  ].filter((x) => x.act <= state.act)
  return (
    <AppFrame title="Reminders">
      <ul className="px-2 py-2">
        {items.map((x, i) => (
          <li key={i} className="flex items-center gap-3 px-3 py-3">
            <span className={`flex h-5 w-5 items-center justify-center rounded-full border ${x.done ? 'border-sky-500 bg-sky-500 text-[11px] text-white' : 'border-white/30'}`}>
              {x.done ? '✓' : ''}
            </span>
            <span className={`text-[15px] ${x.done ? 'text-white/40 line-through' : x.flag ? 'text-amber-300' : 'text-white'}`}>{x.t}</span>
          </li>
        ))}
      </ul>
    </AppFrame>
  )
}

// --- Podcasts --------------------------------------------------------------
export function Podcasts() {
  return (
    <AppFrame title="Podcasts">
      <div className="px-4 py-4">
        <div className="mb-5 flex items-center gap-4 rounded-2xl bg-white/5 p-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-fuchsia-800 text-3xl">🎧</div>
          <div>
            <div className="text-[15px] font-semibold text-white">Gone Cold</div>
            <div className="text-[12px] text-white/45">True crime · subscribed</div>
          </div>
        </div>
        <div className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-white/40">Recent episodes</div>
        <ul className="divide-y divide-white/5 text-[14px]">
          {[
            'Ep. 112 — “When there’s no body”',
            'Ep. 111 — How killers explain the missing days',
            'Ep. 110 — Insurance, motive, and the perfect alibi',
            'Ep. 109 — The partner is always the first suspect',
          ].map((e) => (
            <li key={e} className="flex items-center gap-3 py-3 text-white/85">
              <span className="text-white/30">▶</span>
              {e}
            </li>
          ))}
        </ul>
        <p className="mt-3 px-1 text-[11px] text-white/30">Listened: all four, in the week before Saturday.</p>
      </div>
    </AppFrame>
  )
}
