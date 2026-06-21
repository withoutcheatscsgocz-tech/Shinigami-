# THE PHONE

A psychological detective game that takes place entirely **inside the UI of a
mobile phone**. The player goes through the messages, photos, notes and voice
memos on a stranger's phone, trying to work out what happened to its missing
owner — until it starts to become clear who they really are, and who they have
been helping all along.

> Found-footage / analog-horror vibe. No monsters, no jumpscares — the horror is
> that "this could have been my phone".

## Pillars

- **The phone behaves like a real phone.** The status bar shows the **real time
  and the real battery percentage** of the device (Battery Status API / web
  fallback). This deliberately breaks the fourth wall.
- **Realistic Android UI** (lock screen, home grid, app switcher) that only
  starts to **glitch** when the story wants it to.
- **Double reading** — every document means something different after the final
  twist.

Full design, story, characters, timeline and all the twists:
[`docs/STORY_BIBLE.md`](docs/STORY_BIBLE.md) (**SPOILERS**).

## Tech stack

- **React + Vite + TypeScript + Tailwind CSS** — the UI layer.
- **Capacitor** — packaging into an Android APK.
  - `@capacitor/device` — real battery level / charging state (`getBatteryInfo`),
    with the web Battery Status API as a fallback.
  - `@capacitor/preferences` — persistent save (with a `localStorage` fallback).
  - `@capacitor/haptics` — vibration (wrong password, glitches).

## Development

```bash
npm install
npm run dev          # web dev server (Vite) — playable in the browser too
npm run build        # production build into dist/
npm run lint         # typecheck
```

### Android APK (Capacitor)

```bash
npm run build
npx cap add android      # first time only
npm run cap:sync         # copies the web build into the android project
npm run cap:open         # opens Android Studio (or gradlew assembleDebug)
```

> **Note on audio (voice memos):** the build environment has no TTS to bake real
> audio assets, so voice messages are implemented as a **transcript with a
> realistic playback UI** (timeline, elapsed time, "playing"), optionally
> augmented by the Web Speech API (`speechSynthesis`) where available. The story
> content is not cut short because of this.

## Status

Built in phases — see the git history. Order: scaffolding & story bible → data
model → shell (lock/home/status bar) → apps → content → event/save system →
ending → Capacitor packaging → QA.
