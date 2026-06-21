// Voicemail: a list of voice messages -> player. Only non-locked memos appear
// here; the hidden Saturday recording lives behind the Calculator vault.

import { useState } from 'react'
import { AppFrame } from '../components/AppFrame'
import { VoicePlayer } from '../components/VoicePlayer'
import { caseData } from '../game/caseData'
import { useGame } from '../game/state'
import type { VoiceMemo } from '../game/types'
import { fmtDate, fmtClock } from '../ui/format'

export function Voicemail() {
  const { state, playVoicemail } = useGame()
  const [memo, setMemo] = useState<VoiceMemo | null>(null)

  const memos = caseData.voicemails
    .filter((v) => v.act <= state.act && !v.locked)
    .sort((a, b) => (a.ts < b.ts ? 1 : -1))

  if (memo) {
    return (
      <AppFrame title={memo.title} onBack={() => setMemo(null)}>
        <VoicePlayer memo={memo} onFinished={() => playVoicemail(memo.id)} />
      </AppFrame>
    )
  }

  return (
    <AppFrame title="Voicemail" subtitle={`${memos.length} messages`}>
      <ul className="divide-y divide-white/5">
        {memos.map((v) => {
          const played = state.playedVoicemails.includes(v.id)
          return (
            <li key={v.id}>
              <button onClick={() => setMemo(v)} className="flex w-full items-center gap-3 px-4 py-3 text-left active:bg-white/5">
                {!played && <span className="h-2 w-2 shrink-0 rounded-full bg-sky-500" />}
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className={`truncate text-[15px] ${played ? 'font-medium' : 'font-semibold'} text-white`}>{v.title}</span>
                    <span className="shrink-0 text-[12px] text-white/40">{fmtDate(v.ts)}</span>
                  </div>
                  <p className="truncate text-[12px] text-white/45">{v.fromLabel}</p>
                </div>
                <span className="shrink-0 text-[12px] tabular-nums text-white/40">{fmtClock(v.seconds)}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </AppFrame>
  )
}
