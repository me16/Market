# Design

<!-- impeccable:design-source built -->
<!-- Recorded from the built marketing surface (index.html + src/styles.css), not from intent. -->

## The world

**The prompt book under a booth light.**

A stage manager works in a dark house with one lit page in front of them. That physical
scene, not a category convention, is why this surface is dark: near-black ground, one
paper-white field, and red used only as the SM's pen.

The page is structured as a calling script — a body track carrying the argument and a
narrow **margin rail** beside it carrying annotations. The margin is where line notes are
actually written, so it is the page's spine rather than decoration. Every rail block
carries a real annotation, never a bare category label.

Signature: in the first viewport, a marked line on the script page draws a red **leader
rule** across the paper's margin rule and out to the note it became. That single gesture
is the product's mechanism — anchor a line, route it to a person.

## Color

Palette is a brand commitment (see PRODUCT.md) and must not drift.

| Token | Value | Role |
|---|---|---|
| `--red` | `#E8221A` | The pen. Marks, rules, ticks, primary action. Never small body text. |
| `--red-dim` | `#B81A13` | Primary action hover. |
| `--red-text` | `#FF6157` | Same hue lifted for small red type on dark (`--red` is 4.3:1 and fails). |
| `--red-subtle` / `--red-line` | 10% / 34% red | Chip fills and hairlines. |
| `--bg-deep` `--bg-base` `--bg-card` `--bg-raised` | `#0D0D0D` `#141414` `#1C1C1C` `#252525` | The booth. |
| `--rule` / `--bg-border` | `#2E2E2E` | All dividing. 1px. |
| `--text-primary` / `--secondary` / `--muted` | `#EDEBE6` `#A8A6A1` `#8A8883` | `--muted` was raised from `#5E5C58` to clear 4.5:1 on both `--bg-deep` and `--bg-card`. |
| `--text-faint` | `#5E5C58` | Non-text only. Never body copy. |
| `--paper` / `--paper-edge` / `--paper-rule` | `#F2EFE5` `#D9D4C4` `#E2DDCE` | The one lit material. |
| `--ink` / `--ink-soft` | `#16130F` `#565046` | Type on paper. |

**Functional color** — the demo replica uses the app's own 10-swatch cast palette, because
colour there identifies a cast member and nothing else:

`#C45C4A #D4844A #C8A96E #7AB87A #5B9BD4 #8B6CC4 #C46CA4 #6AB4B4 #D4B44A #7A9AB4`

Note types carry **no colour** — the app renders all seven as neutral chips with a red
active state, so the replica does too. Do not colour-code note types; it would invent a
distinction the product does not make.

Strategy is restrained-plus-one-committed-field: neutral booth, red confined to marks,
and paper carrying large lit regions. Paper is the boldness; do not add a second one.

## Type

| Role | Face | Setting |
|---|---|---|
| Display, UI, body | **Archivo** (variable, `wdth` 62–125) | h1 800/`wdth` 92/`-0.035em`/1.03; h2 700/`wdth` 95/`-0.028em`; wordmarks 800/`wdth` 78/uppercase/`0.06em` |
| Script, data, field labels | **Courier Prime** | Script text, timecodes, prices' units, rail labels, mono captions |

Archivo is a working printer's gothic and its width axis is used as a real system — one
family in several cuts, the way a jobbing printer sets a playbill. Courier Prime is the
face screenplays are literally typed in, which is why monospace here is material rather
than a costume; do not extend it to general body copy.

Body measure caps at ~62ch (`.say`), lede at ~46ch. Tracking floor is `-0.04em`.

## Geometry and elevation

**Zero border-radius everywhere.** Brand commitment. Status dots are squares, not circles.

Dividing is done with 1px rules, not shadows. Shadows are reserved for objects that are
physically above the page: the script paper (`--shadow-paper`), the demo frame, the note
slip, the popover. Everything else is flat.

Red 2px top borders mark a thing as annotated: `.rail-label`, `.slip`, `.term--set`,
`.note-popover`. Side stripes are not used.

## Layout

- Page max-width `1240px`, gutter `32px` (`22px` under 900px).
- `.doc` is the document grid: `minmax(0,1fr)` body + `208px` rail, `56px` column gap.
- `.band` sections are `128px` vertical (`104px` ≤1180px, `76px` ≤900px), separated by a
  single rule. More space above a heading than below it.
- Under 900px the rail moves **below** the body, not above it. Above the heading it would
  read as a kicker, which the craft floor bans outright.

## Motion

One orchestrated page-load moment, then the page is quiet. Curves are
`--ease-out: cubic-bezier(0.23, 1, 0.32, 1)`; `ease-in` is never used.

Load sequence: headline lines rise at 0/70/140ms → paper 200ms → lede 240ms → actions
310ms → the `during` box draws via `clip-path` at 620ms → the leader rule scales from its
left origin at 1100ms → the note slip arrives at 1420ms.

Interaction motion stays under 300ms. Every pressable element takes `scale(0.97)` on
`:active`. Hover is gated behind `@media (hover: hover) and (pointer: fine)`. Nothing
animates from `scale(0)`. Transitions name their properties — `transition: all` is not
used anywhere.

`prefers-reduced-motion: reduce` removes all transforms and the load sequence, keeps the
content, and disables smooth scrolling.

## Icons

One authored set in `src/demo.jsx`: 16px box, 1.5px stroke, `square` caps, `miter` joins,
`currentColor`. Unicode glyphs and emoji are not icons and are not used.

## The demo

`src/demo.jsx` is a **replica of the live Run Show screen**, not an illustration. Its
structure was verified against app.linenotes.io on 2026-08-02 and against the application
source on 2026-08-03. The full inventory is `FEATURES.md`; PRODUCT.md's "Verified App
Behaviour" is the short form. Treat those as the spec, FEATURES.md first.

The rules that keep it honest:

1. **Seven note types**, exactly `Skip Para Called Add Gen Jumped Missed`. Neutral chips,
   red active state, no per-type colour. The app does have shortcuts (`s p l a g j m` in
   the popover, `1`–`9` for cast, arrows for pages) but **no F-keys**; the replica shows
   no key hints, which is the safe default — if hints are ever added, they must be those
   keys and no others.
2. **No live timer and no live counters.** Duration and note count belong to the report.
   Do not add them back because they make the frame look busier.
3. The right rail holds **only** Start Run + Run Reports when idle, and session title +
   End Run + Scratchpad when running.
4. The topbar carries **no production title and no role badge**. The production name lives
   in the sidebar header.
5. Script pages render as a **PDF-like white page in a serif** — the app displays an
   uploaded PDF and does not control its typography. Annotatable line zones are tinted red
   only while a run is active.
6. Invented content is limited to the production, script, cast and notes, and the page
   says so beside the frame.
7. The `cue` kind in the replica's script data means a **character cue** — the speaker's
   name above a line. It is not a technical cue and must never be presented as one; the
   app has no cue tracking whatsoever.
8. The replica's `.heartbeat-dot` is a static muted dot with no tooltip, matching the app,
   where the element exists but nothing ever sets its state. It previously read
   "Connected"; that title was removed on 2026-08-03. Do not restore it, and do not build
   any sync-status affordance on top of this dot.

`styles.css` styles a class contract `demo.jsx` owns: `.demo-body`, `.rs-*`, `.ln-*`,
`.char-*`, `.note-*`, `.popover-*`, `.zone*`, `.pdf-*`, `.app-*`. Renaming on one side
without the other silently breaks the frame.

Below 900px the sidebar and control rail are hidden and the script page reflows to the
viewport — it must remain clickable, not become a fixed-width overflow. The note popover
measures itself on mount and clamps into the canvas; with seven types it is tall enough to
fall out of view otherwise.

## Standing rules

1. Red never carries small body text. Use `--red-text`, or don't use red.
2. Paper is the only light field. A second one dilutes the booth.
3. The margin rail carries information. A rail block with only a label is a kicker.
4. Demonstration content is labeled wherever a visitor could read it as a real production.
5. No numbered section markers unless the sequence itself is the information — the run
   timeline's clock times qualify; a feature list does not.
6. **Check the app before describing the app.** Every functional claim on this page must
   be traceable to `FEATURES.md` (the source-level inventory) or PRODUCT.md's "Verified
   App Behaviour". The first build of this page invented four note types, F-key shortcuts,
   a live session timer, live counters, a cue-standby rail, email invitations, offline
   sync, and a JSON export — none of which exist. FEATURES.md §11 "Not shipped" is the
   list to check against before writing any capability sentence.
