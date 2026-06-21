// A PIN/password entry sheet used for every lock in the game (photo album,
// hidden vault, locked recordings). The clue to each code lives elsewhere in
// the phone — see bible §6. Wrong code = shake + error haptic + tone.

import { useEffect, useRef, useState } from 'react'
import { useGame } from '../game/state'
import { LockGlyph } from '../ui/icons'
import { error as hapticError, tap } from '../ui/haptics'

interface Props {
  passwordId: string
  title: string
  hint?: string
  length?: number
  onSuccess: () => void
  onClose: () => void
}

export function PasswordModal({ passwordId, title, hint, length = 4, onSuccess, onClose }: Props) {
  const { tryPassword } = useGame()
  const [code, setCode] = useState('')
  const [wrong, setWrong] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const audioRef = useRef<AudioContext | null>(null)

  function beep(ok: boolean) {
    try {
      audioRef.current ??= new (window.AudioContext || (window as any).webkitAudioContext)()
      const ctx = audioRef.current
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.value = ok ? 880 : 160
      gain.gain.setValueAtTime(0.0001, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 0.01)
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + (ok ? 0.18 : 0.3))
      osc.start()
      osc.stop(ctx.currentTime + (ok ? 0.18 : 0.3))
    } catch {
      /* audio not available */
    }
  }

  useEffect(() => {
    if (code.length < length) return
    if (tryPassword(passwordId, code)) {
      beep(true)
      void tap()
      onSuccess()
    } else {
      beep(false)
      void hapticError()
      setWrong(true)
      setAttempts((a) => a + 1)
      const t = setTimeout(() => {
        setWrong(false)
        setCode('')
      }, 600)
      return () => clearTimeout(t)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code])

  function press(d: string) {
    void tap()
    setCode((c) => (c.length >= length ? c : c + d))
  }
  function del() {
    void tap()
    setCode((c) => c.slice(0, -1))
  }

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-end bg-black/80 backdrop-blur-md">
      <button className="absolute inset-0" aria-label="Close" onClick={onClose} />
      <div className="relative z-10 w-full animate-slide-up rounded-t-3xl bg-zinc-900 px-6 pb-8 pt-6 text-white">
        <div className="mb-1 flex flex-col items-center">
          <LockGlyph className="mb-2 h-6 w-6 text-white/70" />
          <h2 className="text-[17px] font-semibold">{title}</h2>
          {hint && <p className="mt-1 text-center text-[12px] text-white/45">{hint}</p>}
        </div>

        <div className={`my-5 flex justify-center gap-4 ${wrong ? 'animate-shake' : ''}`}>
          {Array.from({ length }).map((_, i) => (
            <span
              key={i}
              className={`h-3.5 w-3.5 rounded-full border ${
                i < code.length ? (wrong ? 'border-red-500 bg-red-500' : 'border-white bg-white') : 'border-white/40'
              }`}
            />
          ))}
        </div>
        {wrong && <p className="mb-2 text-center text-[12px] text-red-400">Wrong code. Try again.</p>}
        {attempts >= 3 && !wrong && (
          <p className="mb-2 text-center text-[12px] text-white/40">Hint: the answer is somewhere else on this phone.</p>
        )}

        <div className="mx-auto grid max-w-[280px] grid-cols-3 gap-3">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
            <KeypadKey key={d} onClick={() => press(d)}>
              {d}
            </KeypadKey>
          ))}
          <div />
          <KeypadKey onClick={() => press('0')}>0</KeypadKey>
          <KeypadKey onClick={del} faint>
            ⌫
          </KeypadKey>
        </div>
      </div>
    </div>
  )
}

function KeypadKey({ children, onClick, faint }: { children: React.ReactNode; onClick: () => void; faint?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`mx-auto flex h-[68px] w-[68px] items-center justify-center rounded-full text-2xl font-light active:bg-white/20 ${
        faint ? 'text-white/60' : 'bg-white/10 text-white'
      }`}
    >
      {children}
    </button>
  )
}
