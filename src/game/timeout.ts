// Pure (no React/DOM) timeout logic for Secret Ending B, so it can be unit-
// tested by scripts/validate.ts without a bundler.

import type { GameState } from './types'

export const REAL_TIMEOUT_MS = 90 * 60 * 1000 // 90 real minutes (production)

/** Dev/test override: localStorage 'vera_timeout_ms' = a small number of ms. */
export function timeoutThresholdMs(): number {
  try {
    if (typeof localStorage !== 'undefined') {
      const o = Number(localStorage.getItem('vera_timeout_ms'))
      if (Number.isFinite(o) && o > 0) return o
    }
  } catch {
    /* ignore */
  }
  return REAL_TIMEOUT_MS
}

/** Should the "TOO SLOW" timeout ending fire? */
export function shouldTimeout(
  state: Pick<GameState, 'playedMs' | 'finished' | 'endingStarted' | 'phoneUnlocked'>,
  thresholdMs: number,
): boolean {
  return state.phoneUnlocked && !state.finished && !state.endingStarted && state.playedMs >= thresholdMs
}
