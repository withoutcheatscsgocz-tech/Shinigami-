// Messages: a thread list and a conversation view. Threads and individual
// messages are gated by the current act. Opening the main thread (t-clara)
// satisfies the Act 1 gate via readThread().

import { useEffect, useMemo, useState } from 'react'
import { AppFrame } from '../components/AppFrame'
import { caseData } from '../game/caseData'
import { useGame } from '../game/state'
import { useShell } from '../ui/shell'
import type { Message, Thread } from '../game/types'
import { fmtTime, fmtDate, fmtDayLabel } from '../ui/format'

export function Messages() {
  const { state } = useGame()
  const [openId, setOpenId] = useState<string | null>(null)

  const threads = useMemo(
    () =>
      caseData.threads
        .filter((t) => t.act <= state.act)
        .map((t) => ({
          t,
          last: lastVisibleMessage(t, state.act),
        }))
        .filter((x) => x.last)
        .sort((a, b) => (a.last!.ts < b.last!.ts ? 1 : -1)),
    [state.act],
  )

  if (openId) {
    const thread = caseData.threads.find((t) => t.id === openId)!
    return <Conversation thread={thread} onBack={() => setOpenId(null)} />
  }

  return (
    <AppFrame title="Messages">
      <ul className="divide-y divide-white/5">
        {threads.map(({ t, last }) => {
          const c = caseData.contacts[t.contactId]
          const unread = !state.readThreads.includes(t.id)
          return (
            <li key={t.id}>
              <button onClick={() => setOpenId(t.id)} className="flex w-full items-center gap-3 px-4 py-3 text-left active:bg-white/5">
                {unread && <span className="h-2 w-2 shrink-0 rounded-full bg-sky-500" />}
                <Avatar contact={c} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className={`truncate text-[15px] ${unread ? 'font-semibold' : 'font-medium'} text-white`}>
                      {t.title ?? c.name}
                    </span>
                    <span className="shrink-0 text-[12px] text-white/40">{fmtDate(last!.ts)}</span>
                  </div>
                  <p className="truncate text-[13px] text-white/55">{preview(last!)}</p>
                </div>
              </button>
            </li>
          )
        })}
      </ul>
    </AppFrame>
  )
}

function Conversation({ thread, onBack }: { thread: Thread; onBack: () => void }) {
  const { state, readThread } = useGame()
  const contact = caseData.contacts[thread.contactId]
  const messages = thread.messages.filter((m) => (m.act ?? 1) <= state.act)

  useEffect(() => {
    readThread(thread.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [thread.id])

  return (
    <AppFrame
      title={thread.title ?? contact.name}
      subtitle={contact.lastActive}
      onBack={onBack}
      right={<Avatar contact={contact} small />}
    >
      <div className="flex flex-col gap-1 px-3 py-4">
        {messages.map((m, i) => {
          const prev = messages[i - 1]
          const showDay = !prev || fmtDayLabel(prev.ts) !== fmtDayLabel(m.ts)
          return (
            <div key={m.id}>
              {showDay && (
                <div className="my-3 text-center text-[11px] font-medium uppercase tracking-wide text-white/35">
                  {fmtDayLabel(m.ts)}
                </div>
              )}
              <Bubble msg={m} thread={thread} />
            </div>
          )
        })}
        {/* If the next message in the thread is gated behind a later act, show a
            subtle "delivered" gap so the player feels there's more to come. */}
        {messages.length < thread.messages.length && (
          <div className="mt-2 text-center text-[11px] text-white/25">···</div>
        )}
      </div>
    </AppFrame>
  )
}

function Bubble({ msg, thread }: { msg: Message; thread: Thread }) {
  const mine = msg.from === 'me'
  const sender = mine ? null : caseData.contacts[msg.from]
  const { setSecretEnding } = useShell()

  // Phishing link — tapping it triggers the comedic "virus" secret ending.
  if (msg.scam) {
    return (
      <div className="flex justify-start">
        <button
          onClick={() => setSecretEnding('scam')}
          className="max-w-[78%] rounded-2xl rounded-bl-md bg-zinc-800 px-3.5 py-2 text-left text-[15px] leading-snug text-sky-400 underline decoration-sky-400/50 active:opacity-70"
        >
          {msg.text}
          <div className="mt-0.5 text-[10px] text-white/35">{fmtTime(msg.ts)}</div>
        </button>
      </div>
    )
  }

  if (msg.kind === 'system' || (!msg.text && !msg.media && !msg.voice)) {
    return (
      <div className="my-2 text-center text-[11px] italic text-white/30">
        {msg.deleted ? 'This message was deleted' : 'message could not be loaded'}
      </div>
    )
  }

  return (
    <div className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
      <div className="max-w-[78%]">
        {thread.isGroup && !mine && sender && (
          <div className="mb-0.5 pl-3 text-[11px] font-medium text-white/45">{sender.name}</div>
        )}
        <div
          className={`relative rounded-2xl px-3.5 py-2 text-[15px] leading-snug ${
            mine ? 'rounded-br-md bg-sky-600 text-white' : 'rounded-bl-md bg-zinc-800 text-white'
          } ${msg.deleted ? 'opacity-60 ring-1 ring-white/10' : ''}`}
        >
          {msg.media ? (
            <PhotoBubble caption={msg.media.caption} tone={msg.media.tone} />
          ) : msg.voice ? (
            <span className="italic text-white/80">🎙️ Voice message · {msg.voice.seconds}s</span>
          ) : (
            <span className="selectable whitespace-pre-wrap">{msg.text}</span>
          )}
          <div className={`mt-0.5 text-[10px] ${mine ? 'text-white/60' : 'text-white/35'}`}>
            {fmtTime(msg.ts)}
            {msg.deleted && ' · recovered'}
          </div>
        </div>
      </div>
    </div>
  )
}

function PhotoBubble({ caption, tone }: { caption: string; tone?: 'normal' | 'creepy' }) {
  return (
    <div className={`flex h-28 w-44 items-end rounded-xl bg-gradient-to-br ${tone === 'creepy' ? 'from-red-950 to-black' : 'from-zinc-600 to-zinc-800'} p-2`}>
      <span className="text-[11px] text-white/70">{caption}</span>
    </div>
  )
}

function Avatar({ contact, small }: { contact: { avatar: string; initials: string }; small?: boolean }) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${contact.avatar} font-semibold text-white ${
        small ? 'h-8 w-8 text-[12px]' : 'h-11 w-11 text-[15px]'
      }`}
    >
      {contact.initials}
    </div>
  )
}

function lastVisibleMessage(t: Thread, act: number): Message | undefined {
  const visible = t.messages.filter((m) => (m.act ?? 1) <= act)
  return visible[visible.length - 1]
}

function preview(m: Message): string {
  if (m.media) return '📷 Photo'
  if (m.voice) return '🎙️ Voice message'
  if (m.kind === 'system' || !m.text) return m.deleted ? 'Deleted message' : 'Attachment'
  return m.text
}
