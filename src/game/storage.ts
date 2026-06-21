// Persistence wrapper. Uses Capacitor Preferences when running inside the
// native app, and falls back to localStorage in the browser. Both are async so
// the calling code doesn't care which backend is active.

import { Preferences } from '@capacitor/preferences'
import { Capacitor } from '@capacitor/core'

const isNative = Capacitor.isNativePlatform()

export async function loadRaw(key: string): Promise<string | null> {
  try {
    if (isNative) {
      const { value } = await Preferences.get({ key })
      return value
    }
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

export async function saveRaw(key: string, value: string): Promise<void> {
  try {
    if (isNative) {
      await Preferences.set({ key, value })
    } else {
      localStorage.setItem(key, value)
    }
  } catch {
    /* best-effort: a failed save must never crash the game */
  }
}

export async function removeRaw(key: string): Promise<void> {
  try {
    if (isNative) {
      await Preferences.remove({ key })
    } else {
      localStorage.removeItem(key)
    }
  } catch {
    /* ignore */
  }
}
