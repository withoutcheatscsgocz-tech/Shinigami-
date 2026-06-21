// Temporary placeholder for apps not yet implemented (replaced in Phase 4).

import { AppFrame } from '../components/AppFrame'
import { APP_META } from '../ui/apps'
import type { AppId } from '../game/types'

export function Placeholder({ id }: { id: AppId }) {
  const meta = APP_META[id]
  return (
    <AppFrame title={meta.label}>
      <div className="flex h-full flex-col items-center justify-center gap-2 text-white/40">
        <span className="text-5xl">{meta.glyph}</span>
        <p className="text-sm">{meta.label}</p>
      </div>
    </AppFrame>
  )
}
