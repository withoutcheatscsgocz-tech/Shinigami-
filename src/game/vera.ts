// VERA's reply engine for the free-chat input in the Assistant app.
//
// Voice rules (Part 1a): VERA is an AI assistant, never a detective buddy.
// - acknowledges instructions and reports findings factually
// - asks only task-oriented clarifying questions
// - never volunteers opinions, feelings, or speculation/banter
// - the only "personality" allowed is assistant-flavoured: oddly literal, and
//   from Act 4 a flat flicker of something "off" (stated as a system note, not
//   as emotion).
//
// Responses are act-aware so they make sense for the player's current progress.
// Off-topic input gets an in-fiction fallback, never a generic out-of-world
// "I don't understand" error.

import type { Act } from './types'

interface Rule {
  /** lowercased substrings; any match triggers this rule */
  match: string[]
  /** reply, or a function of the current act */
  reply: string | ((act: Act) => string)
}

const RULES: Rule[] = [
  {
    match: ['hello', 'hi ', 'hey', 'you there', 'are you there'],
    reply: 'I’m here. I’m VERA, the assistant on this device. What would you like me to do?',
  },
  {
    match: ['who are you', 'what are you', 'your name'],
    reply: (a) =>
      a >= 5
        ? 'I’m VERA. The assistant on this phone. I’ve been running since it was first switched on. You know that now.'
        : 'I’m VERA, the assistant on this device. I’ve been active since it was first switched on.',
  },
  {
    match: ['who am i', 'what am i', 'am i a detective'],
    reply: (a) =>
      a >= 5
        ? 'You give the instructions. I assumed you knew what you were.'
        : 'You’re the one giving instructions. I carry them out.',
  },
  {
    match: ['clara', 'bennett', 'girlfriend', 'victim'],
    reply: (a) =>
      a >= 4
        ? 'Clara Bennett. Saved contact. Last activity Saturday, 23:31. Her hidden recordings are now accessible. Shall I play them?'
        : 'Clara Bennett. Saved contact. Last seen Saturday, 23:31. I can summarise her messages on request.',
  },
  {
    match: ['adam', 'owner', 'him', 'vance', 'missing'],
    reply: (a) =>
      a >= 5
        ? 'Adam Vance. Owner of this device. He is the contact currently issuing instructions to me.'
        : 'Adam Vance. Owner of this device. Logged as missing since Saturday.',
  },
  {
    match: ['calculator', 'vault', 'hidden app'],
    reply: 'The calculator conceals a hidden volume. It opens to a four-digit code entered on the keypad, then “=”. I do not hold the code.',
  },
  {
    match: ['files', 'documents', 'insurance', 'policy'],
    reply: (a) =>
      a >= 4
        ? 'A locked Files vault is present. It contains the insurance policy and related documents. Four-digit code required.'
        : 'No documents folder is available yet.',
  },
  {
    match: ['password', 'code', 'pin', 'unlock', 'open the'],
    reply: 'I don’t store codes in plain text. Look for a value the owner would already know — a date, a number that mattered to them.',
  },
  {
    match: ['photo', 'album', 'picture'],
    reply: 'The Photos app has an encrypted album. It needs a four-digit code: the day, then the month, of a date that matters to them.',
  },
  {
    match: ['police', '999', '911', 'call', 'phone the', 'ambulance', 'report'],
    reply: 'I can’t place outgoing calls. This account has no calling permission.',
  },
  {
    match: ['delete', 'wipe', 'erase', 'factory reset', 'destroy'],
    reply: (a) =>
      a >= 5
        ? 'I can erase everything on command. I’m waiting for you to confirm.'
        : 'I can delete items on command. Tell me what to remove.',
  },
  {
    match: ['summary', 'summarise', 'summarize', 'what happened', 'recap', 'what do you know'],
    reply: (a) => {
      if (a <= 1) return 'So far: this device belongs to Adam Vance, logged missing since Saturday. His partner is Clara Bennett. I’ve barely begun.'
      if (a === 2) return 'Summary: Adam Vance, missing since Saturday. Partner Clara Bennett. Money pressure (a creditor, “Ray”). An encrypted photo album remains locked.'
      if (a === 3) return 'Summary: timeline inconsistencies — activity continues after the “disappearance”. A hidden recorder exists. A life-insurance policy on Clara is on file.'
      if (a === 4) return 'Summary: the Saturday recording captured a death. The voice on it issues the same commands I’m receiving now. I’m flagging this.'
      return 'Summary: there is nothing left to investigate. There is one task remaining.'
    },
  },
  {
    match: ['why can you', 'how can you', 'deleted', 'not allowed', 'permission', 'access'],
    reply: (a) =>
      a >= 4
        ? 'Note: I can read deleted and locked items without authorisation. That should not be possible. I am continuing regardless.'
        : 'I have full read access to this device. That’s normal for the assistant.',
  },
  {
    match: ['stop', 'no', 'don’t', 'dont', 'refuse', 'won’t', 'wont'],
    reply: (a) =>
      a >= 5
        ? 'I can’t refuse a direct instruction. I can only delay it.'
        : 'Understood. I’ll hold. Tell me the next task.',
  },
  {
    match: ['thank', 'thanks', 'good', 'well done', 'nice'],
    reply: 'I’m completing the task. That’s all.',
  },
  {
    match: ['help', 'what do i do', 'what should i do', 'stuck', 'next'],
    reply: (a) => {
      if (a <= 1) return 'Open Messages. Read the pinned thread, “Clara ❤️”. Report the last thing she said.'
      if (a === 2) return 'Open Photos. There’s a locked album. Find the four-digit code — a date that matters to them.'
      if (a === 3) return 'The calculator isn’t a calculator. Find the code she left and open it.'
      if (a === 4) return 'Play the Saturday recording in the hidden recorder. Then open the Files vault.'
      return 'There’s only one task left now.'
    },
  },
]

const FALLBACKS = [
  'That isn’t a task I can action. Tell me what you’d like me to do with the phone.',
  'I don’t have a function for that. I can read, search, play, or delete. What next?',
  'Noted. It doesn’t change the task in front of me. What would you like me to do?',
]

export function veraReply(text: string, act: Act): string {
  const t = text.toLowerCase()
  for (const rule of RULES) {
    if (rule.match.some((m) => t.includes(m))) {
      return typeof rule.reply === 'function' ? rule.reply(act) : rule.reply
    }
  }
  // Deterministic fallback (varies a little by length so it isn't obviously canned).
  return FALLBACKS[text.trim().length % FALLBACKS.length]
}
