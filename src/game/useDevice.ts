// Real device signals: live clock + real battery level/charging state.
//
// The clock and battery are the core fourth-wall break — they must reflect the
// player's actual device. Everything degrades gracefully: if a source isn't
// available (e.g. desktop browser without the Battery API), we fall back to a
// believable value instead of crashing.

import { useEffect, useState } from 'react'
import { Capacitor } from '@capacitor/core'
import { Device } from '@capacitor/device'

export interface DeviceClock {
  /** Date object, updated every second. */
  now: Date
  hh: string
  mm: string
  /** "Monday, 21 June" style long date for the lock screen. */
  longDate: string
}

export function useClock(format24h = true): DeviceClock {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    // Align the first tick to the next second boundary, then tick each second.
    let interval: ReturnType<typeof setInterval>
    const timeout = setTimeout(() => {
      setNow(new Date())
      interval = setInterval(() => setNow(new Date()), 1000)
    }, 1000 - (Date.now() % 1000))
    return () => {
      clearTimeout(timeout)
      if (interval) clearInterval(interval)
    }
  }, [])

  let hours = now.getHours()
  if (!format24h) {
    hours = hours % 12
    if (hours === 0) hours = 12
  }
  const hh = format24h ? String(hours).padStart(2, '0') : String(hours)
  const mm = String(now.getMinutes()).padStart(2, '0')
  const longDate = now.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  return { now, hh, mm, longDate }
}

export interface BatteryState {
  /** 0–100, integer. */
  level: number
  charging: boolean
  /** True if we got a real reading (vs. fallback). */
  real: boolean
}

export function useBattery(): BatteryState {
  const [state, setState] = useState<BatteryState>({ level: 76, charging: false, real: false })

  useEffect(() => {
    let cancelled = false
    let webBattery: any = null
    let cleanupWeb: (() => void) | null = null
    let poll: ReturnType<typeof setInterval> | null = null

    async function readNative() {
      try {
        const info = await Device.getBatteryInfo()
        if (cancelled || info.batteryLevel == null) return false
        setState({
          level: Math.round(info.batteryLevel * 100),
          charging: !!info.isCharging,
          real: true,
        })
        return true
      } catch {
        return false
      }
    }

    async function setupWeb() {
      const nav = navigator as any
      if (typeof nav.getBattery !== 'function') return false
      try {
        const bat = await nav.getBattery()
        webBattery = bat
        const apply = () => {
          if (cancelled) return
          setState({ level: Math.round(bat.level * 100), charging: !!bat.charging, real: true })
        }
        apply()
        bat.addEventListener('levelchange', apply)
        bat.addEventListener('chargingchange', apply)
        cleanupWeb = () => {
          bat.removeEventListener('levelchange', apply)
          bat.removeEventListener('chargingchange', apply)
        }
        return true
      } catch {
        return false
      }
    }

    ;(async () => {
      if (Capacitor.isNativePlatform()) {
        const ok = await readNative()
        if (ok) {
          // Native has no battery events; poll every 30s.
          poll = setInterval(readNative, 30_000)
          return
        }
      }
      const webOk = await setupWeb()
      if (!webOk) {
        // No real source — keep the believable fallback already in state.
      }
    })()

    return () => {
      cancelled = true
      if (poll) clearInterval(poll)
      if (cleanupWeb) cleanupWeb()
      void webBattery
    }
  }, [])

  return state
}
