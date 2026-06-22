// App registry: icon, label and styling for every home-screen app. Kept
// separate from the app components so the home grid and dock can be described
// declaratively. Emoji glyphs keep the build asset-free while still reading as
// real app icons.

import type { AppId } from '../game/types'

export interface AppMeta {
  id: AppId
  label: string
  glyph: string
  /** Tailwind gradient classes for the icon tile. */
  bg: string
  /** Placement. */
  where: 'dock' | 'grid'
  order: number
}

export const APP_META: Record<AppId, AppMeta> = {
  phone: { id: 'phone', label: 'Phone', glyph: '📞', bg: 'from-green-400 to-green-600', where: 'dock', order: 0 },
  messages: { id: 'messages', label: 'Messages', glyph: '💬', bg: 'from-green-400 to-emerald-600', where: 'dock', order: 1 },
  browser: { id: 'browser', label: 'Browser', glyph: '🧭', bg: 'from-sky-400 to-blue-600', where: 'dock', order: 2 },
  photos: { id: 'photos', label: 'Photos', glyph: '🌼', bg: 'from-fuchsia-400 to-rose-500', where: 'dock', order: 3 },

  calendar: { id: 'calendar', label: 'Calendar', glyph: '📅', bg: 'from-white to-zinc-200', where: 'grid', order: 0 },
  notes: { id: 'notes', label: 'Notes', glyph: '📝', bg: 'from-yellow-300 to-amber-400', where: 'grid', order: 1 },
  voicemail: { id: 'voicemail', label: 'Voicemail', glyph: '🎙️', bg: 'from-zinc-200 to-zinc-400', where: 'grid', order: 2 },
  maps: { id: 'maps', label: 'Maps', glyph: '🗺️', bg: 'from-emerald-300 to-teal-500', where: 'grid', order: 3 },
  bank: { id: 'bank', label: 'Bank', glyph: '🏦', bg: 'from-indigo-400 to-indigo-600', where: 'grid', order: 4 },
  music: { id: 'music', label: 'Music', glyph: '🎵', bg: 'from-pink-400 to-red-500', where: 'grid', order: 5 },
  weather: { id: 'weather', label: 'Weather', glyph: '⛅', bg: 'from-sky-300 to-cyan-500', where: 'grid', order: 6 },
  calculator: { id: 'calculator', label: 'Calculator', glyph: '🧮', bg: 'from-zinc-700 to-zinc-900', where: 'grid', order: 7 },
  assistant: { id: 'assistant', label: 'Assistant', glyph: '🔵', bg: 'from-cyan-400 to-blue-600', where: 'grid', order: 8 },
  settings: { id: 'settings', label: 'Settings', glyph: '⚙️', bg: 'from-zinc-400 to-zinc-600', where: 'grid', order: 9 },
}

export const DOCK_APPS = Object.values(APP_META)
  .filter((a) => a.where === 'dock')
  .sort((a, b) => a.order - b.order)

export const GRID_APPS = Object.values(APP_META)
  .filter((a) => a.where === 'grid')
  .sort((a, b) => a.order - b.order)

export function AppIcon({ meta, badge, pulse }: { meta: AppMeta; badge?: number; pulse?: boolean }) {
  return (
    <div className="relative">
      <div
        className={`flex h-[58px] w-[58px] items-center justify-center rounded-[15px] bg-gradient-to-br ${meta.bg} text-3xl shadow-md`}
      >
        <span className="drop-shadow">{meta.glyph}</span>
      </div>
      {badge ? (
        <span
          className={`absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-bold text-white ring-2 ring-black/10 ${
            pulse ? 'animate-pulse' : ''
          }`}
        >
          {badge > 99 ? '99+' : badge}
        </span>
      ) : null}
    </div>
  )
}
