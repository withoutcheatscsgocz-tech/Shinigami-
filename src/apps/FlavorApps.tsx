// Secondary apps that make the phone feel real and carry extra dual-reading
// clues: recent calls, banking (arc A + the after-disappearance transfer), the
// browser's search history (the coldest clues), music and weather.

import { AppFrame } from '../components/AppFrame'
import { useGame } from '../game/state'
import { fmtFull, fmtDate } from '../ui/format'

// --- Phone (recent calls) --------------------------------------------------
const CALLS = [
  { id: 'rc1', name: 'Paige Bennett', dir: 'missed', ts: '2026-06-10T14:02', act: 1 },
  { id: 'rc2', name: 'Mum', dir: 'missed', ts: '2026-06-09T17:28', act: 1 },
  { id: 'rc3', name: 'Clara ❤️', dir: 'outgoing', ts: '2026-06-06T22:50', act: 1 },
  { id: 'rc4', name: 'Tom Hayes', dir: 'incoming', ts: '2026-06-07T12:31', act: 2 },
  { id: 'rc5', name: 'No caller ID', dir: 'missed', ts: '2026-06-12T03:03', act: 4 },
  { id: 'rc6', name: 'DS Salter', dir: 'missed', ts: '2026-06-11T09:01', act: 3 },
]

export function Phone() {
  const { state } = useGame()
  const calls = CALLS.filter((c) => c.act <= state.act).sort((a, b) => (a.ts < b.ts ? 1 : -1))
  return (
    <AppFrame title="Recents">
      <ul className="divide-y divide-white/5">
        {calls.map((c) => (
          <li key={c.id} className="flex items-center gap-3 px-4 py-3">
            <span className="text-lg">{c.dir === 'missed' ? '📵' : c.dir === 'outgoing' ? '↗️' : '↘️'}</span>
            <div className="min-w-0 flex-1">
              <div className={`text-[15px] ${c.dir === 'missed' ? 'text-red-400' : 'text-white'}`}>{c.name}</div>
              <div className="text-[12px] text-white/40 capitalize">{c.dir} call</div>
            </div>
            <span className="text-[12px] text-white/40">{fmtDate(c.ts)}</span>
          </li>
        ))}
      </ul>
    </AppFrame>
  )
}

// --- Bank ------------------------------------------------------------------
const TX = [
  { id: 'b1', label: 'FitZone Membership', amt: -29.99, ts: '2026-06-12T09:00', act: 1 },
  { id: 'b2', label: 'Bella Pizza', amt: -18.5, ts: '2026-06-05T20:11', act: 1 },
  { id: 'b3', label: 'Transfer to T. Hayes — “Harlow”', amt: -4000, ts: '2026-05-20T22:40', act: 2, flag: 'A' },
  { id: 'b4', label: 'ATM withdrawal', amt: -500, ts: '2026-06-05T18:02', act: 2, flag: 'A' },
  { id: 'b7', label: 'Transfer to R. Doyle — “cards”', amt: -2250, ts: '2026-06-05T16:00', act: 2, flag: 'A' },
  { id: 'b5', label: 'Transfer to “Savings (new)”', amt: -11500, ts: '2026-06-08T07:14', act: 3, flag: 'T1' },
  { id: 'b6', label: 'Hardware Barn — tarpaulin, rope, bleach', amt: -64.2, ts: '2026-06-06T11:30', act: 4, flag: 'evidence' },
]

export function Bank() {
  const { state } = useGame()
  const tx = TX.filter((t) => t.act <= state.act).sort((a, b) => (a.ts < b.ts ? 1 : -1))
  return (
    <AppFrame title="Meridian Bank">
      <div className="px-4 py-4">
        <div className="mb-5 rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-900 p-4 text-white">
          <div className="text-[12px] opacity-70">Current account · ••• 4471</div>
          <div className="mt-2 text-3xl font-semibold tabular-nums">£2,140.61</div>
          <div className="text-[12px] opacity-70">Adam Vance</div>
        </div>
        <div className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-white/40">Transactions</div>
        <ul className="divide-y divide-white/5">
          {tx.map((t) => (
            <li key={t.id} className="flex items-center justify-between gap-3 py-3">
              <div className="min-w-0">
                <div className={`text-[14px] ${t.flag === 'evidence' ? 'text-red-300' : 'text-white'}`}>{t.label}</div>
                <div className="text-[12px] text-white/40">{fmtFull(t.ts)}</div>
              </div>
              <div className={`shrink-0 text-[15px] tabular-nums ${t.amt < 0 ? 'text-white' : 'text-emerald-400'}`}>
                {t.amt < 0 ? '-' : '+'}£{Math.abs(t.amt).toLocaleString('en-GB', { minimumFractionDigits: 2 })}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </AppFrame>
  )
}

// --- Browser (search history — the coldest clues) --------------------------
const HISTORY = [
  { id: 'h1', q: 'maple drive sold prices', ts: '2026-05-26T14:00', act: 1 },
  { id: 'h2', q: 'romantic cabins to rent blackmoor', ts: '2026-06-02T21:00', act: 2 },
  { id: 'h8', q: 'what happens if you can’t pay a gambling debt uk', ts: '2026-05-15T23:50', act: 2, dark: true },
  { id: 'h9', q: 'recover deleted whatsapp messages android', ts: '2026-05-17T22:30', act: 2, dark: true },
  { id: 'h3', q: 'how to track a phone without them knowing', ts: '2026-05-18T23:30', act: 2, dark: true },
  { id: 'h10', q: 'ashford to manchester coach times sunday', ts: '2026-06-06T09:00', act: 3, dark: true },
  { id: 'h4', q: 'can you delete an icloud backup permanently', ts: '2026-06-07T04:00', act: 3, dark: true },
  { id: 'h5', q: 'blackmoor quarry how deep', ts: '2026-06-06T10:40', act: 4, dark: true },
  { id: 'h6', q: 'how long until a missing person is declared dead', ts: '2026-06-09T02:10', act: 4, dark: true },
  { id: 'h7', q: 'does a factory reset erase everything for good', ts: '2026-06-13T02:30', act: 5, dark: true },
]

export function Browser() {
  const { state } = useGame()
  const items = HISTORY.filter((h) => h.act <= state.act).sort((a, b) => (a.ts < b.ts ? 1 : -1))
  return (
    <AppFrame title="History">
      <div className="px-4 py-3">
        <div className="mb-3 rounded-full bg-white/10 px-4 py-2 text-[14px] text-white/45">Search or enter address</div>
        <div className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-white/40">Recent searches</div>
        <ul className="divide-y divide-white/5">
          {items.map((h) => (
            <li key={h.id} className="flex items-center gap-3 py-3">
              <span className="text-white/30">🔍</span>
              <div className="min-w-0 flex-1">
                <div className={`text-[14px] ${h.dark ? 'text-red-300' : 'text-white/90'}`}>{h.q}</div>
                <div className="text-[12px] text-white/35">{fmtFull(h.ts)}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </AppFrame>
  )
}

// --- Music -----------------------------------------------------------------
export function Music() {
  return (
    <AppFrame title="Music">
      <div className="px-4 py-4">
        <div className="mb-5 flex items-center gap-4 rounded-2xl bg-white/5 p-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-red-700 text-3xl">🎵</div>
          <div>
            <div className="text-[15px] font-semibold text-white">our songs ❤️</div>
            <div className="text-[12px] text-white/45">Playlist · made by Clara · 42 songs</div>
          </div>
        </div>
        <div className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-white/40">Recently played</div>
        <ul className="divide-y divide-white/5 text-[14px] text-white/85">
          {['Don’t Leave — Wild Youth', 'Slow Hands', 'The Night We Met', 'Skinny Love', 'Heartless'].map((s) => (
            <li key={s} className="flex items-center gap-3 py-3">
              <span className="text-white/30">🎶</span>
              {s}
            </li>
          ))}
        </ul>
      </div>
    </AppFrame>
  )
}

// --- Weather ---------------------------------------------------------------
export function Weather() {
  return (
    <AppFrame title="Weather">
      <div className="px-4 py-4">
        <div className="mb-4 rounded-3xl bg-gradient-to-b from-sky-700 to-indigo-900 p-6 text-center text-white">
          <div className="text-[15px]">Ashford</div>
          <div className="text-6xl font-thin">12°</div>
          <div className="text-[14px] opacity-80">Rain · H:14° L:7°</div>
        </div>
        <ul className="divide-y divide-white/5">
          <li className="flex items-center justify-between py-3 text-white/85">
            <span>Ashford</span>
            <span>🌧️ 12°</span>
          </li>
          <li className="flex items-center justify-between py-3 text-white/60">
            <span>Blackmoor Woods <span className="text-white/30">· saved</span></span>
            <span>🌫️ 6°</span>
          </li>
        </ul>
      </div>
    </AppFrame>
  )
}
