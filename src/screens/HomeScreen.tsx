// Home screen: page indicator, app grid, search pill and the dock. Real-feeling
// layout so the player accepts it as their own phone before anything is wrong.

import { useShell } from '../ui/shell'
import { useGame } from '../game/state'
import { APP_META, DOCK_APPS, GRID_APPS, AppIcon } from '../ui/apps'
import { caseData } from '../game/caseData'
import type { AppId } from '../game/types'

export function HomeScreen() {
  const { openApp, glitching } = useShell()
  const { state } = useGame()

  // Unread badge for Messages = threads available this act not yet read.
  const unreadThreads = caseData.threads.filter(
    (t) => t.act <= state.act && !state.readThreads.includes(t.id),
  ).length

  function badgeFor(id: AppId): number | undefined {
    if (id === 'messages') return unreadThreads || undefined
    if (id === 'assistant') {
      const hasTask = caseData.assistantTasks.some((a) => a.act <= state.act)
      return hasTask ? 1 : undefined
    }
    return undefined
  }

  // Early-game nudge: in Act 1 only, gently pulse the apps the player should
  // look at first (Messages and the Assistant brief), so a fresh player isn't
  // lost. Disabled from Act 2 on to avoid hand-holding the rest of the game.
  function pulseFor(id: AppId): boolean {
    return state.act === 1 && (id === 'messages' || id === 'assistant')
  }

  return (
    <div
      className={`relative flex h-full flex-col bg-gradient-to-b from-indigo-950 via-zinc-950 to-black ${
        glitching ? 'animate-glitch' : ''
      }`}
    >
      {/* wallpaper glow */}
      <div className="pointer-events-none absolute -top-10 right-0 h-64 w-64 rounded-full bg-fuchsia-700/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-24 left-0 h-64 w-64 rounded-full bg-indigo-700/10 blur-3xl" />

      {/* app grid */}
      <div className="grid grid-cols-4 gap-y-5 px-5 pt-6">
        {GRID_APPS
          // The Files vault only "appears" once the case has cracked open
          // (Act 4+) — discovered after a milestone, not visible from the start.
          .filter((meta) => meta.id !== 'files' || state.act >= 4)
          .map((meta) => (
          <button
            key={meta.id}
            onClick={() => openApp(meta.id)}
            className="flex flex-col items-center gap-1 active:opacity-70"
          >
            <AppIcon meta={meta} badge={badgeFor(meta.id)} pulse={pulseFor(meta.id)} />
            <span className="text-[11px] font-medium text-white/90 drop-shadow">{meta.label}</span>
          </button>
        ))}
      </div>

      {/* page dots */}
      <div className="mt-auto mb-3 flex justify-center gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-white" />
        <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
      </div>

      {/* search pill */}
      <div className="mx-auto mb-3 w-fit rounded-full bg-white/15 px-4 py-1 text-[13px] text-white/70 backdrop-blur">
        Search
      </div>

      {/* dock */}
      <div className="mx-3 mb-2 rounded-[28px] bg-white/10 px-4 py-3 backdrop-blur-xl">
        <div className="flex justify-between">
          {DOCK_APPS.map((meta) => (
            <button
              key={meta.id}
              onClick={() => openApp(APP_META[meta.id].id)}
              className="active:opacity-70"
            >
              <AppIcon meta={meta} badge={badgeFor(meta.id)} pulse={pulseFor(meta.id)} />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
