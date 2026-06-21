// Scripted event runner. Drives the timed/conditional notifications and glitches
// described in the bible: when an act begins, its onAct events fire (staggered);
// afterMs events fire on a timer relative to when the act started; and from Act 3
// on, an ambient "the phone does things on its own" glitch pulses occasionally.
//
// Fired events are recorded in game state so they never repeat, even across the
// persisted save.

import { useEffect, useRef } from 'react'
import { useGame } from './state'
import { useShell } from '../ui/shell'
import { caseData } from './caseData'
import type { AppId } from './types'

export function useEvents() {
  const { state, fireEvent } = useGame()
  const { pushBanner, pulseGlitch } = useShell()
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  // Fire act-entry + timed events whenever the active act changes.
  useEffect(() => {
    if (!state.phoneUnlocked) return
    const clearAll = () => {
      timers.current.forEach(clearTimeout)
      timers.current = []
    }

    const pending = caseData.events.filter((e) => !state.firedEvents.includes(e.id))

    for (const ev of pending) {
      const matchesAct = ev.onAct != null && ev.onAct === state.act
      const isTimed = ev.afterMs != null && (ev.onAct == null || ev.onAct <= state.act)
      if (!matchesAct && !isTimed) continue

      const delay = ev.afterMs ?? 1200 + Math.random() * 1800
      const t = setTimeout(() => {
        if (ev.kind === 'glitch') {
          pulseGlitch(450)
        } else {
          pushBanner({
            appId: ev.app as AppId | undefined,
            title: ev.title,
            body: ev.body,
            tone: ev.kind === 'assistant' || state.act >= 3 ? 'creepy' : 'normal',
          })
        }
        fireEvent(ev.id)
      }, delay)
      timers.current.push(t)
    }

    return clearAll
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.act, state.phoneUnlocked])

  // Ambient glitches from Act 3 onward — rare, unsettling, never blocking.
  useEffect(() => {
    if (state.act < 3 || !state.phoneUnlocked) return
    const id = setInterval(() => {
      // ~1 in 3 chance every interval so it stays unpredictable.
      if (Math.random() < 0.34) pulseGlitch(200 + Math.random() * 250)
    }, 22_000)
    return () => clearInterval(id)
  }, [state.act, state.phoneUnlocked, pulseGlitch])
}
