/**
 * Central display metadata for every LeadStatus.
 * The UI never hardcodes a status color/label — it reads from here, so tone,
 * pulse, and funnel grouping stay consistent everywhere.
 */
import { LeadStatus } from "@shared/types"

/** Semantic tone → maps to design-system color tokens. */
export type Tone = "neutral" | "signal" | "success" | "warning" | "danger"

/** Funnel column groups (left → right through the lifecycle). */
export type StatusGroup = "detect" | "enrich" | "draft" | "outreach" | "reply" | "closed"

export interface StatusMeta {
  /** Full label, e.g. "Follow-up drafted". */
  label: string
  /** Compact label for chips/columns, e.g. "Follow-up". */
  short: string
  tone: Tone
  /** Pulse: true only for genuinely live / in-flight states. */
  live: boolean
  /** Directional-only signal (not trustworthy) — rendered de-emphasized. */
  directional?: boolean
  group: StatusGroup
  /** Sort order along the lifecycle. */
  order: number
}

export const STATUS_META: Record<LeadStatus, StatusMeta> = {
  [LeadStatus.DETECTED]: {
    label: "Detected",
    short: "Detected",
    tone: "signal",
    live: true,
    group: "detect",
    order: 0,
  },
  [LeadStatus.ENRICHED]: {
    label: "Enriched",
    short: "Enriched",
    tone: "neutral",
    live: false,
    group: "enrich",
    order: 1,
  },
  [LeadStatus.DRAFTED]: {
    label: "Drafted",
    short: "Drafted",
    tone: "neutral",
    live: false,
    group: "draft",
    order: 2,
  },
  [LeadStatus.SENT]: {
    label: "Sent",
    short: "Sent",
    tone: "signal",
    live: true,
    group: "outreach",
    order: 3,
  },
  [LeadStatus.DELIVERED]: {
    label: "Delivered",
    short: "Delivered",
    tone: "signal",
    live: false,
    group: "outreach",
    order: 4,
  },
  [LeadStatus.OPENED]: {
    label: "Opened",
    short: "Opened",
    tone: "neutral",
    live: false,
    directional: true,
    group: "outreach",
    order: 5,
  },
  [LeadStatus.REPLIED]: {
    label: "Replied",
    short: "Replied",
    tone: "signal",
    live: true,
    group: "reply",
    order: 6,
  },
  [LeadStatus.GREEN]: {
    label: "Interested",
    short: "Green",
    tone: "success",
    live: false,
    group: "reply",
    order: 7,
  },
  [LeadStatus.YELLOW]: {
    label: "Neutral",
    short: "Yellow",
    tone: "warning",
    live: false,
    group: "reply",
    order: 8,
  },
  [LeadStatus.RED]: {
    label: "Not interested",
    short: "Red",
    tone: "danger",
    live: false,
    group: "reply",
    order: 9,
  },
  [LeadStatus.FOLLOW_UP_DRAFTED]: {
    label: "Follow-up drafted",
    short: "Follow-up",
    tone: "signal",
    live: false,
    group: "draft",
    order: 10,
  },
  [LeadStatus.BOOKED]: {
    label: "Booked",
    short: "Booked",
    tone: "success",
    live: false,
    group: "closed",
    order: 11,
  },
  [LeadStatus.LOST]: {
    label: "Lost",
    short: "Lost",
    tone: "neutral",
    live: false,
    group: "closed",
    order: 12,
  },
}

/** Lifecycle-ordered list of statuses (for column layout / sorting). */
export const STATUS_ORDER: LeadStatus[] = (
  Object.keys(STATUS_META) as LeadStatus[]
).sort((a, b) => STATUS_META[a].order - STATUS_META[b].order)

/** Raw CSS custom-property per tone — for inline styles (ticks, pulse rings). */
export const TONE_VAR: Record<Tone, string> = {
  neutral: "var(--fg-muted)",
  signal: "var(--signal)",
  success: "var(--success)",
  warning: "var(--warning)",
  danger: "var(--danger)",
}

/** Funnel-board columns — the lifecycle left → right. Cards carry exact status. */
export const GROUP_COLUMNS: { group: StatusGroup; label: string; n: string }[] = [
  { group: "detect", label: "Detected", n: "01" },
  { group: "enrich", label: "Enriched", n: "02" },
  { group: "draft", label: "Drafted", n: "03" },
  { group: "outreach", label: "Outreach", n: "04" },
  { group: "reply", label: "Replied", n: "05" },
  { group: "closed", label: "Closed", n: "06" },
]

/** Tailwind class fragments per tone — text, background tint, border, dot. */
export const TONE_CLASSES: Record<
  Tone,
  { text: string; dot: string; chipBg: string; chipBorder: string }
> = {
  neutral: {
    text: "text-fg-muted",
    dot: "bg-fg-muted",
    chipBg: "bg-elevated",
    chipBorder: "border-line-strong",
  },
  signal: {
    text: "text-signal",
    dot: "bg-signal",
    chipBg: "bg-signal/10",
    chipBorder: "border-signal/30",
  },
  success: {
    text: "text-success",
    dot: "bg-success",
    chipBg: "bg-success/10",
    chipBorder: "border-success/30",
  },
  warning: {
    text: "text-warning",
    dot: "bg-warning",
    chipBg: "bg-warning/10",
    chipBorder: "border-warning/30",
  },
  danger: {
    text: "text-danger",
    dot: "bg-danger",
    chipBg: "bg-danger/10",
    chipBorder: "border-danger/30",
  },
}
