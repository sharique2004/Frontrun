# Frontrun — Brand & Image Prompts

Brand guide for Frontrun plus copy-paste prompts for generating the visual
assets with **GPT Image 2.0**. Everything here is locked to the design tokens in
[`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md) so generated assets drop straight into
the dark "live-signal" UI.

---

## A. Brand direction

**Name:** Frontrun. *(Fallbacks if needed: Klaxon, Harbinger.)*
**What it is:** an autonomous SDR — an AI employee that catches a company's
funding raise the day the SEC Form D drops, researches it, finds the contact, and
runs the entire outreach conversation to a booked call.

**The idea in one line:** *being first.* Funding is the signal; Frontrun is the
instant, researched response — before ten other agencies even know the company
raised.

**Personality:** a sharp, calm operator. Terminal, real-time, precise. Quietly
confident, never hypey. It shows its work (the filing, the amount, the
timestamp) and is honest about limits. Bloomberg-terminal precision meets a
signals desk.

**Identity is type-led** — a premium B2B-SaaS wordmark, not an abstract icon or
picture-mark. The padzy DNA carries through *typography and structure*: a single
Signal-Cyan accent tick (a small solid rectangular bar), numbered mono kickers,
hairline rules, hard-left alignment, one accent, ruthless restraint. No radar,
rings, nodes, brackets, or geometric glyphs.

### Taglines
Primary (recommended):
- **Reach them first.**

Support line under it:
- *Frontrun detects the raise the day it files — then researches, drafts, sends, and books, end to end.*

Alternates:
- The moment they raise, you're already there.
- First to the funded.
- Funding is the signal. Frontrun is the response.
- Catch the raise. Win the deal.
- Outreach at the speed of the filing.

### Voice & tone
- **Confident, precise, understated.** Short declaratives. Active voice. Plain verbs ("Send," "Book," not "Initiate outreach sequence").
- **Data-forward.** Lead with the signal — company, `$Amount`, timestamp, `Form D`. Numbers are the proof; set them in mono.
- **Honest about limits.** Say what's out of scope (no cold-emailing real founders, probabilistic email verification shown as confidence tiers). Maturity reads as trust.
- **No hype.** No exclamation marks, no emoji, no "revolutionary / supercharge / unleash." Sentence case everywhere.

| Don't | Do |
|---|---|
| "🚀 Supercharge your outreach!" | "Reach funded companies first." |
| "We guarantee the founder's email." | "Email resolved · confidence: high." |
| "AI-powered next-gen sales agent." | "An AI SDR that runs the whole loop — detect to booked." |

---

## B. The system, in plain terms

**Color.** Near-black canvas (`#06090B`) with a single electric **Signal Cyan**
(`#2CE5E0`) used sparingly for anything live, active, or primary. Reply triage has
its own traffic-light system that is *never* mixed with the brand accent:
**green** `#34E07E` (interested), **amber** `#F5C24B` (neutral), **red**
`#FF5C6A` (not interested). Text is a soft near-white (`#E7EFEF`) stepping down
through cool grays. Structure is drawn with 1px hairlines (`#1B2427`), not boxes
and shadows.

**Type.** Three voices: **Space Grotesk** for headings and the wordmark
(geometric, technical), **Inter** for body and UI (neutral, legible), and **DM
Mono** for every piece of machine data — amounts, timestamps, IDs, counters
(the terminal texture). Numbers are always mono and tabular.

**Feel.** Flat and dark by default; depth is rare. The only things that move are
things that are actually happening — a new detection, a status flip, the live
counter. Cyan glow appears only on genuinely live signals, never as decoration.

---

## C. GPT Image 2.0 prompts

Direction for all five: **premium B2B-SaaS, type-led, editorial, minimal.**
No logo mark, no icon, no radar, no rings, no nodes, no brackets, no abstract
geometry. Padzy DNA comes through *type + structure*: one Signal-Cyan accent tick
(a small solid rectangular bar), numbered mono kickers, 1px hairline rules,
hard-left alignment, strong type contrast, generous negative space, one accent.

**Shared palette to paste into any prompt if needed:** canvas `#06090B`, tile
`#0A0F11`, Signal Cyan `#2CE5E0`, text near-white `#E7EFEF`, muted gray
`#93A3A5`, hairline `#1B2427`; status green `#34E07E`, amber `#F5C24B`, red
`#FF5C6A`.

> Tips: request **PNG**; say **"transparent background"** where noted; keep
> **flat, no gradients, no glow, no drop shadows, no 3D**. Typeface direction:
> a bold modern geometric grotesk with a slightly mechanical/technical character
> (Neue-Machina-like) for the name; monospace for small data labels.

### 1. Wordmark / logo (type-led)
**Use:** app sidebar, docs, site header · **Ratio:** wide ~24:10 · **Background: transparent**

```
A premium B2B SaaS wordmark logo for a company called "Frontrun", an autonomous
sales AI. Type only — no icon, no symbol, no picture-mark. The word "Frontrun"
set in a bold modern geometric grotesk with a slightly mechanical, technical
character (in the spirit of Neue Machina), sentence case, tight letter-spacing,
soft near-white #E7EFEF. The single brand device is one small solid electric-cyan
#2CE5E0 rectangular accent tick — a short square bar — placed deliberately as a
typographic accent (for example a cursor-like tick sitting on the baseline just
after the final "n"). Optional tiny monospace kicker above the word, uppercase,
letter-spaced, muted gray #93A3A5: "01 / AUTONOMOUS SDR". Flat, crisp, hard-left
composition, lots of negative space. No radar, rings, nodes, brackets, or
geometry. No gradients, no shadow, no 3D. Fully transparent background. PNG.
```

### 2. App icon / favicon (monogram)
**Use:** favicon, PWA icon, avatar · **Ratio:** 1:1 · **Background: dark rounded tile**

```
A square app icon, 1024x1024, for a B2B SaaS brand "Frontrun". Type-based
monogram — no symbol, no radar, no geometry. A rounded-square tile in near-black
#0A0F11 with a barely-visible 1px cool-gray #1B2427 hairline border. Centered:
the capital letter "F" from a bold modern geometric grotesk (technical,
Neue-Machina-like), confident and wide, soft near-white #E7EFEF. One small solid
electric-cyan #2CE5E0 rectangular accent tick integrated as a typographic accent
— e.g. a short cyan bar extending the F's lower horizontal arm, or a small cyan
square on the baseline to the right of the F. High contrast, legible at 16px.
Flat, no gradients, no glow, no 3D. PNG.
```
*(For a transparent favicon, add: "no tile — transparent background, letterform only.")*

### 3. Hero / spot graphic (typographic)
**Use:** landing hero, dashboard hero band, section art · **Ratio:** ~3:2 · **Background: canvas #06090B (or transparent)**

```
An editorial, type-led hero graphic for a premium B2B SaaS called Frontrun (an
autonomous SDR). Composition is typography and structure only — no illustration,
no icon, no radar, no nodes, no geometry. Dark canvas #06090B. Hard-left aligned:
a large near-white #E7EFEF headline in a bold geometric grotesk, "Reach them
first.", with strong size contrast. Thin 1px cool-gray #1B2427 hairline rules
divide the space into an asymmetric grid. A short column of small monospace
labels in muted gray #93A3A5, e.g. "FORM D FILED", "$18M", "00:00:03", and a
numbered kicker "01 / SIGNAL". One electric-cyan #2CE5E0 accent tick (a small
solid bar) marks a single label or underlines one word — the only accent. Lots of
negative space, terminal-precise, flat. No gradients, no glow. PNG.
```

### 4. Empty-state illustration (typographic)
**Use:** empty signal feed ("no companies detected yet") · **Ratio:** 1:1 or ~3:2 · **Background: transparent**

```
A calm, minimal, type-led empty-state graphic for a "no companies detected yet"
screen of a B2B SaaS dashboard. Transparent background, no illustration, no icon,
no radar, no geometry. Hard-left aligned block: a small uppercase monospace kicker
in muted gray #93A3A5 "SIGNAL FEED"; below it a large line in cool gray #93A3A5,
bold geometric grotesk, "Nothing detected yet"; below that a line of dimmer
monospace helper text "Watching new Form D filings". A single small electric-cyan
#2CE5E0 rectangular accent tick sits to the left of the block as a status marker;
one or two faint 1px hairline rules #1B2427 frame it. Spacious, quiet, flat.
No gradients, no glow. PNG.
```

### 5. Social / OG card (typographic)
**Use:** link preview, share card · **Ratio:** 1.91:1 (1200×630) · **Background: filled dark canvas**

```
A 1200x630 social share card for a premium B2B SaaS "Frontrun" (an autonomous
SDR). Type-led, editorial, hard-left aligned. Solid near-black #06090B. No icon,
no radar, no nodes, no geometry, no photos. Top-left: the wordmark "Frontrun" in
a bold modern geometric grotesk (technical, Neue-Machina-like), near-white
#E7EFEF, with a single small electric-cyan #2CE5E0 rectangular accent tick right
after it; a tiny monospace kicker above in muted gray #93A3A5 "AUTONOMOUS SDR".
Large headline lower-left in the same grotesk, near-white: "Reach them first."
Muted-gray #93A3A5 subline below: "Catches the raise the day it files — then
researches, drafts, sends, and books." Right third: a faint 1px vertical hairline
#1B2427 and a small stack of uppercase monospace status labels "DETECTED",
"DELIVERED", "BOOKED" in muted gray, one marked with a cyan accent tick. Generous
breathing room, flat, no gradients, no glow. PNG.
```

### 6. Landing hero background (full-bleed, ambient)
**Use:** `/pitch` hero background layer (sits behind live headline text — no baked-in copy) · **Ratio:** ~21:9 (e.g. 2520×1080) · **Background: canvas #06090B**

```
A full-bleed, ambient background texture for the dark hero of a premium B2B SaaS
landing page. NO text, NO words, NO letters, NO logo, NO illustration, no radar,
no rings, no nodes, no geometry glyphs. Near-black canvas #06090B. Composition:
a sparse asymmetric grid of vertical and horizontal 1px hairline rules in cool
dark gray #1B2427, denser toward the right edge, dissolving to plain canvas on
the left (where headline text will sit). A few very short solid rectangular
ticks in electric cyan #2CE5E0 — small bars, 2–8px equivalent — placed sparingly
along one hairline, like markers on a signals desk; at most one faint cyan
hairline among the gray ones. Extremely subtle, low contrast, terminal-precise,
flat: no gradients, no glow, no blur, no vignette, no noise, no 3D. Must stay
quiet enough that near-white text remains readable on top. PNG.
```
Drop the file at `workstream-c-frontend/public/brand/pitch-bg.png`; the hero's
code-drawn hairline grid is the stand-in until then.

---

## D. Assets — integrated
Generated PNGs live in `workstream-c-frontend/public/brand/` (`icon`, `hero`,
`og-card`, plus `wordmark`/`empty-state` which came back on a gray cloud and are
**not used** — rendered in code instead).

- **Favicon / app icon:** `app/icon.png` = the "F" monogram.
- **Wordmark:** type-led in code (`components/frontrun/signature.tsx`) — "Frontrun" + Signal-Cyan accent tick. No image dependency.
- **OG card:** `/brand/og-card.png` wired via `metadata.openGraph` / `twitter`.
- **Hero** (`/brand/hero.png`): available for a landing/marketing surface.
- **Empty-state:** build in code with the feed's empty view (matches #6's intent, on transparent).
- Keep everything on-token — if a returned asset's cyan/gray drifts, regenerate rather than introduce a new hex.
