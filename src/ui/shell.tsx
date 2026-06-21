// Phone shell navigation: which "screen" is showing (lock / home / an app), the
// recent-apps (multitasking) stack, plus a lightweight notification queue that
// drops banners into the status bar.

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
  // --- recents / app switcher ---
  /** Apps the player has opened, most-recent first (ephemeral, like a real
   *  phone's recents — cleared on a full restart, not part of the save). */
  recents: AppId[]
  recentsOpen: boolean
  openRecents: () => void
  closeRecents: () => void
  /** Swipe a card away to "close" that app. */
  removeRecent: (app: AppId) => void
  clearRecents: () => void
}

const Ctx = createContext<ShellCtx | null>(null)

export function ShellProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<View>('lock')
  const [banners, setBanners] = useState<Banner[]>([])
  const [glitching, setGlitching] = useState(false)
  const [recents, setRecents] = useState<AppId[]>([])
  const [recentsOpen, setRecentsOpen] = useState(false)

  const openApp = useCallback((app: AppId) => {
    setRecentsOpen(false)
    setView(app)
    // Move the app to the front of the recents stack (dedup).
    setRecents((prev) => [app, ...prev.filter((a) => a !== app)])
  }, [])

  const goHome = useCallback(() => {
    setRecentsOpen(false)
    setView('home')
  }, [])

  const goLock = useCallback(() => {
    setRecentsOpen(false)
    setView('lock')
  }, [])

  const openRecents = useCallback(() => {
    // Nothing to show if no app has ever been opened.
    setRecents((prev) => {
      if (prev.length > 0) setRecentsOpen(true)
      return prev
    })
  }, [])

  const closeRecents = useCallback(() => setRecentsOpen(false), [])

  const removeRecent = useCallback((app: AppId) => {
    setRecents((prev) => {
      const next = prev.filter((a) => a !== app)
      if (next.length === 0) setRecentsOpen(false)
      return next
    })
  }, [])

  const clearRecents = useCallback(() => {
    setRecents([])
    setRecentsOpen(false)
  }, [])

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
      value={{
        view,
        openApp,
        goHome,
        goLock,
        banners,
        pushBanner,
        dismissBanner,
        glitching,
        pulseGlitch,
        recents,
        recentsOpen,
        openRecents,
        closeRecents,
        removeRecent,
        clearRecents,
      }}
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
