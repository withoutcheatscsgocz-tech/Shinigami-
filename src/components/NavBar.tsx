// The bottom home indicator. Tapping it (or swiping it up) goes to the home
// screen, mimicking the gesture bar on a modern phone.

import { useShell } from '../ui/shell'

export function NavBar() {
  const { goHome, view } = useShell()
  if (view === 'lock') return null
  return (
    <div className="relative z-30 flex h-6 shrink-0 items-end justify-center pb-1.5">
      <button
        aria-label="Home"
        onClick={goHome}
        className="h-1.5 w-32 rounded-full bg-white/80 active:bg-white/50"
      />
    </div>
  )
}
