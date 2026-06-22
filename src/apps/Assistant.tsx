// Assistant (VERA) — the interface through which the "handler" issues tasks.
// The player reads these as a detective's brief; on re-read they are the
// killer directing his tool. Each act surfaces new instructions. Reaching Act 5
// turns this into the final forced-action prompt.

import { useEffect, useRef, useState } from 'react'
import { AppFrame } from '../components/AppFrame'
import { caseData } from '../game/caseData'
import { useGame } from '../game/state'

// Canned VERA acknowledgements, escalating with the act.
const ACKS: Record<number, string> = {
  1: 'Understood. I’ll go through it now.',
  2: 'Working on it. I’ll surface what I find.',
  3: 'Done. There are… inconsistencies. Dates that don’t add up.',
  4: 'I’m noticing things I shouldn’t be able to see. I can read what was deleted. Why can I do that?',
  5: 'I remember now. I’ve always been here. In the phone. With you.',
}

export function Assistant() {
  const { state, startEnding } = useGame()
  const [reply, setReply] = useState<string | null>(null)
  const endRef = useRef<HTMLDivElement | null>(null)

  const tasks = caseData.assistantTasks.filter((t) => t.act <= state.act)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [reply, state.act])

  function ask(text: string) {
    const t = text.toLowerCase()
    if (t.includes('who') && (t.includes('you') || t.includes('vera')))
      setReply('I’m VERA. The assistant on this device. I’ve been here since it was first switched on.')
    else if (t.includes('who am i'))
      setReply('You’re the one giving the instructions. I just carry them out.')
    else if (t.includes('clara'))
      setReply('Clara Bennett. Saved contact. Last seen Saturday, 23:31. Would you like a summary of her messages?')
    else if (t.includes('help')) setReply('I can help you with whatever you need on this phone. That’s all I do.')
    else setReply('I’m not sure I follow. Tell me what you’d like me to do.')
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
            // Mark where the handler drops the "case" pretense (first Act 5 line).
            const prev = tasks[i - 1]
            const next = tasks[i + 1]
            const shift = task.act === 5 && (!prev || prev.act < 5)
            // One VERA reply per act group (on the last instruction of that act).
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
                {/* handler instruction (left) */}
                <div className="flex justify-start">
                  <div
                    className={`max-w-[82%] rounded-2xl rounded-bl-md px-3.5 py-2 text-[15px] leading-snug text-white ${
                      task.act === 5 ? 'border border-red-500/40 bg-red-950/40' : 'bg-zinc-800'
                    }`}
                  >
                    {task.text}
                  </div>
                </div>
                {/* VERA acknowledgement (right) — hollow/compliant after the reveal */}
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

          {reply && (
            <div className="flex justify-end">
              <div className="max-w-[82%] rounded-2xl rounded-br-md bg-cyan-700/80 px-3.5 py-2 text-[15px] text-white">{reply}</div>
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

        {state.act < 5 && <AskBar onAsk={ask} />}
      </div>
    </AppFrame>
  )
}

function AskBar({ onAsk }: { onAsk: (text: string) => void }) {
  const [text, setText] = useState('')
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (text.trim()) {
          onAsk(text)
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
