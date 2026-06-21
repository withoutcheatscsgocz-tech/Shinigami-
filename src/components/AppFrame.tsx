// Shared chrome for an open app: a header bar (with optional back action and a
// title) and a scrollable content area. Apps compose their content inside it.

import type { ReactNode } from 'react'
import { useShell } from '../ui/shell'
import { ChevronLeft } from '../ui/icons'

interface Props {
  title: string
  /** Optional larger subtitle under the title. */
  subtitle?: string
  /** Right-aligned header accessory (buttons, etc.). */
  right?: ReactNode
  /** Override the back action (defaults to going home). */
  onBack?: () => void
  /** Header colour theme. */
  theme?: 'light' | 'dark'
  children: ReactNode
}

export function AppFrame({ title, subtitle, right, onBack, theme = 'dark', children }: Props) {
  const { goHome } = useShell()
  const isDark = theme === 'dark'
  return (
    <div className={`flex h-full flex-col ${isDark ? 'bg-black text-white' : 'bg-zinc-100 text-black'}`}>
      <header
        className={`flex shrink-0 items-center gap-1 px-2 py-2 ${
          isDark ? 'border-b border-white/10 bg-black' : 'border-b border-black/10 bg-zinc-100/90'
        } backdrop-blur`}
      >
        <button
          onClick={onBack ?? goHome}
          className={`flex items-center rounded-full px-1 py-1 ${isDark ? 'text-sky-400' : 'text-blue-600'} active:opacity-60`}
          aria-label="Back"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-[17px] font-semibold leading-tight">{title}</h1>
          {subtitle && <p className="truncate text-[12px] opacity-60">{subtitle}</p>}
        </div>
        {right && <div className="flex items-center gap-2 pr-1">{right}</div>}
      </header>
      <div className="no-scrollbar flex-1 overflow-y-auto overscroll-contain">{children}</div>
    </div>
  )
}
