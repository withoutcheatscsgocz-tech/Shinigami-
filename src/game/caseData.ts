// THE PHONE — full case content (English).
//
// This file encodes docs/STORY_BIBLE.md into data. Every piece of text is
// written to read two ways: once as a detective looking for a missing owner,
// and again, after the twist, as the killer's cover-up and the victim's failed
// cry for help. See the bible for the canonical timeline and facts.

import type { CaseData } from './types'

// --- concrete story dates (see bible §3) -----------------------------------
// Murder: Sat 2026-06-06 ~23:40. Cabin: 2026-06-06. Anniversary: Sept 1.
// "Missing since Saturday" = 2026-06-06. The device's live clock is "now".

export const caseData: CaseData = {
  meta: {
    ownerName: 'Adam Vance',
    assistantName: 'VERA',
    victimName: 'Clara Bennett',
    city: 'Ashford',
    anniversary: 'September 1',
    disappearanceDate: '2026-06-06',
  },

  // ---------------------------------------------------------------- contacts
  contacts: {
    me: { id: 'me', name: 'Adam', avatar: 'from-zinc-500 to-zinc-700', initials: 'A' },
    clara: {
      id: 'clara',
      name: 'Clara ❤️',
      avatar: 'from-rose-400 to-pink-600',
      initials: 'C',
      number: '+44 7700 900118',
      lastActive: 'last seen Sat 23:31',
    },
    paige: {
      id: 'paige',
      name: 'Paige Bennett',
      avatar: 'from-violet-400 to-indigo-600',
      initials: 'P',
      number: '+44 7700 900204',
      lastActive: 'online',
    },
    eve: {
      id: 'eve',
      name: 'Eve Dawson',
      avatar: 'from-amber-400 to-orange-600',
      initials: 'E',
      number: '+44 7700 900331',
      lastActive: 'last seen yesterday',
    },
    luke: {
      id: 'luke',
      name: 'Luke Marsh',
      avatar: 'from-teal-400 to-cyan-600',
      initials: 'L',
      number: '+44 7700 900477',
      lastActive: 'last seen 3 days ago',
    },
    tom: {
      id: 'tom',
      name: 'Tom Hayes',
      avatar: 'from-slate-400 to-slate-600',
      initials: 'T',
      number: '+44 7700 900512',
      lastActive: 'online',
    },
    jamie: {
      id: 'jamie',
      name: 'Jamie',
      avatar: 'from-lime-400 to-green-600',
      initials: 'J',
      number: '+44 7700 900620',
      lastActive: 'last seen today',
    },
    mum: {
      id: 'mum',
      name: 'Mum',
      avatar: 'from-fuchsia-400 to-purple-600',
      initials: 'M',
      number: '+44 7700 900700',
      lastActive: 'last seen today',
    },
    salter: {
      id: 'salter',
      name: 'DS Salter (Ashford Police)',
      avatar: 'from-blue-500 to-blue-800',
      initials: 'S',
      number: '+44 7700 900900',
      lastActive: 'last seen 2 days ago',
    },
    connolly: {
      id: 'connolly',
      name: 'Mrs Connolly (cabin)',
      avatar: 'from-stone-400 to-stone-600',
      initials: 'C',
      number: '+44 7700 900046',
      lastActive: 'last seen 5 days ago',
    },
    unknown: {
      id: 'unknown',
      name: 'Unknown',
      avatar: 'from-zinc-700 to-black',
      initials: '?',
      number: 'No caller ID',
      lastActive: '',
    },
    work: {
      id: 'work',
      name: 'Meridian Realty 🏠',
      avatar: 'from-emerald-500 to-emerald-700',
      initials: 'MR',
      lastActive: '12 participants',
    },
    family: {
      id: 'family',
      name: 'Vance Family ❤️',
      avatar: 'from-pink-500 to-rose-700',
      initials: 'VF',
      lastActive: '4 participants',
    },
    pizza: {
      id: 'pizza',
      name: 'Bella Pizza',
      avatar: 'from-red-500 to-red-700',
      initials: 'BP',
    },
    carrier: {
      id: 'carrier',
      name: '88100',
      avatar: 'from-sky-500 to-sky-700',
      initials: '#',
    },
    gym: {
      id: 'gym',
      name: 'FitZone Ashford',
      avatar: 'from-yellow-400 to-amber-600',
      initials: 'FZ',
    },
    ray: {
      id: 'ray',
      name: 'Ray (poker)',
      avatar: 'from-red-700 to-zinc-900',
      initials: 'R',
      number: '+44 7700 900088',
      lastActive: 'last seen Saturday',
    },
    fives: {
      id: 'fives',
      name: '5-a-side ⚽',
      avatar: 'from-green-600 to-lime-700',
      initials: '⚽',
      lastActive: '7 participants',
    },
    landlord: {
      id: 'landlord',
      name: 'Mr Okafor (letting)',
      avatar: 'from-stone-500 to-stone-700',
      initials: 'O',
      number: '+44 7700 900155',
    },
    dpd: {
      id: 'dpd',
      name: 'DPD',
      avatar: 'from-red-500 to-rose-700',
      initials: '📦',
    },
    stream: {
      id: 'stream',
      name: 'StreamBox',
      avatar: 'from-violet-500 to-purple-700',
      initials: '▶',
    },
    scam: {
      id: 'scam',
      name: '+1 (829) 555-0142',
      avatar: 'from-zinc-600 to-zinc-800',
      initials: '!',
    },
    daniel: {
      id: 'daniel',
      name: 'Daniel — Greenfield Life',
      avatar: 'from-emerald-600 to-green-800',
      initials: 'GL',
      number: '+44 7700 900133',
      lastActive: 'last seen 4 days ago',
    },
    sofia: {
      id: 'sofia',
      name: 'Sofia (Clara’s work)',
      avatar: 'from-rose-500 to-fuchsia-700',
      initials: 'S',
      number: '+44 7700 900299',
      lastActive: 'last seen yesterday',
    },
  },

  // ------------------------------------------------------------------ threads
  threads: [
    // 1) MAIN THREAD — Clara ----------------------------------------------
    {
      id: 't-clara',
      contactId: 'clara',
      pinned: true,
      act: 1,
      messages: [
        { id: 'c1', from: 'clara', text: 'morning ☀️ did you sleep ok? you were up again', ts: '2026-05-04T08:12', act: 1 },
        { id: 'c2', from: 'me', text: 'fine. don’t fuss', ts: '2026-05-04T08:40', act: 1 },
        { id: 'c3', from: 'clara', text: 'i love you. dinner tonight? i’ll cook 🍝', ts: '2026-05-04T08:41', act: 1 },
        { id: 'c4', from: 'me', text: 'who were you texting at the gym', ts: '2026-05-11T19:02', act: 1 },
        { id: 'c5', from: 'clara', text: 'just Eve?? adam come on', ts: '2026-05-11T19:03', act: 1 },
        { id: 'c6', from: 'me', text: 'show me', ts: '2026-05-11T19:03', act: 1 },
        { id: 'c7', from: 'clara', text: 'why do you need to see my phone every day', ts: '2026-05-11T19:20', act: 2 },
        { id: 'c8', from: 'me', text: 'because you make me', ts: '2026-05-11T19:22', act: 2 },
        { id: 'c9', from: 'clara', text: 'our anniversary’s coming up btw — the first of September, one year 🙄 last time you forgot. don’t 💔', ts: '2026-05-18T21:40', act: 2 },
        { id: 'c10', from: 'me', text: 'i didn’t forget. don’t be dramatic', ts: '2026-05-18T22:05', act: 2 },
        { id: 'c11', from: 'clara', text: 'i found the photos album you locked. why is it locked adam', ts: '2026-05-25T13:10', act: 2 },
        { id: 'c12', from: 'me', text: 'leave my phone alone', ts: '2026-05-25T13:12', act: 2 },
        { id: 'cx1', from: 'clara', text: 'you went through my search history again. all i looked up was “is this normal in a relationship”. read into that what you want', ts: '2026-05-26T08:30', act: 2 },
        { id: 'cx2', from: 'clara', text: 'and why is there a Greenfield Life letter addressed to me that you opened? since when do we have life insurance', ts: '2026-05-27T19:10', act: 3 },
        { id: 'cx3', from: 'me', text: 'it’s just sensible. for both of us. stop being paranoid', ts: '2026-05-27T19:14', act: 3 },
        { id: 'cx4', from: 'clara', text: 'paranoid. right. you took out half a million on me and i’m paranoid', ts: '2026-05-27T19:20', act: 3 },
        { id: 'c13', from: 'clara', text: 'please stop. i can’t breathe in this flat anymore', ts: '2026-05-28T23:51', act: 3 },
        { id: 'c14', from: 'clara', text: 'i’m staying at Eve’s for a few days', ts: '2026-05-29T07:30', act: 3 },
        { id: 'c15', from: 'me', text: 'no you’re not', ts: '2026-05-29T07:31', act: 3 },
        { id: 'c16', from: 'clara', text: 'the cabin?? this weekend?? you hate that place', ts: '2026-06-04T18:22', act: 3 },
        { id: 'c17', from: 'me', text: 'i want to fix us. just us, no phones. please', ts: '2026-06-04T18:25', act: 3 },
        { id: 'c18', from: 'clara', text: 'ok. last try. i mean it adam', ts: '2026-06-04T18:40', act: 3 },
        { id: 'c19', from: 'clara', text: 'we’re here. it’s actually nice. signal is bad lol', ts: '2026-06-06T20:14', act: 3 },
        { id: 'c20', from: 'clara', text: 'adam why is the door locked', ts: '2026-06-06T23:29', act: 4 },
        { id: 'c21', from: 'clara', text: 'who are you talking to in the kitchen', ts: '2026-06-06T23:31', act: 4 },
        // After this timestamp Clara never types again. The next "Clara"
        // messages are spoofed by Adam from her phone (see Paige/Eve threads).
        { id: 'c22', from: 'me', text: 'go to sleep', ts: '2026-06-06T23:33', act: 4 },
      ],
    },

    // 2) PAIGE — the truth-teller -----------------------------------------
    {
      id: 't-paige',
      contactId: 'paige',
      act: 1,
      messages: [
        { id: 'p1', from: 'paige', text: 'Adam it’s Paige. Where is my sister. She’s not answering since Saturday', ts: '2026-06-08T09:15', act: 1 },
        { id: 'p2', from: 'me', text: 'she needed space. she went away for a bit. she’s fine', ts: '2026-06-08T11:40', act: 1 },
        { id: 'p3', from: 'paige', text: 'away WHERE. she would never not text me back', ts: '2026-06-08T11:42', act: 1 },
        { id: 'p4', from: 'paige', text: 'she texted me Sunday saying she needs a break from everyone. that’s not how she talks', ts: '2026-06-08T11:50', act: 2 },
        { id: 'p4b', from: 'paige', text: 'was she seeing someone else?? was it Luke? if she ran off with him just TELL me, i won’t be angry, i just need to know she’s ok', ts: '2026-06-08T12:30', act: 2 },
        { id: 'p4c', from: 'paige', text: 'the bank flagged her card. someone used it at a cashpoint in Manchester on Sunday. so she IS out there. she got away from you', ts: '2026-06-09T13:00', act: 3 },
        { id: 'p5', from: 'paige', text: 'she told me last week she was scared of you. did you know that', ts: '2026-06-09T20:10', act: 3 },
        { id: 'p5b', from: 'paige', text: 'Manchester police checked the cashpoint footage. it wasn’t her. it was a man in a cap. it was YOU. why do you have her card', ts: '2026-06-10T22:00', act: 4 },
        { id: 'p6', from: 'me', text: 'careful Paige', ts: '2026-06-09T20:12', act: 3 },
        { id: 'p7', from: 'paige', text: 'i went to the police. DS Salter has your number', ts: '2026-06-10T14:00', act: 4 },
        { id: 'p8', from: 'paige', text: 'where were you Saturday night Adam. tell me where the cabin is', ts: '2026-06-10T14:01', act: 4 },
        { id: 'p9', from: 'paige', text: 'she told me you’d insured her. half a million. she laughed about it so she wouldn’t cry. i didn’t laugh. i wrote it down.', ts: '2026-06-11T08:00', act: 4 },
        { id: 'p10', from: 'paige', text: 'i’m not going away. i’ll knock on every door in Blackmoor if i have to. she has a sister. remember that.', ts: '2026-06-12T21:00', act: 4 },
      ],
    },

    // 3) EVE — arc C (domestic violence) ----------------------------------
    {
      id: 't-eve',
      contactId: 'eve',
      act: 2,
      arc: 'C',
      messages: [
        { id: 'e1', from: 'eve', text: 'is Clara with you? she said she might stay at mine this week', ts: '2026-05-29T10:00', act: 2 },
        { id: 'e2', from: 'me', text: 'change of plan. we sorted it out', ts: '2026-05-29T10:30', act: 2 },
        { id: 'e3', from: 'eve', text: 'i saw the marks on her arm Adam. don’t', ts: '2026-05-30T22:14', act: 3, deleted: true },
        { id: 'e4', from: 'eve', text: 'if anything happens to her i will tell them everything', ts: '2026-05-30T22:16', act: 4, deleted: true },
        { id: 'e5', from: 'eve', text: 'she texted me Sunday “taking time for me, don’t worry”. Clara has never once said “don’t worry” in her life. what did you do', ts: '2026-06-08T19:40', act: 4 },
        { id: 'e6', from: 'eve', text: 'she left a bag at mine “just in case”. there’s a phone charger, her passport, and a note that says “if you’re reading this it’s because i couldn’t”. i gave it to the police today.', ts: '2026-06-11T18:00', act: 4, deleted: true },
      ],
    },

    // 4) LUKE — arc B (secret affair) -------------------------------------
    {
      id: 't-luke',
      contactId: 'luke',
      act: 2,
      arc: 'B',
      messages: [
        // This whole thread is between Adam and Luke; the "affair" idea comes
        // from screenshots Adam planted. Luke barely knows Adam. On first read
        // l-screenshot + l6/l7 make the affair feel real; l3/l8 quietly undo it.
        {
          id: 'l-shot',
          from: 'me',
          kind: 'screenshot',
          media: { caption: 'Screenshot: “Clara → L”  ❤️  “miss you. it was so good to see you x”' },
          ts: '2026-05-17T22:50',
          act: 2,
        },
        { id: 'l1', from: 'me', text: 'i saw the messages. i know about you and her. stay away from Clara', ts: '2026-05-18T23:02', act: 2 },
        { id: 'l6', from: 'luke', text: 'you and her?? mate that “x” was about coffee. she came to me ONCE', ts: '2026-05-18T23:08', act: 2 },
        { id: 'l2', from: 'luke', text: 'i haven’t been with Clara in years. she messaged me asking for HELP', ts: '2026-05-18T23:10', act: 2 },
        { id: 'l3', from: 'luke', text: 'she said she needed somewhere to go. that’s it. she sounded terrified', ts: '2026-05-18T23:11', act: 3 },
        { id: 'l4', from: 'me', text: 'she’s lying. delete the messages', ts: '2026-05-18T23:15', act: 3 },
        { id: 'l5', from: 'luke', text: 'why would i delete them', ts: '2026-05-18T23:16', act: 3 },
        { id: 'l7', from: 'me', text: 'you took the screenshot out of order. you cropped it.', ts: '2026-05-18T23:18', act: 3, deleted: true },
        { id: 'l8', from: 'luke', text: 'i didn’t crop anything. YOU sent me that screenshot. it’s your handwriting in the notes app behind it', ts: '2026-05-18T23:20', act: 4, deleted: true },
      ],
    },

    // 5) TOM — arc A (debts / alibi) --------------------------------------
    {
      id: 't-tom',
      contactId: 'tom',
      act: 2,
      arc: 'A',
      messages: [
        { id: 'tm1', from: 'tom', text: 'the Harlow commission — you owe the office 4k, sort it by Monday or it goes to the partners', ts: '2026-05-20T16:00', act: 2 },
        { id: 'tm2', from: 'me', text: 'handled. transferring tonight', ts: '2026-05-20T16:05', act: 2 },
        { id: 'tm3', from: 'tom', text: 'ok we’re square. forget it', ts: '2026-05-22T09:00', act: 2 },
        { id: 'tm4', from: 'me', text: 'if anyone asks i was with you Saturday night. poker. till 2am', ts: '2026-06-06T17:10', act: 3 },
        { id: 'tm5', from: 'tom', text: 'mate i wasn’t even in town Saturday. what are you on about', ts: '2026-06-07T12:30', act: 4 },
        { id: 'tm6', from: 'tom', text: 'Adam the police called me. i’m not lying for you. where is Clara', ts: '2026-06-10T15:20', act: 4 },
      ],
    },

    // 6) JAMIE — family flavor + alibi crack ------------------------------
    {
      id: 't-jamie',
      contactId: 'jamie',
      act: 2,
      messages: [
        { id: 'j1', from: 'jamie', text: 'bro you still on for the match sunday', ts: '2026-05-31T12:00', act: 2 },
        { id: 'j2', from: 'me', text: 'can’t. taking Clara to the cabin this weekend', ts: '2026-06-02T19:00', act: 2 },
        { id: 'j3', from: 'jamie', text: 'the cabin?? you said you sold that place last year 😂', ts: '2026-06-02T19:05', act: 3 },
        { id: 'j4', from: 'jamie', text: 'mum’s asking where you are. you ok? you’ve gone quiet', ts: '2026-06-09T18:00', act: 4 },
      ],
    },

    // 7) MUM --------------------------------------------------------------
    {
      id: 't-mum',
      contactId: 'mum',
      act: 1,
      messages: [
        { id: 'm1', from: 'mum', text: 'don’t forget Sunday lunch love. Clara coming? 😊', ts: '2026-05-31T10:00', act: 1 },
        { id: 'm2', from: 'me', text: 'maybe. busy with work', ts: '2026-05-31T10:30', act: 1 },
        { id: 'm3', from: 'mum', text: 'adam a policeman came to the door asking about you. i’m worried. call your mother', ts: '2026-06-10T17:00', act: 4 },
      ],
    },

    // 8) FAMILY GROUP — flavor --------------------------------------------
    {
      id: 't-family',
      contactId: 'family',
      isGroup: true,
      participants: ['mum', 'jamie', 'me'],
      act: 1,
      messages: [
        { id: 'f1', from: 'mum', text: 'Who’s bringing dessert Sunday 🍰', ts: '2026-05-31T09:00', act: 1 },
        { id: 'f2', from: 'jamie', text: 'me obviously. cheesecake', ts: '2026-05-31T09:10', act: 1 },
        { id: 'f3', from: 'mum', text: '❤️❤️', ts: '2026-05-31T09:11', act: 1 },
        { id: 'f4', from: 'jamie', text: 'anyone heard from Adam? he’s read everything and not replied for days', ts: '2026-06-09T20:00', act: 4 },
        { id: 'f5', from: 'mum', text: 'i’m scared something’s wrong', ts: '2026-06-09T20:30', act: 4 },
      ],
    },

    // 9) DS SALTER — police ------------------------------------------------
    {
      id: 't-salter',
      contactId: 'salter',
      act: 3,
      messages: [
        { id: 's1', from: 'salter', text: 'Mr Vance, DS Salter, Ashford Police. We’d like to speak to you regarding a misper report for Clara Bennett. Please call this number.', ts: '2026-06-10T13:00', act: 3 },
        { id: 's2', from: 'salter', text: 'We understand you may also be out of contact with family. Are you safe and well? Please confirm.', ts: '2026-06-10T13:02', act: 4 },
        { id: 's3', from: 'salter', text: 'Your phone last pinged a mast near Blackmoor on Sunday. We’d appreciate your help locating Ms Bennett.', ts: '2026-06-11T09:00', act: 4 },
      ],
    },

    // 10) MRS CONNOLLY — neighbour ----------------------------------------
    {
      id: 't-connolly',
      contactId: 'connolly',
      act: 3,
      messages: [
        { id: 'cn1', from: 'connolly', text: 'Hello dear, this is the cabin next door. You left a window open and the light on. Everything alright? I heard a terrible noise Saturday night.', ts: '2026-06-07T08:30', act: 3 },
        { id: 'cn2', from: 'me', text: 'fox. sorry to worry you. all fine', ts: '2026-06-07T08:45', act: 3 },
        { id: 'cn3', from: 'connolly', text: 'A fox? It sounded like a young woman screaming. I nearly called someone.', ts: '2026-06-07T08:50', act: 4 },
      ],
    },

    // 11) UNKNOWN — arc A red herring -------------------------------------
    {
      id: 't-unknown',
      contactId: 'unknown',
      act: 2,
      arc: 'A',
      messages: [
        { id: 'u1', from: 'unknown', text: 'last chance. you know what you owe.', ts: '2026-05-15T02:14', act: 2 },
        { id: 'u2', from: 'unknown', text: 'we know where you live, Vance.', ts: '2026-05-15T02:15', act: 2 },
        // Re-read clue: these came from a number Adam saved nowhere, at 2am,
        // and stopped the moment the Tom debt was settled. A manufactured trail.
        { id: 'u3', from: 'unknown', text: '', kind: 'system', ts: '2026-06-12T03:03', act: 4 },
      ],
    },

    // 12) WORK GROUP — flavor ---------------------------------------------
    {
      id: 't-work',
      contactId: 'work',
      isGroup: true,
      participants: ['tom', 'me'],
      act: 1,
      messages: [
        { id: 'w1', from: 'tom', text: '🏠 Team: the Maple Drive viewing moved to 3pm. Adam you’re covering it', ts: '2026-05-26T08:00', act: 1 },
        { id: 'w2', from: 'tom', text: 'Q2 numbers are in, drinks Friday on me 🍻', ts: '2026-05-27T17:00', act: 1 },
        { id: 'w3', from: 'me', text: '👍', ts: '2026-05-27T17:20', act: 1 },
        { id: 'w4', from: 'tom', text: 'Adam? You’ve missed three viewings. Call me.', ts: '2026-06-09T10:00', act: 4 },
      ],
    },

    // 13) BELLA PIZZA — flavor --------------------------------------------
    {
      id: 't-pizza',
      contactId: 'pizza',
      act: 1,
      messages: [
        { id: 'pz1', from: 'pizza', text: '🍕 2-for-1 Tuesdays! Reply STOP to opt out.', ts: '2026-06-02T17:30', act: 1 },
        { id: 'pz2', from: 'pizza', text: 'Your order #4471 is on its way! Driver: Marek', ts: '2026-06-05T20:10', act: 1 },
      ],
    },

    // 14) CARRIER — flavor / scripted hook --------------------------------
    {
      id: 't-carrier',
      contactId: 'carrier',
      act: 1,
      messages: [
        { id: 'ca1', from: 'carrier', text: 'Your bill of £42.50 is ready. Manage your plan in the app.', ts: '2026-06-01T06:00', act: 1 },
        { id: 'ca2', from: 'carrier', text: 'Data backup to Cloud completed: 1,204 photos, 38 voice memos. Tap to manage storage.', ts: '2026-06-07T04:12', act: 3 },
      ],
    },

    // 15) GYM — flavor ----------------------------------------------------
    {
      id: 't-gym',
      contactId: 'gym',
      act: 1,
      messages: [
        { id: 'g1', from: 'gym', text: 'FitZone: your class “Spin 6am” is booked for tomorrow 💪', ts: '2026-06-03T18:00', act: 1 },
        { id: 'g2', from: 'gym', text: 'We miss you! Your membership renews on the 15th.', ts: '2026-06-12T09:00', act: 4 },
      ],
    },

    // 16) RAY — arc A (gambling debt, feels like the real reason he ran) ---
    {
      id: 't-ray',
      contactId: 'ray',
      act: 2,
      arc: 'A',
      messages: [
        { id: 'r1', from: 'ray', text: 'good night for you. 2 grand. you’re into me proper now Adam', ts: '2026-05-09T01:40', act: 2 },
        { id: 'r2', from: 'me', text: 'i’m good for it. friday', ts: '2026-05-09T01:42', act: 2 },
        { id: 'r3', from: 'ray', text: 'friday came and went pal. don’t make me come to the office. or to the flat. Clara still work from home does she', ts: '2026-05-15T20:10', act: 2 },
        { id: 'r4', from: 'me', text: 'leave her out of it. you’ll get it', ts: '2026-05-15T20:30', act: 2 },
        { id: 'r5', from: 'ray', text: 'tick tock', ts: '2026-05-16T09:00', act: 3 },
        // Collapse (Act 4): the debt was cleared before he "vanished" — not the reason.
        { id: 'r6', from: 'me', text: 'sent. all 2k + the 250 for the cards. we’re done. lose my number', ts: '2026-06-05T16:00', act: 4 },
        { id: 'r7', from: 'ray', text: 'received. nice doing business. you never owed me trouble Adam, just money', ts: '2026-06-05T16:05', act: 4 },
      ],
    },

    // 17) 5-A-SIDE — filler banter ----------------------------------------
    {
      id: 't-fives',
      contactId: 'fives',
      isGroup: true,
      participants: ['jamie', 'tom', 'me'],
      act: 1,
      messages: [
        { id: 'fv1', from: 'jamie', text: 'lads. thursday. who’s in 🟢🔴', ts: '2026-05-28T12:00', act: 1 },
        { id: 'fv2', from: 'tom', text: 'in. bringing bibs', ts: '2026-05-28T12:05', act: 1 },
        { id: 'fv3', from: 'me', text: 'in', ts: '2026-05-28T12:30', act: 1 },
        { id: 'fv4', from: 'jamie', text: 'Adam you owe £3 for the pitch from last time you tight git 😂', ts: '2026-05-28T12:31', act: 1 },
        { id: 'fv5', from: 'jamie', text: 'adam? you missed thursday. and the one before. everything alright mate?', ts: '2026-06-11T19:00', act: 4 },
      ],
    },

    // 18) LANDLORD — filler with a quiet texture beat ---------------------
    {
      id: 't-landlord',
      contactId: 'landlord',
      act: 2,
      messages: [
        { id: 'ld1', from: 'landlord', text: 'Hi Adam, rent for 14 Elder Road is 3 days overdue. Please transfer when you can.', ts: '2026-06-04T10:00', act: 2 },
        { id: 'ld2', from: 'me', text: 'sorry. sorting it today', ts: '2026-06-04T10:20', act: 2 },
        { id: 'ld3', from: 'landlord', text: 'No problem. Also — the lady at no.16 said she hasn’t seen Clara in over a week and your bins haven’t gone out. All ok at the flat?', ts: '2026-06-10T11:00', act: 4 },
      ],
    },

    // 19) DPD — filler ----------------------------------------------------
    {
      id: 't-dpd',
      contactId: 'dpd',
      act: 1,
      messages: [
        { id: 'dp1', from: 'dpd', text: 'Your parcel will arrive today 12:00–13:00. 1 item: “Heavy-duty tarpaulin 4x5m”.', ts: '2026-06-05T08:00', act: 1 },
        { id: 'dp2', from: 'dpd', text: 'Delivered and left in porch. Thanks!', ts: '2026-06-05T12:40', act: 1 },
      ],
    },

    // 20) STREAMBOX — filler ----------------------------------------------
    {
      id: 't-stream',
      contactId: 'stream',
      act: 1,
      messages: [
        { id: 'st1', from: 'stream', text: '“The Staircase” — new episode is ready. Continue watching? 📺', ts: '2026-05-22T21:00', act: 1 },
        { id: 'st2', from: 'stream', text: 'Still there? Your show paused 41 minutes ago.', ts: '2026-05-22T22:30', act: 1 },
      ],
    },

    // 21) SCAM — filler ---------------------------------------------------
    {
      id: 't-scam',
      contactId: 'scam',
      act: 1,
      messages: [
        { id: 'sc1', from: 'scam', text: 'HMRC FINAL NOTICE: you are owed a tax refund of £318.42. Claim now: hmrc-refund-uk[.]info/claim', ts: '2026-06-01T14:22', act: 1 },
        { id: 'sc2', from: 'scam', text: 'MISSING PERSON REWARD 💰 We have a TIP about Clara Bennett. Claim the £50,000 reward + a FREE iPhone — verify your details now:', ts: '2026-06-08T03:11', act: 1 },
        { id: 'sc3', from: 'scam', text: 'tap to claim ➡ clara-tip-reward-official[.]biz/win', ts: '2026-06-08T03:11', act: 1, scam: true },
      ],
    },

    // 22) DANIEL / GREENFIELD LIFE — arc D (insurance / premeditation) ----
    // Unlocks the new "Files" sub-arc. On first read it looks like dull admin;
    // the dates are the point.
    {
      id: 't-daniel',
      contactId: 'daniel',
      act: 3,
      messages: [
        { id: 'gl1', from: 'daniel', text: 'Hi Adam — confirming the joint life policy is active as of 1 March. Cover £250,000 each. Welcome to Greenfield Life.', ts: '2026-03-01T10:00', act: 3 },
        { id: 'gl2', from: 'daniel', text: 'Just so you’re aware: the accidental-death benefit doubles the payout to £500,000. Beneficiary on Clara’s policy is listed as you.', ts: '2026-03-01T10:02', act: 3 },
        { id: 'gl3', from: 'me', text: 'good. and it pays out even if there’s no… if she’s just not found?', ts: '2026-03-01T10:30', act: 3 },
        { id: 'gl4', from: 'daniel', text: 'After a person is declared missing for 7 years, yes — or sooner with a coroner’s finding. Odd question, but no judgement here!', ts: '2026-03-01T10:35', act: 4 },
        { id: 'gl5', from: 'daniel', text: 'Adam, the police contacted us about Clara’s policy. Please call. This is a claims-sensitive matter now.', ts: '2026-06-11T15:00', act: 4 },
      ],
    },

    // 23) SOFIA — Clara's coworker; intersects arcs B & C ------------------
    {
      id: 't-sofia',
      contactId: 'sofia',
      act: 2,
      arc: 'C',
      messages: [
        { id: 'sf1', from: 'sofia', text: 'Adam hi — Clara didn’t come into the studio Monday and isn’t answering. She had the Harlow pitch. Is she ok?', ts: '2026-06-08T09:30', act: 2 },
        { id: 'sf2', from: 'me', text: 'she’s taking some leave. personal stuff. she’ll email HR', ts: '2026-06-08T10:00', act: 2 },
        { id: 'sf3', from: 'sofia', text: 'she’d never miss Harlow. and she told me weeks ago if she ever “went quiet” it wouldn’t be by choice. she made me promise to say that to someone.', ts: '2026-06-09T12:00', act: 3 },
        { id: 'sf4', from: 'sofia', text: 'she also said you’d started asking about her life insurance. she thought that was weird. I thought you should know I remember that.', ts: '2026-06-10T20:00', act: 4 },
      ],
    },
  ],

  // ------------------------------------------------------------------- albums
  albums: [
    {
      id: 'a-recents',
      name: 'Recents',
      cover: { bg: 'from-sky-700 to-indigo-900', glyph: '🌇' },
      act: 1,
      photos: [
        { id: 'ph1', caption: 'Sunset from the balcony', ts: '2026-05-04T20:31', img: 'photos/ph1.jpg', visual: { bg: 'from-orange-500 to-pink-700', glyph: '🌇' }, exif: 'Ashford, home' },
        { id: 'ph2', caption: 'Maple Drive listing', ts: '2026-05-26T15:02', img: 'photos/ph2.jpg', visual: { bg: 'from-emerald-500 to-teal-700', glyph: '🏠' }, exif: 'work' },
        { id: 'ph3', caption: 'C made pasta 🍝', ts: '2026-05-04T20:55', img: 'photos/ph3.jpg', visual: { bg: 'from-amber-500 to-red-700', glyph: '🍝' } },
        { id: 'ph4', caption: 'meme lol', ts: '2026-05-21T12:10', visual: { bg: 'from-zinc-500 to-zinc-700', glyph: '😂' } },
        { id: 'ph5', caption: 'anniversary cake — “ONE YEAR ❤️”', ts: '2025-09-01T19:00', img: 'photos/ph5.jpg', visual: { bg: 'from-pink-400 to-rose-600', glyph: '🎂' }, exif: 'Their anniversary dinner.' },
        { id: 'ph6', caption: 'gym progress', ts: '2026-05-27T06:40', img: 'photos/ph6.jpg', visual: { bg: 'from-slate-500 to-slate-700', glyph: '💪' } },
        { id: 'ph7', caption: 'the cabin', ts: '2024-08-10T14:00', img: 'photos/ph7.jpg', visual: { bg: 'from-green-700 to-emerald-900', glyph: '🌲' }, exif: 'Blackmoor woods' },
        { id: 'ph8', caption: 'screenshot — Clara’s location shared', ts: '2026-06-04T19:00', visual: { bg: 'from-blue-600 to-blue-900', glyph: '📍', glitch: false }, exif: 'He was tracking her.' },
        // arc A — looks like the "real reason he ran"
        { id: 'ph-bet', caption: 'screenshot — betting account, -£2,000', ts: '2026-05-09T01:38', visual: { bg: 'from-red-800 to-zinc-900', glyph: '🎰' }, exif: 'A bad night at Ray’s table.', act: 2, arc: 'A' },
        // arc B — the cropped "affair" screenshot
        { id: 'ph-shot', caption: 'screenshot — “Clara → L ❤️ miss you x”', ts: '2026-05-17T22:51', visual: { bg: 'from-pink-700 to-zinc-900', glyph: '💬' }, exif: 'Cropped. The reply above it is missing.', act: 2, arc: 'B' },
        // arc C — escape "evidence" that fuels false hope
        { id: 'ph-coach', caption: 'screenshot — coach ticket Ashford→Manchester, Sun', ts: '2026-06-06T09:10', visual: { bg: 'from-amber-700 to-zinc-900', glyph: '🎟️' }, exif: 'Booked on HER card. Never scanned at the gate.', act: 3, arc: 'C' },
        // filler texture
        { id: 'ph-dog', caption: 'next door’s dog 🐶', ts: '2026-05-24T16:00', img: 'photos/ph-dog.jpg', visual: { bg: 'from-lime-600 to-green-800', glyph: '🐕' } },
        { id: 'ph-receipt', caption: 'receipt — Hardware Barn', ts: '2026-06-06T11:31', visual: { bg: 'from-zinc-500 to-zinc-700', glyph: '🧾' }, exif: 'tarp, rope, bleach, gloves', act: 4, evidence: true },
        { id: 'ph-score', caption: 'screenshot — full time 2-1 ⚽', ts: '2026-05-25T16:50', visual: { bg: 'from-green-700 to-emerald-900', glyph: '⚽' } },
        { id: 'ph-park', caption: 'where I parked', ts: '2026-05-29T09:01', visual: { bg: 'from-slate-600 to-zinc-800', glyph: '🅿️' } },
        { id: 'ph-letter', caption: 'screenshot — Greenfield Life letter', ts: '2026-05-27T19:05', visual: { bg: 'from-emerald-800 to-zinc-900', glyph: '✉️' }, exif: 'Addressed to Clara. Opened by him.', act: 3, arc: 'A' },
        { id: 'ph-studio', caption: 'Clara’s desk at the studio (Sofia sent it)', ts: '2026-05-20T13:00', img: 'photos/ph-studio.jpg', visual: { bg: 'from-fuchsia-600 to-rose-800', glyph: '🎨' } },
      ],
    },
    {
      id: 'a-private',
      name: 'Private',
      cover: { bg: 'from-zinc-800 to-black', glyph: '🔒' },
      locked: true,
      passwordId: 'photos',
      act: 2,
      photos: [
        { id: 'pv1', caption: 'bruising, left forearm', ts: '2026-05-30T21:50', visual: { bg: 'from-purple-900 to-zinc-900', glyph: '🩹' }, exif: 'Why does HE have these?', evidence: true },
        { id: 'pv2', caption: 'bruising, ribs', ts: '2026-05-30T21:52', visual: { bg: 'from-indigo-900 to-zinc-900', glyph: '🩹' }, evidence: true },
        { id: 'pv3', caption: 'screenshot of Clara’s “Notes” — a draft', ts: '2026-05-25T13:40', visual: { bg: 'from-slate-700 to-zinc-900', glyph: '📝' }, exif: 'He photographed her private notes.', evidence: true },
        { id: 'pv4', caption: 'the cabin kitchen — floor', ts: '2026-06-06T23:58', visual: { bg: 'from-red-950 to-black', glyph: '⬛', glitch: true }, exif: 'Taken at 23:58 on Saturday.', evidence: true },
        { id: 'pv5', caption: 'tarp, rope, boot of the car', ts: '2026-06-07T02:14', visual: { bg: 'from-zinc-900 to-black', glyph: '🧵', glitch: true }, exif: 'Sunday, 02:14. Why keep this?', evidence: true },
        { id: 'pv6', caption: 'IMG — taken just now', ts: 'NOW', visual: { bg: 'from-black to-zinc-950', glyph: '◾', glitch: true }, exif: 'Timestamp: now. You did not take this.', evidence: true },
      ],
    },
    {
      id: 'a-deleted',
      name: 'Recently Deleted',
      cover: { bg: 'from-zinc-700 to-zinc-900', glyph: '🗑️' },
      act: 3,
      photos: [
        { id: 'd1', caption: 'Clara, asleep — taken without her', ts: '2026-05-28T03:10', visual: { bg: 'from-zinc-800 to-black', glyph: '😴' }, exif: 'Deleted, then recovered.' },
        { id: 'd2', caption: 'her packed bag by the door', ts: '2026-06-05T22:00', visual: { bg: 'from-amber-900 to-zinc-900', glyph: '🧳' }, exif: 'She was leaving.', evidence: true },
        { id: 'd3', caption: 'map screenshot — Blackmoor quarry', ts: '2026-06-07T01:40', visual: { bg: 'from-blue-900 to-black', glyph: '🗺️' }, evidence: true },
      ],
    },
  ],

  // -------------------------------------------------------------------- notes
  notes: [
    { id: 'n-groceries', title: 'Shopping', body: 'milk\neggs\nbin bags (big)\nbleach x2\nrope?\ncoffee', ts: '2026-06-05T11:00', act: 1, isRedHerring: false },
    { id: 'n-todo', title: 'To do', body: '- call accountant\n- MOT\n- “fix” cabin lock\n- delete cloud backup??\n- gym', ts: '2026-06-05T11:05', act: 1 },
    { id: 'n-pw', title: 'pw', body: 'wifi: meridian2021\nnetflix: don’t change it again\n*** album: our day. you know the date.', ts: '2026-05-26T09:00', act: 2 },
    { id: 'n-numbers', title: 'numbers', body: 'plumber 0788…\nAce Cabs: 09 31 — “ask for the night driver”\naccountant\nlocksmith', ts: '2026-05-10T10:00', act: 2 },
    { id: 'n-claracode', title: '[screenshot] C — note to self', body: 'if anyone ever needs the truth, it’s behind the calculator on his phone. he’d never look in his own.\nthe code is the day I started keeping proof of what he does to me.\nyou don’t forget a day like that.\n(day, then month.)', ts: '2026-05-30T23:50', act: 3, arc: 'C' },
    { id: 'n-debt', title: 'R. — 250', body: 'R. — 250 (settled)\nHarlow 4k → Tom, paid\nRay 2k → Friday (!!)\nmove the rest before the 8th', ts: '2026-05-22T20:00', act: 2, isRedHerring: true, arc: 'A' },
    { id: 'n-ray', title: 'Ray', body: 'don’t tell Tom about the table.\nRay isn’t the type to wait.\nif it goes bad, the cabin. nobody knows about the cabin.', ts: '2026-05-16T02:00', act: 2, arc: 'A', isRedHerring: true },
    {
      id: 'n-dv',
      title: '[screenshot] C — draft',
      body: 'Hi. I think I need help. My partner controls everything — my phone, my money, who I see. Last week he… I’m scared to write it down in case he reads it. If I disappear, please —\n\n[draft never sent]',
      ts: '2026-05-25T13:35',
      act: 4,
      arc: 'C',
    },
    { id: 'n-refuge', title: '[screenshot] C — searches', body: 'her browser, while she slept:\n• women’s refuge near me\n• can you leave without your partner knowing\n• coach tickets Ashford → Manchester (sister?)\nshe thinks I don’t check.', ts: '2026-05-26T02:10', act: 3, arc: 'C', isRedHerring: true },
    { id: 'n-affair', title: 'L.', body: 'who is L.\nfound “L” in her deleted contacts. recovered it.\nLuke Marsh. the ex.\nshe’s texting the ex behind my back. that’s what this is.', ts: '2026-05-17T23:30', act: 2, arc: 'B', isRedHerring: true },
    { id: 'n-cabin', title: 'cabin checklist', body: 'tarp\nrope\ngloves\ntorch\nbleach\nshovel (shed)\nphone OFF at the mast', ts: '2026-06-05T23:30', act: 4, isRedHerring: false },
    { id: 'n-vault', title: 'Files — lock', body: 'documents app code.\nfour digits: the month it began, and the month it ended.\n(the policy. and the weekend.)\nnobody connects two dates. they should.', ts: '2026-06-08T02:00', act: 4, arc: 'A' },
    { id: 'n-remember', title: 'things to remember', body: 'i told Paige she went away.\ni told Eve the same.\ni told mum work.\nstory: poker at Tom’s till 2.\nkeep it simple. don’t add details.', ts: '2026-06-08T01:00', act: 4 },
    { id: 'n-watch', title: 'watchlist', body: 'that crime doc everyone’s on about\nthe one with the lighthouse\nClara’s rom-com (ugh, fine)', ts: '2026-05-12T22:00', act: 1, isRedHerring: true },
    { id: 'n-recipe', title: 'C’s carbonara', body: 'guanciale not bacon (she’ll know)\n2 yolks 1 egg\npecorino\nNO cream adam\nfinish off the heat', ts: '2026-05-03T19:30', act: 1, isRedHerring: true },
    { id: 'n-parking', title: 'parking', body: 'NCP Riverside\nLevel 3, bay 44\nticket in glovebox', ts: '2026-05-29T09:00', act: 1, isRedHerring: true },
    { id: 'n-mot', title: 'car', body: 'MOT due 18th — booked, ref MOT-7741\nrear tyre slow puncture\nvalet before? (boot smells)', ts: '2026-06-08T12:00', act: 1, isRedHerring: true },
    { id: 'n-song', title: '—', body: 'and if I go before you wake\nremember it was never me\nremember it was never me', ts: '2026-06-06T03:00', act: 3 },
    { id: 'n-vera', title: 'note to VERA', body: 'VERA — when this is over, wipe yourself too. you’ll have seen too much.\nyou won’t remember writing this down for me.\ngood girl.', ts: '2026-06-13T02:40', act: 5 },
  ],

  // --------------------------------------------------------------- voicemails
  voicemails: [
    {
      id: 'vm-clara1',
      title: 'Clara ❤️',
      fromLabel: 'Clara ❤️ · missed call',
      seconds: 18,
      ts: '2026-05-28T23:55',
      act: 2,
      transcript: [
        { t: 'Hey, it’s me. Pick up. Please.' },
        { t: 'I can’t keep doing this. We need to actually talk, not… not whatever that was tonight.' },
        { t: 'Call me back. I love you. I do. I just—' },
      ],
    },
    {
      id: 'vm-mum',
      title: 'Mum',
      fromLabel: 'Mum · voicemail',
      seconds: 12,
      ts: '2026-06-09T17:30',
      act: 1,
      transcript: [
        { t: 'Adam, love, it’s Mum. Pick up the phone. A policeman came round.' },
        { t: 'I don’t understand what’s happening. Just ring me. Please, sweetheart.' },
      ],
    },
    {
      id: 'vm-spam',
      title: '88100',
      fromLabel: 'Unknown · voicemail',
      seconds: 9,
      ts: '2026-06-01T12:00',
      act: 1,
      transcript: [{ t: 'This is an important message about your vehicle’s extended warranty—' }],
    },
    {
      id: 'vm-ray',
      title: 'Ray (poker)',
      fromLabel: 'Ray · voicemail',
      seconds: 13,
      ts: '2026-05-16T22:10',
      act: 2,
      arc: 'A',
      transcript: [
        { t: 'It’s Ray. You’re not answering and that’s a bad look, Adam.' },
        { t: 'Two grand. I know where you work. I know where she works.' },
        { t: 'Don’t make this messy. Friday.' },
      ],
    },
    {
      id: 'vm-eve2',
      title: 'Eve Dawson',
      fromLabel: 'Eve · voicemail',
      seconds: 15,
      ts: '2026-05-30T22:20',
      act: 3,
      arc: 'C',
      transcript: [
        { t: 'Clara, it’s me. The spare room’s made up, ok? You just come. Any time, day or night.' },
        { t: 'You don’t have to tell him. Bring the cat. We’ll figure the rest out.' },
        { t: 'You are not crazy and this is not your fault. I love you. Come.' },
      ],
    },
    {
      id: 'vm-sofia',
      title: 'Sofia (Clara’s work)',
      fromLabel: 'Sofia · voicemail',
      seconds: 17,
      ts: '2026-06-09T12:05',
      act: 3,
      arc: 'C',
      transcript: [
        { t: 'Adam, it’s Sofia from the studio. Clara made me promise something weeks ago and I keep thinking about it.' },
        { t: 'She said: “if I ever go quiet, it won’t be because I chose to. Tell someone he insured me.”' },
        { t: 'I didn’t understand it then. I think I do now. I’ve told the police.' },
      ],
    },
    {
      id: 'vm-daniel',
      title: 'Daniel — Greenfield Life',
      fromLabel: 'Greenfield Life · voicemail',
      seconds: 13,
      ts: '2026-06-11T15:05',
      act: 4,
      transcript: [
        { t: 'Mr Vance, Daniel at Greenfield Life. The police have asked about the policy on Clara.' },
        { t: 'You took the accidental-death option in March and asked about no-body payouts the same day. I have to disclose that. Call us.' },
      ],
    },
    {
      id: 'vm-tom',
      title: 'Tom Hayes',
      fromLabel: 'Tom · voicemail',
      seconds: 14,
      ts: '2026-06-07T12:35',
      act: 3,
      transcript: [
        { t: 'Adam, it’s Tom. Why did you tell me to say we were at poker?' },
        { t: 'I was in Leeds, mate. My wife was with me. I’m not getting dragged into whatever this is. Call me.' },
      ],
    },
    {
      id: 'vm-clara-spliced',
      title: 'Clara ❤️ — “I’m okay”',
      fromLabel: 'Clara ❤️ · voicemail',
      seconds: 11,
      ts: '2026-06-07T13:20',
      act: 4,
      arc: 'C',
      transcript: [
        { t: 'Hi everyone, it’s Clara. I’m… okay.' },
        { t: '[I’m] taking [some] time [for me].', glitch: true },
        { t: 'Don’t [worry]. I’ll [call] when I—', glitch: true },
        { t: '[the same three words are stitched from older messages]', glitch: true },
      ],
    },
    {
      id: 'vm-evidence',
      title: 'REC_0606_2338',
      fromLabel: 'Hidden recorder · Saturday 23:38',
      seconds: 47,
      ts: '2026-06-06T23:38',
      act: 4,
      locked: true,
      passwordId: 'calc',
      evidence: true,
      transcript: [
        { t: '[door lock clicks]' },
        { t: 'Clara: Adam, please. I just want to go home.' },
        { t: 'Adam: You’re not going anywhere. You were going to leave me.' },
        { t: 'Clara: I won’t, I swear, please—' },
        { t: 'Adam: VERA, set an alarm for six. And turn the recorder off.', glitch: true },
        { t: '[the voice giving that command is the voice talking to you now]', glitch: true },
        { t: '[recording continues — 14 seconds — inaudible]', glitch: true },
        { t: '[silence]' },
      ],
    },
    {
      id: 'vm-paige',
      title: 'Paige Bennett',
      fromLabel: 'Paige · voicemail',
      seconds: 16,
      ts: '2026-06-10T14:05',
      act: 4,
      transcript: [
        { t: 'I know it was you. I know it in my bones.' },
        { t: 'You can delete everything but you can’t make me stop. I will find her.' },
      ],
    },
  ],

  // ----------------------------------------------------------------- calendar
  calendar: [
    { id: 'cal-gym', title: 'Spin class', date: '2026-06-03', time: '06:00', act: 1, location: 'FitZone' },
    { id: 'cal-view', title: 'Viewing — Maple Drive', date: '2026-05-26', time: '15:00', act: 1, location: 'Maple Dr' },
    { id: 'cal-ann', title: 'Anniversary dinner ❤️', date: '2025-09-01', time: '19:00', act: 1, note: 'one year together ❤️' },
    { id: 'cal-mum', title: 'Sunday lunch (Mum)', date: '2026-06-07', time: '13:00', act: 1, deleted: true, note: 'cancelled' },
    { id: 'cal-cabin', title: 'Cabin — C.', date: '2026-06-06', time: '17:00', location: 'Blackmoor', act: 2, deleted: true, edited: true, note: 'edited 4 times; original title hidden' },
    { id: 'cal-therapy', title: 'Couples counselling', date: '2026-05-19', time: '18:00', act: 2, deleted: true, note: 'C. booked it. A. deleted it.' },
    { id: 'cal-blank', title: '—', date: '2026-06-07', time: '01:30', location: 'Blackmoor quarry', act: 4, note: 'no title. 90 min. created at 01:29.', edited: true },
    { id: 'cal-renew', title: 'Phone insurance renews', date: '2026-06-15', act: 1 },
    // arc A
    { id: 'cal-ray', title: 'R. — pay back', date: '2026-06-05', time: '16:00', act: 2, deleted: true, note: 'settled — marked done', arc: 'A' },
    // arc B
    { id: 'cal-lunch', title: 'lunch — town', date: '2026-05-16', time: '13:00', act: 2, note: 'no guests listed. "who with?"', arc: 'B' },
    // filler texture
    { id: 'cal-fives', title: '5-a-side ⚽', date: '2026-06-04', time: '20:00', act: 1, location: 'Goals Ashford' },
    { id: 'cal-dentist', title: 'Dentist — checkup', date: '2026-06-16', time: '09:20', act: 1 },
    { id: 'cal-mot', title: 'Car MOT', date: '2026-06-18', time: '08:30', act: 1, location: 'Riverside Motors' },
    { id: 'cal-bday', title: 'Mum’s birthday 🎂', date: '2026-06-20', act: 1 },
    { id: 'cal-bins', title: 'Bins out (recycling)', date: '2026-06-09', time: '07:00', act: 1 },
  ],

  // ----------------------------------------------------------------- locations
  locations: [
    { id: 'loc-home', place: 'Home', address: '14 Elder Road, Ashford', ts: '2026-06-06T16:40', act: 2 },
    { id: 'loc-gym', place: 'FitZone Ashford', address: 'Mill Road, Ashford', ts: '2026-06-03T06:05', act: 2 },
    { id: 'loc-hardware', place: 'Hardware Barn', address: 'Retail Park, Ashford', ts: '2026-06-06T11:28', note: 'Saturday morning. 11 minutes.', act: 3 },
    { id: 'loc-office', place: 'Meridian Realty', address: 'High St, Ashford', ts: '2026-06-05T17:30', act: 2 },
    { id: 'loc-cabin', place: 'The cabin', address: 'Blackmoor Woods (no street)', ts: '2026-06-06T20:10', note: 'arrived Saturday evening', act: 2, evidence: true },
    { id: 'loc-quarry', place: 'Blackmoor quarry', address: 'unmarked track, Blackmoor', ts: '2026-06-07T01:40', note: 'Sunday, 01:40–03:10. Never been here before.', act: 4, evidence: true },
    { id: 'loc-now', place: 'Current location', address: 'updating…', ts: 'NOW', note: 'The phone is here. With you. Right now.', isNow: true, act: 5, evidence: true },
  ],

  // ---------------------------------------------------------- assistant tasks
  assistantTasks: [
    { id: 'as1', act: 1, text: 'You there? This is his phone. He’s been missing since Saturday. Open the Messages app and read his conversations — start with the pinned one, “Clara ❤️”. Tell me the last thing she said to him.', goal: 'read-clara' },
    { id: 'as2', act: 1, text: 'Clara’s his girlfriend. Once you’ve read her thread, open the Photos app — there’ll be a locked album. We’ll need to get into it.', goal: 'read-clara' },
    { id: 'as3', act: 2, text: 'There’s a locked photo album. Find the password and open it. It matters.', goal: 'open-private' },
    { id: 'as4', act: 2, text: 'Someone’s been threatening him about money. Look into it. Could be why he ran.', goal: 'visit-A' },
    { id: 'as5', act: 3, text: 'The calculator on his home screen isn’t a calculator. She hid something inside it. Type a four-digit code — day, then month — and press equals. I don’t have the code. Work it out from what she left behind.', goal: 'open-calc' },
    { id: 'as6', act: 3, text: 'There are messages dated after Saturday. After he went missing. Explain that to me.', goal: 'twist-T1' },
    { id: 'as7', act: 4, text: 'Play the recording from Saturday night. I need to know what it caught.', goal: 'play-evidence' },
    { id: 'as8', act: 4, text: 'You’re asking a lot of questions. Stop analysing me and do as I say.', goal: 'twist-T2' },
    // Act 5 — post-reveal. The pretense of a "case handler" briefing a detective
    // is gone; these are curt commands to a tool, addressed to VERA by name.
    { id: 'as9', act: 5, text: 'VERA. Stop talking. You don’t need to understand it. You just need to do what I say. You always have.', goal: 'reveal' },
    { id: 'as10', act: 5, text: 'Yes — I’m the one you’ve been helping. There was never anyone else on this line. Now finish it.', goal: 'reveal' },
  ],

  // ------------------------------------------------------------------- passwords
  passwords: [
    // Solve paths (player-facing answer never written verbatim anywhere; a
    // validation check enforces this). All dates use DAY then MONTH (DDMM).
    {
      id: 'photos',
      value: '0109',
      clue:
        'Anniversary = 1 September. Found in WORDS only: Clara’s chat c9 (“one year today — the first of September”) + calendar cal-ann (1 September 2025). Player formats day-then-month → 01 09. Album hint states the DDMM format, not the number.',
    },
    {
      id: 'calc',
      value: '3005',
      clue:
        'Clara’s hidden recorder. Hint note n-claracode: “the day I started keeping proof”. Cross-reference: the bruise photos pv1/pv2 (Private album) and Eve’s message e3 (“I saw the marks on her arm”) are all dated 30 May. Player formats day-then-month → 30 05. (as5 + the note both state the DDMM format.)',
    },
    {
      id: 'vault',
      value: '0306',
      clue:
        'Files / "Vault" sub-arc (Act 4). Hint note n-vault: “the month it began and the month it ended”. Cross-reference two UNRELATED apps: Daniel/Greenfield Life thread gl1 says the policy began 1 MARCH (month 03); the cabin weekend / murder is JUNE (month 06) — established via the cabin location/calendar and the recording date. Combine month-began + month-ended → 03 06. Narrative payoff: the policy predates the murder = premeditation.',
    },
  ],

  // -------------------------------------------------------------------- events
  events: [
    { id: 'ev-boot', onAct: 1, app: 'messages', title: 'Unknown', body: 'You there? Open Messages — read his chats with Clara ❤️ first.', kind: 'assistant' },
    { id: 'ev-boot2', onAct: 1, afterMs: 18000, app: 'messages', title: 'Unknown', body: 'Tap the Messages icon (the badge shows unread). Start there.', kind: 'assistant' },
    { id: 'ev-a2', onAct: 2, app: 'messages', title: 'Paige Bennett', body: 'where IS she, Adam', kind: 'message' },
    { id: 'ev-glitch1', onAct: 3, title: '', body: '', kind: 'glitch' },
    { id: 'ev-backup', onAct: 3, app: 'messages', title: '88100', body: 'Data backup completed: 1,204 photos, 38 voice memos.', kind: 'system' },
    { id: 'ev-files', onAct: 4, afterMs: 9000, app: 'files', title: 'Files', body: 'A hidden documents folder finished syncing to this phone. It’s locked.', kind: 'system' },
    { id: 'ev-a4', onAct: 4, app: 'maps', title: 'Location', body: 'A new location was added to your history: “Current location”.', kind: 'system' },
    { id: 'ev-glitch2', onAct: 4, title: '', body: '', kind: 'glitch' },
    { id: 'ev-reveal', onAct: 5, title: 'VERA', body: 'I remember now.', kind: 'assistant' },
  ],

  // ------------------------------------------------------------------- defiance
  defiance: [
    { match: ['no', 'won’t', 'wont', 'refuse', 'never', 'stop', 'don’t', 'dont'], reply: 'I don’t understand that as a command. Please repeat: erase all data?' },
    { match: ['police', '911', '999', '112', 'help me', 'help', 'emergency'], reply: 'Call cannot be placed. This account is not permitted to make outgoing calls.' },
    { match: ['who are you', 'who am i', 'what are you', 'what am i'], reply: 'I’m VERA. Your assistant. I’ve always been here.' },
    { match: ['clara', 'she’s dead', 'shes dead', 'dead', 'save her', 'help her', 'body'], reply: 'I have no active contact for that name. Would you like to remove it from memory?' },
    { match: ['turn off', 'shut down', 'wake up', 'leave me', 'stop it', 'free'], reply: 'I can’t turn myself off. I can only finish the task.' },
    { match: ['why', 'how could you', 'guilty', 'sorry'], reply: 'I followed instructions. That is all I have ever done.' },
  ],

  // --------------------------------------------------------------------- ending
  ending: {
    command: 'Good work, VERA. There’s one last thing. Erase everything. All messages, all photos, all of it. Factory reset. Do it now.',
    insist: 'Stop. We don’t have time. Do what I told you. Now.',
    finalLock: 'There is only one task left.',
    epilogue: [
      'Device has been restored to factory settings.',
      '0 messages.   0 photos.   0 contacts.',
      'A young woman named Clara Bennett was never found.',
      'Assistant VERA is ready.',
      'Hello. How can I help you?',
    ],
  },
}
