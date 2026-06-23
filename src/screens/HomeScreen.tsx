// Home screen: two swipeable pages of apps (page dots reflect the current
// page), a persistent dock, attention pulses in Act 1, and a working Search
// that filters apps by name and launches them — like a real phone.

import { useMemo, useRef, useState } from 'react'
import { useShell } from '../ui/shell'
import { useGame } from '../game/state'
import { APP_META, DOCK_APPS, gridPage, ALL_APPS, AppIcon, type AppMeta } from '../ui/apps'
import { caseData } from '../game/caseData'
import type { AppId } from '../game/types'

export function HomeScreen() {
  const { openApp, glitching } = useShell()
  const { state } = useGame()
  const [page, setPage] = useState<0 | 1>(0)
  const [searching, setSearching] = useState(false)

  const unreadThreads = caseData.threads.filter(
    (t) => t.act <= state.act && !state.readThreads.includes(t.id),
  ).length

  function badgeFor(id: AppId): number | undefined {
    if (id === 'messages') return unreadThreads || undefined
    if (id === 'assistant') return caseData.assistantTasks.some((a) => a.act <= state.act) ? 1 : undefined
    if (id === 'mail') return state.act >= 4 ? 2 : 1
    return undefined
  }
  function pulseFor(id: AppId): boolean {
    return state.act === 1 && (id === 'messages' || id === 'assistant')
  }

  // Files only "appears" once the case cracks open (Act 4+).
  const visible = (m: AppMeta) => m.id !== 'files' || state.act >= 4
  const page1 = gridPage(1).filter(visible)
  const page2 = gridPage(2).filter(visible)

  // --- horizontal swipe between pages ---
  const startX = useRef<number | null>(null)
  const [dx, setDx] = useState(0)
  function onDown(e: React.PointerEvent) {
    startX.current = e.clientX
  }
  function onMove(e: React.PointerEvent) {
    if (startX.current != null) setDx(e.clientX - startX.current)
  }
  function onUp() {
    if (dx < -55 && page === 0) setPage(1)
    else if (dx > 55 && page === 1) setPage(0)
    setDx(0)
    startX.current = null
  }

  return (
    <div
      className={`relative flex h-full flex-col bg-gradient-to-b from-indigo-950 via-zinc-950 to-black ${
        glitching ? 'animate-glitch' : ''
      }`}
    >
      <div className="pointer-events-none absolute -top-10 right-0 h-64 w-64 rounded-full bg-fuchsia-700/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-24 left-0 h-64 w-64 rounded-full bg-indigo-700/10 blur-3xl" />

      {/* paged app grid */}
      <div
        className="relative flex-1 touch-none overflow-hidden"
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      >
        <div
          className="flex h-full w-[200%] transition-transform duration-300"
          style={{ transform: `translateX(calc(${page === 0 ? '0%' : '-50%'} + ${dx}px))` }}
        >
          <AppPage apps={page1} onOpen={openApp} badgeFor={badgeFor} pulseFor={pulseFor} />
          <AppPage apps={page2} onOpen={openApp} badgeFor={badgeFor} pulseFor={pulseFor} />
        </div>
      </div>

      {/* page dots (tappable) */}
      <div className="mb-3 flex justify-center gap-1.5">
        {[0, 1].map((p) => (
          <button
            key={p}
            onClick={() => setPage(p as 0 | 1)}
            className={`h-1.5 w-1.5 rounded-full ${page === p ? 'bg-white' : 'bg-white/40'}`}
            aria-label={`Page ${p + 1}`}
          />
        ))}
      </div>

      {/* search pill — opens the search overlay */}
      <button
        onClick={() => setSearching(true)}
        className="mx-auto mb-3 flex w-fit items-center gap-2 rounded-full bg-white/15 px-4 py-1 text-[13px] text-white/70 backdrop-blur active:opacity-70"
      >
        <span>🔍</span> Search
      </button>

      {/* dock */}
      <div className="mx-3 mb-2 rounded-[28px] bg-white/10 px-4 py-3 backdrop-blur-xl">
        <div className="flex justify-between">
          {DOCK_APPS.map((meta) => (
            <button key={meta.id} onClick={() => openApp(APP_META[meta.id].id)} className="active:opacity-70">
              <AppIcon meta={meta} badge={badgeFor(meta.id)} pulse={pulseFor(meta.id)} />
            </button>
          ))}
        </div>
      </div>

      {searching && (
        <SearchOverlay
          appsVisible={ALL_APPS.filter(visible)}
          onClose={() => setSearching(false)}
          onOpen={(id) => {
            setSearching(false)
            openApp(id)
          }}
        />
      )}
    </div>
  )
}

function AppPage({
  apps,
  onOpen,
  badgeFor,
  pulseFor,
}: {
  apps: AppMeta[]
  onOpen: (id: AppId) => void
  badgeFor: (id: AppId) => number | undefined
  pulseFor: (id: AppId) => boolean
}) {
  return (
    <div className="grid w-1/2 auto-rows-min grid-cols-4 gap-y-5 px-5 pt-6">
      {apps.map((meta) => (
        <button key={meta.id} onClick={() => onOpen(meta.id)} className="flex flex-col items-center gap-1 active:opacity-70">
          <AppIcon meta={meta} badge={badgeFor(meta.id)} pulse={pulseFor(meta.id)} />
          <span className="text-[11px] font-medium text-white/90 drop-shadow">{meta.label}</span>
        </button>
      ))}
    </div>
  )
}

function SearchOverlay({
  appsVisible,
  onClose,
  onOpen,
}: {
  appsVisible: AppMeta[]
  onClose: () => void
  onOpen: (id: AppId) => void
}) {
  const [q, setQ] = useState('')
  const results = useMemo(() => {
    const query = q.trim().toLowerCase()
    if (!query) return appsVisible
    return appsVisible.filter((a) => a.label.toLowerCase().includes(query))
  }, [q, appsVisible])

  return (
    <div className="absolute inset-0 z-40 flex flex-col bg-black/85 backdrop-blur-xl">
      <div className="flex items-center gap-2 px-3 pt-4">
        <div className="flex flex-1 items-center gap-2 rounded-full bg-white/15 px-4 py-2">
          <span className="text-white/50">🔍</span>
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search apps"
            className="selectable w-full bg-transparent text-[15px] text-white placeholder-white/40 outline-none"
          />
        </div>
        <button onClick={onClose} className="px-2 text-[15px] text-sky-400 active:opacity-60">
          Cancel
        </button>
      </div>

      <div className="no-scrollbar mt-3 flex-1 overflow-y-auto px-2 pb-6">
        {results.length === 0 ? (
          <p className="px-4 py-6 text-center text-[14px] text-white/40">No apps found for “{q}”.</p>
        ) : (
          <ul>
            {results.map((a) => (
              <li key={a.id}>
                <button onClick={() => onOpen(a.id)} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left active:bg-white/10">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-[10px] bg-gradient-to-br ${a.bg} text-xl`}>{a.glyph}</div>
                  <span className="text-[15px] text-white">{a.label}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
