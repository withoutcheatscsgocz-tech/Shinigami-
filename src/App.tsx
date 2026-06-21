// Root composition: the phone shell. Renders the status bar, the current view
// (lock / home / an app), the bottom nav indicator, and notification banners.

import { useGame } from './game/state'
import { useShell } from './ui/shell'
import { StatusBar } from './components/StatusBar'
import { NavBar } from './components/NavBar'
import { Banners } from './components/Banners'
import { LockScreen } from './screens/LockScreen'
import { HomeScreen } from './screens/HomeScreen'
import { Placeholder } from './apps/Placeholder'
import type { AppId } from './game/types'

function CurrentApp({ id }: { id: AppId }) {
  // Phase 4 replaces these with real app components.
  return <Placeholder id={id} />
}

export default function App() {
  const { state } = useGame()
  const { view } = useShell()

  const onLock = view === 'lock' || !state.phoneUnlocked

  return (
    <div className="phone-shell flex flex-col">
      {!onLock && <StatusBar />}
      <main className="relative flex-1 overflow-hidden">
        {onLock ? (
          <LockScreen />
        ) : view === 'home' ? (
          <HomeScreen />
        ) : (
          <CurrentApp id={view as AppId} />
        )}
        <Banners />
      </main>
      {!onLock && <NavBar />}
    </div>
  )
}
