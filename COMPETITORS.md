# Line Notes — Competitive & Market Research

**Prepared:** 2026-08-03
**Audience:** the owner and the agent maintaining `linenotes.io`.
**Purpose:** map what else exists in this market, where Line Notes genuinely wins, where it
genuinely loses, and what that implies for positioning.

**Grounding rule:** every claim about *our* product traces to [`FEATURES.md`](FEATURES.md),
which is source of truth. Claims about competitors trace to the sources in §11, each tagged
with a confidence level. Nothing here is invented, and no customer, testimonial, or usage
number is asserted for Line Notes — we have none.

---

## 1. Executive summary

**The headline finding:** line notes is a real, named, *contested* category — but the
competition is unusually weak, old, and platform-locked. There is no dominant modern
web-based line-notes product. That is the opening.

Five things matter most:

1. **Two direct competitors do the exact job**, and both are iPad/Mac-native, one-time
   purchase, single-user: **Line-It** ($24.99, actively maintained) and **Line Notes for
   Stage Managers** ($39.99, last updated 2019, website dead — effectively abandoned).
2. **Both direct competitors lead their marketing with one-touch emailing of notes to the
   cast.** Line Notes cannot do this — `mailto:` hand-off, one actor at a time, body
   truncated at ~1800 characters ([`FEATURES.md` §6](FEATURES.md)). **This is our single
   biggest competitive deficit and it sits exactly on the competitors' lead claim.**
3. **Nobody else appears to do automatic line-zone extraction with automatic speaker
   tagging.** Every competitor makes the SM highlight, circle, or hand-mark the line, and
   hand-pick the actor. Our extractor reads the PDF text layer, classifies dialogue vs.
   character name vs. stage direction, and infers who speaks each line from the cast list.
   **This is the most defensible differentiator we have.**
4. **The premium end of the market is per-seat and expensive.** Stage Write is explicitly
   single-user — collaborators need their own subscriptions — with team bundles at
   $249–$599/yr. Our flat "$9/mo, unlimited members, unlimited cast" is a structurally
   different offer and the strongest true pricing claim available.
5. **The big platforms don't do line notes at all.** Stage Write, CuePad, Cue to Cue, and
   ProductionPro are prompt books, blocking charts, and cue tracking. Line notes is our
   category, not a feature we're bolting onto theirs.

**Strategic read:** we are the only browser-native, collaboration-priced, auto-extracting
line notes tool. We are also the only one that can't actually send the email. Closing the
delivery gap converts our biggest weakness into parity on the competitors' own pitch.

---

## 2. Market map

The market splits into five layers. Only layer 1 competes with us head-on.

| # | Layer | What it does | Overlap with us | Examples |
|---|---|---|---|---|
| 1 | **Line-notes tools** | Capture actor line errors, distribute per actor | **Direct** | Line-It, Line Notes for Stage Managers, LineNotes (Ben Crop), LineNotes (Thank You 5) |
| 2 | **Digital prompt books** | Blocking, cues, ground plans, script annotation | Partial — adjacent tab, not our loop | Stage Write, CuePad, Cue to Cue, ProductionPro |
| 3 | **Script annotation / PDF markup** | Generic marking on scripts | Substitute | Scriptation, GoodNotes, Notability, forScore |
| 4 | **Production management** | Scheduling, reports, logistics, budgets | Minimal | Propared |
| 5 | **Actor-side line learning** | Help actors get off book | **Complementary, not competing** | Rehearsal Pro, LineLearner, ColdRead, Linus |
| 0 | **The real incumbent** | Paper script + pen, spreadsheet, Word template | **Dominant** | Etsy/Theaterish templates, USITT & HeadsetChatter paperwork |

**Layer 0 is the actual competition.** Published stage-management guidance still teaches the
paper method as best practice — "keep a paper copy of the rehearsal report next to me… as
actors miss or invert lines I circle the lines" (The Complete Stage Manager). Templates for
line-note tracking are sold on Etsy and given away by USITT and HeadsetChatter. Most switching
decisions are *paper → software*, not *competitor → us*.

---

## 3. Direct competitors (layer 1)

### 3.1 Line-It — UrbanByte LLC ⭐ the one that matters

| | |
|---|---|
| **Platform** | iPad, macOS 13.5+, visionOS. No web, no Windows, no Android. |
| **Price** | $24.99 one-time, **per device** — buy separately for iPad and Mac |
| **Maintained** | Yes — v3.1.0, April 2026 |
| **Traction** | 6 App Store ratings, 4.3★ — very small |
| **Note types** | Paraphrased, called for line, added words, skipped words |

**Workflow:** Highlight → Choose → Distribute → Navigate. The SM highlights the line or
section on the script, marks which actor and which error type, and presses Send. "With one
touch, actors are emailed their customized notes."

Recent additions: bookmarks, written comments, redesigned color picker, iOS Share Sheet
(Mail, Messages, AirDrop).

**Where it beats us**
- **Real one-touch email distribution to all actors.** We cannot do this at all.
- Works offline (native app); we require a live connection.
- One-time $24.99 vs. our $108/yr — cheaper for a single SM doing one show a year.
- Apple Pencil highlighting is a natural gesture on a script.

**Where we beat it**
- **Automatic extraction and speaker tagging** — Line-It requires manual highlighting *and*
  manual actor selection on every note. We pre-select the cast member from the zone.
- **Any browser, any OS.** Line-It excludes every Windows user, every Chromebook school, and
  every Android tablet. Educational theatre is heavily Chromebook.
- **Multi-user, real-time.** Line-It is a single-device app; our notes sync live to every
  device in the production via Firestore `onSnapshot`.
- Team pricing: unlimited members and cast on one $9/mo account; Line-It is per-device,
  per-person.
- Persistent shared artifacts — zones extracted once for the whole company, run reports,
  session history, Lines report per cast member.

**Read:** the closest competitor, actively developed, but tiny and locked to Apple. Its
distribution story is better than ours; everything else about ours is more modern.

### 3.2 Line Notes for Stage Managers™ — Athos Accessory Corporation ⚠️

| | |
|---|---|
| **Platform** | iPad ($39.99), plus a **free companion app for actors and crew** |
| **Status** | **Likely abandoned** — last updated 26 Feb 2019; `linenotesapp.com` no longer resolves |
| **Rating** | 4★ |

**Workflow:** "Swipe-Tap-Tap the scrolling script during rehearsal to instantly capture line
and tech notes, then send them to cast and crew with just a click." Cast review personalized
notes in the free companion app, which also has a blackout feature for getting off book.

**Two things to take from this competitor:**

1. **The two-app model is smart and we should note it.** A paid SM app plus a *free actor
   app* solves delivery without email entirely — notes land in the actor's own app, and the
   actor app doubles as a line-learning tool. That is a genuinely better distribution design
   than either their email or our `mailto:`.
2. **⚠️ Name collision — flag to the owner.** They assert **™ on "Line Notes for Stage
   Managers"**. Combined with two other products literally named *LineNotes* (§3.3, §3.4),
   our product name sits in crowded territory. The mark appears dormant, but this is a
   question for a trademark attorney before any significant brand spend — not something to
   resolve from a marketing doc. It also has a practical SEO consequence (§8).

### 3.3 LineNotes — Ben Crop

| | |
|---|---|
| **Platform** | Java desktop (Windows/Mac); requires a Java install |
| **Price** | **Free**, donations accepted |
| **Model** | Database form, **not** script-anchored |

A simple form: character name (persists between entries), page-number dropdown, note reason
(dropped word, called for line, …), fields for correct and incorrect line text, auto-incrementing
counter, autosave reminder. Exports to RTF, HTML, email, plain text, and a "Quick Export"
that filters by character/page/reason to the clipboard.

**Relevance:** it's free and it exports better than we do (five formats vs. our zero — we have
**no CSV or JSON export at all**, `FEATURES.md` §11). But it never touches the script: the SM
types the page number and retypes the line. Its existence proves demand at the free tier and
sets a floor: a free tool already covers the bare data-entry job.

### 3.4 LineNotes — Thank You 5

| | |
|---|---|
| **Platform** | **Windows 98+ and Microsoft Word 2000+** |
| **Price** | Demo free; paid license (price not retrieved — HTTPS certificate expired) |

Interfaces directly with a Word script; the Distribute Notes window sends notes by print or
email and **tracks which notes were distributed by which means** — a delivery-receipt feature
nobody else has, including us.

**Status:** the stated requirements and an expired TLS certificate on the site put this in
the legacy bucket. Its distribution tracking is the one idea worth stealing.

---

## 4. Adjacent platforms (layer 2) — they do *not* do line notes

This matters: our nearest "big" competitors don't compete on our core loop.

### Stage Write — the premium incumbent

Broadway's blocking-notation standard. Patented (US-9424535-B2), Apple-featured, claims 100+
Broadway shows and 100,000+ users. Digital script annotation, spacing charts with ground
plans and performer icons, calling scripts, real-time collaboration. Web (Chrome/Firefox,
Android included) plus a free iPad app.

**Pricing — the important part:**

| Plan | Price |
|---|---|
| View Only | Free (actors, swings, understudies) |
| Single Production | $5.99/mo or $59.99/yr |
| **Pro** (unlimited productions) | **$9.99/mo or $99.99/yr** |
| Creative Team Bundle | $249/yr — 3 Pro seats + unlimited view-only; extra seats $79.99 |
| Educational Bundle | $599/yr — 10 seats |
| Enterprise | 1–3 seats $249; +$79.99/seat; 16+ seats $69.99/seat |

**Subscriptions are single-user** — "one user can be logged into one place at a time," and
collaborators need their own. **Line notes are not mentioned anywhere in their FAQ or feature
list.**

**Read:** their Pro tier ($9.99/mo, $99.99/yr) is priced within cents of ours ($9/mo, $90/yr)
— so we are *not* undercutting on headline price. We undercut on **people**: a 3-person
stage-management team costs $249/yr on Stage Write and $90/yr on ours, and a 10-seat
educational program costs $599/yr there and $90/yr here. That is the comparison to make.

### CuePad — the modern browser-first challenger

Positions itself explicitly as "a modern Stage Write alternative." Browser-first, script-centred
prompt book, real-time collaboration, blocking tools, ground plan editor, PDF export, version
history.

| Plan | Price |
|---|---|
| Core | Free — full features, 1 script |
| Pro | $19/mo or $199/yr — unlimited scripts, PDF export, version history, **up to 5 team members included** |
| Theatre | Removes the 5-member cap |

**Does not mention line notes.** Its pitch — "charges the production owner once rather than
per user" — is the *same structural argument we make*, aimed at the same Stage Write weakness.
Closest competitor in *philosophy*; not in *function*. Watch it: if CuePad adds line notes, it
becomes our most serious threat, since it already has the browser + team-pricing story and
charges 2× our price.

### Cue to Cue (Denmark)

iOS digital prompt book in development since 2016. Auto-generates cue and cast lists from the
script; shared, legible team notes. Subscription, price not published. No line-note
functionality documented.

### ProductionPro — the enterprise/film crossover

Film, TV and theatre. Scripts with **offline access** and annotation, scene breakdowns, media
hub, production binder. Claims 120,000+ users; Marvel Studios among clients. Distributed through
**Music Theatre International** — added to an MTI show license for **$199** (4 downloads at
order, 99 more once materials ship).

**The MTI channel is the notable fact here.** ProductionPro reaches schools and community
theatres by riding the licensing transaction — at the exact moment a production is greenlit and
has a budget. That is a distribution model we cannot match, and it should temper any assumption
that we can win the school market on product merit alone. No line-note features documented.

---

## 5. Substitutes and complements (layers 3–5)

**Script annotation (layer 3)** — Scriptation, GoodNotes, Notability, forScore. Generic PDF
markup. Cheap or bundled, infinitely flexible, and **zero structure**: no per-actor grouping, no
note types, no report. A stage manager using GoodNotes still hand-transcribes notes into an
email afterwards. Our four anchors (line, cast member, type, session) are precisely what these
lack.

**Production management (layer 4)** — Propared. Scheduling, rehearsal/performance reports,
department notes, budgets, inventory. Third-party listings put it at $112–$299/month, which is
a different budget category and a different buyer (production manager, not SM). Not a
competitor; conceivably a partner.

**Actor-side line learning (layer 5)** — **complementary, and worth understanding as demand
evidence.** ColdRead (free under 8 lines, $6.99–$10.99/mo), LineLearner ($5 one-time, iOS +
Android), Rehearsal Pro ($19.99), Linus (tracks rehearsal stats, line counts, scene history).
These prove actors will pay to fix the *same problem* from the other side. The Athos free-actor-app
model (§3.2) is exactly the bridge between the two halves — an actor-facing surface is the
natural second product, not a competitor.

---

## 6. Feature comparison

Line Notes column is strictly per [`FEATURES.md`](FEATURES.md).

| Capability | **Line Notes** | Line-It | Athos LN | Ben Crop | Stage Write | CuePad | ProductionPro |
|---|---|---|---|---|---|---|---|
| **Line notes as core loop** | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Runs in any browser | ✅ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| Windows / Chromebook / Android | ✅ | ❌ | ❌ | Win only | ✅ | ✅ | ✅ |
| **Auto line extraction from PDF** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Auto speaker → cast tagging** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Script-anchored notes | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ |
| Real-time multi-device sync | ✅ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| Per-actor grouped report | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **One-click email to whole cast** | ❌ | ✅ | ✅ | partial | — | — | — |
| Free actor-facing app | ❌ | ❌ | ✅ | ❌ | ✅ view-only | ❌ | ✅ |
| CSV / data export | ❌ | ? | ? | ✅ (5 formats) | ? | ✅ PDF | ? |
| Offline use | ❌ | ✅ | ✅ | ✅ | ? | ❌ | ✅ |
| OCR for scanned scripts | ❌ | ? | ? | n/a | ? | ? | ? |
| Blocking / spacing charts | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ |
| Cue tracking | ❌ | ✅ (Que It) | ✅ tech notes | ❌ | ✅ | ✅ | ❌ |
| Unlimited collaborators, flat price | ✅ | n/a | n/a | n/a | ❌ per-seat | ✅ to 5 | ? |
| Self-serve cancellation | ❌ ⚠️ | n/a | n/a | n/a | ✅ | ✅ | ? |

`?` = not documented in retrieved sources. `—` = not applicable, product has no line notes.

### Annual cost for a 3-person SM team, one show

| Product | Year 1 |
|---|---|
| Ben Crop LineNotes | **$0** |
| Line-It | $74.97 (3 × $24.99, +$24.99 per extra device) |
| **Line Notes (ours)** | **$90–108** — any number of people |
| Stage Write Pro ×3 | $299.97, or $249 team bundle |
| CuePad Pro | $199 (5 members included) |
| ProductionPro via MTI | $199 per show license |
| Propared | $1,344+ |

We are mid-priced against tools that do less for teams, and we hold that price no matter how
large the company gets. **Ours is the only row where the number doesn't move when people are
added.**

---

## 7. Where we win, honestly

1. **Automatic extraction + speaker tagging.** Uncontested. Every competitor makes the SM mark
   the line and pick the actor by hand; we pre-select from the zone. Roughly twenty minutes of
   setup buys a script where clicking a line already knows who's speaking.
2. **Platform reach.** Both direct competitors are Apple-only. Windows laptops and Chromebooks
   are the norm in schools and community theatre — a large share of the addressable market
   *cannot buy* Line-It or the Athos app at any price.
3. **Pricing that never scales with people.** Verified against the market: Stage Write charges
   per seat and is explicit that collaborators need their own subscriptions. Ours is the
   structurally different offer, and it's true.
4. **Real-time multi-device collaboration on the line-notes loop specifically.** The prompt-book
   platforms have real-time sync but no line notes; the line-notes tools have no sync. We're the
   only product with both.
5. **Category focus.** We do one job. Stage Write, CuePad, and ProductionPro are omnibus
   platforms where line notes are absent entirely.

## 8. Where we lose, honestly

Ordered by how much damage each does.

1. **⚠️ Distribution.** Both direct competitors' *lead marketing claim* is one-touch email to
   the entire cast. We hand off to the user's mail client, one actor at a time, truncated at
   ~1800 characters, with a Copy button as the workaround. On a head-to-head feature page we
   lose this comparison outright. **Highest-value thing to fix.** Until then, copy must say
   "prepares each actor's notes for sending" and never "emails your cast."
2. **⚠️ Self-serve cancellation is not live** (`FEATURES.md` §12). Customers must email
   `hello@linenotes.io`. Every competitor with a subscription lets users cancel themselves.
   This is a customer-facing gap on a product that already charges money, and it is blocked on
   a Stripe Dashboard setting, not code. Competitively it makes any "cancel anytime" claim on
   the marketing site a trap.
3. **No actor-facing surface.** Athos's free companion app and Stage Write's free view-only tier
   both give actors a place to *receive*. We give them an email. This is also the most natural
   expansion path.
4. **No offline mode.** Native competitors keep working in a basement rehearsal room with bad
   wifi; ProductionPro explicitly markets offline scripts. We need a live connection for both
   Firestore and CDN-loaded PDF.js. Theatres are notorious dead zones — expect this objection.
5. **No export.** Ben Crop's free tool has five export formats; we have none, and the CSV helper
   in the codebase has no caller. Blocks archiving and any "own your data" claim.
6. **No OCR.** We require a text-layer PDF and point users at Adobe Acrobat. Scanned and
   photocopied scripts are extremely common in schools and community theatre — the segment where
   our platform advantage is otherwise strongest. This directly undercuts our best market.
7. **Script Editor is mouse-only.** Setup can't be done on a tablet. Competitors are tablet-first.
8. **No cue tracking or blocking.** Fine — that's category focus, not a defect. But expect
   "can it also do…" and answer it cleanly rather than hedging.
9. **Brand crowding.** Three shipped products use *LineNotes* / *Line Notes*, one with a ™
   (§3.2). Organic search for "line notes app" surfaces Line-It, Ben Crop, Thank You 5, and
   UrbanByte's marketing page well before us. Expect to buy or earn that term.
10. **No proof.** No customers, testimonials, logos, or usage numbers exist and none may be
    fabricated. Competitors lead with "100+ Broadway shows" and "120,000 users." We must compete
    on demonstrated product, not social proof — which argues for an interactive demo or video
    over a testimonial wall.

---

## 9. Threat assessment

| Threat | Likelihood | Impact | Note |
|---|---|---|---|
| **CuePad adds line notes** | Medium | **High** | Already browser-first, team-priced, script-centred, $199/yr. Same argument, bigger surface. The one to watch. |
| Line-It ships a web version | Low–Med | High | They just added macOS "following user demand for laptop accessibility" — the pressure toward wider platforms is visibly there. |
| Stage Write adds line notes | Low | High | Broadway relationships + patent. Has ignored the category for years. |
| ProductionPro adds line notes | Low | Medium | Film-first; theatre is a channel play via MTI. |
| Free tools stay good enough | **High** | Medium | Ben Crop is free; paper is free; templates cost $5 on Etsy. The real fight. |
| Someone builds the actor-side app first | Medium | Medium | Layer 5 is crowded and well-funded relative to layer 1. |

---

## 10. Positioning recommendations

**The defensible one-line claim:**
> The only line notes tool that reads your script and already knows who says every line.

Nobody else can say it. It's true per `FEATURES.md` §7. It centres a capability competitors
would need real engineering to match, rather than price or breadth.

**Supporting claims, all verifiable:**
- *Works on the laptop you already own.* — against two Apple-only direct competitors.
- *One price, whole company.* — against Stage Write's per-seat model. Use the concrete
  comparison: 3 seats is $249/yr there, $90/yr here.
- *Notes appear on every device, live.* — confirmed real (`FEATURES.md` §5.6).
- *Built for line notes, not a prompt book that happens to have a notes field.*

**Comparisons worth building** (in priority order): vs. paper/spreadsheet (layer 0 is the real
incumbent and the biggest volume of switchers); vs. Stage Write (the per-seat pricing contrast
is our strongest structural argument); vs. Line-It (only if we fix delivery first — today we
lose their headline).

**Do not claim, per `FEATURES.md`:** emails your cast · cue tracking · offline · OCR · export ·
fully keyboard-driven · "cancel anytime" unqualified · any customer, testimonial, or usage number
· that the free-plan limit is enforced.

**Product implications ranked by competitive return:**

1. **Server-side email delivery.** Closes the gap on both direct competitors' lead claim.
   Everything else is second.
2. **Turn on the Stripe cancellation setting.** A dashboard toggle. Removes a live
   customer-facing dead end and unblocks honest pricing copy.
3. **Export (CSV/PDF of the report).** The helper already exists without a caller. Cheapest
   real win on the list.
4. **A free actor-facing view.** Athos and Stage Write both prove the model; it doubles as
   distribution and as a growth loop.
5. **OCR, or a documented path for scanned scripts.** Unblocks exactly the schools-and-community
   segment where our cross-platform advantage is worth the most.

---

## 11. Sources & confidence

**High confidence — read from the vendor's own site or the App Store:**
- [Line-It — App Store](https://apps.apple.com/us/app/line-it/id1090772813) · [UrbanByte Line Notes](https://www.urbanbyte.io/theatre-software/line-it-line-notes.html) · [UrbanByte products](http://www.urbanbyte.io/theatre-software/)
- [Stage Write pricing](https://www.stagewritesoftware.com/pricing) · [FAQ](https://www.stagewritesoftware.com/faq) · [home](https://www.stagewritesoftware.com/)
- [CuePad — StageWrite alternative](https://cuepad.app/stagewrite-alternative) · [CuePad](https://cuepad.app/)
- [Ben Crop LineNotes](https://www.bencrop.com/linenotes/help)
- [ProductionPro](https://production.pro/) · [Cue to Cue](https://cue-to-cue.dk/)
- [Theatrecrafts — Software Tools for Stage Management](https://theatrecrafts.com/pages/home/topics/stage-management/software-tools-for-stage-management/) (curated industry index)

**Medium — third-party listings or search summaries, not vendor-confirmed:**
- [Line Notes for Stage Managers (AppAdvice)](https://appadvice.com/app/line-notes-for-stage-managers/1154264290) — $39.99, Feb 2019. Vendor site `linenotesapp.com` **does not resolve** (verified 2026-08-03); treat as abandoned.
- [MTI ProductionPro](https://www.mtishows.com/help/shows/digital-scripts-scores-powered-by-productionpro/digital-scripts-scores-productionpro) — $199 add-on
- [Propared pricing](https://www.propared.com/pricing/) — $112–$299/mo figures came from a third-party aggregator, **not** verified on Propared's own page
- Line-learning app prices via [Backstage](https://www.backstage.com/magazine/article/line-memorization-apps-actors-70280/) and [ActOnCue](https://actoncue.com/blog/best-line-learning-apps)
- [Educational Theatre Association facts](https://schooltheatre.org/quick-facts-and-figures-on-theatre-education/) — ~26,000 K-12 theatre programs. The "10,500 community theatre groups" figure came from a market-report aggregator and should not be repeated publicly without a better source.

**Low — could not verify:**
- Thank You 5 LineNotes pricing — [site](https://thankyou5.com/) has an **expired TLS certificate**; page could not be fetched
- PromptPad — listed by Theatrecrafts, but `promptpad.com` returned 403; unverified
- "Luminotes" appeared only in a low-quality listicle and could not be corroborated anywhere — **treat as non-existent** until proven otherwise

**Known gaps:** no competitor took a live trial, so competitor UX quality is inferred from
marketing copy. No pricing was confirmed for Cue to Cue, Thank You 5, or ProductionPro's direct
(non-MTI) theatre tiers. No primary research with stage managers — the paper-workflow evidence
is from published SM guidance, not interviews.
