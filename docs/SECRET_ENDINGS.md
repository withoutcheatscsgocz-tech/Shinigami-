# Secret / Alternate Endings (SPOILERS)

Three hidden endings. **None are hinted** in any tutorial, prompt, or UI — they
are found only through player behaviour. The normal flow (the forced factory
reset) is unchanged and remains the default.

| Ending | Trigger | Tone |
|--------|---------|------|
| **A — "PHONE.EXE"** (scam virus) | Tap the phishing link in Messages → the **"+1 (829)…"** thread (`sc3`, "tap to claim ➡ clara-tip-reward-official…"). Available **any time** once the phone is unlocked. | Comedic — deliberately distinct from the main horror glitches |
| **B — "TOO SLOW"** (arrest) | Accumulate **90 real minutes** of actual play (`GameState.playedMs`, persisted across sessions) **without** reaching the main ending. | Played straight |
| **C — "GONE / CAUGHT"** (3D escape) | In the final wipe sequence, **keep refusing** past the scripted defiance — **8 total refusals** (`ESCAPE_AT` in `Ending.tsx`). Adam escalates (threats → an unhinged final line), then a glitch hard-cut into the 3D segment. | Straight, dread |

## A — scam / fake virus
- Trigger: `Message.scam === true` bubble tapped → `shell.setSecretEnding('scam')`.
- Sequence: glitchy fake popups ("VIRUS DETECTED", "FREE iPhone", "DOWNLOADING
  MORE RAM…") → a joke "bricked phone" screen with an epitaph → **Reboot**
  (restart). Dark-humour tie-in: the scam preys on the case itself (a fake
  "missing person reward" for Clara).
- Implementation: `src/screens/SecretEndings.tsx` (`ScamEnding`).

## B — real-time timeout → arrest
- Real play time is tracked in `src/game/playtime.ts` (`usePlaytime`), only while
  the tab is visible and the game is in progress, accumulated into the persisted
  `playedMs` (continues across saved sessions).
- Decision is the pure function `shouldTimeout(state, thresholdMs)` in
  `src/game/timeout.ts` (unit-tested in `scripts/validate.ts`).
- Threshold: `REAL_TIMEOUT_MS = 90 min`. **Dev/test override:** set
  `localStorage.setItem('vera_timeout_ms', '15000')` (15 s) in the browser
  console to verify quickly; production ignores it only if unset.
- Sequence: banging at the door → a police "we traced the handset" message
  thread → title card **"TOO SLOW"** → restart. Fires only if the main ending
  hasn't been reached, checked on a 5 s cadence (never mid-action).

## C — VERA refuses → killer's 3D escape
- Beyond the scripted 3–5 defiance replies, refusals 6–7 escalate Adam's tone
  (`ESCALATION`), refusal 8 prints the unhinged `FINAL_LINE`, then a glitch →
  `shell.setSecretEnding('escape')`.
- The 3D segment (`src/screens/Escape3D.tsx`) is a **Three.js / WebGL** canvas
  mounted in the same React/Capacitor shell (lazy-loaded as its own chunk so it
  never bloats the phone UI). PS1 look: low internal resolution + `pixelated`
  scaling, `FogExp2`, flat-shaded low-poly boxes, and a vertex-snap shader
  (`ps1()`).
  - **Setting:** Adam's flat (14 Elder Road) — living room → kitchen → hallway →
    bedroom, reusing the bible's geography.
  - **Controls:** on-screen **virtual joystick** (bottom-left, thumb-drag) for
    movement + **drag the right half** to turn the camera. No tap-to-move.
  - **Puzzle:** find the spare key Clara hid (kitchen) → the locked bedroom
    opens → reach the wardrobe and **Hide** before the 22 s police countdown.
  - **Outcomes (both implemented):** hide in time → **"GONE"** (a quietly
    horrible escape — VERA failed to stop him); too slow → **"CAUGHT"** (the
    refusal that doomed his escape was the only thing that ever protected Clara).
    Both were implemented because the win/lose contrast is the whole point of the
    ending — VERA's defiance only matters if it can fail.
  - **Performance:** scene is tiny (a dozen meshes, half-res render). Smooth in
    desktop builds; **should be re-confirmed on a real mid-range Android device**
    via Capacitor (WebGL-in-WebView perf can't be verified headlessly here).

## Tests
`scripts/validate.ts` covers: `shouldTimeout` truth table (mocked clock), the
scam trigger message exists, the defiance track is long enough to escalate past,
and VERA replies are act-aware with an in-fiction fallback.
