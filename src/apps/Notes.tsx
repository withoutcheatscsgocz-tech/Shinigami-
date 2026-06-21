// Notes: a list of folders/notes -> note detail. Some notes carry password
// clues (the calculator/PIN), some are red-herring junk, one is Adam's cold
// "story to keep straight". Gated by act.

import { useState } from 'react'
import { AppFrame } from '../components/AppFrame'
import { caseData } from '../game/caseData'
import { useGame } from '../game/state'
import type { Note } from '../game/types'
import { fmtFull, fmtDate } from '../ui/format'

export function Notes() {
  const { state } = useGame()
  const [note, setNote] = useState<Note | null>(null)

  const notes = caseData.notes
    .filter((n) => n.act <= state.act)
    .sort((a, b) => Number(!!b.pinned) - Number(!!a.pinned) || (a.ts < b.ts ? 1 : -1))

  if (note) {
    return (
      <AppFrame title="" onBack={() => setNote(null)} theme="dark">
        <div className="px-5 py-4">
          <h1 className="text-[22px] font-bold text-white">{note.title}</h1>
          <p className="mt-1 text-[12px] text-white/40">{fmtFull(note.ts)}</p>
          <p className="selectable mt-4 whitespace-pre-wrap text-[16px] leading-relaxed text-white/90">{note.body}</p>
        </div>
      </AppFrame>
    )
  }

  return (
    <AppFrame title="Notes" subtitle={`${notes.length} notes`}>
      <ul className="px-3 py-2">
        {notes.map((n) => (
          <li key={n.id}>
            <button onClick={() => setNote(n)} className="flex w-full flex-col gap-0.5 rounded-xl px-3 py-3 text-left active:bg-white/5">
              <span className="text-[15px] font-semibold text-white">{n.title || 'New note'}</span>
              <span className="flex gap-2 text-[12px] text-white/40">
                <span>{fmtDate(n.ts)}</span>
                <span className="truncate">{firstLine(n.body)}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </AppFrame>
  )
}

function firstLine(body: string): string {
  return body.split('\n')[0]
}
