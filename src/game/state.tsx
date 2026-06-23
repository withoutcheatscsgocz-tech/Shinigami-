// Central game state: a reducer + React context, persisted via storage.ts.
//
// Act progression is goal-driven (see bible §4): completing the gate goal of an
// act bumps the player into the next one, which in turn reveals more content.

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
  type ReactNode,
} from 'react'
import type { Act, AppId, GameState } from './types'
import { caseData } from './caseData'
import { loadRaw, saveRaw, removeRaw } from './storage'

const SAVE_KEY = 'thephone.save.v1'

const initialState: GameState = {
  act: 1,
  phoneUnlocked: false,
  unlockedApps: [],
  solvedPasswords: [],
  readThreads: [],
  openedPhotos: [],
  playedVoicemails: [],
  visitedRedHerrings: [],
  triggeredTwists: [],
  completedGoals: [],
  defianceCount: 0,
  endingStarted: false,
  finished: false,
  actStartedAt: Date.now(),
  firedEvents: [],
  playedMs: 0,
}

// Gate goal that completes each act -> the act it advances to.
const ACT_GATES: Record<string, Act> = {
  'read-clara': 2,
  'open-private': 3,
  'open-calc': 4,
  'play-evidence': 5,
}

type Action =
  | { type: 'HYDRATE'; state: GameState }
  | { type: 'UNLOCK_PHONE' }
  | { type: 'READ_THREAD'; id: string }
  | { type: 'SOLVE_PASSWORD'; id: string }
  | { type: 'OPEN_PHOTO'; id: string }
  | { type: 'PLAY_VOICEMAIL'; id: string }
  | { type: 'VISIT_RED_HERRING'; arc: 'A' | 'B' | 'C' }
  | { type: 'TRIGGER_TWIST'; id: string }
  | { type: 'COMPLETE_GOAL'; id: string }
  | { type: 'UNLOCK_APP'; app: AppId }
  | { type: 'FIRE_EVENT'; id: string }
  | { type: 'INC_DEFIANCE' }
  | { type: 'START_ENDING' }
  | { type: 'FINISH' }
  | { type: 'ADD_PLAYTIME'; ms: number }
  | { type: 'RESET' }

function add<T>(arr: T[], v: T): T[] {
  return arr.includes(v) ? arr : [...arr, v]
}

/** Apply a completed goal, advancing the act if it's a gate goal. */
function applyGoal(state: GameState, goal: string): GameState {
  const completedGoals = add(state.completedGoals, goal)
  let act = state.act
  let actStartedAt = state.actStartedAt
  const gate = ACT_GATES[goal]
  if (gate && gate > act) {
    act = gate
    actStartedAt = Date.now()
  }
  return { ...state, completedGoals, act, actStartedAt }
}

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'HYDRATE':
      return action.state
    case 'UNLOCK_PHONE':
      return { ...state, phoneUnlocked: true }
    case 'READ_THREAD': {
      let next = { ...state, readThreads: add(state.readThreads, action.id) }
      if (action.id === 't-clara') next = applyGoal(next, 'read-clara')
      return next
    }
    case 'SOLVE_PASSWORD': {
      let next = { ...state, solvedPasswords: add(state.solvedPasswords, action.id) }
      if (action.id === 'photos') next = applyGoal(next, 'open-private')
      if (action.id === 'calc') {
        next = applyGoal(next, 'open-calc')
        next = { ...next, unlockedApps: add(next.unlockedApps, 'calculator') }
      }
      return next
    }
    case 'OPEN_PHOTO':
      return { ...state, openedPhotos: add(state.openedPhotos, action.id) }
    case 'PLAY_VOICEMAIL': {
      let next = { ...state, playedVoicemails: add(state.playedVoicemails, action.id) }
      if (action.id === 'vm-evidence') next = applyGoal(next, 'play-evidence')
      return next
    }
    case 'VISIT_RED_HERRING':
      return { ...state, visitedRedHerrings: add(state.visitedRedHerrings, action.arc) }
    case 'TRIGGER_TWIST':
      return { ...state, triggeredTwists: add(state.triggeredTwists, action.id) }
    case 'COMPLETE_GOAL':
      return applyGoal(state, action.id)
    case 'UNLOCK_APP':
      return { ...state, unlockedApps: add(state.unlockedApps, action.app) }
    case 'FIRE_EVENT':
      return { ...state, firedEvents: add(state.firedEvents, action.id) }
    case 'INC_DEFIANCE':
      return { ...state, defianceCount: state.defianceCount + 1 }
    case 'START_ENDING':
      return { ...state, endingStarted: true, act: 5 }
    case 'FINISH':
      return { ...state, finished: true }
    case 'ADD_PLAYTIME':
      return { ...state, playedMs: state.playedMs + action.ms }
    case 'RESET':
      return { ...initialState, actStartedAt: Date.now() }
    default:
      return state
  }
}

interface Ctx {
  state: GameState
  // actions
  unlockPhone: () => void
  readThread: (id: string) => void
  solvePassword: (id: string) => void
  openPhoto: (id: string) => void
  playVoicemail: (id: string) => void
  visitRedHerring: (arc: 'A' | 'B' | 'C') => void
  triggerTwist: (id: string) => void
  completeGoal: (id: string) => void
  unlockApp: (app: AppId) => void
  fireEvent: (id: string) => void
  incDefiance: () => void
  startEnding: () => void
  finish: () => void
  addPlaytime: (ms: number) => void
  resetGame: () => void
  /** Verify a password by id; on success records it solved. Returns boolean. */
  tryPassword: (passwordId: string, value: string) => boolean
}

const GameContext = createContext<Ctx | null>(null)

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const hydrated = useRef(false)

  // Load any saved game on first mount.
  useEffect(() => {
    let active = true
    ;(async () => {
      const raw = await loadRaw(SAVE_KEY)
      if (active && raw) {
        try {
          const parsed = JSON.parse(raw) as GameState
          dispatch({ type: 'HYDRATE', state: { ...initialState, ...parsed } })
        } catch {
          /* corrupt save: start fresh */
        }
      }
      hydrated.current = true
    })()
    return () => {
      active = false
    }
  }, [])

  // Persist on every change once hydrated.
  useEffect(() => {
    if (hydrated.current) void saveRaw(SAVE_KEY, JSON.stringify(state))
  }, [state])

  const value: Ctx = {
    state,
    unlockPhone: () => dispatch({ type: 'UNLOCK_PHONE' }),
    readThread: (id) => dispatch({ type: 'READ_THREAD', id }),
    solvePassword: (id) => dispatch({ type: 'SOLVE_PASSWORD', id }),
    openPhoto: (id) => dispatch({ type: 'OPEN_PHOTO', id }),
    playVoicemail: (id) => dispatch({ type: 'PLAY_VOICEMAIL', id }),
    visitRedHerring: (arc) => dispatch({ type: 'VISIT_RED_HERRING', arc }),
    triggerTwist: (id) => dispatch({ type: 'TRIGGER_TWIST', id }),
    completeGoal: (id) => dispatch({ type: 'COMPLETE_GOAL', id }),
    unlockApp: (app) => dispatch({ type: 'UNLOCK_APP', app }),
    fireEvent: (id) => dispatch({ type: 'FIRE_EVENT', id }),
    incDefiance: () => dispatch({ type: 'INC_DEFIANCE' }),
    startEnding: () => dispatch({ type: 'START_ENDING' }),
    finish: () => dispatch({ type: 'FINISH' }),
    addPlaytime: (ms) => dispatch({ type: 'ADD_PLAYTIME', ms }),
    resetGame: () => {
      void removeRaw(SAVE_KEY)
      dispatch({ type: 'RESET' })
    },
    tryPassword: (passwordId, value) => {
      const def = caseData.passwords.find((p) => p.id === passwordId)
      if (def && def.value === value.trim()) {
        dispatch({ type: 'SOLVE_PASSWORD', id: passwordId })
        return true
      }
      return false
    },
  }

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export function useGame(): Ctx {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be used inside <GameProvider>')
  return ctx
}
