// Phone shell navigation: which "screen" is showing (lock / home / an app),
// plus a lightweight notification queue that drops banners into the status bar.

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import type { AppId } from '../game/types'

export type View = 'lock' | 'home' | AppId

export interface Banner {
  id: string
  appId?: AppId
  title: string
  body: string
  /** 'creepy' banners get a subtle glitch treatment. */
  tone?: 'normal' | 'creepy'
}

interface ShellCtx {
  view: View
  openApp: (app: AppId) => void
  goHome: () => void
  goLock: () => void
  banners: Banner[]
  pushBanner: (b: Omit<Banner, 'id'>) => void
  dismissBanner: (id: string) => void
  /** Global glitch pulse toggled by scripted events. */
  glitching: boolean
  pulseGlitch: (ms?: number) => void
}

const Ctx = createContext<ShellCtx | null>(null)

export function ShellProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<View>('lock')
  const [banners, setBanners] = useState<Banner[]>([])
  const [glitching, setGlitching] = useState(false)

  const openApp = useCallback((app: AppId) => setView(app), [])
  const goHome = useCallback(() => setView('home'), [])
  const goLock = useCallback(() => setView('lock'), [])

  const pushBanner = useCallback((b: Omit<Banner, 'id'>) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    setBanners((prev) => [...prev, { ...b, id }])
    // Auto-dismiss after a while so the status bar doesn't fill up.
    setTimeout(() => setBanners((prev) => prev.filter((x) => x.id !== id)), 6500)
  }, [])

  const dismissBanner = useCallback(
    (id: string) => setBanners((prev) => prev.filter((x) => x.id !== id)),
    [],
  )

  const pulseGlitch = useCallback((ms = 350) => {
    setGlitching(true)
    setTimeout(() => setGlitching(false), ms)
  }, [])

  return (
    <Ctx.Provider
      value={{ view, openApp, goHome, goLock, banners, pushBanner, dismissBanner, glitching, pulseGlitch }}
    >
      {children}
    </Ctx.Provider>
  )
}

export function useShell(): ShellCtx {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useShell must be used inside <ShellProvider>')
  return ctx
}
