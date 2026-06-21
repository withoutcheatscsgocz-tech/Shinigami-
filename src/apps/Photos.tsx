// Photos: albums -> album grid -> full-screen viewer. The "Private" album is
// locked and needs the anniversary code (clue: cake photo + Clara's chat).
// Opening it satisfies the Act 2 gate.

import { useState } from 'react'
import { AppFrame } from '../components/AppFrame'
import { PasswordModal } from '../components/PasswordModal'
import { caseData } from '../game/caseData'
import { useGame } from '../game/state'
import type { Album, Photo } from '../game/types'
import { fmtFull, isNow } from '../ui/format'

export function Photos() {
  const { state, openPhoto } = useGame()
  const [albumId, setAlbumId] = useState<string | null>(null)
  const [photo, setPhoto] = useState<Photo | null>(null)
  const [askPw, setAskPw] = useState<Album | null>(null)

  const albums = caseData.albums.filter((a) => a.act <= state.act)

  function openAlbum(a: Album) {
    if (a.locked && a.passwordId && !state.solvedPasswords.includes(a.passwordId)) {
      setAskPw(a)
    } else {
      setAlbumId(a.id)
    }
  }

  // full-screen photo viewer
  if (photo) {
    return (
      <AppFrame title={fmtFull(photo.ts)} onBack={() => setPhoto(null)} subtitle={photo.exif}>
        <div className="flex h-full flex-col">
          <div
            className={`m-3 flex flex-1 items-center justify-center rounded-2xl bg-gradient-to-br ${photo.visual.bg} ${
              photo.visual.glitch ? 'animate-glitch' : ''
            }`}
          >
            <span className="text-[120px] leading-none drop-shadow-lg">{photo.visual.glyph ?? '🖼️'}</span>
          </div>
          <div className="px-5 pb-6">
            <p className="text-[15px] text-white">{photo.caption}</p>
            <p className={`mt-1 text-[12px] ${photo.evidence ? 'text-red-400' : 'text-white/40'}`}>
              {isNow(photo.ts) ? 'Captured: just now' : fmtFull(photo.ts)}
              {photo.exif ? ` · ${photo.exif}` : ''}
            </p>
          </div>
        </div>
      </AppFrame>
    )
  }

  // album grid
  if (albumId) {
    const album = caseData.albums.find((a) => a.id === albumId)!
    const photos = album.photos.filter((p) => (p.act ?? album.act) <= state.act)
    return (
      <AppFrame title={album.name} subtitle={`${photos.length} items`} onBack={() => setAlbumId(null)}>
        <div className="grid grid-cols-3 gap-0.5 p-0.5">
          {photos.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                openPhoto(p.id)
                setPhoto(p)
              }}
              className={`relative aspect-square bg-gradient-to-br ${p.visual.bg} ${p.visual.glitch ? 'animate-glitch' : ''}`}
            >
              <span className="absolute inset-0 flex items-center justify-center text-4xl">{p.visual.glyph ?? '🖼️'}</span>
              {p.evidence && <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />}
            </button>
          ))}
        </div>
      </AppFrame>
    )
  }

  // albums list
  return (
    <AppFrame title="Albums">
      <div className="grid grid-cols-2 gap-4 p-4">
        {albums.map((a) => {
          const locked = a.locked && a.passwordId && !state.solvedPasswords.includes(a.passwordId)
          return (
            <button key={a.id} onClick={() => openAlbum(a)} className="text-left active:opacity-80">
              <div className={`relative flex aspect-square items-center justify-center rounded-2xl bg-gradient-to-br ${a.cover.bg}`}>
                <span className="text-5xl">{locked ? '🔒' : a.cover.glyph ?? '🖼️'}</span>
              </div>
              <div className="mt-1.5 text-[14px] font-medium text-white">{a.name}</div>
              <div className="text-[12px] text-white/40">
                {locked ? 'Locked' : `${a.photos.filter((p) => (p.act ?? a.act) <= state.act).length} items`}
              </div>
            </button>
          )
        })}
      </div>

      {askPw && (
        <PasswordModal
          passwordId={askPw.passwordId!}
          title={`“${askPw.name}” is locked`}
          hint="4 digits · a date that matters to them"
          onSuccess={() => {
            const id = askPw.id
            setAskPw(null)
            setAlbumId(id)
          }}
          onClose={() => setAskPw(null)}
        />
      )}
    </AppFrame>
  )
}
