// Recents / app switcher: a multitasking view of horizontally scrollable app
// "cards" (a stylised preview built from each app's icon, since the game ships
// no real screenshots). Tap a card to return to that app; swipe a card up to
// close it. Mirrors gesture-nav multitasking on a modern phone.

import { useRef, useState } from 'react'
import { useShell } from '../ui/shell'
import { APP_META } from '../ui/apps'
import type { AppId } from '../game/types'

export function Recents() {
  const { recentsOpen, recents, openApp, removeRecent, clearRecents, goHome } = useShell()
  if (!recentsOpen) return null

  return (
    <div className="absolute inset-0 z-40 flex flex-col bg-black/85 backdrop-blur-xl">
      {/* tap empty space to dismiss back to home */}
      <button className="absolute inset-0" aria-label="Close recents" onClick={goHome} />

      <div className="relative z-10 flex-1 overflow-hidden">
        <div className="no-scrollbar flex h-full items-center gap-4 overflow-x-auto px-8 pt-10">
          {recents.map((id) => (
            <RecentCard key={id} id={id} onOpen={() => openApp(id)} onClose={() => removeRecent(id)} />
          ))}
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center gap-3 pb-8">
        {recents.length > 1 && (
          <button
            onClick={clearRecents}
            className="rounded-full bg-white/15 px-5 py-2 text-[13px] font-medium text-white active:opacity-70"
          >
            Clear all
          </button>
        )}
        <span className="text-[12px] text-white/40">Swipe a card up to close · tap to open</span>
      </div>
    </div>
  )
}

function RecentCard({ id, onOpen, onClose }: { id: AppId; onOpen: () => void; onClose: () => void }) {
  const meta = APP_META[id]
  const [dy, setDy] = useState(0)
  const startY = useRef<number | null>(null)
  const dragging = useRef(false)

  function onPointerDown(e: React.PointerEvent) {
    startY.current = e.clientY
    dragging.current = false
    ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
  }
  function onPointerMove(e: React.PointerEvent) {
    if (startY.current == null) return
    const delta = e.clientY - startY.current
    if (Math.abs(delta) > 6) dragging.current = true
    // Only allow dragging upward (closing gesture).
    setDy(Math.min(0, delta))
  }
  function onPointerUp() {
    if (dy < -120) {
      onClose()
    } else if (!dragging.current) {
      onOpen()
    }
    setDy(0)
    startY.current = null
  }

  return (
    <div className="flex shrink-0 flex-col items-center gap-2">
      <div className="flex items-center gap-2">
        <div className={`flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br ${meta.bg} text-base`}>
          {meta.glyph}
        </div>
        <span className="text-[13px] font-medium text-white">{meta.label}</span>
      </div>
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        style={{ transform: `translateY(${dy}px)`, opacity: 1 + dy / 240 }}
        className="relative h-[460px] w-[230px] touch-none overflow-hidden rounded-3xl bg-zinc-900 shadow-2xl ring-1 ring-white/10"
      >
        {/* stylised preview */}
        <div className={`flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br ${meta.bg} opacity-90`}>
          <span className="text-7xl drop-shadow-lg">{meta.glyph}</span>
          <span className="text-[15px] font-semibold text-black/70">{meta.label}</span>
        </div>
      </div>
    </div>
  )
}
