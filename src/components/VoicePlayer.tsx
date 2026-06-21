// Voice memo player: a realistic playback UI (waveform, scrubber, elapsed time)
// that reveals the transcript line by line as it "plays". No real audio assets
// ship (see README); a faint synthesized tone plays under playback for presence.
// Glitched lines render as corrupted/inaudible.

import { useEffect, useRef, useState } from 'react'
import type { VoiceMemo } from '../game/types'
import { fmtClock, fmtFull } from '../ui/format'
import { PlayGlyph, PauseGlyph } from '../ui/icons'

export function VoicePlayer({ memo, onFinished }: { memo: VoiceMemo; onFinished?: () => void }) {
  const [elapsed, setElapsed] = useState(0)
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef<AudioContext | null>(null)
  const oscRef = useRef<{ osc: OscillatorNode; gain: GainNode } | null>(null)
  const finishedRef = useRef(false)

  const lineCount = memo.transcript.length
  // Map elapsed time onto transcript lines. Nothing is revealed until playback
  // actually starts, so the player has to listen.
  const started = playing || elapsed > 0
  const visibleLines = started ? Math.min(lineCount, Math.ceil((elapsed / memo.seconds) * lineCount + 0.001)) : 0

  function startTone() {
    try {
      audioRef.current ??= new (window.AudioContext || (window as any).webkitAudioContext)()
      const ctx = audioRef.current
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = memo.evidence ? 70 : 130
      gain.gain.value = 0.02
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      oscRef.current = { osc, gain }
    } catch {
      /* no audio */
    }
  }
  function stopTone() {
    try {
      oscRef.current?.osc.stop()
    } catch {
      /* ignore */
    }
    oscRef.current = null
  }

  useEffect(() => {
    if (!playing) return
    startTone()
    const id = setInterval(() => {
      setElapsed((e) => {
        if (e + 0.1 >= memo.seconds) {
          setPlaying(false)
          return memo.seconds
        }
        return e + 0.1
      })
    }, 100)
    return () => {
      clearInterval(id)
      stopTone()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing])

  useEffect(() => {
    if (elapsed >= memo.seconds && !finishedRef.current) {
      finishedRef.current = true
      onFinished?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elapsed])

  useEffect(() => () => stopTone(), [])

  function toggle() {
    if (elapsed >= memo.seconds) {
      setElapsed(0)
      finishedRef.current = false
      setPlaying(true)
    } else {
      setPlaying((p) => !p)
    }
  }

  const progress = Math.min(1, elapsed / memo.seconds)

  return (
    <div className="px-4 py-3">
      <div className="rounded-2xl bg-white/5 p-4">
        <div className="mb-1 text-[15px] font-semibold text-white">{memo.title}</div>
        <div className="mb-4 text-[12px] text-white/40">
          {memo.fromLabel} · {fmtFull(memo.ts)}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggle}
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
              memo.evidence ? 'bg-red-600' : 'bg-sky-600'
            } text-white active:opacity-80`}
            aria-label={playing ? 'Pause' : 'Play'}
          >
            {playing ? <PauseGlyph className="h-6 w-6" /> : <PlayGlyph className="h-6 w-6 pl-0.5" />}
          </button>
          <div className="flex-1">
            {/* fake waveform */}
            <div className="flex h-8 items-center gap-0.5 overflow-hidden">
              {Array.from({ length: 40 }).map((_, i) => {
                const active = i / 40 <= progress
                const h = 4 + Math.abs(Math.sin(i * 1.7)) * 22
                return (
                  <span
                    key={i}
                    className={`w-0.5 rounded-full ${active ? (memo.evidence ? 'bg-red-400' : 'bg-sky-400') : 'bg-white/20'} ${
                      playing && active && memo.evidence ? 'animate-flicker' : ''
                    }`}
                    style={{ height: `${h}px` }}
                  />
                )
              })}
            </div>
            <div className="mt-1 flex justify-between text-[11px] tabular-nums text-white/45">
              <span>{fmtClock(elapsed)}</span>
              <span>{fmtClock(memo.seconds)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* transcript */}
      <div className="mt-4 space-y-2">
        <div className="text-[11px] font-semibold uppercase tracking-wide text-white/35">Transcript</div>
        {visibleLines === 0 && <p className="text-[13px] italic text-white/30">Press play to listen.</p>}
        {memo.transcript.slice(0, visibleLines).map((line, i) => (
          <p
            key={i}
            className={`text-[14px] leading-relaxed ${
              line.glitch ? 'animate-flicker text-red-400/90 [font-family:monospace]' : 'text-white/85'
            }`}
          >
            {line.t}
          </p>
        ))}
        {playing && visibleLines < lineCount && <p className="text-[14px] text-white/30">···</p>}
      </div>
    </div>
  )
}
