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
| — | flavor contacts | pizza, carrier, gym, work group "Meridian Realty 🏠", spam | phone realism | — |

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
| −3 weeks | Clara reconnects with ex Luke — seeking help/escape | Messages (Luke), Deleted contacts |
| −2 weeks | Clara secretly installs a **hidden app** (recorder disguised as "Calculator"), records; drafts a message to a DV helpline | Hidden app, Notes (draft) |
| −10 days | Arguments escalate; Adam finds proof Clara plans to leave | Messages, Voicemail |
| −7 days | Clara tells her sister Paige "I'm scared of him" | Messages (Paige) — key on re-read |
| −2 days (Thu) | Adam arranges an "alibi" weekend at the cabin, invites only Clara | Calendar (deleted event), Messages (Tom) |
| **DAY 0 (Sat) night** | **Adam kills Clara at the cabin.** Neighbour Mrs. Connolly hears a scream | Voicemail (secret recording), Location, Photos (locked) |
| Day 0 night–Sun | Adam moves and hides the body; returns | Location (remote point), Photos (timestamp "now") |
| Day +1 (Sun) | From **Clara's** phone Adam sends "I need space, going away" to Paige/Eve | Messages (screenshots in Adam's phone), Paige↔Adam |
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
- **For:** texts from "Tom" about "money by Monday", an unknown number "last
  chance", withdrawals/payments in the bank, a note "R. — 250".
- **Against / collapse:** the payments are Adam's own (moving money before
  fleeing); the "threats" predate the disappearance and concern a routine
  commission dispute; in a later thread Tom confirms the "debt" was settled
  long ago.
- **Truth underneath:** Adam was preparing money to disappear.

### B) Secret affair / Clara ran away (peaks in Act 3)
- **For:** Luke (the ex) — warm messages, "you can come to me any time",
  deleted contacts, a "screenshot" of Clara's chat.
- **Against / collapse:** context shows Clara was begging Luke for help leaving,
  not romance; the "flirt" is taken out of context; Adam did the deleting.
- **Truth underneath:** Clara was planning to leave Adam → motive for murder.

### C) Domestic violence / Clara is hiding (peaks in Act 4) — PARTLY TRUE
- **For:** Eve ("don't worry, you'll be safe at mine"), a draft message to a DV
  helpline (Notes), photos of bruises (locked album), Paige "I'm scared of him".
- **Against the conclusion:** clues show the escape never happened — Clara's
  last activity ends the night of the murder; the "I'm leaving, I need space"
  messages were sent by Adam from her phone (screenshots).
- **Truth underneath:** the violence was real; Clara did not get out in time.

---

## 6. Passwords / locks — ALL derivable from content

| Lock | Value | Where the clue is |
|------|-------|-------------------|
| Phone lock screen | swipe (Act 1) → later PIN **0901** for the "safe zone" | PIN = anniversary Sept 1; clue: cake photo "Sept 1" + chat |
| Locked Photos album | **0901** (Sept 1, anniversary) | Messages with Clara "one year 9/1 ❤️", cake photo |
| Hidden "Calculator" app (PIN) | **0931** | business card in Notes: "cab 09 31 …"; + Clara's note "in reverse" |
| Recorder/vault folder | inherited from unlocking Calculator | — |
| Gallery "private" video | **date** from calendar (deleted event "cabin 5/30") | Calendar + Location |

> Rule: **no brute force.** For every lock there is a findable clue in another
> app. A wrong password = shake + error tone/vibration.

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
