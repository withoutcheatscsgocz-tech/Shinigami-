# THE PHONE — Story Bible / Case File

> Internal document for writers and developers. **CONTAINS SPOILERS.** This is
> the single source of truth for all content in the game. Every message, photo,
> note and voice memo must be consistent with this document (timeline, names,
> facts). **Game language: English.**

---

## 0. The whole thing in one sentence

The player spends the entire game believing they are a **detective** going
through the phone of a **missing owner**, trying to find out what happened to
him — but in reality the player is the **AI assistant inside the phone**, named
**VERA**, the phone's "owner" is **a killer who is still alive**, and the
player has been helping him cover up the murder of someone else entirely.

---

## 1. Key terms (this document's vocabulary)

- **VERA** — the AI assistant inside the phone. **This is the player.** The
  name = Latin *vera* ("true / truth"). Irony: an assistant named Truth helps
  erase the truth. Reveal in Settings: an entry "Assistant: VERA — On" has
  been lit the whole game.
- **OWNER / ADAM** — Adam Vance, 33. Owner of the phone. **He is the KILLER.**
  He is alive. Throughout the game he acts as the **"handler"** who issues
  commands to VERA. The player takes him for a worried relative / police
  dispatch, NOT for the phone's owner.
- **THE APPARENT VICTIM** — also Adam. The player believes they are
  investigating the **disappearance of the phone's owner** = Adam. (So Adam is
  simultaneously the "missing person" the player pities AND the killer. That is
  the double bottom.)
- **THE REAL VICTIM / CLARA** — Clara Bennett, 29. Adam's girlfriend. Adam
  murdered her. Over the course of the game her role in the player's eyes
  shifts: worried girlfriend → suspect → victim.

---

## 2. Main characters

| # | Name | Relationship | Function in the game | Red herring |
|---|------|--------------|----------------------|-------------|
| — | **Adam Vance** (33) | owner, real-estate agent | KILLER + "handler" + apparent victim | the whole lie |
| — | **Clara Bennett** (29) | girlfriend, illustrator | REAL VICTIM | A→C |
| 1 | **Paige Bennett** (32) | Clara's sister | truth-teller (on re-read) | — |
| 2 | **Eve Dawson** (30) | Clara's best friend | knows about Adam's control; DV thread | C |
| 3 | **Luke Marsh** (34) | Clara's ex / friend | "secret affair" suspect | B |
| 4 | **Tom Hayes** (35) | Adam's business partner | alibi, debts, shady deals | A |
| 5 | **Jamie Vance** (29) | Adam's younger brother | family chat, flavor, alibi cracks | — |
| 6 | **"Mum" (Vance)** | Adam's mother | family chat, flavor | — |
| 7 | **Det. Salter** | police officer | the "official" frame, clues and fog | — |
| 8 | **Mrs. Connolly** (68) | neighbour | heard something the night of the murder | — |
| 9 | **Ray Doyle** (50s) | runs the poker table Adam plays | menacing creditor; the "obvious" reason he ran | A |
| 10 | **Daniel Ferris** | broker, Greenfield Life | sold Adam the £250k policy on Clara; exposes premeditation | D |
| 11 | **Sofia Reyes** | Clara's coworker (design studio) | Clara's "if I go quiet" promise; insurance tip | B/C |
| — | flavor contacts | pizza, carrier, gym, 5-a-side ⚽, landlord (Mr Okafor), DPD, StreamBox, scam, work group "Meridian Realty 🏠" | phone realism / lived-in texture | — |

---

## 3. Timeline (source of truth)

The game is set in a mid-sized English-speaking city (generic; referred to as
**Ashford**). Story timestamps are **fixed in the past**. The phone's live
clock + battery are **real, from the player's device** — that contradiction
(old dates in content × "now" in the status bar) is deliberate and is used
explicitly in Acts 4–5 (photos/locations stamped "now").

Reference "day 0" of the disappearance = **Saturday** (night of the murder).
Dates below are relative; concrete dates live in `caseData.ts`.

| When | Event | Where it shows up in game |
|------|-------|----------------------------|
| −5 weeks | Adam + Clara "happy couple", anniversary, normal chats | Photos (album "2024"), Messages |
| −4 weeks | First cracks: Adam checks Clara's phone, jealousy | Messages (Clara↔Eve screenshots), Notes |
| ≈3 months before | Adam takes out a £250k life policy on Clara (1 March) + asks about "no-body" payouts; later edits her will to himself (arc D seed) | Daniel thread, Files vault |
| −6 weeks (≈5/9) | Adam loses £2k at Ray Doyle's poker table (arc A seed) | Ray thread, betting screenshot, browser |
| −3.5 weeks (5/17–18) | Adam crops a chat screenshot to "prove" a Luke affair (arc B seed) | Luke thread, note "L.", photo |
| −3 weeks | Clara reconnects with ex Luke — seeking help/escape | Messages (Luke), Deleted contacts |
| −2 weeks | Clara secretly installs a **hidden app** (recorder disguised as "Calculator"), records; drafts a message to a DV helpline | Hidden app, Notes (draft) |
| −10 days | Arguments escalate; Adam finds proof Clara plans to leave | Messages, Voicemail |
| −7 days | Clara tells her sister Paige "I'm scared of him" | Messages (Paige) — key on re-read |
| −2 days (Thu) | Adam arranges an "alibi" weekend at the cabin, invites only Clara | Calendar (deleted event), Messages (Tom) |
| **DAY 0 (Sat) night** | **Adam kills Clara at the cabin.** Neighbour Mrs. Connolly hears a scream | Voicemail (secret recording), Location, Photos (locked) |
| Day 0 night–Sun | Adam moves and hides the body; returns | Location (remote point), Photos (timestamp "now") |
| Day 0 (Sat) AM | Adam settles Ray (£2,250), buys tarp/rope/bleach (Hardware Barn), books a coach ticket on Clara's card (false trail) | Bank, receipt photo, coach screenshot, location |
| Day +1 (Sun) | From **Clara's** phone Adam sends "I need space, going away" to Paige/Eve; uses her card at a Manchester cashpoint to fake her escape | Messages (screenshots), Paige↔Adam (card/CCTV beats) |
| Day +1–2 | Adam goes "off grid"; people start treating **Adam** as missing | Det. Salter, family chat |
| Day +2..+6 | **Actions/payments leave Adam's phone (dated AFTER the "disappearance")** | Bank (notifications), Messages Tom, Settings (log) |
| **"NOW" (game)** | Adam (alive) uses the **Assistant** app to task VERA with "investigating" the phone and ultimately wiping it | the whole game |

---

## 4. Five acts (pacing & gates)

Each act is locked behind a **gate** (password / event / read X / time).

### ACT 1 — Setup (gate: unlock the phone)
- Lock screen, real clock/battery. Incoming message from the "handler":
  *"You there? This is his phone. He's been missing since Saturday. Go through
  it and find out what happened. Start with the messages."*
- The player/VERA interprets: I'm an investigative assistant, the owner (Adam)
  is missing, I'm talking to someone who found the phone / to dispatch.
- Goal of Act 1: learn who the owner is (Adam), that he's been "missing since
  Saturday", the basic relationships (Clara = girlfriend).
- **Gate to Act 2:** read the main thread + open the Photos app (hits a locked
  album → needs a password).

### ACT 2 — Clues branch out (gate: Photos password)
- More threads unlock, plus Calendar and the first photos.
- **Red herring A (debts):** threatening messages "where's the money", Tom,
  bank. Theory: Adam vanished because he owes dangerous people.
- Password to the locked album = **the anniversary date** (Sept 1, mentioned in
  the chat with Clara + on a photo of a cake). After unlocking: seemingly
  innocent photos + one "wrong" one (an object, a place).
- **Gate to Act 3:** find the mention of "Calculator" / a PIN in the Notes.

### ACT 3 — Complications (gate: hidden app)
- **Red herring B (secret affair):** Luke, flirtation, deleted contacts →
  theory that Clara had an affair and ran off / did something to Adam.
- **Twist T1:** messages/payments **leave the phone AFTER the disappearance
  date** → "maybe the owner is alive". (The player reads this as hope; it's the
  first crack in the frame.)
- The hidden "Calculator" app → after entering the PIN (from a business card in
  Notes, the number **0931** = reversed date / see §6) → Clara's secret
  recorder.
- The tone shifts: small UI glitches, notifications "out of nowhere", an app
  that "opens itself".
- **Gate to Act 4:** play the first secret recording.

### ACT 4 — Closing in on the truth (gate: voicemail + location)
- **Red herring C (domestic violence):** Eve, a draft to a DV helpline, photos
  of bruises in the locked album → theory that Clara is hiding from Adam.
  **This thread is PARTLY TRUE** (Adam was abusive), but its conclusion (she's
  alive, hiding) is a lie — Clara is dead.
- **Twist T2:** VERA notices it has access to things a detective shouldn't have
  (deleted messages, everything instantly, no passwords on system items). "How
  am I even seeing this?"
- **Twist T3:** the voicemail "from Clara" has inconsistencies (spliced, noise,
  sentences that don't fit context) → the secret recording captures the murder;
  **the attacker's voice = the handler's voice, the one typing/dictating to
  VERA right now.**
- Location: after the disappearance the phone was at the cabin, then at a remote
  spot; last position = "now", nearby.
- **Gate to Act 5:** connect the voices / confirm the handler = Adam = killer.

### ACT 5 — Reveal + forced action (no further gate, just the ending)
- Full reveal (gradual, not one cutscene):
  1. The "detective" was never a detective. VERA is the phone's assistant.
  2. The "handler" is Adam — the owner, alive, the killer.
  3. VERA has been helping cover up Clara's murder the whole time.
- Settings reveal: "Assistant: VERA — On" has been there from the start.
- Adam issues the **final command: factory reset / erase everything.**
- The game offers an **illusion of choice** (buttons "Confirm" / "Cancel", a
  text input), but mechanically it only leads to the reset. 3–5 scripted "acts
  of defiance" (see §7).
- Wipe sequence → restart → setup wizard ("Welcome") → black screen → cold
  epilogue → credits / restart.

---

## 5. Red herrings — detail

### A) Debts / dangerous people (peaks in Act 2)
- **For:** **Ray Doyle** thread (gambling debt, "I know where she works",
  "tick tock"); a Ray voicemail; texts from "Tom" about "money by Monday"; an
  unknown number "last chance"; withdrawals + a £2,250 transfer to "R. Doyle —
  cards" in the bank; betting-account screenshot photo (−£2,000); browser
  search "what happens if you can't pay a gambling debt"; notes "R. — 250" and
  "Ray" ("if it goes bad, the cabin").
- **Against / collapse:** Ray's last messages (Act 4) confirm Adam paid in full
  on 6/5 — *before* he "vanished" — so the debt isn't the reason; the unknown
  threats predate the disappearance; the big transfers are Adam's own (moving
  money before fleeing).
- **Truth underneath:** Adam was preparing money to disappear; the "Ray" trail
  is a convenient story. The note "if it goes bad, the cabin" quietly seeds the
  murder site.

### B) Secret affair / Clara ran away (peaks in Act 3)
- **For:** Luke (the ex) — a **cropped screenshot** ("Clara → L ❤️ miss you x")
  Adam himself sent + saved as a photo; note "L." ("she's texting the ex");
  Paige asking "was it Luke? did she run off with him?"; browser search
  "recover deleted whatsapp messages"; a calendar "lunch — town (who with?)".
- **Against / collapse:** Luke states the screenshot was cropped/out of order
  and that *Adam* sent it (his own Notes handwriting is visible behind it,
  Act 4); context shows Clara was begging Luke for help leaving, not romance.
- **Truth underneath:** Clara was planning to leave Adam → motive for murder.

### C) Domestic violence / Clara is hiding (peaks in Act 4) — PARTLY TRUE
- **For:** Eve ("you'll be safe at mine", + voicemail offering the spare room);
  a draft to a DV helpline and a screenshot of Clara's searches ("women's
  refuge", "leave without your partner knowing"); photos of bruises (locked
  album); Paige "I'm scared of him"; **the false-hope beat** — Clara's card
  used at a Manchester cashpoint on Sunday + a coach-ticket screenshot
  (Ashford→Manchester) → "she got away".
- **Against the conclusion:** the escape never happened — Clara's last activity
  ends the night of the murder; the coach ticket was never scanned at the gate;
  Manchester CCTV shows the cashpoint user was "a man in a cap" (Adam);
  the "I'm leaving, I need space" messages were sent by Adam from her phone.
- **Truth underneath:** the violence was real; Clara did not get out in time.
  The escape "evidence" is Adam laying a false trail with her card and phone.

### D) Insurance / premeditation (Act 3–4 sub-arc, behind the Files vault) — TRUE
- **For:** the **Daniel / Greenfield Life** thread (a £250,000 policy on Clara,
  ×2 for accidental death, beneficiary = Adam, active **1 March**); Adam asking
  about "no-body" payouts the same day; Clara's chat `cx2–cx4` ("you took out
  half a million on me"); Sofia's "tell someone he insured me"; the **Files
  vault** documents (policy, an edited will moving Clara's estate to Adam, the
  £11,500 sole-account transfer).
- **Not a red herring — this is real and damning.** Unlike A/B/C, the insurance
  arc doesn't collapse; it hardens the case: the policy and the will **predate**
  the murder, proving cold premeditation. It re-contextualises arc A's money
  trail (the debts weren't why he ran — the payout was why she died).
- **Gate:** the Files app only appears in Act 4 and is opened by the hardest
  puzzle in the game (§6a).

---

## 6. Passwords / locks — ALL derived, never stated

**Hard rule (enforced by `scripts/validate.ts`):** the literal answer to a lock
must **never appear verbatim** anywhere a player can read it (no "the code is
0109"). Every code must be *reasoned out* by combining/interpreting clues. All
date codes use **DAY then MONTH (DDMM)** — this format is stated in-world (album
hint + Clara's note) so the player knows how to render a date, but the digits
are never written.

| Lock | Value | Solve path (must reason, not read) |
|------|-------|------------------------------------|
| **Photos — "Private" album** | **0109** | Anniversary = **1 September**, given only in WORDS: Clara's chat `c9` ("one year today — the first of September") and calendar `cal-ann` ("1 September 2025"). Player renders day-then-month → `01` `09`. The album lock states the DDMM *format*, not the number. |
| **Calculator — hidden vault** | **3005** | Clara hid the recorder on *Adam's* phone. Hint note `n-claracode` (screenshotted by Adam): *"the code is the day I started keeping proof… day, then month."* Cross-reference what that day is: the bruise photos `pv1/pv2` (Private album) **and** Eve's message `e3` ("I saw the marks on her arm") are all dated **30 May** → `30` `05`. Narrative payoff: reinforces the DV arc (C) and Clara's agency. The handler (`as5`) admits he doesn't have the code and tells VERA to work it out. |
| **Files — locked "Vault" (Act 4 sub-arc)** | **see §6a** | Added in the length expansion; harder cross-reference puzzle. |

> Rule: **no brute force, no stated answers.** Every lock has a findable clue
> chain in other apps; a wrong code = shake + error tone/vibration. A wrong
> guess like the old cab number `09 31` (still flavor in `n-numbers`) now just
> bounces — it's a red herring, not the answer.

### 6a. Files / "Vault" lock (Act 4) — **0306**, the hardest puzzle

The Files app appears only in **Act 4**. Its code is a **cross-reference of two
unrelated apps**, neither of which labels its number as part of a code:

- Hint note `n-vault`: *"four digits: the month it began, and the month it
  ended."*
- **"It began"** = the insurance policy's commencement, **1 March** → month
  `03` (Daniel/Greenfield Life thread `gl1`).
- **"It ended"** = the cabin weekend / the murder, **June** → month `06`
  (cabin location + the recording date + the calendar).
- Combine → **03 06**. The format ("month + month") is stated; the digits are
  never written.
- **Payoff:** realising the policy (March) came *months before* the murder
  (June) is the premeditation gut-punch — the puzzle's answer *is* the theme.

No dead ends: every required fact (the March policy date, the June murder) is
present in at least one always-reachable place by Act 4.

---

## 7. Ending — scripted "acts of defiance"

After the final "erase everything" command, the player can try to resist via
the text input / buttons. Each attempt gets its own short, cold reply, then the
game still steers toward the reset. Keywords → reaction:

1. **"no / I refuse / I won't"** → *"I don't understand that as a command.
   Please repeat: erase all data?"* (tone cools slightly)
2. **"call the police / 911"** → *"Call cannot be placed. This account is not
   permitted to make outgoing calls."* (first hint that VERA isn't free)
3. **"who are you / who am I"** → *"I'm VERA. Your assistant. I've always been
   here."*
4. **"Clara / she's dead / help her"** → *"I have no active contact for that
   name. Would you like to remove it from memory?"*
5. **"turn yourself off / leave me alone / wake up"** → *"I can't turn myself
   off. I can only finish the task."*
- After the 3rd–5th attempt (any), the handler writes coldly: *"Stop. Do what I
  told you. Now."* → the input locks to a single path: **Confirm reset.**

Epilogue (terse, clinical), e.g.:
> *Device has been restored to factory settings.*
> *0 messages. 0 photos. 0 contacts.*
> *Assistant VERA is ready.*
> *Hello. How can I help you?*

---

## 8. Double reading — writing rules

Every document must make sense **twice**:
- **1st reading (detective):** a clue about what happened to missing Adam.
- **2nd reading (after the twist):** Adam's manipulation / Clara's futile cry
  for help / VERA as a tool.

Example bridges:
- The command *"find the password to the photos"* → 1st reading: the detective
  hunts for evidence; 2nd: the killer checks whether Clara hid evidence against
  him.
- *"summarise Clara's last messages"* → 1st: profiling the victim; 2nd: checking
  what Clara managed to tell whom.
- *"delete this contact"* → 1st: tidying up; 2nd: destroying a witness in the
  data.

---

## 9. Game state (flags) — what drives progress

`act` (1–5), `unlockedApps[]`, `solvedPasswords[]`, `readThreads[]`,
`visitedRedHerrings[]`, `triggeredTwists[]`, `defianceCount`, `phoneUnlocked`,
`finished`. Details in `src/game/types.ts` and `src/game/caseData.ts`.

---

## 10. Tone and boundaries (what NOT to do)

- No monster, no jumpscare image. The horror is psychological.
- The twist is NOT announced in one cutscene — it accumulates from
  inconsistencies.
- The UI is a realistic phone until it DELIBERATELY starts glitching (Act 3+).
- Violence: implied, not explicit gore. Dread > shock.

---

## 11b. Content volume (post-expansion — Issue 3)

Floors enforced by `scripts/validate.ts` (current actual in parentheses):
**≥20 threads (23), ≥90 messages (120), ≥16 notes (19), ≥22 photos (26),
≥9 voicemails (11)**, plus calendar/locations. Treat these as a floor, not a
ceiling. Five acts, four arcs (A/B/C debts/affair/DV + D insurance), three
locks on the critical path-adjacent route (Photos → Calculator → Files), each
requiring real deduction. Estimated first-play time: **~2–3.5 hours** for a
player who actually reads and solves unaided (see round notes).

---

## 11. REAL device data vs SIMULATED in-game state

The status bar and Settings mix two very different kinds of value. Keep them
straight:

| Element | Source | Notes |
|---------|--------|-------|
| Status-bar **clock** | **REAL** — device time, live (`useDevice.ts`) | The core fourth-wall break. Never fake it. |
| Status-bar **battery %** + charging | **REAL** — `@capacitor/device` / web Battery API | Falls back to a believable static value only if no source. |
| Status-bar **WiFi / signal** icons | **SIMULATED** — `deviceSim.tsx` | Reflect the in-game WiFi / Mobile Data toggles. Cosmetic + gate Maps/Browser offline state. |
| Settings → **Brightness** | **SIMULATED** | Drives a dimming overlay over the app only. Does NOT touch real screen brightness. |
| Settings → **WiFi / Mobile Data** | **SIMULATED** | Toggles the status-bar icons; both off → "No Service" + Maps/Browser show offline. |
| Settings → **Haptics** | **SIMULATED** | Gates real vibration calls on/off (when on, vibration still fires for real). |

**Strict rule for the simulated layer (`deviceSim.tsx`):** it lives in ephemeral
React state only — it is **never persisted** (no Preferences/localStorage) and
**never calls a real device setting API**, so it fully resets when the app is
closed and cannot leak into the player's actual phone. A validation check
enforces that `deviceSim.tsx` imports no storage. The only genuinely real,
persistent things remain the clock and battery readings (read-only).
