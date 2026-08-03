# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: the production stage manager (PSM) running a live performance from the booth
or the SM desk. They are working in a dim house, part of their attention on the stage,
part on the calling script, with a headset on. They cannot look away for long and they
cannot type a paragraph.

Secondary: ASMs and the director, who need to see the same notes in real time during
the run; and the actors, who receive only their own notes afterward.

Buying is split and both cases are real: an individual SM paying $9/mo out of pocket,
and a producing company, university, or touring company buying it for an SM team. The
page must serve the individual first with the company/unlimited-seats argument directly
behind it.

## Product Purpose

Line Notes lets a stage manager log line notes *during* the run instead of
reconstructing them afterward. Tap an annotatable line zone in the script, pick a cast
member, pick a note type, optionally type context, and move on. Ending the run generates
a report that groups the notes by actor, which can be printed, saved as PDF, or emailed.

Success is that the notes go out at intermission or immediately after curtain, correct
and per-actor, with no midnight sorting session.

## Positioning

Every note is anchored to four things at once: a line of the script, a cast member, a
session, and a type. That structure is the mechanism — it is what allows automatic
routing of the right notes to the right actor without anyone reading the document back
through. A shared doc, a spiral pad, or a spreadsheet stores the same words with none of
that structure, which is why distribution stays manual with those tools.

## Operating Context

- Text-based PDF scripts are uploaded; speakers, stage directions, music lines, and
  clickable line zones are auto-extracted per page and hand-correctable in the Script
  Editor. Scanned PDFs require manually drawn line zones; OCR is roadmap, not shipped.
- Runs happen on whatever machine is in the booth — frequently a house Mac mini. Recent
  Chrome, Edge, Safari, or Firefox. No install.
- Venue Wi-Fi is unreliable. The app writes locally and syncs on reconnect; a heartbeat
  indicator shows sync state.
- Multiple devices in one session: PSM, ASMs, director. Notes propagate in real time.
- LX, SQ, fly, and follow-spot cues live as inline pills on the script; standby states
  surface in a right-hand rail.
- Real artifacts of this world that the product sits among: the prompt book, the calling
  script and its margin, the rehearsal/performance report, the call sheet, the cue sheet,
  the French scene breakdown, the playbill.

## Verified App Behaviour

Observed directly in the live app at app.linenotes.io on 2026-08-02. This section
overrides any older description; earlier copy on the marketing site contradicted it.

- **Seven note types**, in this order and casing: `Skip, Para, Called, Add, Gen, Jumped,
  Missed`. There is no DROP / TRANS / NOTE. Definitions, confirmed by the owner:
  - `Skip` — an actor skipped a line.
  - `Para` — an actor paraphrased a line.
  - `Called` — an actor called for a line.
  - `Add` — an actor added a line, or words not in the script.
  - `Gen` — a general note; the catch-all.
  - `Jumped` — an actor jumped ahead to later in the script.
  - `Missed` — an actor missed a line, or words inside one.
- **No keyboard shortcuts for note types were found.** F1–F4 does nothing.
- **No live session timer and no live note counters** anywhere in Run Show. Duration and
  note count appear only in the run report afterward.
- Right rail while idle: `Start Run` + `Run Reports` list. While running: session title,
  `End Run`, and `Scratchpad` — nothing else.
- `Start Run` opens a modal asking for **session title** and **total script pages**.
- `End Run` opens a modal for final scratchpad notes, then `End & Generate Report`.
- Run report contains: Total Duration, Page Count, Note Count, and **Line Notes by
  Actor**. Actions on it: `Print / Save PDF`, `Send Email`, `Close`. **No JSON export
  was found.**
- **A note cannot be logged until cast members exist** — the app blocks it with
  "Add cast members first — go to Cast & Crew tab".
- Joining a production is by **7-character join code** (regenerate / deactivate), not by
  email invitation. Cast members do carry an email, used for delivery.
- Cast member fields: full name, email, **role type** (`Actor, Director, Stage Manager,
  Crew, Other`), one or more **characters**, and a colour from a fixed 10-swatch palette
  (`#C45C4A #D4844A #C8A96E #7AB87A #5B9BD4 #8B6CC4 #C46CA4 #6AB4B4 #D4B44A #7A9AB4`).
  Swatches are round.
- Production membership role seen: `★ OWNER`. **"PSM" is not a role in the app.**
- Top bar: wordmark, then `Run Show / Script Editor / Cast & Crew / Settings`, then
  `Sign Out`. It shows **no production title and no role badge**; the production name sits
  in the Run Show sidebar header.
- Script Editor: `Zones` toggle, `Line Zones` panel with `Re-extract`, `+ Draw`, `Clear`,
  `Save`, plus per-zone X/Y/W/H, live text, and `Assign Actor(s)`. Zone kind seen:
  `DIALOGUE`. Both automatic extraction and manual drawing exist.
- Settings: production title, join code, script PDF replace, members.
- Scripts must be **text-layer PDFs**; the app instructs users to run scanned scripts
  through Adobe Acrobat OCR *before* uploading. OCR is not performed by Line Notes.
- Confirmed present: `☆ Bookmarks`, `2-up`, page nav, edge page-turn controls.

### Resolved by the owner (2026-08-03)

- **No offline write-and-sync.** The claim that the app keeps writing locally and syncs on
  reconnect was removed from the site. Do not reintroduce it.
- **No keyboard-driven operation.** "Fully keyboard-driven" was removed; no shortcuts were
  found in Run Show.
- **Setup takes about twenty minutes — confirmed accurate**, may be stated.
- **Enterprise is a contact-sales tier, priced per company and scoped in conversation.**
  Terms are agreed with each company. The owner has committed to the following as included
  on purchase, and the site states them as such: everything in Annual, one account for the
  whole season, shared cast and crew across productions, multiple stage manager seats,
  consolidated billing and invoicing, custom note types, and onboarding plus priority
  support. These are forward commitments by the owner, not shipped features observed in the
  app — do not add to this list without the owner's say-so. SSO/SAML, API access, audit log,
  SLA and retention controls are deliberately **not** offered.

### Still unverified — never assert without checking

Realtime multi-device sync; cue tracking of any kind (no LX/SQ/fly/follow-spot feature was
found anywhere in the app).

## Capabilities and Constraints

- Unlimited productions per company; unlimited cast and crew — pricing is flat, never per
  seat. People join a production with its join code.
- Run reports grouped by actor; print, save as PDF, or send by email.
- Bookmarks, 2-up view, SM scratchpad.
- Pricing: $9.00/month, $90.00/year, 7-day free trial, cancel anytime. Enterprise
  (SSO/SAML, company-wide cast archive, API, onboarding, SLA, audit log, retention) is
  contact-sales, no published price.
- Not shipped, do not imply: OCR performed by Line Notes; changelog, roadmap, docs, API
  reference, status page, press kit, and about pages are all unbuilt.
- Terminology: run, run session, line note, note type, line zone, cast member, character,
  join code, run report, scratchpad, prompt book, places, load-in, PSM, ASM. Note that
  PSM/ASM are the audience's words, not roles the app implements.

## Brand Commitments

- Name and wordmark: LINE NOTES.
- Binding visual constraints the user set for this rebuild: keep the existing color
  palette (red #E8221A on near-black grounds #0D0D0D/#141414/#1C1C1C, text #EDEBE6, and
  the functional cast/note-type colors gold #C8A96E / #D4AF37, blue #4A8FD4, violet
  #9B7BC8, green #3BAF6A) and keep sharp corners — no rounded geometry.
- Typography is explicitly *not* locked; the user released it for this rebuild.
- Domains: linenotes.io (marketing), app.linenotes.io (product).

## Evidence on Hand

- A working, interactive facsimile of the Run Show interface runs on the marketing page
  itself (`src/demo.jsx`) with a fictional play, "The Kettle". This is the strongest
  proof asset and it is a real demonstration, not a screenshot.
- **No real customers, named productions, testimonials, logos, press, or usage numbers
  exist.** Future work must not fabricate any of these. Demonstration content — the
  script, cast, notes, cue list — is synthetic and must be labeled where a visitor could
  mistake it for a real production.

## Product Principles

1. Two seconds, eyes back on stage. Any interaction that costs more than that has failed
   the person in the booth.
2. Structure is the product. A note without a line, an actor, a session, and a type is
   just text, and text has to be sorted by hand.
3. The run does not stop for the software. Offline, flaky Wi-Fi, and a house machine are
   the normal case, not the edge case.
4. The whole company gets in free. Price scales with productions, never with people.
5. Demonstrate rather than claim. The live demo carries the argument; there is no proof
   to borrow yet.

## Accessibility & Inclusion

Used in a dim house with divided attention, so contrast and hit targets matter more than
usual. Fully keyboard-operable is a product requirement, not a nicety.
