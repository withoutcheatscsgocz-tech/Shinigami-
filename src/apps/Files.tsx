// Files — a locked "documents" vault, the Act-4 sub-arc. Discovered only from
// Act 4 (gated in the home grid), and opened only by solving the harder
// cross-reference puzzle (passwordId 'vault' = month-policy-began + month-it-
// ended = 03 06). Inside: the paperwork that exposes the cold financial
// premeditation behind the murder (arc D, intersecting the money arc A).

import { useState } from 'react'
import { AppFrame } from '../components/AppFrame'
import { PasswordModal } from '../components/PasswordModal'
import { useGame } from '../game/state'

interface Doc {
  id: string
  name: string
  kind: string
  ts: string
  body: string[]
  evidence?: boolean
}

const DOCS: Doc[] = [
  {
    id: 'doc-policy',
    name: 'Greenfield_Life_Policy.pdf',
    kind: 'PDF · 2 pages',
    ts: '1 March 2026',
    evidence: true,
    body: [
      'GREENFIELD LIFE — JOINT LIFE POLICY GL-44715',
      'Policyholders: Adam Vance · Clara Bennett',
      'Sum assured: £250,000 each.',
      'Accidental death benefit: ×2 → £500,000.',
      'Beneficiary (Clara’s life): Adam Vance.',
      'Commencement: 1 March 2026.',
      '— note clipped to file, Adam’s handwriting: “double if it looks like an accident.”',
    ],
  },
  {
    id: 'doc-will',
    name: 'will_draft_v3.docx',
    kind: 'Document',
    ts: '12 April 2026',
    evidence: true,
    body: [
      'LAST WILL — C. BENNETT (DRAFT, unsigned)',
      'This draft names Adam as sole executor and beneficiary.',
      'Tracked changes show the original left everything to her sister Paige —',
      'the beneficiary was edited to “Adam Vance” on 11 April. Editor: this device.',
    ],
  },
  {
    id: 'doc-deed',
    name: 'cabin_deed_blackmoor.pdf',
    kind: 'PDF',
    ts: '2019',
    body: [
      'TITLE: Woodland plot, Blackmoor (no postal address).',
      'Owner: A. Vance. Status: NOT sold.',
      '(He told his brother Jamie he’d sold it last year.)',
    ],
  },
  {
    id: 'doc-clara',
    name: 'IMG_claranote.jpg',
    kind: 'Screenshot',
    ts: '30 May 2026',
    evidence: true,
    body: [
      'A photo of a handwritten note, taken by Adam from Clara’s journal:',
      '“If you’re reading this and I’m not here, it wasn’t my choice and it wasn’t an accident.',
      'Look behind the calculator. Look at the insurance. He planned it on paper before he ever raised a hand.”',
    ],
  },
  {
    id: 'doc-search',
    name: 'savings_account_8820.pdf',
    kind: 'PDF',
    ts: '8 June 2026',
    evidence: true,
    body: [
      'New sole account ••• 8820 opened 8 June (after the “disappearance”).',
      'Opening deposit £11,500 — matching the transfer out of the joint account.',
      'Sole signatory: Adam Vance.',
    ],
  },
]

export function Files() {
  const { state } = useGame()
  const unlocked = state.solvedPasswords.includes('vault')
  const [asked, setAsked] = useState(!unlocked)
  const [doc, setDoc] = useState<Doc | null>(null)

  if (!unlocked) {
    return (
      <AppFrame title="Files">
        <div className="flex h-full flex-col items-center justify-center gap-3 px-8 text-center text-white/50">
          <span className="text-5xl">🗂️</span>
          <p className="text-[15px] text-white/70">Locked vault</p>
          <p className="text-[13px]">A hidden documents folder. It needs a 4-digit code.</p>
          <button
            onClick={() => setAsked(true)}
            className="mt-2 rounded-full bg-white/10 px-5 py-2 text-[14px] text-white active:opacity-70"
          >
            Enter code
          </button>
        </div>
        {asked && (
          <PasswordModal
            passwordId="vault"
            title="Files — locked"
            hint="4 digits · the month it began, and the month it ended"
            onSuccess={() => setAsked(false)}
            onClose={() => setAsked(false)}
          />
        )}
      </AppFrame>
    )
  }

  if (doc) {
    return (
      <AppFrame title={doc.name} subtitle={`${doc.kind} · ${doc.ts}`} onBack={() => setDoc(null)}>
        <div className="px-5 py-4">
          <div className="rounded-2xl bg-white/5 p-4">
            {doc.body.map((line, i) => (
              <p
                key={i}
                className={`mb-2 text-[14px] leading-relaxed ${i === 0 ? 'font-semibold text-white' : doc.evidence ? 'text-amber-300/90' : 'text-white/80'}`}
              >
                {line}
              </p>
            ))}
          </div>
        </div>
      </AppFrame>
    )
  }

  return (
    <AppFrame title="Files" subtitle="Vault · unlocked">
      <ul className="divide-y divide-white/5">
        {DOCS.map((d) => (
          <li key={d.id}>
            <button onClick={() => setDoc(d)} className="flex w-full items-center gap-3 px-4 py-3 text-left active:bg-white/5">
              <span className="text-2xl">{d.evidence ? '📕' : '📄'}</span>
              <div className="min-w-0 flex-1">
                <div className={`truncate text-[14px] ${d.evidence ? 'text-amber-300' : 'text-white'}`}>{d.name}</div>
                <div className="text-[12px] text-white/40">{d.kind} · {d.ts}</div>
              </div>
              <span className="text-white/25">›</span>
            </button>
          </li>
        ))}
      </ul>
    </AppFrame>
  )
}
