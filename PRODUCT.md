# Product

<!-- impeccable:product-schema 1 -->

**Source of truth for functionality:** `FEATURES.md` in this repo — a feature-by-feature
inventory read directly from the application source at `/Users/nrg/line-notes` on
2026-08-03 (HEAD `69a5f11`). This file records the *strategic* product record: who it is
for, what it claims, what it may never claim. Where the two disagree about what the app
does, **FEATURES.md wins** and this file should be corrected to match.

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
reconstructing them afterward. Click an annotatable line zone in the script, pick a cast
member, pick a note type, optionally type context, and move on. Ending the run generates
a report that groups the notes by actor, which can be printed, saved as PDF, or prepared
for sending one actor at a time.

Success is that the notes go out at intermission or immediately after curtain, correct
and per-actor, with no midnight sorting session.

## Positioning

Every note is anchored to four things at once: a line of the script, a cast member, a
session, and a type. That structure is the mechanism — it is what allows automatic
routing of the right notes to the right actor without anyone reading the document back
through. A shared doc, a spiral pad, or a spreadsheet stores the same words with none of
that structure, which is why distribution stays manual with those tools.

## Operating Context

- Text-layer PDF scripts are uploaded; speakers, stage directions, music lines, page
  numbers, and clickable line zones are auto-extracted per page and hand-correctable in
  the Script Editor. Extraction is saved per production, so it happens once for the whole
  company. Scanned PDFs without a text layer fall back to evenly spaced blank strips that
  are clickable but carry no script text; users are told to OCR in Adobe Acrobat *before*
  uploading. **Line Notes performs no OCR, and OCR is not on a committed roadmap.**
- Runs happen on whatever machine is in the booth — frequently a house Mac mini. Recent
  Chrome, Edge, Safari, or Firefox. No install.
- **A live connection is required.** There is no offline mode: Firestore persistence is
  not enabled and PDF.js loads from a CDN. Venue Wi-Fi being unreliable is a real problem
  for the audience, but it is a problem this product does not currently solve — never
  claim local-write-and-sync-on-reconnect.
- Multiple devices in one session: PSM, ASMs, director. Notes and cast changes propagate
  in real time through Firestore `onSnapshot`. This is verified and may be stated.
- **Desktop-first.** Note-taking degrades acceptably to a tablet (tabs move to a bottom
  bar under 768px, the sidebar becomes a drawer under 1024px). The Script Editor is
  mouse-only — zone drawing, dragging, and resizing have no touch handling. Do not imply
  script prep works on a tablet or phone.
- **No cue tracking of any kind.** No LX, sound, fly, or follow-spot cues; no cue pills,
  no standby rail, no cue sheet. The word "cue" on the marketing site must only ever mean
  a *character cue* (the speaker's name above a line), and even then it is safer avoided.
- Real artifacts of this world that the product sits among: the prompt book, the calling
  script and its margin, the rehearsal/performance report, the call sheet, the cue sheet,
  the French scene breakdown, the playbill. These are audience language, not features.

## Verified App Behaviour

Read from application source on 2026-08-03 and recorded in full in `FEATURES.md`. This
section overrides any older description; earlier copy on the marketing site contradicted
it. Consult FEATURES.md before writing any functional claim.

- **Seven note types**, in this order and casing: `Skip, Para, Called, Add, Gen, Jumped,
  Missed`. There is no DROP / TRANS / NOTE. Definitions, confirmed by the owner:
  - `Skip` — an actor skipped a line.
  - `Para` — an actor paraphrased a line.
  - `Called` — an actor called for a line.
  - `Add` — an actor added a line, or words not in the script.
  - `Gen` — a general note; the catch-all.
  - `Jumped` — an actor jumped ahead to later in the script.
  - `Missed` — an actor missed a line, or words inside one.
  Note types are **not user-configurable** (custom types are an Enterprise forward
  commitment, not a shipped feature).
- **Keyboard shortcuts exist, but are scoped.** In Run Show: `←` `→` `[` `]` page turns,
  `↑` `↓` zone focus, `Enter` open the popover, `Esc` close. In the note popover: `1`–`9`
  cast selection, `s p l a g j m` note types, `Enter` confirm, `Esc` cancel. **There are
  no F-key shortcuts**, and the quick-entry popover maps only `s p l a g`. "Keyboard
  shortcuts for page turns, cast selection, and note types" is accurate; "fully
  keyboard-driven" is not.
- **No live session timer and no live note counters** anywhere in Run Show. Duration and
  note count appear only in the run report afterward. (Per-cast-member note counts do
  appear in the sidebar for the current session.)
- Right rail while idle: `Start Run` plus a **recent runs** strip (the three most recent
  ended sessions and an `All reports →` link). While running: session title, `End Run`, and
  `Scratchpad`, nothing else.
- `Start Run` opens a modal asking for **session title** and **total script pages**.
- `End Run` opens a modal for final scratchpad notes, then `End & Generate Report`. An
  ended session can be **resumed**.
- Run report contains: Total Duration, Page Count, Note Count, a Recurring Lines count when
  any apply, SM Notes (the scratchpad), and **Line Notes by Actor**. Actions:
  `Print / Save PDF`, `Send Email`, `Close`. **CSV export lives on the Reports tab**, not
  here; there is no JSON export and no PDF export beyond printing.
- **`Send Email` is a per-actor `mailto:` and clipboard hand-off, not a mail sender.**
  Each actor gets an **Email** button (opens the user's own mail client, body truncated at
  ~1800 characters) and a **Copy** button (full untruncated list). There is no bulk send
  and no server-side delivery. Say "prepares each actor's notes for sending", never
  "emails your cast".
- **A note cannot be logged until cast members exist** — the app blocks it with
  "Add cast members first — go to Cast & Crew tab" — and only while a run session is
  active. Three entry paths: click a line zone, drag a rectangle on blank page area, or
  the floating action button.
- Joining a production is by **7-character join code** (regenerate / deactivate, 30-day
  expiry, rate-limited to 10 attempts per user per hour), not by email invitation.
  **There are no email invitations.** Cast members do carry an email, used for delivery.
- **Authentication is email + password only** — no Google sign-in, no SSO, no magic link.
  Email verification is mandatory. Email address changes are not supported (users are told
  to contact `hello@linenotes.io`).
- Cast member fields: full name, email, **role type** (`Actor, Director, Stage Manager,
  Crew, Other`), one or more **characters**, and a colour from a fixed 10-swatch palette
  (`#C45C4A #D4844A #C8A96E #7AB87A #5B9BD4 #8B6CC4 #C46CA4 #6AB4B4 #D4B44A #7A9AB4`).
  Swatches are round. A per-member **Lines** button lists every script line assigned to
  that person, grouped by page — a sides-like view, available to all members.
- Production roles are **Owner** and **Member**. **"PSM" is not a role in the app.**
  Owners can override ten individual permission flags per member, so a member can be
  granted script editing without being made an owner. Firestore rules mirror this.
- Top bar: wordmark, then `Run Show / Script Editor / Cast & Crew / Settings`, then an
  **account menu** (user's name → Account settings, Manage billing, linenotes.io ↗, Sign
  out). The topbar production title and role badge elements exist but are **empty in
  normal use**; the production name sits in the Run Show sidebar header.
- An **Account page** exists at `#/account`: display name, read-only email, password
  change, membership/plan status, and account deletion.
- Script Editor: automatic extraction plus full manual correction — draw, move, resize,
  multi-select and group-drag, Select All & Drag, re-extract, clear, delete, per-zone
  X/Y/W/H, text, type checkboxes, and `Assign Actor(s)`. **Five zone kinds:** dialogue,
  character name, stage direction, music line, page number. Automatic speaker tagging
  walks zones top-down and re-runs across all pages whenever a cast member's characters
  change; hand-edited zones are locked and never overwritten. Auto-saves after 500ms.
- **Script page numbering follows the script, not the PDF** — "Set p.1 here" sets a
  per-production offset; front matter is labeled `i-1`, `i-2`. **2-up split** handles PDFs
  printed two script pages per sheet.
- Settings: production title, join code, script PDF replace (**replacing the script
  deletes every zone document** and forces re-extraction), members with permission
  overrides, and a danger zone (delete production for owners, leave production for
  members).
- Confirmed present: `☆ Bookmarks`, `2-up`, page nav, edge page-turn controls, Actors
  overlay toggle.
- **The sync heartbeat dot in the app is inert** — the element and its healthy/stale
  styles exist, but no code ever sets its state. It renders as a static muted dot. It is
  not a sync indicator and must not be described as one.

### Resolved by the owner (2026-08-03)

- **No offline write-and-sync.** The claim that the app keeps writing locally and syncs on
  reconnect was removed from the site. Do not reintroduce it.
- **Setup takes about twenty minutes — confirmed accurate**, may be stated.
- **Enterprise is a contact-sales tier, priced per company and scoped in conversation.**
  Terms are agreed with each company. The owner has committed to the following as included
  on purchase, and the site states them as such: everything in Annual, one account for the
  whole season, shared cast and crew across productions, multiple stage manager seats,
  consolidated billing and invoicing, custom note types, and onboarding plus priority
  support. These are forward commitments by the owner, not shipped features observed in the
  app — do not add to this list without the owner's say-so. SSO/SAML, API access, audit log,
  SLA and retention controls are deliberately **not** offered.

### Resolved by source review (2026-08-03)

- **Realtime multi-device sync — confirmed present.** Line notes and cast use Firestore
  `onSnapshot`; changes propagate live to every device in the production.
- **Cue tracking — confirmed absent.** No cue feature of any kind exists in the codebase.
  `scriptCues` and `diagrams` appear in the security and storage rules as scaffolding with
  no code behind them. Any cue claim is false.
- **Keyboard shortcuts — confirmed present but scoped** (see above). The earlier "no
  keyboard shortcuts were found" note was wrong; they were simply not discoverable in the
  UI.

## Capabilities and Constraints

- Unlimited productions per paid account; unlimited members and unlimited cast on every
  plan — **pricing is flat and never scales with people.** This is the strongest true
  structural claim available. People join a production with its join code.
- Run reports grouped by actor; print, save as PDF, or prepare per-actor email/clipboard
  hand-off.
- Bookmarks, 2-up view, SM scratchpad, script-page offset, per-member Lines report.
- Pricing: **Workshop** free (1 production you own; joining others' productions is
  unlimited); **Production** $9.00/month or $90.00/year, 7-day free trial with card
  required up front. Stripe Checkout, webhook plan sync, billing portal for cards and
  invoices, and a site-wide banner on `past_due` are all implemented. The free-plan limit
  is enforced **client-side only** — do not describe it as enforced.
- Enterprise is contact-sales with no published price. Its inclusions are the owner's
  forward commitments listed above, not observable app features.
- **Self-serve cancellation is live.** The Account page's "Manage billing & cancel →"
  button opens the Stripe customer portal, where customers cancel, update a card and
  download invoices themselves. "Cancel anytime" is accurate and needs no qualification.
- **A Reports tab is live**, with two sub-pages. *All runs* is a searchable, sortable table
  of every recorded run. *Insights* holds charts for notes per run, per script page, per
  actor and per type, plus a list of lines the same actor has been noted on three or more
  times across separate runs. Filtered notes export as CSV, and run reports mark those
  recurring lines with a ↻ badge.
- Not shipped, do not imply: cue tracking of any kind; OCR performed by Line Notes; JSON
  export or import; PDF export (printing the report is the path); server-side email;
  offline mode; live session timer or live note counters; page timing (an "Edit Times"
  control exists but nothing ever writes a page log); email invitations; email address
  changes; SSO/SAML; API access; audit log; native mobile apps; changelog, roadmap, docs,
  API reference, status page, press kit, and about pages.
- Terminology: production, member, cast member, character, line zone, run session, line
  note, note type, run report, scratchpad, join code, script page offset, bookmark. The
  audience's words — PSM, ASM, prompt book, cue sheet, French scene — are fine as language
  but are **not** roles or features the app implements.
- **`DESIGN.md` in the *app* repo is stale** and still describes four note types (DROP /
  ADD / TRANS / NOTE). Never source note types from it.

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
  script, cast, and notes — is synthetic and must be labeled where a visitor could
  mistake it for a real production.
- Known divergence to fix, not to copy: the replica's heartbeat dot animates and is
  titled "Connected". The real dot never changes state. Either drop it from the replica or
  render it static — an animated one implies a sync indicator the app does not have.

## Product Principles

1. Two seconds, eyes back on stage. Any interaction that costs more than that has failed
   the person in the booth.
2. Structure is the product. A note without a line, an actor, a session, and a type is
   just text, and text has to be sorted by hand.
3. Claim only what the code does. This product's audience can tell instantly when software
   was described by someone who has not run a show on it, and the first build of this site
   invented seven features that do not exist. Every functional sentence traces to
   FEATURES.md.
4. The whole company gets in free. Price scales with productions, never with people.
5. Demonstrate rather than claim. The live demo carries the argument; there is no proof
   to borrow yet.

## Accessibility & Inclusion

Used in a dim house with divided attention, so contrast and hit targets matter more than
usual. Keyboard operation is a stated product goal and is **partially** delivered — page
turns, zone focus, cast selection, note types, confirm, and cancel all have keys, scoped
to Run Show and the note popover. It is not yet complete enough to call the app
keyboard-driven.
