// Lock screen: the entry point. Real time + date, a couple of notifications
// that set up Act 1, and swipe-up to unlock. The handler's first message is
// shown as a notification so the player meets the "brief" before unlocking.

import { useRef, useState } from 'react'
import { useClock } from '../game/useDevice'
import { useGame } from '../game/state'
import { useShell } from '../ui/shell'
import { LockGlyph, ChevronUp } from '../ui/icons'
import { caseData } from '../game/caseData'

export function LockScreen() {
  const { hh, mm, longDate } = useClock()
  const { unlockPhone } = useGame()
  const { goHome } = useShell()
  const [drag, setDrag] = useState(0)
  const startY = useRef<number | null>(null)
  const moved = useRef(false)

  function unlock() {
    unlockPhone()
    goHome()
  }

  function onPointerDown(e: React.PointerEvent) {
    startY.current = e.clientY
    moved.current = false
  }
  function onPointerMove(e: React.PointerEvent) {
    if (startY.current == null) return
    const dy = startY.current - e.clientY
    if (Math.abs(dy) > 6) moved.current = true
    setDrag(Math.max(0, dy))
  }
  function onPointerUp() {
    // Unlock on a deliberate upward swipe, or on a simple tap (Act 1 has no PIN,
    // so tap-to-open is a forgiving fallback when gesture tracking is flaky).
    if (drag > 50 || !moved.current) unlock()
    setDrag(0)
    startY.current = null
    moved.current = false
  }

  return (
    <div
      className="relative flex h-full touch-none select-none flex-col bg-gradient-to-b from-zinc-900 via-black to-zinc-950 text-white"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={() => {
        setDrag(0)
        startY.current = null
        moved.current = false
      }}
      style={{ transform: `translateY(${-drag * 0.4}px)` }}
    >
      {/* faux wallpaper glow */}
      <div className="pointer-events-none absolute -top-20 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-700/20 blur-3xl" />

      <div className="mt-16 flex flex-col items-center">
        <LockGlyph className="mb-3 h-5 w-5 text-white/70" />
        <div className="text-[15px] font-medium text-white/80">{longDate}</div>
        <div className="mt-1 text-[80px] font-semibold leading-none tracking-tight tabular-nums">
          {hh}:{mm}
        </div>
      </div>

      {/* Act 1 brief, framed as a notification */}
      <div className="mt-10 space-y-2 px-4">
        <div className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-md">
          <div className="flex items-baseline justify-between">
            <span className="text-[13px] font-semibold">Messages</span>
            <span className="text-[11px] text-white/50">now</span>
          </div>
          <p className="mt-0.5 text-[13px] leading-snug text-white/90">
            <span className="font-medium">Unknown:</span> {caseData.assistantTasks[0].text}
          </p>
        </div>
        <div className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-md">
          <div className="flex items-baseline justify-between">
            <span className="text-[13px] font-semibold">{caseData.contacts.paige.name}</span>
            <span className="text-[11px] text-white/50">9:15</span>
          </div>
          <p className="mt-0.5 text-[13px] leading-snug text-white/90">
            Where is my sister. She’s not answering since Saturday
          </p>
        </div>
      </div>

      <div className="mt-auto flex flex-col items-center pb-10">
        <button onClick={unlock} className="flex flex-col items-center text-white/70 active:text-white">
          <ChevronUp className="h-6 w-6 animate-bounce" />
          <span className="text-[13px]">Swipe up to open</span>
        </button>
      </div>
    </div>
  )
}
