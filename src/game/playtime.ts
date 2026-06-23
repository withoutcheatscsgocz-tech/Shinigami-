// Real-time playtime tracking for Secret Ending B ("TOO SLOW").
//
// We accumulate actual elapsed play time (only while the tab/app is visible and
// the game is still in progress) into persisted GameState.playedMs, so it keeps
// counting across saved sessions. If it crosses the threshold before the player
// reaches the main ending, the timeout ending fires.

import { useEffect, useRef } from 'react'
import { useGame } from './state'
import { useShell } from '../ui/shell'
import { shouldTimeout, timeoutThresholdMs } from './timeout'

const TICK_MS = 5000

export function usePlaytime() {
  const { state, addPlaytime } = useGame()
  const { secretEnding, setSecretEnding } = useShell()
  const last = useRef<number>(Date.now())

  // Accumulate visible, in-progress time.
  useEffect(() => {
    last.current = Date.now()
    const id = window.setInterval(() => {
      const now = Date.now()
      const delta = now - last.current
      last.current = now
      const active =
        document.visibilityState === 'visible' &&
        state.phoneUnlocked &&
        !state.finished &&
        !state.endingStarted &&
        !secretEnding
      if (active && delta > 0 && delta < TICK_MS * 4) addPlaytime(delta)
    }, TICK_MS)
    return () => window.clearInterval(id)
  }, [state.phoneUnlocked, state.finished, state.endingStarted, secretEnding, addPlaytime])

  // Check the threshold at a sensible cadence (not mid-action millisecond IRQs).
  useEffect(() => {
    if (secretEnding) return
    if (shouldTimeout(state, timeoutThresholdMs())) setSecretEnding('timeout')
  }, [state, secretEnding, setSecretEnding])
}
