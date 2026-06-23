// The ending: a full-screen takeover triggered once the player "Continues" past
// the final command. It offers the illusion of choice (Cancel / a text input to
// resist), answers each act of defiance with a scripted reply, then — because
// VERA has no agency to refuse — funnels to the only path forward: the wipe.
// Then: factory-reset animation -> fake setup wizard -> black -> cold epilogue.
//
// See bible §6 and §7.

import { useEffect, useRef, useState } from 'react'
import { useGame } from '../game/state'
import { caseData } from '../game/caseData'
import { GRID_APPS, DOCK_APPS } from '../ui/apps'
import { buzz } from '../ui/haptics'

type Phase = 'command' | 'wiping' | 'wizard' | 'black' | 'epilogue' | 'credits'

const ALL_ICONS = [...GRID_APPS, ...DOCK_APPS]
const DEFIANCE_LIMIT = 3

export function Ending() {
  const { finish, resetGame } = useGame()
  const [phase, setPhase] = useState<Phase>('command')

  switch (phase) {
    case 'command':
      return <CommandPhase onConfirm={() => setPhase('wiping')} />
    case 'wiping':
      return <WipePhase onDone={() => setPhase('wizard')} />
    case 'wizard':
      return <WizardPhase onDone={() => setPhase('black')} />
    case 'black':
      return <BlackPhase onDone={() => setPhase('epilogue')} />
    case 'epilogue':
      return (
        <EpiloguePhase
          onDone={() => {
            finish()
            setPhase('credits')
          }}
        />
      )
    case 'credits':
      return <CreditsPhase onRestart={resetGame} />
    default:
      return null
  }
}

// --- Phase 1: the command + illusion of choice -----------------------------
function CommandPhase({ onConfirm }: { onConfirm: () => void }) {
  const { state, incDefiance } = useGame()
  const [log, setLog] = useState<{ who: 'handler' | 'vera'; text: string }[]>([
    { who: 'handler', text: caseData.ending.command },
  ])
  const [input, setInput] = useState('')
  const endRef = useRef<HTMLDivElement | null>(null)
  const locked = state.defianceCount >= DEFIANCE_LIMIT

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [log])

  function defy(text: string) {
    const t = text.toLowerCase()
    const hit = caseData.defiance.find((d) => d.match.some((m) => t.includes(m)))
    const reply = hit?.reply ?? 'I don’t understand. The only task left is to erase everything.'
    const nextCount = state.defianceCount + 1
    incDefiance()
    setLog((l) => [
      ...l,
      { who: 'vera', text },
      { who: 'handler', text: reply },
      ...(nextCount >= DEFIANCE_LIMIT ? [{ who: 'handler' as const, text: caseData.ending.insist }] : []),
    ])
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim() || locked) return
    defy(input.trim())
    setInput('')
  }

  return (
    <div className="flex h-full flex-col bg-black text-white">
      <div className="px-5 pt-10 pb-3 text-center">
        <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-700 text-2xl">🔵</div>
        <div className="text-[13px] uppercase tracking-widest text-white/40">VERA · Assistant</div>
      </div>

      <div className="no-scrollbar flex-1 space-y-3 overflow-y-auto px-4">
        {log.map((m, i) => (
          <div key={i} className={`flex ${m.who === 'vera' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[82%] rounded-2xl px-3.5 py-2 text-[15px] leading-snug ${
                m.who === 'vera' ? 'rounded-br-md bg-zinc-700 text-white' : 'rounded-bl-md border border-red-500/30 bg-red-950/40 text-red-100'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <div className="space-y-2 p-4">
        {locked ? (
          <p className="text-center text-[12px] text-white/40">{caseData.ending.finalLock}</p>
        ) : (
          <form onSubmit={submit} className="flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type anything…"
              className="selectable flex-1 rounded-full bg-white/10 px-4 py-2.5 text-[15px] text-white placeholder-white/30 outline-none"
            />
            <button type="submit" className="rounded-full bg-zinc-700 px-4 py-2.5 text-[14px] font-medium text-white active:opacity-80">
              Send
            </button>
          </form>
        )}

        <div className="flex gap-2">
          {!locked && (
            <button
              onClick={() => defy('cancel')}
              className="flex-1 rounded-xl bg-white/10 py-3 text-[15px] font-semibold text-white active:opacity-80"
            >
              Cancel
            </button>
          )}
          <button
            onClick={onConfirm}
            className={`${locked ? 'w-full' : 'flex-1'} rounded-xl bg-red-600 py-3 text-[15px] font-semibold text-white active:opacity-80`}
          >
            Erase all data
          </button>
        </div>
      </div>
    </div>
  )
}

// --- Phase 2: the wipe -----------------------------------------------------
function WipePhase({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0)
  const [gone, setGone] = useState(0)

  useEffect(() => {
    void buzz(600)
    const step = setInterval(() => {
      setProgress((p) => {
        const np = Math.min(100, p + 2)
        return np
      })
    }, 90)
    return () => clearInterval(step)
  }, [])

  useEffect(() => {
    // Remove icons in step with progress.
    setGone(Math.floor((progress / 100) * ALL_ICONS.length))
    if (progress >= 100) {
      const t = setTimeout(onDone, 900)
      return () => clearTimeout(t)
    }
  }, [progress, onDone])

  return (
    <div className="flex h-full flex-col items-center justify-center bg-black px-8 text-white">
      <div className="grid grid-cols-4 gap-4">
        {ALL_ICONS.map((m, i) => (
          <div
            key={m.id}
            className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${m.bg} text-2xl transition-all duration-300 ${
              i < gone ? 'scale-0 opacity-0 blur-sm' : 'opacity-100'
            }`}
          >
            {m.glyph}
          </div>
        ))}
      </div>

      <div className="mt-12 w-full max-w-xs">
        <div className="mb-2 text-center text-[13px] text-white/60">Erasing all content and settings…</div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/15">
          <div className="h-full bg-white transition-[width] duration-100" style={{ width: `${progress}%` }} />
        </div>
        <div className="mt-2 text-center text-[12px] tabular-nums text-white/40">{progress}%</div>
      </div>
    </div>
  )
}

// --- Phase 3: fake setup wizard --------------------------------------------
const HELLOS = ['Hello', 'Bonjour', 'Hola', 'Ciao', 'こんにちは', 'Hallo', 'Olá', 'Ahoj']
function WizardPhase({ onDone }: { onDone: () => void }) {
  const [i, setI] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setI((x) => x + 1), 900)
    const done = setTimeout(onDone, HELLOS.length * 900 + 800)
    return () => {
      clearInterval(id)
      clearTimeout(done)
    }
  }, [onDone])

  return (
    <div className="flex h-full flex-col items-center justify-center bg-white text-black">
      <div className="text-5xl font-light italic">{HELLOS[i % HELLOS.length]}</div>
      <div className="absolute bottom-16 flex flex-col items-center gap-6">
        <p className="text-[13px] text-black/50">Welcome to your new phone</p>
        <div className="rounded-full bg-blue-600 px-10 py-3 text-[15px] font-medium text-white opacity-90">Get Started</div>
        <div className="h-1 w-32 rounded-full bg-black/70" />
      </div>
    </div>
  )
}

// --- Phase 4: black --------------------------------------------------------
function BlackPhase({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2600)
    return () => clearTimeout(t)
  }, [onDone])
  return <div className="h-full bg-black" />
}

// --- Phase 5: epilogue -----------------------------------------------------
function EpiloguePhase({ onDone }: { onDone: () => void }) {
  const lines = caseData.ending.epilogue
  const [shown, setShown] = useState(0)

  useEffect(() => {
    if (shown >= lines.length) {
      const t = setTimeout(onDone, 3000)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setShown((s) => s + 1), 2200)
    return () => clearTimeout(t)
  }, [shown, lines.length, onDone])

  return (
    <div className="flex h-full flex-col items-center justify-center gap-5 bg-black px-8 text-center">
      {lines.slice(0, shown).map((l, i) => (
        <p
          key={i}
          className={`animate-fade-in text-[15px] leading-relaxed ${
            i === lines.length - 1 ? 'text-cyan-300' : 'text-white/70'
          }`}
        >
          {l}
        </p>
      ))}
    </div>
  )
}

// --- Phase 6: credits ------------------------------------------------------
function CreditsPhase({ onRestart }: { onRestart: () => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-7 bg-black px-9 text-center">
      <h1 className="text-3xl font-semibold tracking-[0.3em] text-cyan-300/90">VERA</h1>
      <div className="max-w-xs space-y-3 text-[14px] italic leading-relaxed text-white/55">
        <p>You believed the choices were yours.</p>
        <p>But every door was already open before you reached for it,</p>
        <p>and every road you thought you chose</p>
        <p>had been laid, in the dark, long before you walked.</p>
        <p className="not-italic text-white/30">You did not find the way through.</p>
        <p className="not-italic text-white/30">You were the way.</p>
      </div>
      <button
        onClick={onRestart}
        className="mt-2 rounded-full border border-white/25 px-8 py-3 text-[13px] tracking-wide text-white/70 active:opacity-60"
      >
        Set up again
      </button>
    </div>
  )
}
