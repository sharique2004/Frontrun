# Frontrun — Design System

**Direction:** a *live-signal command center*. Dark, high-contrast, generous
whitespace, exposed hairline structure, monospace for all signal data. Motion is
functional — it signals change, never decorates.

Tokens live in [`workstream-c-frontend/app/globals.css`](../workstream-c-frontend/app/globals.css)
as Tailwind v4 theme variables. This doc is the human-readable mirror. **Never
hardcode a hex in a component — use a token.**

---

## 1. Color

One brand accent — **Signal Cyan** — reserved for the live/active/focus state and
the single primary action. Status (green/amber/red) is a *separate, functional*
system and is never used as the brand accent.

### Background layers (deepest → most elevated)
| Token | Hex | Use |
|---|---|---|
| `--bg-base` / `bg-background` | `#06090B` | App canvas |
| `--bg-surface` / `bg-surface`, `bg-card` | `#0C1113` | Cards, panels, feed |
| `--bg-elevated` / `bg-elevated`, `bg-popover` | `#131A1D` | Popovers, inputs, hover |
| `--bg-inset` / `bg-inset` | `#090D0F` | Wells, code, feed track |
| `--sidebar` | `#080C0E` | Sidebar ground |

### Text ramp
| Token | Hex | Contrast on base | Use |
|---|---|---|---|
| `--foreground` / `text-fg` | `#E7EFEF` | ~15:1 | Primary text |
| `--fg-muted` / `text-fg-muted` | `#93A3A5` | ~6.4:1 | Secondary |
| `--fg-subtle` / `text-fg-subtle` | `#6E8385` | ~4.6:1 | Captions, kickers |
| `--fg-faint` / `text-fg-faint` | `#46595B` | ~2.4:1 | Disabled / decorative only |

### Hairlines
| Token | Hex | Use |
|---|---|---|
| `--line` / `border-line` | `#1B2427` | Default hairline, rhythm |
| `--line-strong` / `border-line-strong` | `#2C3B3E` | Perceptible boundaries, inputs |

### Brand accent — Signal Cyan
| Token | Hex | Use |
|---|---|---|
| `--signal` / `*-signal` | `#2CE5E0` | Active, live, focus, primary action |
| `--signal-strong` | `#5FF2EE` | Hover / press |
| `--signal-deep` | `#0E6E6B` | Muted accent, dim borders |
| `--signal-foreground` | `#04140F` | Text/icon on a cyan fill |

### Status — success / warning / danger (maps to reply triage green/yellow/red)
| Tone | Token | Hex | Dim tint | Meaning |
|---|---|---|---|---|
| success | `--success` / `*-success` | `#34E07E` | `--success-dim` `#123D26` | Green · interested · delivered · booked |
| warning | `--warning` / `*-warning` | `#F5C24B` | `--warning-dim` `#3A2E0C` | Yellow · neutral / question |
| danger | `--danger` / `*-danger` | `#FF5C6A` | `--danger-dim` `#3A1417` | Red · not interested · errors |

> Status is **never signaled by color alone** — every status also carries a label
> and a dot (see `StatusBadge`). `OPENED` renders dimmed (directional, unreliable).

---

## 2. Radii & elevation

- `--radius` = **6px** base. Utilities: `rounded-sm` 4px · `rounded-md` 6px ·
  `rounded-lg` 9px · `rounded-xl` 13px · `rounded-full` for dots/pills only.
- Tight and functional — structure comes from hairlines, not big rounded cards.

| Shadow | Token | Use |
|---|---|---|
| Card | `shadow-card` | Rare quiet lift for floating surfaces |
| Popover | `shadow-pop` | Sheets, dialogs, menus |
| Glow | `shadow-glow` | **Functional only** — live/in-flight signal emphasis |

Default is **flat**. No ambient gradients, glass, or decorative glow.

---

## 3. Typography

| Role | Family | Token | Where |
|---|---|---|---|
| Display / headings | **Space Grotesk** | `font-display` | Section titles, wordmark, big labels |
| Body / UI | **Inter** | `font-sans` (default) | All prose and controls |
| Data / mono | **DM Mono** | `font-mono` | **All signal data** — amounts, timestamps, IDs, counters, latency, shortcuts |

**Invariant:** numbers and machine data are *always* mono and tabular
(`font-variant-numeric: tabular-nums`).

### Scale (Functional tier — headline capped)
| Step | Size / line | Weight | Use |
|---|---|---|---|
| Display | 26–30px | 600 | Page titles (`font-display`) |
| H-section | 16px | 600 | Section headers |
| Body | 14px / 20 | 400–500 | Default |
| Small | 12px | 400 | Secondary |
| Kicker | 11px, `0.16em`, UPPERCASE, mono | 400 | Numbered editorial labels — `.kicker`, e.g. `01 / SIGNAL FEED` |
| Micro-tag | 9–10px, UPPERCASE, mono | 400 | Status chips, `LIVE` / `SOON` |

---

## 4. Motion

Purposeful only. Motion communicates a state change or a genuinely live process.

### Durations (`--dur-*`)
| Token | ms | Use |
|---|---|---|
| `instant` | 80 | Color/tint hovers |
| `fast` | 140 | Buttons, ticks, focus |
| `base` | 220 | Card/row enter, tab, counter roll |
| `slow` | 360 | Column reflow, sheet/dialog |
| ambient | 2000 | Live status pulse loop (only) |

### Easing (`--ease-*`)
- `--ease-signal` `cubic-bezier(0.2,0,0,1)` — decelerate; "a signal arriving." Default for enters/moves.
- `--ease-exit` `cubic-bezier(0.4,0,1,1)` — accelerate out.
- `--ease-pulse` `cubic-bezier(0.4,0,0.6,1)` — the breathing status pulse.

### Principles
1. **State change is animated, chrome is still.** A lead moving columns slides/reflows (Framer Motion `layout`); the frame around it doesn't move.
2. **Pulse = live only.** The radar-ping dot loops *only* for in-flight states (`DETECTED`, `SENT`, `REPLIED`) and the top-bar counter. Resting states are static.
3. **The feed feels alive.** New rows enter with a `base`/`ease-signal` slide-fade + a brief cyan flash; the counter rolls on a new detection.
4. **Reduced motion is respected.** `prefers-reduced-motion` collapses all animation to ~0ms and drops pulses to a static dot (handled globally in `globals.css`).

### Keyframes / utilities
- `animate-pulse-live` — breathing opacity/scale (status dots).
- `animate-ping` (core) — expanding radar ring on live dots.
- `animate-signal-in` — slide-fade enter.
- `animate-sweep` — left-to-right scan for live rules.

---

## 5. Padzy invariants applied
1. **Mono data, always** — DM Mono + tabular for every number/ID/timestamp.
2. **Numbered editorial kicker** — `.kicker` (`01 / SIGNAL FEED`).
3. **Exposed hairline structure** — 1px dividers, labeled regions, hairline-gapped stat grid.
4. **Accent tick** — 2px cyan leading bar (`.tick`) on the active nav item.
5. **One accent, ruthless restraint** — exactly one Signal Cyan per view for active/primary; status colors stay functional.

## 6. Accessibility floor
- Body/UI text ≥ 4.5:1; large text & non-text UI ≥ 3:1 (see ramp table).
- Visible keyboard focus (`focus-visible` ring, `--ring` = Signal Cyan).
- Status never by color alone (label + dot).
- Three data states designed everywhere: loading (skeleton), empty (with next action), error (with recovery).
