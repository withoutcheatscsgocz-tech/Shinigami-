// Settings: mostly cosmetic flavor, with one thing hiding in plain sight —
// "Assistant: VERA — On", with full access and "always listening", lit since the
// phone was first switched on. The later the act, the more its wording unsettles.

import { useState } from 'react'
import { AppFrame } from '../components/AppFrame'
import { useBattery } from '../game/useDevice'
import { useGame } from '../game/state'
import { caseData } from '../game/caseData'

type Pane = 'root' | 'assistant' | 'about' | 'reset'

export function Settings() {
  const { state, resetGame } = useGame()
  const battery = useBattery()
  const [pane, setPane] = useState<Pane>('root')

  if (pane === 'assistant') return <AssistantPane act={state.act} onBack={() => setPane('root')} />
  if (pane === 'about') return <AboutPane onBack={() => setPane('root')} />
  if (pane === 'reset') return <ResetPane onBack={() => setPane('root')} onReset={resetGame} />

  return (
    <AppFrame title="Settings">
      <div className="px-3 py-4">
        {/* account card */}
        <div className="mb-5 flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-zinc-500 to-zinc-700 text-lg font-semibold text-white">
            A
          </div>
          <div>
            <div className="text-[16px] font-semibold text-white">{caseData.meta.ownerName}</div>
            <div className="text-[12px] text-white/45">Apple/Google ID, iCloud, Media & Purchases</div>
          </div>
        </div>

        <Group>
          <Row icon="✈️" label="Airplane Mode" value="Off" />
          <Row icon="📶" label="Wi-Fi" value="Meridian_5G" />
          <Row icon="🔵" label="Bluetooth" value="On" />
          <Row icon="📱" label="Mobile Data" value="On" />
        </Group>

        <Group>
          <Row icon="🔋" label="Battery" value={`${battery.level}%${battery.charging ? ' ⚡' : ''}`} />
          <Row icon="🌙" label="Display & Brightness" value="" chevron />
          <Row icon="🔔" label="Notifications" value="" chevron />
          <Row icon="🔊" label="Sounds & Haptics" value="" chevron />
        </Group>

        <Group>
          <Row
            icon="🔵"
            label="Assistant"
            value="VERA · On"
            chevron
            onClick={() => setPane('assistant')}
            highlight={state.act >= 4}
          />
          <Row icon="🔒" label="Privacy & Security" value="" chevron />
          <Row icon="⚙️" label="General" value="" chevron onClick={() => setPane('about')} />
          <Row icon="🗑️" label="Transfer or Reset" value="" chevron onClick={() => setPane('reset')} />
        </Group>
      </div>
    </AppFrame>
  )
}

function AssistantPane({ act, onBack }: { act: number; onBack: () => void }) {
  return (
    <AppFrame title="Assistant" onBack={onBack}>
      <div className="px-4 py-5">
        <div className="mb-4 flex flex-col items-center gap-2">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 text-3xl">🔵</div>
          <div className="text-[17px] font-semibold text-white">VERA</div>
          <div className="text-[12px] text-white/45">Active since this device was first switched on</div>
        </div>

        <Group>
          <Row icon="" label="Assistant" value="On" />
          <Row icon="" label="Listen for “Hey VERA”" value="Always" highlight={act >= 4} />
          <Row icon="" label="Allow when Locked" value="On" />
        </Group>

        <div className="mb-1 mt-5 px-3 text-[12px] font-semibold uppercase tracking-wide text-white/40">Access</div>
        <Group>
          <Row icon="" label="Messages" value="Full" />
          <Row icon="" label="Photos" value="Full" />
          <Row icon="" label="Microphone" value="Always" highlight={act >= 4} />
          <Row icon="" label="Location" value="Always" highlight={act >= 4} />
          <Row icon="" label="Files & Deleted Items" value="Full" highlight={act >= 4} />
        </Group>

        {act >= 4 && (
          <p className="mt-5 px-3 text-[12px] leading-relaxed text-red-400/80">
            This assistant is currently active and has been recording context for this
            session. It cannot be disabled from this account.
          </p>
        )}
      </div>
    </AppFrame>
  )
}

function AboutPane({ onBack }: { onBack: () => void }) {
  return (
    <AppFrame title="About" onBack={onBack}>
      <div className="px-3 py-4">
        <Group>
          <Row icon="" label="Name" value="Adam’s Phone" />
          <Row icon="" label="Software Version" value="14.2" />
          <Row icon="" label="Model" value="Meridian X" />
          <Row icon="" label="Capacity" value="256 GB" />
          <Row icon="" label="Photos" value="1,204" />
          <Row icon="" label="Voice Memos" value="38" />
        </Group>
      </div>
    </AppFrame>
  )
}

function ResetPane({ onBack, onReset }: { onBack: () => void; onReset: () => void }) {
  const [confirm, setConfirm] = useState(false)
  return (
    <AppFrame title="Reset" onBack={onBack}>
      <div className="px-4 py-4">
        <p className="mb-4 text-[13px] text-white/50">
          This resets your <span className="font-semibold">game progress</span> only — it’s the
          out-of-game restart, not part of the story.
        </p>
        {!confirm ? (
          <button onClick={() => setConfirm(true)} className="w-full rounded-xl bg-red-600/90 py-3 text-[15px] font-semibold text-white active:opacity-80">
            Reset game progress
          </button>
        ) : (
          <div className="space-y-2">
            <p className="text-[13px] text-white/70">Are you sure? This wipes your save.</p>
            <button onClick={onReset} className="w-full rounded-xl bg-red-600 py-3 text-[15px] font-semibold text-white active:opacity-80">
              Yes, reset
            </button>
            <button onClick={() => setConfirm(false)} className="w-full rounded-xl bg-white/10 py-3 text-[15px] text-white active:opacity-80">
              Cancel
            </button>
          </div>
        )}
      </div>
    </AppFrame>
  )
}

function Group({ children }: { children: React.ReactNode }) {
  return <div className="mb-4 overflow-hidden rounded-2xl bg-white/5">{children}</div>
}

function Row({
  icon,
  label,
  value,
  chevron,
  onClick,
  highlight,
}: {
  icon: string
  label: string
  value: string
  chevron?: boolean
  onClick?: () => void
  highlight?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      className="flex w-full items-center gap-3 border-b border-white/5 px-4 py-3 text-left last:border-0 active:bg-white/5 disabled:active:bg-transparent"
    >
      {icon && <span className="text-lg">{icon}</span>}
      <span className={`flex-1 text-[15px] ${highlight ? 'text-red-300' : 'text-white'}`}>{label}</span>
      <span className={`text-[14px] ${highlight ? 'text-red-400' : 'text-white/45'}`}>{value}</span>
      {chevron && <span className="text-white/30">›</span>}
    </button>
  )
}
