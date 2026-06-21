// Root composition: the phone shell. Renders the status bar, the current view
// (lock / home / an app), the bottom nav indicator, and notification banners.

import { useGame } from './game/state'
import { useShell } from './ui/shell'
import { useEvents } from './game/useEvents'
import { StatusBar } from './components/StatusBar'
import { NavBar } from './components/NavBar'
import { Banners } from './components/Banners'
import { Recents } from './components/Recents'
import { LockScreen } from './screens/LockScreen'
import { HomeScreen } from './screens/HomeScreen'
import { Ending } from './screens/Ending'
import { Placeholder } from './apps/Placeholder'
import { Messages } from './apps/Messages'
import { Photos } from './apps/Photos'
import { Notes } from './apps/Notes'
import { Voicemail } from './apps/Voicemail'
import { Calendar } from './apps/Calendar'
import { Maps } from './apps/Maps'
import { Calculator } from './apps/Calculator'
import { Assistant } from './apps/Assistant'
import { Settings } from './apps/Settings'
import { Phone, Bank, Browser, Music, Weather } from './apps/FlavorApps'
import type { AppId } from './game/types'

function CurrentApp({ id }: { id: AppId }) {
  switch (id) {
    case 'messages':
      return <Messages />
    case 'photos':
      return <Photos />
    case 'notes':
      return <Notes />
    case 'voicemail':
      return <Voicemail />
    case 'calendar':
      return <Calendar />
    case 'maps':
      return <Maps />
    case 'calculator':
      return <Calculator />
    case 'assistant':
      return <Assistant />
    case 'settings':
      return <Settings />
    case 'phone':
      return <Phone />
    case 'bank':
      return <Bank />
    case 'browser':
      return <Browser />
    case 'music':
      return <Music />
    case 'weather':
      return <Weather />
    default:
      return <Placeholder id={id} />
  }
}

export default function App() {
  const { state } = useGame()
  const { view } = useShell()
  useEvents()

  const onLock = view === 'lock' || !state.phoneUnlocked

  // The ending is a full takeover — no status bar, no nav, no escaping it.
  if (state.endingStarted) {
    return (
      <div className="phone-shell">
        <Ending />
      </div>
    )
  }

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
        {!onLock && <Recents />}
        <Banners />
      </main>
      {!onLock && <NavBar />}
    </div>
  )
}
