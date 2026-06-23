// Root composition: the phone shell. Renders the status bar, the current view
// (lock / home / an app), the bottom nav indicator, and notification banners.

import { useGame } from './game/state'
import { useShell } from './ui/shell'
import { useEvents } from './game/useEvents'
import { useDeviceSim } from './game/deviceSim'
import { StatusBar } from './components/StatusBar'
import { NavBar } from './components/NavBar'
import { Banners } from './components/Banners'
import { Recents } from './components/Recents'
import { LockScreen } from './screens/LockScreen'
import { HomeScreen } from './screens/HomeScreen'
import { Ending } from './screens/Ending'
import { RevealBeat } from './screens/RevealBeat'
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
import { Files } from './apps/Files'
import { Mail } from './apps/Mail'
import { Clock, Health, Camera, Reminders, Podcasts } from './apps/ExtraApps'
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
    case 'files':
      return <Files />
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
    case 'mail':
      return <Mail />
    case 'clock':
      return <Clock />
    case 'health':
      return <Health />
    case 'camera':
      return <Camera />
    case 'reminders':
      return <Reminders />
    case 'podcasts':
      return <Podcasts />
    default:
      return <Placeholder id={id} />
  }
}

export default function App() {
  const { state, triggerTwist } = useGame()
  const { view, goHome } = useShell()
  useEvents()

  const onLock = view === 'lock' || !state.phoneUnlocked

  // The point-of-no-return reveal: the instant Act 5 begins (the murder
  // recording has been played), take over the screen once with the reveal beat.
  if (state.act >= 5 && !state.endingStarted && !state.triggeredTwists.includes('reveal-beat')) {
    return (
      <>
        <RevealBeat
          onDone={() => {
            triggerTwist('reveal-beat')
            goHome()
          }}
        />
        <BrightnessOverlay />
      </>
    )
  }

  // The ending is a full takeover — no status bar, no nav, no escaping it.
  if (state.endingStarted) {
    return (
      <div className="phone-shell">
        <Ending />
        <BrightnessOverlay />
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
      <BrightnessOverlay />
    </div>
  )
}

// Simulated brightness: a black dimming layer over the whole shell. This only
// affects the game's own UI — it never changes the real device brightness.
function BrightnessOverlay() {
  const { brightness } = useDeviceSim()
  if (brightness >= 0.999) return null
  return (
    <div
      className="pointer-events-none absolute inset-0 z-[60] bg-black transition-opacity duration-200"
      style={{ opacity: 1 - brightness }}
    />
  )
}
