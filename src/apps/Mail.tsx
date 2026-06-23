// Mail — a functional inbox (list -> message), act-gated like Messages. Carries
// more reading + dual-reading clues (the insurance policy, the cabin booking,
// the cloud-backup notice, the police follow-up).

import { useState } from 'react'
import { AppFrame } from '../components/AppFrame'
import { useGame } from '../game/state'
import { fmtDate, fmtFull } from '../ui/format'

interface Email {
  id: string
  from: string
  fromAddr: string
  subject: string
  ts: string
  act: number
  body: string[]
  flag?: boolean
}

const MAIL: Email[] = [
  {
    id: 'm-gl',
    from: 'Greenfield Life',
    fromAddr: 'no-reply@greenfieldlife.co.uk',
    subject: 'Your joint life cover is active',
    ts: '2026-03-01T10:01',
    act: 3,
    flag: true,
    body: [
      'Dear Mr Vance,',
      'This confirms your joint life policy GL-44715 is now active (commencement 1 March).',
      'Cover: £250,000 each life. Accidental death benefit doubles the sum assured.',
      'Beneficiary on Ms Bennett’s life: Adam Vance.',
      'You can manage your policy any time in the Greenfield portal.',
    ],
  },
  {
    id: 'm-cabin',
    from: 'Blackmoor Retreats',
    fromAddr: 'bookings@blackmoorretreats.co.uk',
    subject: 'Booking confirmed — Pinewood Cabin',
    ts: '2026-06-02T20:40',
    act: 2,
    body: [
      'Your stay is confirmed: Pinewood Cabin, Blackmoor.',
      'Check-in: Sat 6 June. Guests: 2.',
      'Note from guest: “No housekeeping. We won’t need anyone coming by.”',
      'There is no mobile signal at the cabin. Enjoy the quiet.',
    ],
  },
  {
    id: 'm-work',
    from: 'Tom Hayes',
    fromAddr: 'tom@meridianrealty.co.uk',
    subject: 'You’ve missed three viewings',
    ts: '2026-06-09T10:05',
    act: 4,
    body: ['Adam — where are you? Maple Drive, Harlow, and the Riverside flat all no-shows. The partners are asking. This isn’t like you. Call the office.'],
  },
  {
    id: 'm-backup',
    from: 'Cloud',
    fromAddr: 'storage@icloud-mail.com',
    subject: 'Backup complete',
    ts: '2026-06-07T04:12',
    act: 3,
    body: [
      'Your device backed up at 04:12.',
      '1,204 photos · 38 voice memos · 6 GB.',
      'Tip: you can delete a backup permanently from Settings, but this cannot be undone.',
    ],
  },
  {
    id: 'm-salter',
    from: 'DS Salter — Ashford Police',
    fromAddr: 'j.salter@ashford.police.uk',
    subject: 'Voluntary interview — Clara Bennett',
    ts: '2026-06-11T09:10',
    act: 4,
    flag: true,
    body: [
      'Mr Vance,',
      'We are investigating the disappearance of Clara Bennett and have questions regarding a life insurance policy, your vehicle, and your whereabouts on Sat 6 June.',
      'Please attend a voluntary interview. If we do not hear from you we will consider further steps.',
    ],
  },
  {
    id: 'm-spam',
    from: 'Riverside Motors',
    fromAddr: 'service@riversidemotors.co.uk',
    subject: 'Your MOT is due + a free valet!',
    ts: '2026-06-08T09:00',
    act: 1,
    body: ['Book your MOT this month and get a FREE interior valet. Boot a bit grubby? We’ll sort it. Reply BOOK to confirm.'],
  },
  {
    id: 'm-clara',
    from: 'Clara Bennett',
    fromAddr: 'clara.b.makes@gmail.com',
    subject: 'shared album: “us”',
    ts: '2026-05-02T12:00',
    act: 1,
    body: ['i made us a shared album so you stop going through my camera roll 🙄 everything’s in here. i love you, even when you’re impossible. x'],
  },
]

export function Mail() {
  const { state } = useGame()
  const [open, setOpen] = useState<Email | null>(null)
  const mail = MAIL.filter((m) => m.act <= state.act).sort((a, b) => (a.ts < b.ts ? 1 : -1))

  if (open) {
    return (
      <AppFrame title="" subtitle={open.subject} onBack={() => setOpen(null)}>
        <div className="px-5 py-4">
          <h1 className="text-[18px] font-semibold text-white">{open.subject}</h1>
          <div className="mt-2 flex items-center gap-2 border-b border-white/10 pb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-zinc-600 to-zinc-800 text-[13px] font-semibold text-white">
              {open.from[0]}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[14px] text-white">{open.from}</div>
              <div className="truncate text-[12px] text-white/40">{open.fromAddr}</div>
            </div>
            <div className="text-[12px] text-white/40">{fmtFull(open.ts)}</div>
          </div>
          <div className="mt-4 space-y-3">
            {open.body.map((p, i) => (
              <p key={i} className={`text-[15px] leading-relaxed ${open.flag ? 'text-amber-200/90' : 'text-white/85'}`}>
                {p}
              </p>
            ))}
          </div>
        </div>
      </AppFrame>
    )
  }

  return (
    <AppFrame title="Inbox" subtitle={`${mail.length} messages`}>
      <ul className="divide-y divide-white/5">
        {mail.map((m) => (
          <li key={m.id}>
            <button onClick={() => setOpen(m)} className="flex w-full flex-col gap-0.5 px-4 py-3 text-left active:bg-white/5">
              <div className="flex items-baseline justify-between gap-2">
                <span className="truncate text-[15px] font-semibold text-white">{m.from}</span>
                <span className="shrink-0 text-[12px] text-white/40">{fmtDate(m.ts)}</span>
              </div>
              <span className={`truncate text-[14px] ${m.flag ? 'text-amber-300/90' : 'text-white/80'}`}>{m.subject}</span>
              <span className="truncate text-[12px] text-white/40">{m.body[0]}</span>
            </button>
          </li>
        ))}
      </ul>
    </AppFrame>
  )
}
