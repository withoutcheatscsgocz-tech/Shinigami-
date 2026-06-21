// Notification banners that slide down from the top of the screen, like a real
// push notification. Tapping one opens the related app.

import { useShell } from '../ui/shell'

export function Banners() {
  const { banners, dismissBanner, openApp } = useShell()
  if (banners.length === 0) return null
  return (
    <div className="pointer-events-none absolute inset-x-0 top-12 z-40 flex flex-col gap-2 px-3">
      {banners.map((b) => (
        <button
          key={b.id}
          onClick={() => {
            if (b.appId) openApp(b.appId)
            dismissBanner(b.id)
          }}
          className={`pointer-events-auto animate-slide-down-in rounded-2xl bg-zinc-800/80 px-4 py-3 text-left shadow-lg backdrop-blur-xl ${
            b.tone === 'creepy' ? 'ring-1 ring-red-500/40' : ''
          }`}
        >
          <div className="flex items-baseline justify-between">
            <span className="text-[13px] font-semibold text-white">{b.title}</span>
            <span className="text-[11px] text-white/50">now</span>
          </div>
          <p className={`mt-0.5 text-[13px] leading-snug text-white/85 ${b.tone === 'creepy' ? 'animate-flicker' : ''}`}>
            {b.body}
          </p>
        </button>
      ))}
    </div>
  )
}
