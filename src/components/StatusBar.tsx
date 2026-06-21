// The phone status bar: live clock on the left, signal/wifi/real-battery on the
// right, with a dynamic island / pill in the middle. This is the core fourth-wall
// break — time and battery are the player's actual device, updated live.

import { useClock, useBattery } from '../game/useDevice'
import { SignalIcon, WifiIcon, BatteryIcon } from '../ui/icons'
import { useShell } from '../ui/shell'

export function StatusBar({ dark = false }: { dark?: boolean }) {
  const { hh, mm } = useClock()
  const battery = useBattery()
  const { glitching } = useShell()
  const color = dark ? 'text-black' : 'text-white'

  return (
    <div
      className={`relative z-30 flex h-11 shrink-0 items-center justify-between px-6 pt-1 text-[15px] font-semibold ${color} ${
        glitching ? 'animate-glitch' : ''
      }`}
    >
      <div className="tabular-nums tracking-tight">
        {hh}:{mm}
      </div>
      {/* dynamic island */}
      <div className="absolute left-1/2 top-2 h-7 w-28 -translate-x-1/2 rounded-full bg-black" />
      <div className="flex items-center gap-1.5">
        <SignalIcon className="h-3 w-4" />
        <WifiIcon className="h-3 w-4" />
        <BatteryIcon level={battery.level} charging={battery.charging} />
      </div>
    </div>
  )
}
