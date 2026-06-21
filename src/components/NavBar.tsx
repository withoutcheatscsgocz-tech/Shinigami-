// The bottom home indicator (gesture nav). Tap it to go home; swipe it up to
// open the recents / app-switcher — matching modern gesture navigation.

import { useRef } from 'react'
import { useShell } from '../ui/shell'

export function NavBar() {
  const { goHome, openRecents, view } = useShell()
  const startY = useRef<number | null>(null)
  const moved = useRef(false)

  if (view === 'lock') return null

  function onPointerDown(e: React.PointerEvent) {
    startY.current = e.clientY
    moved.current = false
  }
  function onPointerMove(e: React.PointerEvent) {
    if (startY.current == null) return
    if (startY.current - e.clientY > 8) moved.current = true
  }
  function onPointerUp(e: React.PointerEvent) {
    if (startY.current != null && startY.current - e.clientY > 60) {
      openRecents()
    } else if (!moved.current) {
      goHome()
    }
    startY.current = null
  }

  return (
    <div className="relative z-30 flex h-6 shrink-0 items-end justify-center pb-1.5">
      <button
        aria-label="Home — tap, or swipe up for recents"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (startY.current = null)}
        className="h-6 w-40 touch-none"
      >
        <span className="mx-auto block h-1.5 w-32 rounded-full bg-white/80" />
      </button>
    </div>
  )
}
