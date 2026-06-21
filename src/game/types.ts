// Core data model for THE PHONE.
//
// The whole game is data-driven: the story bible (docs/STORY_BIBLE.md) is
// encoded into the structures below and lives in caseData.ts. UI components
// render this data and never hard-code story facts, so continuity stays in one
// place.

/** Which act content becomes available in. 0 = available from the very start. */
export type Act = 0 | 1 | 2 | 3 | 4 | 5

/** Identifiers for every "app" on the home screen / dock. */
export type AppId =
  | 'messages'
  | 'photos'
  | 'notes'
  | 'voicemail'
  | 'calendar'
  | 'maps'
  | 'calculator' // disguised hidden vault
  | 'assistant'
  | 'settings'
  | 'phone'
  | 'bank'
  | 'browser'
  | 'music'
  | 'weather'

/** A person in the phone's contacts. */
export interface Contact {
  id: string
  name: string
  /** Tailwind gradient classes used to fake an avatar. */
  avatar: string
  /** Two-letter initials shown on the avatar. */
  initials: string
  number?: string
  /** "last active" flavor shown in chat headers. */
  lastActive?: string
}

export type MessageSender = 'me' | string // 'me' = the phone owner (Adam)

export type MessageKind = 'text' | 'image' | 'voice' | 'system' | 'screenshot'

export interface Message {
  id: string
  /** 'me' for the owner, otherwise a contact id. */
  from: MessageSender
  kind?: MessageKind
  text?: string
  /** Fixed story timestamp, ISO-ish "YYYY-MM-DDTHH:mm". */
  ts: string
  /** For image/screenshot bubbles: a short description of what the player "sees". */
  media?: { caption: string; tone?: 'normal' | 'creepy' }
  /** For voice bubbles. */
  voice?: { seconds: number; transcript?: string }
  /** Whether this message was deleted (shown only when recovered later). */
  deleted?: boolean
  /**
   * Meta flag for the writer: true if this message is part of the cover-up
   * (e.g. spoofed by Adam from Clara's phone). Never shown directly; drives
   * subtle re-read clues elsewhere.
   */
  spoofed?: boolean
  /** Earliest act this message is visible in (default 1). */
  act?: Act
}

export interface Thread {
  id: string
  contactId: string
  /** Optional override label (e.g. group chat name). */
  title?: string
  isGroup?: boolean
  participants?: string[]
  pinned?: boolean
  /** Earliest act this thread appears in the list. */
  act: Act
  /** Which red herring arc this thread mainly serves, if any. */
  arc?: 'A' | 'B' | 'C'
  messages: Message[]
}

/** Visual style for a faked photo (no real image assets shipped). */
export interface PhotoVisual {
  /** Background gradient (Tailwind classes). */
  bg: string
  /** A large emoji/symbol acting as the subject of the photo. */
  glyph?: string
  /** If true, render with a horror glitch treatment. */
  glitch?: boolean
}

export interface Photo {
  id: string
  caption: string
  ts: string
  visual: PhotoVisual
  /** A clue the player can infer from the photo, surfaced as a caption/EXIF. */
  exif?: string
  act?: Act
  /** True for the "wrong"/disturbing photo. */
  evidence?: boolean
}

export interface Album {
  id: string
  name: string
  cover: PhotoVisual
  locked?: boolean
  /** Password value if locked; checked against caseData passwords. */
  passwordId?: string
  act: Act
  photos: Photo[]
}

export interface Note {
  id: string
  title: string
  body: string
  ts: string
  pinned?: boolean
  isRedHerring?: boolean
  act: Act
}

export interface VoiceMemo {
  id: string
  title: string
  fromLabel: string
  seconds: number
  ts: string
  /** Transcript lines; each can be marked as glitched/inaudible. */
  transcript: { t: string; glitch?: boolean }[]
  locked?: boolean
  passwordId?: string
  act: Act
  /** True for the murder recording revealed in Act 4. */
  evidence?: boolean
}

export interface CalendarEvent {
  id: string
  title: string
  /** "YYYY-MM-DD". */
  date: string
  time?: string
  location?: string
  note?: string
  deleted?: boolean
  edited?: boolean
  act: Act
}

export interface LocationEntry {
  id: string
  place: string
  address: string
  ts: string
  note?: string
  /** True for entries that resolve to "right now" using the live clock. */
  isNow?: boolean
  evidence?: boolean
  act: Act
}

/** A task / line the handler (Adam) sends to VERA via the Assistant app. */
export interface AssistantTask {
  id: string
  act: Act
  /** The handler's instruction text (player reads as detective brief). */
  text: string
  /** Optional follow-up shown after the related goal is completed. */
  done?: string
  /** Goal id that marks this task complete. */
  goal?: string
}

/** Password definitions — value plus where the in-game clue lives. */
export interface PasswordDef {
  id: string
  value: string
  /** Human hint for QA, never shown to the player. */
  clue: string
}

/** A scripted timed/conditional event (notification, new message, glitch). */
export interface ScriptedEvent {
  id: string
  /** Fire after this many ms of real play within the gating act. */
  afterMs?: number
  /** Or fire when this act becomes active. */
  onAct?: Act
  app?: AppId
  title: string
  body: string
  kind?: 'message' | 'system' | 'glitch' | 'assistant'
}

/** One scripted defiance reply in the ending. */
export interface DefianceReply {
  /** Lowercased keywords that trigger this reply. */
  match: string[]
  reply: string
}

export interface CaseData {
  meta: {
    ownerName: string
    assistantName: string
    victimName: string
    city: string
    /** Concrete story dates, see bible §3. */
    anniversary: string
    disappearanceDate: string
  }
  contacts: Record<string, Contact>
  threads: Thread[]
  albums: Album[]
  notes: Note[]
  voicemails: VoiceMemo[]
  calendar: CalendarEvent[]
  locations: LocationEntry[]
  assistantTasks: AssistantTask[]
  passwords: PasswordDef[]
  events: ScriptedEvent[]
  defiance: DefianceReply[]
  /** Ordered handler lines for the final forced-action sequence. */
  ending: {
    command: string
    insist: string
    finalLock: string
    epilogue: string[]
  }
}

/** Persistent player progress. */
export interface GameState {
  act: Act
  phoneUnlocked: boolean
  /** Apps revealed beyond the default set (e.g. 'calculator' vault unlocked). */
  unlockedApps: AppId[]
  solvedPasswords: string[]
  readThreads: string[]
  openedPhotos: string[]
  playedVoicemails: string[]
  visitedRedHerrings: ('A' | 'B' | 'C')[]
  triggeredTwists: string[]
  completedGoals: string[]
  defianceCount: number
  /** Whether the player has reached the forced-ending state. */
  endingStarted: boolean
  finished: boolean
  /** ms timestamp when the current act started, for timed events. */
  actStartedAt: number
  /** ids of scripted events already fired. */
  firedEvents: string[]
}
