// Minimal inline SVG icons so the phone UI ships no external assets.

type P = { className?: string }

export const SignalIcon = ({ className }: P) => (
  <svg viewBox="0 0 18 12" className={className} fill="currentColor" aria-hidden>
    <rect x="0" y="8" width="3" height="4" rx="1" />
    <rect x="5" y="5" width="3" height="7" rx="1" />
    <rect x="10" y="2.5" width="3" height="9.5" rx="1" />
    <rect x="15" y="0" width="3" height="12" rx="1" opacity="0.35" />
  </svg>
)

export const WifiIcon = ({ className }: P) => (
  <svg viewBox="0 0 18 14" className={className} fill="currentColor" aria-hidden>
    <path d="M9 2C5.5 2 2.4 3.3 0 5.4l1.6 1.8C3.6 5.4 6.1 4.3 9 4.3s5.4 1.1 7.4 2.9L18 5.4C15.6 3.3 12.5 2 9 2z" />
    <path d="M9 6.6c-2 0-3.9.7-5.3 2l1.7 1.9C6.3 9.6 7.6 9 9 9s2.7.6 3.6 1.5l1.7-1.9c-1.4-1.3-3.3-2-5.3-2z" />
    <circle cx="9" cy="12" r="1.6" />
  </svg>
)

export const BatteryIcon = ({ level, charging, className }: P & { level: number; charging: boolean }) => {
  const w = Math.max(2, Math.round((level / 100) * 20))
  const low = level <= 20 && !charging
  return (
    <span className={`relative inline-flex items-center ${className ?? ''}`}>
      <svg viewBox="0 0 28 13" className="h-3.5 w-7" aria-hidden>
        <rect x="0.5" y="0.5" width="24" height="12" rx="3" fill="none" stroke="currentColor" strokeOpacity="0.5" />
        <rect x="25.5" y="4" width="2" height="5" rx="1" fill="currentColor" fillOpacity="0.5" />
        <rect x="2" y="2" width={w} height="9" rx="1.5" fill={low ? '#ff453a' : 'currentColor'} />
      </svg>
      {charging && (
        <svg viewBox="0 0 24 24" className="absolute left-[7px] h-3 w-3 text-black" fill="currentColor">
          <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" />
        </svg>
      )}
    </span>
  )
}

export const ChevronLeft = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M15 18l-6-6 6-6" />
  </svg>
)

export const ChevronUp = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M18 15l-6-6-6 6" />
  </svg>
)

export const LockGlyph = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
    <path d="M12 1.5A4.5 4.5 0 007.5 6v3H6a2 2 0 00-2 2v9a2 2 0 002 2h12a2 2 0 002-2v-9a2 2 0 00-2-2h-1.5V6A4.5 4.5 0 0012 1.5zm0 2A2.5 2.5 0 0114.5 6v3h-5V6A2.5 2.5 0 0112 3.5z" />
  </svg>
)

export const PlayGlyph = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
    <path d="M8 5v14l11-7z" />
  </svg>
)

export const PauseGlyph = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
    <rect x="6" y="5" width="4" height="14" rx="1" />
    <rect x="14" y="5" width="4" height="14" rx="1" />
  </svg>
)
