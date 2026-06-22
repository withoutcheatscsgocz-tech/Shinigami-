// Secondary apps. These make the phone feel real and carry extra dual-reading
// clues. Each now has genuine interaction (list -> detail, playback, forecast)
// rather than a single static screen.

import { useEffect, useRef, useState } from 'react'
import { AppFrame } from '../components/AppFrame'
import { useGame } from '../game/state'
import { useDeviceSim } from '../game/deviceSim'
import { fmtFull, fmtDate, fmtClock } from '../ui/format'
import { PlayGlyph, PauseGlyph } from '../ui/icons'
import { tap } from '../ui/haptics'

// ===========================================================================
// Phone (recent calls -> call detail)
// ===========================================================================
interface Call {
  id: string
  name: string
  dir: 'missed' | 'outgoing' | 'incoming'
  ts: string
  act: number
  seconds?: number
  number?: string
}
const CALLS: Call[] = [
  { id: 'rc1', name: 'Paige Bennett', dir: 'missed', ts: '2026-06-10T14:02', act: 1, number: '+44 7700 900204' },
  { id: 'rc2', name: 'Mum', dir: 'missed', ts: '2026-06-09T17:28', act: 1, number: '+44 7700 900700' },
  { id: 'rc3', name: 'Clara ❤️', dir: 'outgoing', ts: '2026-06-06T22:50', act: 1, seconds: 0, number: '+44 7700 900118' },
  { id: 'rc7', name: 'Ray (poker)', dir: 'incoming', ts: '2026-05-16T22:09', act: 2, seconds: 41, number: '+44 7700 900088' },
  { id: 'rc4', name: 'Tom Hayes', dir: 'incoming', ts: '2026-06-07T12:31', act: 2, seconds: 12, number: '+44 7700 900512' },
  { id: 'rc6', name: 'DS Salter', dir: 'missed', ts: '2026-06-11T09:01', act: 3, number: '+44 7700 900900' },
  { id: 'rc5', name: 'No caller ID', dir: 'missed', ts: '2026-06-12T03:03', act: 4, number: 'Withheld' },
]

export function Phone() {
  const { state } = useGame()
  const [sel, setSel] = useState<Call | null>(null)
  const calls = CALLS.filter((c) => c.act <= state.act).sort((a, b) => (a.ts < b.ts ? 1 : -1))

  if (sel) {
    return (
      <AppFrame title={sel.name} onBack={() => setSel(null)}>
        <div className="flex flex-col items-center gap-2 px-5 py-8">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-zinc-600 to-zinc-800 text-3xl">
            {sel.dir === 'missed' ? '📵' : '📞'}
          </div>
          <div className="text-[20px] font-semibold text-white">{sel.name}</div>
          <div className="text-[13px] text-white/45">{sel.number}</div>
        </div>
        <ul className="mx-4 overflow-hidden rounded-2xl bg-white/5 text-[14px]">
          <DetailRow k="Type" v={`${sel.dir[0].toUpperCase()}${sel.dir.slice(1)} call`} />
          <DetailRow k="When" v={fmtFull(sel.ts)} />
          <DetailRow
            k="Duration"
            v={sel.dir === 'missed' ? '—' : sel.seconds ? fmtClock(sel.seconds) : 'No answer'}
          />
        </ul>
      </AppFrame>
    )
  }

  return (
    <AppFrame title="Recents">
      <ul className="divide-y divide-white/5">
        {calls.map((c) => (
          <li key={c.id}>
            <button onClick={() => setSel(c)} className="flex w-full items-center gap-3 px-4 py-3 text-left active:bg-white/5">
              <span className="text-lg">{c.dir === 'missed' ? '📵' : c.dir === 'outgoing' ? '↗️' : '↘️'}</span>
              <div className="min-w-0 flex-1">
                <div className={`text-[15px] ${c.dir === 'missed' ? 'text-red-400' : 'text-white'}`}>{c.name}</div>
                <div className="text-[12px] capitalize text-white/40">{c.dir} call</div>
              </div>
              <span className="text-[12px] text-white/40">{fmtDate(c.ts)}</span>
              <span className="text-white/25">›</span>
            </button>
          </li>
        ))}
      </ul>
    </AppFrame>
  )
}

// ===========================================================================
// Bank (scrollable transactions -> transaction detail)
// ===========================================================================
interface Tx {
  id: string
  label: string
  amt: number
  ts: string
  act: number
  flag?: 'A' | 'T1' | 'evidence'
  category: string
  ref?: string
}
const TX: Tx[] = [
  { id: 'b1', label: 'FitZone Membership', amt: -29.99, ts: '2026-06-12T09:00', act: 1, category: 'Health & Fitness' },
  { id: 'b2', label: 'Bella Pizza', amt: -18.5, ts: '2026-06-05T20:11', act: 1, category: 'Eating out' },
  { id: 'b8', label: 'Salary — Meridian Realty', amt: 2850, ts: '2026-05-28T00:01', act: 1, category: 'Income' },
  { id: 'b9', label: 'Tesco Express', amt: -23.16, ts: '2026-06-04T18:40', act: 1, category: 'Groceries' },
  { id: 'b10', label: 'Shell — fuel', amt: -61.0, ts: '2026-06-06T10:02', act: 1, category: 'Transport' },
  { id: 'b11', label: 'StreamBox', amt: -9.99, ts: '2026-06-01T00:00', act: 1, category: 'Entertainment' },
  { id: 'b12', label: 'Costa Coffee', amt: -4.65, ts: '2026-06-05T08:14', act: 1, category: 'Eating out' },
  { id: 'b13', label: 'Rent — J. Okafor', amt: -1150, ts: '2026-06-04T12:00', act: 2, category: 'Housing' },
  { id: 'b3', label: 'Transfer to T. Hayes — “Harlow”', amt: -4000, ts: '2026-05-20T22:40', act: 2, flag: 'A', category: 'Transfer', ref: 'Harlow commission' },
  { id: 'b4', label: 'ATM withdrawal', amt: -500, ts: '2026-06-05T18:02', act: 2, flag: 'A', category: 'Cash' },
  { id: 'b7', label: 'Transfer to R. Doyle — “cards”', amt: -2250, ts: '2026-06-05T16:00', act: 2, flag: 'A', category: 'Transfer', ref: 'cards' },
  { id: 'b5', label: 'Transfer to “Savings (new)”', amt: -11500, ts: '2026-06-08T07:14', act: 3, flag: 'T1', category: 'Transfer', ref: 'new account ••• 8820' },
  { id: 'b6', label: 'Hardware Barn — tarpaulin, rope, bleach', amt: -64.2, ts: '2026-06-06T11:30', act: 4, flag: 'evidence', category: 'DIY' },
]

export function Bank() {
  const { state } = useGame()
  const [sel, setSel] = useState<Tx | null>(null)
  const tx = TX.filter((t) => t.act <= state.act).sort((a, b) => (a.ts < b.ts ? 1 : -1))

  if (sel) {
    return (
      <AppFrame title="Transaction" onBack={() => setSel(null)}>
        <div className="flex flex-col items-center gap-1 px-5 py-7">
          <div className={`text-4xl font-semibold tabular-nums ${sel.amt < 0 ? 'text-white' : 'text-emerald-400'}`}>
            {sel.amt < 0 ? '-' : '+'}£{Math.abs(sel.amt).toLocaleString('en-GB', { minimumFractionDigits: 2 })}
          </div>
          <div className={`text-[15px] ${sel.flag === 'evidence' ? 'text-red-300' : 'text-white/80'}`}>{sel.label}</div>
        </div>
        <ul className="mx-4 overflow-hidden rounded-2xl bg-white/5 text-[14px]">
          <DetailRow k="Date" v={fmtFull(sel.ts)} />
          <DetailRow k="Category" v={sel.category} />
          <DetailRow k="Status" v="Completed" />
          {sel.ref && <DetailRow k="Reference" v={sel.ref} />}
          <DetailRow k="Account" v="Current ••• 4471" />
        </ul>
      </AppFrame>
    )
  }

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
            <li key={t.id}>
              <button onClick={() => setSel(t)} className="flex w-full items-center justify-between gap-3 py-3 text-left active:bg-white/5">
                <div className="min-w-0">
                  <div className={`text-[14px] ${t.flag === 'evidence' ? 'text-red-300' : 'text-white'}`}>{t.label}</div>
                  <div className="text-[12px] text-white/40">{fmtFull(t.ts)}</div>
                </div>
                <div className={`shrink-0 text-[15px] tabular-nums ${t.amt < 0 ? 'text-white' : 'text-emerald-400'}`}>
                  {t.amt < 0 ? '-' : '+'}£{Math.abs(t.amt).toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </AppFrame>
  )
}

// ===========================================================================
// Browser (search history -> fake results page)
// ===========================================================================
interface Hist {
  id: string
  q: string
  ts: string
  act: number
  dark?: boolean
}
const HISTORY: Hist[] = [
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
  const { online } = useDeviceSim()
  const [sel, setSel] = useState<Hist | null>(null)
  const items = HISTORY.filter((h) => h.act <= state.act).sort((a, b) => (a.ts < b.ts ? 1 : -1))

  if (sel) {
    if (!online) {
      return (
        <AppFrame title={sel.q} onBack={() => setSel(null)}>
          <div className="flex h-full flex-col items-center justify-center gap-3 px-8 text-center text-white/50">
            <span className="text-5xl">📡</span>
            <p className="text-[15px] text-white/70">You’re offline</p>
            <p className="text-[13px]">Turn on WiFi or mobile data in Settings to load this page.</p>
          </div>
        </AppFrame>
      )
    }
    return (
      <AppFrame title="Results" onBack={() => setSel(null)}>
        <div className="px-4 py-3">
          <div className="mb-3 truncate rounded-full bg-white/10 px-4 py-2 text-[13px] text-white/60">🔍 {sel.q}</div>
          <p className="mb-3 text-[11px] text-white/35">About 1,240,000 results · last opened {fmtFull(sel.ts)}</p>
          {fakeResults(sel.q).map((r, i) => (
            <div key={i} className="mb-4">
              <div className="text-[12px] text-emerald-400/80">{r.url}</div>
              <div className="text-[15px] text-sky-300">{r.title}</div>
              <div className="text-[13px] leading-snug text-white/55">{r.snippet}</div>
            </div>
          ))}
        </div>
      </AppFrame>
    )
  }

  return (
    <AppFrame title="History">
      <div className="px-4 py-3">
        <div className="mb-3 rounded-full bg-white/10 px-4 py-2 text-[14px] text-white/45">Search or enter address</div>
        <div className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-white/40">Recent searches</div>
        <ul className="divide-y divide-white/5">
          {items.map((h) => (
            <li key={h.id}>
              <button onClick={() => setSel(h)} className="flex w-full items-center gap-3 py-3 text-left active:bg-white/5">
                <span className="text-white/30">🔍</span>
                <div className="min-w-0 flex-1">
                  <div className={`text-[14px] ${h.dark ? 'text-red-300' : 'text-white/90'}`}>{h.q}</div>
                  <div className="text-[12px] text-white/35">{fmtFull(h.ts)}</div>
                </div>
                <span className="text-white/25">›</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </AppFrame>
  )
}

function fakeResults(q: string): { url: string; title: string; snippet: string }[] {
  // Lightweight, believable SERP-style stubs themed to the query.
  const generic = [
    { url: 'www.gov.uk › guidance', title: q.replace(/^\w/, (c) => c.toUpperCase()), snippet: 'Official information and advice. Find out what your options are and where to get confidential support.' },
    { url: 'www.reddit.com › r/LegalAdviceUK', title: `[Serious] ${q}?`, snippet: 'I’m in a similar situation and could really use some advice. Has anyone been through this…' },
    { url: 'www.which.co.uk › advice', title: `${q} — explained`, snippet: 'Everything you need to know, step by step, with links to free helplines and services.' },
  ]
  return generic
}

// ===========================================================================
// Music (library + now playing with simulated progress)
// ===========================================================================
interface Track {
  id: string
  title: string
  artist: string
  seconds: number
}
const TRACKS: Track[] = [
  { id: 'mt1', title: 'The Night We Met', artist: 'Lord Huron', seconds: 208 },
  { id: 'mt2', title: 'Skinny Love', artist: 'Bon Iver', seconds: 238 },
  { id: 'mt3', title: 'Don’t Leave', artist: 'Wild Youth', seconds: 195 },
  { id: 'mt4', title: 'Slow Hands', artist: 'Niall Horan', seconds: 188 },
  { id: 'mt5', title: 'Heartless', artist: 'The Weeknd', seconds: 198 },
  { id: 'mt6', title: 'Lovely', artist: 'Billie Eilish', seconds: 200 },
  { id: 'mt7', title: 'Skin', artist: 'Rag’n’Bone Man', seconds: 224 },
]

export function Music() {
  const [now, setNow] = useState<Track | null>(null)
  if (now) return <NowPlaying track={now} onBack={() => setNow(null)} />

  return (
    <AppFrame title="Music">
      <div className="px-4 py-4">
        <button
          onClick={() => setNow(TRACKS[0])}
          className="mb-5 flex w-full items-center gap-4 rounded-2xl bg-white/5 p-4 text-left active:bg-white/10"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-red-700 text-3xl">🎵</div>
          <div>
            <div className="text-[15px] font-semibold text-white">our songs ❤️</div>
            <div className="text-[12px] text-white/45">Playlist · made by Clara · {TRACKS.length} songs</div>
          </div>
        </button>
        <div className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-white/40">Songs</div>
        <ul className="divide-y divide-white/5">
          {TRACKS.map((t) => (
            <li key={t.id}>
              <button onClick={() => setNow(t)} className="flex w-full items-center gap-3 py-3 text-left active:bg-white/5">
                <span className="text-white/30">🎶</span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[14px] text-white/90">{t.title}</div>
                  <div className="truncate text-[12px] text-white/45">{t.artist}</div>
                </div>
                <span className="text-[12px] tabular-nums text-white/35">{fmtClock(t.seconds)}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </AppFrame>
  )
}

function NowPlaying({ track, onBack }: { track: Track; onBack: () => void }) {
  const [elapsed, setElapsed] = useState(0)
  const [playing, setPlaying] = useState(true)
  const raf = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!playing) return
    raf.current = setInterval(() => {
      setElapsed((e) => (e + 1 >= track.seconds ? 0 : e + 1))
    }, 1000)
    return () => {
      if (raf.current) clearInterval(raf.current)
    }
  }, [playing, track.seconds])

  const progress = (elapsed / track.seconds) * 100

  return (
    <AppFrame title="Now Playing" onBack={onBack}>
      <div className="flex flex-col items-center px-6 py-6">
        <div className="mb-6 flex h-56 w-56 items-center justify-center rounded-3xl bg-gradient-to-br from-pink-500 via-rose-600 to-red-800 text-7xl shadow-xl">
          🎵
        </div>
        <div className="w-full text-center">
          <div className="text-[20px] font-semibold text-white">{track.title}</div>
          <div className="text-[14px] text-white/50">{track.artist}</div>
        </div>
        <div className="mt-6 w-full">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/15">
            <div className="h-full bg-white" style={{ width: `${progress}%` }} />
          </div>
          <div className="mt-1 flex justify-between text-[11px] tabular-nums text-white/45">
            <span>{fmtClock(elapsed)}</span>
            <span>-{fmtClock(track.seconds - elapsed)}</span>
          </div>
        </div>
        <div className="mt-6 flex items-center gap-10 text-white">
          <span className="text-2xl opacity-60">⏮</span>
          <button
            onClick={() => {
              void tap()
              setPlaying((p) => !p)
            }}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-black active:opacity-80"
          >
            {playing ? <PauseGlyph className="h-7 w-7" /> : <PlayGlyph className="h-7 w-7 pl-1" />}
          </button>
          <span className="text-2xl opacity-60">⏭</span>
        </div>
      </div>
    </AppFrame>
  )
}

// ===========================================================================
// Weather (current + hourly + multi-day; Ashford & Blackmoor)
// ===========================================================================
interface Place {
  id: string
  name: string
  temp: number
  cond: string
  icon: string
  hi: number
  lo: number
  saved?: boolean
  note?: string
}
const PLACES: Place[] = [
  { id: 'ashford', name: 'Ashford', temp: 12, cond: 'Rain', icon: '🌧️', hi: 14, lo: 7 },
  { id: 'blackmoor', name: 'Blackmoor Woods', temp: 6, cond: 'Fog', icon: '🌫️', hi: 9, lo: 3, saved: true, note: 'Saved location' },
]
const HOURLY = [
  { t: 'Now', icon: '🌧️', temp: 12 },
  { t: '19', icon: '🌧️', temp: 11 },
  { t: '20', icon: '🌦️', temp: 10 },
  { t: '21', icon: '☁️', temp: 9 },
  { t: '22', icon: '🌫️', temp: 8 },
  { t: '23', icon: '🌫️', temp: 7 },
]
const DAILY = [
  { d: 'Mon', icon: '🌧️', hi: 14, lo: 7 },
  { d: 'Tue', icon: '🌦️', hi: 15, lo: 8 },
  { d: 'Wed', icon: '⛅', hi: 17, lo: 9 },
  { d: 'Thu', icon: '☀️', hi: 19, lo: 10 },
  { d: 'Fri', icon: '⛅', hi: 18, lo: 11 },
  { d: 'Sat', icon: '🌧️', hi: 13, lo: 8 },
  { d: 'Sun', icon: '🌫️', hi: 11, lo: 6 },
]

export function Weather() {
  const [place, setPlace] = useState<Place>(PLACES[0])
  return (
    <AppFrame title="Weather">
      <div className="px-4 py-4">
        <div className="mb-4 rounded-3xl bg-gradient-to-b from-sky-700 to-indigo-900 p-6 text-center text-white">
          <div className="text-[15px]">{place.name}</div>
          <div className="text-6xl font-thin">{place.temp}°</div>
          <div className="text-[14px] opacity-80">{place.cond} · H:{place.hi}° L:{place.lo}°</div>
        </div>

        {/* hourly */}
        <div className="mb-4 rounded-2xl bg-white/5 p-3">
          <div className="flex justify-between">
            {HOURLY.map((h) => (
              <div key={h.t} className="flex flex-col items-center gap-1 text-white/80">
                <span className="text-[11px] text-white/45">{h.t}</span>
                <span className="text-lg">{h.icon}</span>
                <span className="text-[12px] tabular-nums">{h.temp}°</span>
              </div>
            ))}
          </div>
        </div>

        {/* 7-day */}
        <div className="mb-4 overflow-hidden rounded-2xl bg-white/5">
          {DAILY.map((d) => (
            <div key={d.d} className="flex items-center justify-between border-b border-white/5 px-4 py-2.5 text-[14px] last:border-0">
              <span className="w-10 text-white/80">{d.d}</span>
              <span className="text-lg">{d.icon}</span>
              <span className="tabular-nums text-white/45">{d.lo}°</span>
              <span className="tabular-nums text-white">{d.hi}°</span>
            </div>
          ))}
        </div>

        {/* saved locations */}
        <div className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-white/40">Locations</div>
        <ul className="overflow-hidden rounded-2xl bg-white/5">
          {PLACES.map((p) => (
            <li key={p.id}>
              <button
                onClick={() => setPlace(p)}
                className={`flex w-full items-center justify-between border-b border-white/5 px-4 py-3 text-left last:border-0 active:bg-white/10 ${
                  place.id === p.id ? 'bg-white/5' : ''
                }`}
              >
                <span className="text-white/85">
                  {p.name}
                  {p.saved && <span className="ml-2 text-[11px] text-white/30">· saved</span>}
                </span>
                <span className="text-white/70">{p.icon} {p.temp}°</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </AppFrame>
  )
}

// shared little detail row -------------------------------------------------
function DetailRow({ k, v }: { k: string; v: string }) {
  return (
    <li className="flex items-center justify-between gap-3 border-b border-white/5 px-4 py-3 last:border-0">
      <span className="text-white/45">{k}</span>
      <span className="text-right text-white/90">{v}</span>
    </li>
  )
}
