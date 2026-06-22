// Simulated, in-game-only device settings (brightness / connectivity / haptics).
//
// IMPORTANT: this is a SEPARATE layer from the REAL device data (the live clock
// and real battery %, which stay genuinely real — see useDevice.ts). Everything
// here is purely simulated and lives in ephemeral React state:
//   - it is NOT persisted (not written to Preferences/localStorage),
//   - it NEVER touches a real device setting (no real brightness/network APIs),
//   - it resets to defaults the moment the app is closed/reloaded.
// So nothing here can leak into or alter the player's actual phone.

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { setHapticsEnabled } from '../ui/haptics'

interface DeviceSim {
  /** 0.15 – 1.0; drives a dimming overlay over the whole UI (never the real screen). */
  brightness: number
  setBrightness: (v: number) => void
  wifi: boolean
  toggleWifi: () => void
  mobileData: boolean
  toggleMobileData: () => void
  haptics: boolean
  toggleHaptics: () => void
  /** Convenience: is the (simulated) phone online at all? */
  online: boolean
}

const Ctx = createContext<DeviceSim | null>(null)

export function DeviceSimProvider({ children }: { children: ReactNode }) {
  // Ephemeral defaults — recreated on every app launch, never stored.
  const [brightness, setBrightness] = useState(1)
  const [wifi, setWifi] = useState(true)
  const [mobileData, setMobileData] = useState(true)
  const [haptics, setHaptics] = useState(true)

  // Mirror the haptics toggle into the haptics module so vibration is actually
  // skipped when the player turns it off.
  useEffect(() => {
    setHapticsEnabled(haptics)
  }, [haptics])

  const value: DeviceSim = {
    brightness,
    setBrightness: (v) => setBrightness(Math.min(1, Math.max(0.15, v))),
    wifi,
    toggleWifi: () => setWifi((w) => !w),
    mobileData,
    toggleMobileData: () => setMobileData((m) => !m),
    haptics,
    toggleHaptics: () => setHaptics((h) => !h),
    online: wifi || mobileData,
  }

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useDeviceSim(): DeviceSim {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useDeviceSim must be used inside <DeviceSimProvider>')
  return ctx
}
