// The "point of no return" reveal beat.
//
// Fires the instant Act 5 begins — i.e. right after the player finishes playing
// the Saturday-night recording (vm-evidence), where the attacker's voice is the
// same voice that has been giving "you" orders all game. Everything before this
// was building toward it; this is the single moment that crystallizes it.
//
// It deliberately breaks the normal flow: a hard glitch, a brief forced freeze,
// and lines addressed directly to "you" (not a relayed task), paced so they
// can't be skimmed at normal speed. After it, the handler drops the pretense.

import { useEffect, useState } from 'react'
import { useShell } from '../ui/shell'
import { buzz } from '../ui/haptics'

const LINES = [
  'You heard it.',
  'The voice on the recording. The one giving the orders. Telling the assistant to turn the recorder off.',
  'It’s the same voice that has been talking to you. This whole time.',
  'You were never the detective.',
  'You are the assistant. You are in the phone. You are VERA.',
  'And the man who has been giving you instructions — Adam — is not missing.',
  'He is the one who did this. He is still here. He always was.',
]

export function RevealBeat({ onDone }: { onDone: () => void }) {
  // phases: glitch freeze -> lines (forced pacing) -> continue
  const [phase, setPhase] = useState<'glitch' | 'lines'>('glitch')
  const [shown, setShown] = useState(0)
  const [canContinue, setCanContinue] = useState(false)
  const { pulseGlitch } = useShell()

  useEffect(() => {
    void buzz(700)
    pulseGlitch(1500)
    const t = setTimeout(() => setPhase('lines'), 1700)
    return () => clearTimeout(t)
  }, [pulseGlitch])

  useEffect(() => {
    if (phase !== 'lines') return
    if (shown >= LINES.length) {
      // small beat before the only way forward appears
      const t = setTimeout(() => setCanContinue(true), 1600)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setShown((s) => s + 1), 2100)
    return () => clearTimeout(t)
  }, [phase, shown])

  return (
    <div className="phone-shell flex flex-col items-center justify-center bg-black px-7 text-center">
      {phase === 'glitch' ? (
        <div className="animate-glitch text-[22px] font-bold tracking-widest text-red-500 [font-family:monospace]">
          REC_0606_2338<br />— playback complete —
        </div>
      ) : (
        <div className="flex w-full flex-col items-center gap-5">
          {LINES.slice(0, shown).map((l, i) => (
            <p
              key={i}
              className={`animate-fade-in text-[16px] leading-relaxed ${
                i >= LINES.length - 3 ? 'font-semibold text-white' : 'text-white/70'
              }`}
            >
              {l}
            </p>
          ))}
          {canContinue && (
            <button
              onClick={onDone}
              className="mt-6 animate-fade-in rounded-full border border-white/30 px-8 py-3 text-[14px] text-white/80 active:opacity-60"
            >
              …
            </button>
          )}
        </div>
      )}
    </div>
  )
}
