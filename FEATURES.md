# Line Notes — Feature & Capability Reference

**Audience:** the agent maintaining the marketing site (`linenotes.io`).
**Purpose:** a factual inventory of what the app does, what it does not do, and where
claims would be wrong. This is not copy and not a pitch — it is source material.

**Derived from:** the application source at `/Users/nrg/line-notes`, read on **2026-08-03**
(HEAD `69a5f11`). Where this document and `line-notes-MARKETING/PRODUCT.md` disagree, this
document is newer — see [§13 Corrections to PRODUCT.md](#13-corrections-to-productmd).

**Precedence rule:** a feature is real only if code implements it. Several UI elements,
security rules, and helper modules exist for features that were never built; those are
listed in [§11 Not shipped](#11-not-shipped--do-not-claim) so they are not mistaken for
capabilities.

---

## 1. What the product is

Line Notes is a browser-based tool for taking **line notes** during a theatrical run and
distributing them to actors afterward.

The core loop:

1. An owner uploads a script PDF and adds cast members.
2. The app extracts clickable **line zones** from the PDF text layer, one set per page,
   and tags each zone with the character speaking it.
3. During a run, the stage manager starts a **run session**, clicks the line where
   something went wrong, picks the cast member(s) and a **note type**, optionally types a
   remark, and moves on.
4. Ending the session generates a **run report** grouped by actor, which can be printed,
   saved as PDF, or handed off to the user's email client one actor at a time.

Every note carries four anchors: script line, cast member, note type, and session. That
structure is what allows per-actor grouping without anyone re-reading the notes.

**Deployment:** web SPA at `app.linenotes.io`. No install, no native app.
**Stack:** vanilla JS ES modules + Vite; Firebase Auth, Firestore, Storage, Cloud
Functions; PDF.js loaded from CDN; Stripe for billing.

---

## 2. Terminology (use these words; they are the app's own)

| Term | Meaning in the app |
|---|---|
| **Production** | A show. The top-level container. Has a title, a script, cast, members, notes, sessions. |
| **Member** | A person with a login who has joined the production. Roles: `owner`, `member`. |
| **Cast member** | An entry in Cast & Crew. **Not a login.** Has a name, email, role type, characters, and a color. |
| **Character** | A named role a cast member plays. One cast member can hold several. |
| **Line zone** | A clickable rectangle over a region of a script page. Types: dialogue, character name, stage direction, music line, page number. |
| **Run session** | One timed run. Notes are tied to it by `sessionId`. |
| **Line note** | A note anchored to a zone (or a hand-drawn rectangle), a cast member, a type, and a session. |
| **Note type** | One of seven fixed categories — see §5.3. |
| **Run report** | The generated post-session HTML document, grouped by actor. |
| **Scratchpad** | A free-text field on the session for the SM's own notes; appears in the report as "SM Notes". |
| **Join code** | A 7-character code that lets someone join a production. |
| **Script page offset** | A per-production setting mapping a PDF page (and half, in 2-up) to script page 1. |
| **Bookmark** | A saved page position with an optional label. |

Terms the app does **not** implement, though the audience uses them: PSM, ASM, prompt
book, cue sheet, French scene. They are fine as audience language; they are not features.

---

## 3. Accounts, sign-up, and access

**Authentication is email + password only.** There is no Google sign-in, no SSO, no magic
link, no social login.

- **Sign-up:** name, email, password (minimum 8 characters), confirm password.
- **Email verification is mandatory.** An unverified user is held on a verification screen
  and cannot reach the app. There is a "Resend email" button (30-second cooldown) and an
  "I've verified — continue" button that re-checks the account.
- **Password reset:** self-serve, from the sign-in screen, by email.
- **Password change:** on the Account page, requires the current password.
- **Email address change:** **not supported.** The Account page tells users to contact
  `hello@linenotes.io`.
- `?signup=production` / `?signup=workshop` on the app URL opens the sign-up form
  directly. This is the marketing site's hand-off mechanism into the app.

---

## 4. Dashboard, productions, and joining

**Dashboard** lists every production the signed-in user belongs to as a card showing the
title, their role badge, and the member count, with an **Open** button.

**Create Production:** a modal taking a title and, optionally, a script PDF uploaded on
the spot with a progress bar. The creator becomes the owner. A 7-character join code is
generated (alphabet excludes confusable characters `0 O 1 I`) with a 30-day expiry.

**Join with Code:** a modal taking the 7-character code. Handled by a Cloud Function,
rate-limited to **10 join attempts per user per hour**. Invalid, deactivated, or expired
codes are rejected. Already-joined users get a distinct message rather than a duplicate.

**There are no email invitations.** Joining is by code only. This is the sole way a person
gets into someone else's production.

---

## 5. Run Show tab — the primary interface

Three columns: cast + notes sidebar (left, collapsible), script (center), session controls
(right, collapsible).

### 5.1 Script viewing

- Renders the production's PDF with PDF.js at a fixed 1.4× scale.
- **Page navigation:** previous/next buttons, a page-number input, and keyboard
  `←` / `→` / `[` / `]`.
- **Page numbering follows the script, not the PDF.** If a script's page 1 is PDF page 3,
  the owner marks it with "Set p.1 here" in the Script Editor, and every page label,
  note, and report entry then reads in script pages. Front matter before page 1 is
  labeled `i-1`, `i-2`, and so on. A badge shows the active offset.
- **2-up split** ("2-up" button) for PDFs printed two script pages per sheet. Each half
  becomes its own numbered page with its own zones.
- **Bookmarks** dropdown, listing saved pages with labels; button hidden when there are
  none.
- **Actors toggle** overlays colored pills naming the assigned character on each zone.

### 5.2 Taking a note

Notes can only be taken while a run session is active, and only if at least one cast
member exists — the app blocks with *"Add cast members first — go to Cast & Crew tab"*.

Three entry paths:

1. **Click a line zone.** Opens the quick-note popover, pre-selecting the cast member(s)
   assigned to that zone, showing the zone's script text as a read-only quote, and
   offering a free-text field (500 characters).
2. **Drag a rectangle** on any blank part of the page. Creates a note anchored to that
   rectangle with no script text — for notes on regions the extractor missed.
3. **Floating action button.** A note tied to the current page with no zone anchor.

Multiple cast members can be selected for one note; the note then appears in each of their
report sections.

**Editing:** clicking an existing note's marker reopens the popover pre-filled, with a
Delete button. A user can delete their own notes; owners can delete anyone's.

**On-page rendering:** each note draws a colored underline in the cast member's color plus
a small type tag. Zones that already carry a note are visually marked.

### 5.3 Note types

Seven fixed types. The sidebar and popover labels:

| Label | Stored key | Report label | Meaning |
|---|---|---|---|
| Skip | `skp` | SKIP | Actor skipped a line |
| Para | `para` | PARAPHRASE | Actor paraphrased |
| Called | `line` | CALLED | Actor called for a line |
| Add | `add` | ADDITION | Actor added words not in the script |
| Gen | `gen` | GENERAL | Catch-all |
| Jumped | `jmp` | JUMPED | Actor jumped ahead |
| Missed | `mw` | MISSED WORDS | Actor missed a line or words within one |

Note types are **not user-configurable**. (Custom note types are an Enterprise forward
commitment in PRODUCT.md, not a shipped feature.)

The popover displays the raw stored keys (`skp`, `para`, `line`, …) rather than the
friendly labels — a real inconsistency, worth knowing before writing about the interface.

### 5.4 Keyboard operation

Shortcuts **do exist**, contrary to earlier marketing notes, but they are scoped:

**Always active in the Run Show tab (outside inputs and modals):**

| Key | Action |
|---|---|
| `←` `→` `[` `]` | Previous / next page |
| `↑` `↓` | Move focus between annotatable zones |
| `Enter` | Open the note popover on the focused zone |
| `Esc` | Close popover / clear zone focus |

**While the note popover is open:**

| Key | Action |
|---|---|
| `1`–`9` | Toggle cast member by list position |
| `s p l a g j m` | Select note type (skip, para, called, add, gen, jumped, missed) |
| `Enter` | Confirm the note |
| `Esc` | Cancel |

Two caveats to state accurately: there are **no F-key shortcuts**, and the quick-entry
popover only maps `s p l a g` — `j` and `m` are missing there. "Fully keyboard-driven" is
still an overstatement; "keyboard shortcuts for page turns, cast selection, and note
types" is accurate.

### 5.5 Session lifecycle

- **Start Run** opens a modal asking for a session title (defaulting to
  *"<Production> — Mon D"*) and total script pages.
- **While running,** the right rail shows the session title, an **End Run** button, and a
  **Scratchpad** textarea. There is **no live timer and no live note counter.**
- **End Run** opens a modal for final scratchpad notes, then generates the report.
- Notes in the sidebar are filtered to the current session and sorted by page, then by
  vertical position. Clicking one jumps the script to it. Each cast member shows a live
  count of their notes in this session.
- An ended session can be **resumed**, reopening it so new notes attach to it.

### 5.6 Real-time collaboration

Line notes are read through a Firestore `onSnapshot` listener. **Notes written on one
device appear on every other device viewing the same production, live.** Cast changes
propagate the same way. This is real and can be stated.

What it is **not**: there is no offline write-and-sync. Firestore persistence is not
enabled, and PDF.js is loaded from a CDN, so the app needs a working connection. Do not
reintroduce any offline claim.

---

## 6. Run reports and distribution

Generated on End Run, stored on the session, and re-openable from the **Run Reports** list
in the right rail.

**Report contents:**
- Header: production title, session title, full date.
- Stats table: **Total Duration**, **Page Count**, **Note Count**.
- **SM Notes** — the scratchpad text, if any.
- **Line Notes by Actor** — one section per cast member with their name, email, and color
  dot, then each note as a colored type badge with script page, character name, and the
  quoted script line.

Rendered as a self-contained HTML document inside a sandboxed iframe.

**Actions:** `Print / Save PDF` (opens a print window), `Send Email`, `Close`.

**Send Email is a per-actor `mailto:` hand-off, not a mail sender.** It lists each actor
with their email and note count and gives two buttons:

- **Email** — opens the user's own mail client with a pre-filled subject and body. The
  body is **truncated at ~1800 characters** to survive browser URL limits, with a note
  pointing at the Copy button.
- **Copy** — copies the full, untruncated note list to the clipboard.

Actors without an email show *"No email — update in Cast & Crew tab"* and cannot be
emailed. There is **no bulk send and no server-side email delivery.** Describe this as
"prepares each actor's notes for sending", never "emails your cast".

**Run Reports list** shows title, date, duration, and note count per ended session, with
**View**, **Resume**, and (owner only) **Delete** — deleting a report cascades to delete
that session's notes.

---

## 7. Script Editor tab

Where the script is prepared. Owner-facing; members with the permission see it read-only
except for actor assignment.

**Automatic extraction.** On first view of a page, the app reads the PDF text layer,
groups text runs into lines by vertical position, and classifies each:

- **Character name** — short, all-caps, narrow, non-italic, and horizontally aligned with
  the page's dominant character-name column (detected statistically per page).
- **Stage direction** — italic, parenthetical (including multi-line parentheticals), or
  all-caps.
- **Page number** — bare numerals, roman numerals, `Page N`, or `N-N-N` patterns.
- **Dialogue** — everything else, with consecutive lines merged into one clickable block.

Extracted zones are saved to Firestore per page and shared by every member, so extraction
happens once for the company, not once per person.

**Automatic speaker tagging.** Zones are walked top-down; each character-name zone sets
the current speaker, and following dialogue zones are assigned to the matching cast
member. Matching normalizes `(CONT'D)`, `(V.O.)`, `(O.S.)`, `(O.C.)` suffixes. Re-runs
across every page whenever a cast member's character list changes. Zones the user has
edited by hand are locked and never overwritten.

**Manual correction.** Everything the extractor produces is editable:

- Draw a new zone by dragging.
- Move and resize zones; multi-select with Shift/Cmd/Ctrl-click and drag the group.
- **Select All & Drag** — move every zone on a page together to fix a uniform offset.
- Per-zone detail panel: X/Y/W/H, the zone's text, type checkboxes (character name /
  stage direction / music line), and **Assign Actor(s)** as a multi-select checkbox list.
- Re-extract a page, clear a page, delete zones.
- Keyboard: `←` `→` page turn, `↑` `↓` zone selection, `c` / `s` / `m` toggle zone type,
  `Delete` remove, `Esc` deselect.
- Changes auto-save after 500 ms with a saved indicator.

**Bookmarks** are added here, with an optional label such as "Act 2 Scene 1".

**Set p.1 here** sets the script page offset for the whole production.

**Scripts without a text layer.** If a page has no extractable text, the app generates
evenly spaced blank strips as fallback zones — clickable, but carrying no script text, so
reports show no quoted line. Both the create-production modal and Settings tell users to
run scanned scripts through Adobe Acrobat OCR *before* uploading. **Line Notes performs no
OCR.**

---

## 8. Cast & Crew tab

Cast members are records, not user accounts. Adding someone here does not give them a
login and sends them nothing.

**Fields:** full name, email, role type (`Actor`, `Director`, `Stage Manager`, `Crew`,
`Other`), one or more characters entered as chips, and a color from a fixed 10-swatch
palette (`#C45C4A #D4844A #C8A96E #7AB87A #5B9BD4 #8B6CC4 #C46CA4 #6AB4B4 #D4B44A
#7A9AB4`).

The list is grouped into tables by role type. The color is used consistently for that
person's notes, pills, dots, and report section.

**Lines report.** A per-member **Lines** button lists every script line currently assigned
to that person, grouped by page and expandable, with a total line and page count.
Available to all members, not just owners. Useful framing: it turns the zone assignments
into a sides-like view.

Editing a cast member's characters triggers re-tagging of every script page.

---

## 9. Settings tab (production-level)

- **Production title** — editable by owners.
- **Join code** — displayed, with **Regenerate** (old code stops working, new 30-day
  expiry) and **Deactivate / Activate**.
- **Script PDF** — upload or replace. **Replacing the script deletes every zone document**,
  so the new PDF is re-extracted from scratch. Worth being explicit about anywhere the
  site discusses swapping in a revised script.
- **Members** — the list of logins, with a role dropdown (Owner / Member), a per-member
  permission-override panel (see §10), and Remove.
- **Danger zone** — owners get **Delete production**, gated behind typing the production
  title; it removes the script, zones, cast, notes, and every report for everyone.
  Non-owners get **Leave production**; their notes stay with the production and they can
  rejoin with a code.

---

## 10. Roles and permissions

Two production roles plus an internal `superadmin` claim used for support, not sold.

| Capability | Owner | Member |
|---|---|---|
| Run a session | ✅ | ✅ |
| Take line notes | ✅ | ✅ |
| View all four tabs | ✅ | ✅ |
| Upload / replace the script | ✅ | ❌ |
| Edit line zones | ✅ | ❌ |
| Manage cast | ✅ | ❌ |
| Edit production settings | ✅ | ❌ |
| Delete anyone's note | ✅ | own only |
| Delete run reports | ✅ | ❌ |
| Delete the production | ✅ | ❌ (can leave) |

Owners can override ten individual permission flags per member (run session, take notes,
manage cast, edit zones, upload script, edit settings, and per-tab access), so a member
can be granted script-editing without being made an owner. Only flags that differ from the
role default are stored.

Firestore security rules mirror these checks server-side.

---

## 11. Not shipped — do not claim

Everything in this list is either absent, dormant, or present only as scaffolding.

**Absent entirely:**
- **Cue tracking of any kind.** No LX, sound, fly, or follow-spot cues. No cue pills, no
  standby rail, no cue sheet. `scriptCues` and `diagrams` appear in the security rules and
  storage rules, but **no code reads or writes them.** Any cue-tracking claim is false.
- **OCR.** The app requires a text-layer PDF and points users to Adobe Acrobat.
- **CSV or JSON export.** A CSV helper exists in the codebase with no caller; there is no
  export button anywhere.
- **JSON import.** An import modal module exists in the codebase and is never imported.
- **Server-side email.** Delivery is `mailto:` plus clipboard only.
- **Offline mode.** No local persistence; the app needs a connection.
- **Live session timer and live note counters.** Duration and counts appear only in the
  report.
- **Page timing.** A "Edit Times" control exists but only renders when a session has a
  page log, and **nothing in the app ever writes one** — the feature is dormant.
- **Email invitations, email address changes, SSO/SAML, API access, audit log, native
  mobile apps, changelog, docs site, status page.**

**Present in the DOM but inert — do not describe as visible features:**
- **The sync heartbeat dot.** The element and its healthy/stale styles exist; no code ever
  sets its state. It renders as a static muted dot.
- **The topbar production title and role badge.** Both elements are empty in normal use.
  The production name appears in the Run Show sidebar header instead.

**Stale internal doc:** `DESIGN.md` in the app repo still describes four note types
(DROP / ADD / TRANS / NOTE). That is wrong; the app has the seven in §5.3. Do not source
note types from `DESIGN.md`.

---

## 12. Pricing, billing, and the cancellation gap

**Plans**

| Plan | Price | Includes |
|---|---|---|
| Workshop | Free | 1 production you own. Joining other people's productions is unlimited. |
| Production | $9 / month or $90 / year | Unlimited productions. 7-day free trial, card required up front. |

Enterprise is a contact-sales tier with no published price; its inclusions are the owner's
forward commitments recorded in `PRODUCT.md`, not observable app features.

**Pricing never scales with people.** Unlimited members and unlimited cast on every paid
plan. This is accurate and is the strongest true structural claim available.

**What is implemented:** Stripe Checkout for both intervals; a webhook that syncs plan and
status (`trialing`, `active`, `past_due`, `canceled`) onto the user; a Stripe billing
portal link for updating cards and downloading invoices; a red site-wide banner on
`past_due`; a success toast on return from checkout.

**The upgrade gate is client-side.** It counts owner-role cards on the dashboard. Do not
describe the free-plan limit as enforced.

### ⚠ Self-serve cancellation is not live

**Customers cannot cancel their own subscription.** The Account page tells them to email
`hello@linenotes.io`, and every cancellation is processed by hand in the Stripe Dashboard.
This is blocked on a Stripe Dashboard setting — "Billing → Customer portal →
Functionality → Cancel subscriptions" — which must be switched on in both test and live
mode, not on any code change.

**Consequence for the site:** the in-app upgrade modal already says *"cancel anytime"*,
which today means "email us and we'll cancel it". If the marketing site says "cancel
anytime" without qualification, a visitor who subscribes will hit a dead end. Until the
Stripe setting is enabled, either qualify the phrase or leave cancellation copy out. Flag
this to the owner rather than working around it silently — it is a customer-facing gap on
a product that already charges money.

---

## 13. Corrections to PRODUCT.md

`line-notes-MARKETING/PRODUCT.md` records observations from **2026-08-02**. The following
entries are now wrong or incomplete. Everything else in it holds.

| PRODUCT.md says | Actually |
|---|---|
| "No keyboard shortcuts for note types were found. F1–F4 does nothing." | F-keys do nothing, but shortcuts exist: `←` `→` `[` `]` page turns, `↑` `↓` zone focus, `1`–`9` cast selection, `s p l a g j m` note types, `Enter` confirm, `Esc` cancel. Scoped to the Run Show tab and the note popover. |
| "Realtime multi-device sync — still unverified" | **Confirmed present.** Line notes and cast use Firestore `onSnapshot`; changes propagate live to every device in the production. |
| "Cue tracking — still unverified" | **Confirmed absent.** No cue feature of any kind exists. The `scriptCues` security rule is scaffolding with no code behind it. |
| "Top bar: wordmark, then tabs, then `Sign Out`" | `Sign Out` has been replaced by an **account menu** (user's name → Account settings, Manage billing, linenotes.io ↗, Sign out), mounted in the dashboard, the account page, and the in-production topbar. |
| No mention of an account page | An **Account page** now exists at `#/account`: display name, email (read-only), password change, membership/plan status, and account deletion. |
| "`Print / Save PDF`, `Send Email`, `Close`" (unelaborated) | Accurate, but **Send Email is a per-actor `mailto:` + clipboard hand-off**, truncated at ~1800 characters, with no bulk send and no server-side delivery. Worth stating precisely. |
| Zone kind seen: `DIALOGUE` | Five kinds exist: dialogue, character name, stage direction, music line, page number — each separately togglable, plus automatic speaker tagging across all pages. |

---

## 14. Platform constraints worth knowing before writing copy

- **Desktop-first.** Below 768 px the tabs move to a bottom bar and the Run Show sidebar
  becomes a drawer below 1024 px, so note-taking is usable on a tablet. **The Script
  Editor is not** — zone drawing, dragging, and resizing are wired to mouse events only,
  with no touch handling. Do not imply script prep works on a tablet or phone.
- **Requires a live connection.** PDF.js loads from a CDN and Firestore has no offline
  persistence.
- **Requires a text-layer PDF** for the automatic parts to work at all.
- **Setup is roughly twenty minutes** — the owner has confirmed this figure as accurate.
- **No customers, testimonials, logos, press, or usage numbers exist.** Nothing of that
  kind may be fabricated. Demonstration content must be labeled as synthetic wherever a
  visitor could take it for a real production.

---

## 15. Honest one-paragraph summary

Line Notes replaces the pad-and-spreadsheet workflow for line notes. A stage manager
uploads a text-layer PDF script; the app extracts clickable line zones and figures out who
speaks each one from the cast list. During a run, clicking a line and picking a note type
files a note against the right actor, the right line, and that session — and the notes
appear live on every other device watching the show. Ending the run produces a report
grouped by actor that can be printed, saved as PDF, or copied into an email per person.
Everything the extractor gets wrong is correctable by hand. Pricing is flat per account —
one production free, unlimited productions for $9 a month or $90 a year — and never scales
with the size of the company.
