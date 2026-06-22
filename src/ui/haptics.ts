// Thin haptics wrapper: Capacitor Haptics on device, the Vibration API on the
// web, silently no-op if neither is available.

import { Capacitor } from '@capacitor/core'
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics'

// In-game "Haptics" toggle (simulated setting). When off, all vibration is
// skipped. Defaults to on; set from the device-sim layer.
let enabled = true
export function setHapticsEnabled(on: boolean) {
  enabled = on
}

export async function tap(style: ImpactStyle = ImpactStyle.Light) {
  if (!enabled) return
  try {
    if (Capacitor.isNativePlatform()) await Haptics.impact({ style })
    else if (navigator.vibrate) navigator.vibrate(10)
  } catch {
    /* ignore */
  }
}

export async function error() {
  if (!enabled) return
  try {
    if (Capacitor.isNativePlatform()) await Haptics.notification({ type: NotificationType.Error })
    else if (navigator.vibrate) navigator.vibrate([40, 30, 40])
  } catch {
    /* ignore */
  }
}

export async function buzz(ms = 200) {
  if (!enabled) return
  try {
    if (Capacitor.isNativePlatform()) await Haptics.vibrate({ duration: ms })
    else if (navigator.vibrate) navigator.vibrate(ms)
  } catch {
    /* ignore */
  }
}
