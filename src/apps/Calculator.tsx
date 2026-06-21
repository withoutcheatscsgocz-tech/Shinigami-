// Calculator — a working calculator that is secretly a vault (classic trope).
// Typing the night-cab number (clue in Notes) and pressing "=" unlocks it.
// Inside: Clara's hidden recordings, including the Saturday night recording.
// Playing that recording satisfies the Act 4 gate.

import { useState } from 'react'
import { AppFrame } from '../components/AppFrame'
import { VoicePlayer } from '../components/VoicePlayer'
import { caseData } from '../game/caseData'
import { useGame } from '../game/state'
import type { VoiceMemo } from '../game/types'
import { tap } from '../ui/haptics'

const CALC_PW = caseData.passwords.find((p) => p.id === 'calc')!.value

export function Calculator() {
  const { state } = useGame()
  const unlocked = state.solvedPasswords.includes('calc')

  if (unlocked) return <Vault />
  return <CalcFace />
}

function CalcFace() {
  const { tryPassword } = useGame()
  const [display, setDisplay] = useState('0')
  const [acc, setAcc] = useState<number | null>(null)
  const [op, setOp] = useState<string | null>(null)
  const [fresh, setFresh] = useState(true)
  // Track the raw keyed digits so the secret code can be detected on "=".
  const [raw, setRaw] = useState('')

  function input(d: string) {
    void tap()
    setRaw((r) => (r + d).slice(-8))
    if (fresh || display === '0') {
      setDisplay(d)
      setFresh(false)
    } else {
      setDisplay((s) => (s.length < 12 ? s + d : s))
    }
  }

  function setOperator(o: string) {
    void tap()
    setAcc(parseFloat(display))
    setOp(o)
    setFresh(true)
    setRaw('')
  }

  function equals() {
    void tap()
    // Secret unlock: if the raw entry matches the code, open the vault.
    if (raw === CALC_PW) {
      tryPassword('calc', raw)
      return
    }
    if (op != null && acc != null) {
      const b = parseFloat(display)
      let r = acc
      if (op === '+') r = acc + b
      if (op === '−') r = acc - b
      if (op === '×') r = acc * b
      if (op === '÷') r = b === 0 ? NaN : acc / b
      setDisplay(String(Number.isFinite(r) ? +r.toFixed(6) : 'Error'))
      setAcc(null)
      setOp(null)
      setFresh(true)
    }
    setRaw('')
  }

  function clear() {
    void tap()
    setDisplay('0')
    setAcc(null)
    setOp(null)
    setFresh(true)
    setRaw('')
  }

  const keys: { label: string; kind?: 'op' | 'fn' | 'eq'; on: () => void }[] = [
    { label: 'AC', kind: 'fn', on: clear },
    { label: '±', kind: 'fn', on: () => setDisplay((d) => String(-parseFloat(d))) },
    { label: '%', kind: 'fn', on: () => setDisplay((d) => String(parseFloat(d) / 100)) },
    { label: '÷', kind: 'op', on: () => setOperator('÷') },
    { label: '7', on: () => input('7') },
    { label: '8', on: () => input('8') },
    { label: '9', on: () => input('9') },
    { label: '×', kind: 'op', on: () => setOperator('×') },
    { label: '4', on: () => input('4') },
    { label: '5', on: () => input('5') },
    { label: '6', on: () => input('6') },
    { label: '−', kind: 'op', on: () => setOperator('−') },
    { label: '1', on: () => input('1') },
    { label: '2', on: () => input('2') },
    { label: '3', on: () => input('3') },
    { label: '+', kind: 'op', on: () => setOperator('+') },
    { label: '0', on: () => input('0') },
    { label: '.', on: () => input('.') },
    { label: '=', kind: 'eq', on: equals },
  ]

  return (
    <AppFrame title="Calculator">
      <div className="flex h-full flex-col justify-end p-4">
        <div className="mb-3 px-2 text-right text-6xl font-light tabular-nums text-white">{display}</div>
        <div className="grid grid-cols-4 gap-3">
          {keys.map((k, i) => (
            <button
              key={i}
              onClick={k.on}
              className={`flex h-[72px] items-center justify-center rounded-full text-2xl active:opacity-70 ${
                k.label === '0' ? 'col-span-2 justify-start pl-8' : ''
              } ${
                k.kind === 'op' || k.kind === 'eq'
                  ? 'bg-amber-500 text-white'
                  : k.kind === 'fn'
                    ? 'bg-zinc-500 text-black'
                    : 'bg-zinc-700 text-white'
              }`}
            >
              {k.label}
            </button>
          ))}
        </div>
      </div>
    </AppFrame>
  )
}

function Vault() {
  const { state, playVoicemail } = useGame()
  const [memo, setMemo] = useState<VoiceMemo | null>(null)

  // Locked memos (the hidden recordings) become available here once unlocked.
  const memos = caseData.voicemails.filter((v) => v.locked)

  if (memo) {
    return (
      <AppFrame title={memo.title} onBack={() => setMemo(null)}>
        <VoicePlayer memo={memo} onFinished={() => playVoicemail(memo.id)} />
      </AppFrame>
    )
  }

  return (
    <AppFrame title="Recorder" subtitle="Hidden · 1 item">
      <div className="px-4 py-3">
        <div className="mb-4 rounded-xl bg-amber-500/10 p-3 text-[12px] text-amber-300/90">
          This isn’t Adam’s. It’s a recorder Clara installed in secret, disguised as
          a calculator. She was gathering proof.
        </div>
        <ul className="divide-y divide-white/5">
          {memos.map((v) => {
            const played = state.playedVoicemails.includes(v.id)
            return (
              <li key={v.id}>
                <button onClick={() => setMemo(v)} className="flex w-full items-center gap-3 py-3 text-left active:opacity-70">
                  {!played && <span className="h-2 w-2 shrink-0 rounded-full bg-red-500" />}
                  <span className="text-2xl">🎙️</span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[15px] font-semibold text-white">{v.title}</div>
                    <div className="text-[12px] text-white/45">{v.fromLabel}</div>
                  </div>
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </AppFrame>
  )
}
