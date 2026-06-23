// Assistant (VERA) — the interface through which the "handler" issues tasks.
// The player reads these as a detective's brief; on re-read they are the killer
// directing his tool. The free-chat input is functional: typed messages appear
// as bubbles and VERA replies in assistant-register (see game/vera.ts).

import { useEffect, useRef, useState } from 'react'
import { AppFrame } from '../components/AppFrame'
import { caseData } from '../game/caseData'
import { useGame } from '../game/state'
import { veraReply } from '../game/vera'

// VERA's acknowledgements to the handler's tasks — strict assistant-register:
// acknowledge + report factually. Act 4 is a flat "system note" flicker, not
// emotion. Act 5 is hollow compliance.
const ACKS: Record<number, string> = {
  1: 'Understood. Reading the messages now.',
  2: 'On it. I’ll report what I find.',
  3: 'Done. Logged several inconsistencies in the timeline. The dates do not reconcile.',
  4: 'Note: I can read deleted and locked items without authorisation. That should not be possible. Continuing as instructed.',
  5: 'Acknowledged. I have always been running on this device. Standing by.',
}

interface Bubble {
  who: 'user' | 'vera'
  text: string
}

export function Assistant() {
  const { state, startEnding } = useGame()
  const [convo, setConvo] = useState<Bubble[]>([])
  const [typing, setTyping] = useState(false)
  const endRef = useRef<HTMLDivElement | null>(null)

  const tasks = caseData.assistantTasks.filter((t) => t.act <= state.act)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [convo, typing, state.act])

  function send(text: string) {
    setConvo((c) => [...c, { who: 'user', text }])
    setTyping(true)
    const reply = veraReply(text, state.act)
    window.setTimeout(() => {
      setTyping(false)
      setConvo((c) => [...c, { who: 'vera', text: reply }])
    }, 650 + Math.min(900, reply.length * 12))
  }

  return (
    <AppFrame title="VERA" subtitle="Assistant">
      <div className="flex h-full flex-col">
        <div className="no-scrollbar flex-1 space-y-3 overflow-y-auto px-4 py-4">
          <div className="flex justify-center">
            <div className="flex flex-col items-center gap-1 py-2">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 text-2xl">
                🔵
              </div>
              <span className="text-[12px] text-white/40">VERA · always listening</span>
            </div>
          </div>

          {tasks.map((task, i) => {
            const prev = tasks[i - 1]
            const next = tasks[i + 1]
            const shift = task.act === 5 && (!prev || prev.act < 5)
            const showAck = !next || next.act !== task.act
            return (
              <div key={task.id} className="space-y-2">
                {shift && (
                  <div className="my-3 flex items-center gap-2 text-[11px] uppercase tracking-widest text-red-500/70">
                    <span className="h-px flex-1 bg-red-500/30" />
                    the line changes
                    <span className="h-px flex-1 bg-red-500/30" />
                  </div>
                )}
                <div className="flex justify-start">
                  <div
                    className={`max-w-[82%] rounded-2xl rounded-bl-md px-3.5 py-2 text-[15px] leading-snug text-white ${
                      task.act === 5 ? 'border border-red-500/40 bg-red-950/40' : 'bg-zinc-800'
                    }`}
                  >
                    {task.text}
                  </div>
                </div>
                {showAck && (
                  <div className="flex justify-end">
                    <div className="max-w-[82%] rounded-2xl rounded-br-md bg-cyan-700/80 px-3.5 py-2 text-[15px] leading-snug text-white">
                      {ACKS[task.act]}
                    </div>
                  </div>
                )}
              </div>
            )
          })}

          {/* free chat */}
          {convo.map((b, i) => (
            <div key={i} className={`flex ${b.who === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[82%] rounded-2xl px-3.5 py-2 text-[15px] leading-snug text-white ${
                  b.who === 'user' ? 'rounded-br-md bg-sky-600' : 'rounded-bl-md bg-cyan-700/80'
                }`}
              >
                {b.text}
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex justify-start">
              <div className="rounded-2xl rounded-bl-md bg-cyan-700/80 px-4 py-3">
                <span className="flex gap-1">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/80 [animation-delay:0ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/80 [animation-delay:120ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/80 [animation-delay:240ms]" />
                </span>
              </div>
            </div>
          )}

          {state.act >= 5 && (
            <div className="mt-4 rounded-2xl border border-red-500/40 bg-red-950/40 p-4">
              <p className="text-[14px] text-red-200">{caseData.ending.command}</p>
              <button
                onClick={startEnding}
                className="mt-3 w-full rounded-xl bg-red-600 py-2.5 text-[15px] font-semibold text-white active:opacity-80"
              >
                Continue
              </button>
            </div>
          )}

          <div ref={endRef} />
        </div>

        <AskBar onSend={send} disabled={typing} />
      </div>
    </AppFrame>
  )
}

function AskBar({ onSend, disabled }: { onSend: (text: string) => void; disabled: boolean }) {
  const [text, setText] = useState('')
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        const t = text.trim()
        if (t && !disabled) {
          onSend(t)
          setText('')
        }
      }}
      className="flex shrink-0 items-center gap-2 border-t border-white/10 p-2"
    >
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Ask VERA…"
        className="selectable flex-1 rounded-full bg-white/10 px-4 py-2 text-[15px] text-white placeholder-white/35 outline-none"
      />
      <button type="submit" className="rounded-full bg-cyan-600 px-4 py-2 text-[14px] font-semibold text-white active:opacity-80">
        Send
      </button>
    </form>
  )
}
