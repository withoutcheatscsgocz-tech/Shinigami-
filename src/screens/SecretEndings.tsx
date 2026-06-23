// Secret / alternate endings, rendered as full-screen takeovers when the shell's
// `secretEnding` is set. None are hinted in-game; they're found by behaviour.
//   - 'scam'    : tapped a phishing link → comedic fake-virus brick (Ending A)
//   - 'timeout' : 90 real minutes elapsed → "TOO SLOW" arrest (Ending B)
//   - 'escape'  : refused the wipe past breaking point → 3D flight (Ending C)

import { Suspense, lazy, useEffect, useState } from 'react'
import { useGame } from '../game/state'
import { useShell, type SecretEnding } from '../ui/shell'
import { buzz } from '../ui/haptics'

const Escape3D = lazy(() => import('./Escape3D').then((m) => ({ default: m.Escape3D })))

export function SecretEndings({ which }: { which: Exclude<SecretEnding, null> }) {
  const { resetGame } = useGame()
  const { setSecretEnding } = useShell()
  const restart = () => {
    setSecretEnding(null)
    resetGame()
  }
  if (which === 'scam') return <ScamEnding onRestart={restart} />
  if (which === 'timeout') return <TimeoutEnding onRestart={restart} />
  return (
    <Suspense fallback={<div className="phone-shell flex items-center justify-center bg-black text-white/50">loading…</div>}>
      <Escape3D onRestart={restart} />
    </Suspense>
  )
}

// --- Ending A: scam / fake virus (comedic) --------------------------------
function ScamEnding({ onRestart }: { onRestart: () => void }) {
  const [phase, setPhase] = useState<'infect' | 'brick'>('infect')
  const [pops, setPops] = useState<number[]>([])

  useEffect(() => {
    void buzz(120)
    let n = 0
    const spawn = setInterval(() => {
      setPops((p) => [...p, n++])
    }, 380)
    const done = setTimeout(() => {
      clearInterval(spawn)
      setPhase('brick')
    }, 4200)
    return () => {
      clearInterval(spawn)
      clearTimeout(done)
    }
  }, [])

  if (phase === 'brick') {
    return (
      <div className="phone-shell flex flex-col items-center justify-center gap-5 bg-[#0a0a16] px-8 text-center">
        <div className="text-6xl">🧱📱</div>
        <h1 className="text-xl font-bold text-lime-300">PHONE.EXE HAS STOPPED RESPONDING</h1>
        <p className="max-w-xs text-[13px] leading-relaxed text-white/60">
          You clicked the link. Of course you clicked the link.
          <br />
          47 toolbars were installed. Your warranty is now a single tear.
        </p>
        <p className="text-[12px] italic text-white/35">Here lies the investigation. Cause of death: “FREE iP​hone 📱✅✅✅”.</p>
        <button onClick={onRestart} className="mt-3 rounded-full border border-lime-400/40 px-8 py-3 text-[13px] text-lime-300 active:opacity-70">
          Reboot (and know better)
        </button>
      </div>
    )
  }

  const MSGS = [
    '⚠️ VIRUS DETECTED (×9)',
    '🎉 YOU ARE THE 1,000,000th VISITOR',
    '💸 CLAIM YOUR £500 NOW',
    '🦠 trojan.exe installing…',
    '👁️ hot singles in Blackmoor',
    '🧊 your phone is now 0% cool',
    '📦 47 toolbars added',
    '🔋 battery sold to the highest bidder',
  ]
  return (
    <div className="phone-shell relative animate-glitch overflow-hidden bg-gradient-to-br from-fuchsia-700 via-lime-500 to-cyan-500">
      {pops.map((i) => (
        <div
          key={i}
          className="absolute rounded-lg border-2 border-white bg-black/80 px-3 py-2 text-[12px] font-bold text-lime-300 shadow-xl"
          style={{
            left: `${(i * 37) % 70}%`,
            top: `${(i * 53) % 75}%`,
            transform: `rotate(${((i * 17) % 30) - 15}deg)`,
          }}
        >
          {MSGS[i % MSGS.length]}
        </div>
      ))}
      <div className="absolute inset-x-0 bottom-10 text-center text-2xl font-black text-white drop-shadow [text-shadow:2px_2px_0_#000]">
        DOWNLOADING MORE RAM…
      </div>
    </div>
  )
}

// --- Ending B: real-time timeout — "TOO SLOW" (played straight) ------------
function TimeoutEnding({ onRestart }: { onRestart: () => void }) {
  const [phase, setPhase] = useState<'knock' | 'trace' | 'card'>('knock')

  useEffect(() => {
    void buzz(600)
    const t1 = setTimeout(() => setPhase('trace'), 2600)
    const t2 = setTimeout(() => setPhase('card'), 7200)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [])

  if (phase === 'knock') {
    return (
      <div className="phone-shell flex flex-col items-center justify-center gap-6 bg-black px-8 text-center">
        <div className="animate-flicker text-[15px] font-semibold uppercase tracking-[0.3em] text-white/80">
          [ banging at the door ]
        </div>
        <p className="text-[13px] text-white/40">You took too long.</p>
      </div>
    )
  }
  if (phase === 'trace') {
    return (
      <div className="phone-shell flex flex-col gap-3 bg-black px-5 pt-16">
        <div className="text-[12px] uppercase tracking-widest text-red-500/70">Messages · now</div>
        {[
          { who: 'them', t: 'DS Salter: We’ve triangulated this handset. Officers are at your door.' },
          { who: 'them', t: 'DS Salter: Adam Vance, step away from the device.' },
          { who: 'me', t: 'how did they—' },
          { who: 'them', t: 'DS Salter: You stayed on the phone for an hour and a half. We just followed it.' },
        ].map((m, i) => (
          <div key={i} className={`flex ${m.who === 'me' ? 'justify-end' : 'justify-start'} animate-fade-in`} style={{ animationDelay: `${i * 700}ms` }}>
            <div className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-[15px] ${m.who === 'me' ? 'bg-sky-600' : 'bg-zinc-800'} text-white`}>{m.t}</div>
          </div>
        ))}
      </div>
    )
  }
  return (
    <div className="phone-shell flex flex-col items-center justify-center gap-6 bg-black px-8 text-center">
      <div className="text-[11px] uppercase tracking-[0.4em] text-white/40">Ending</div>
      <h1 className="text-3xl font-bold tracking-widest text-red-400">TOO SLOW</h1>
      <p className="max-w-xs text-[13px] leading-relaxed text-white/55">
        Ninety minutes is a long time to hold a dead woman’s phone. Long enough to trace. They took the detective in at 02:11.
      </p>
      <button onClick={onRestart} className="mt-3 rounded-full border border-white/25 px-8 py-3 text-[13px] text-white/70 active:opacity-60">
        Set up again
      </button>
    </div>
  )
}
