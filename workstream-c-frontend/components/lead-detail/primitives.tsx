import {
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  ShieldQuestion,
  CheckCircle2,
  CircleHelp,
  CircleX,
  CalendarCheck,
  ArrowUpRight,
} from "lucide-react"
import type { EmailConfidence, ReplyClassification, Citation, EmailDraft } from "@shared/types"
import { cn } from "@/lib/utils"
import { TONE_CLASSES, TONE_VAR, type Tone } from "@/lib/ui/status"
import { clockUTC, shortDate } from "@/lib/ui/format"

/** Numbered section header (Padzy kicker) with optional right slot. */
export function SectionHeader({
  n,
  label,
  right,
}: {
  n: string
  label: string
  right?: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="kicker">
        {n} / {label}
      </span>
      {right}
    </div>
  )
}

/** Label + value field. */
export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="kicker text-[9px]">{label}</span>
      <span className="text-sm text-foreground">{children}</span>
    </div>
  )
}

/** External citation as a linked chip. */
export function CitationChip({ citation }: { citation: Citation }) {
  return (
    <a
      href={citation.url}
      target="_blank"
      rel="noopener noreferrer"
      title={citation.snippet ?? citation.url}
      className="group inline-flex max-w-full items-center gap-1.5 rounded-sm border border-line-strong bg-elevated px-2 py-1 text-xs text-fg-muted transition-colors hover:border-signal/40 hover:text-foreground"
    >
      <span className="truncate">{citation.title}</span>
      <ExternalLink className="size-3 shrink-0 text-fg-subtle group-hover:text-signal" />
    </a>
  )
}

const CONFIDENCE: Record<
  EmailConfidence,
  { label: string; tone: Tone; icon: React.ComponentType<{ className?: string }> }
> = {
  high: { label: "High", tone: "success", icon: ShieldCheck },
  medium: { label: "Medium", tone: "warning", icon: ShieldAlert },
  low: { label: "Low", tone: "danger", icon: ShieldAlert },
  unverified: { label: "Unverified", tone: "neutral", icon: ShieldQuestion },
}

/** Email confidence tier — probabilistic, never claims certainty (PRD §14). */
export function ConfidenceTier({ confidence }: { confidence: EmailConfidence }) {
  const c = CONFIDENCE[confidence]
  const tone = TONE_CLASSES[c.tone]
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-sm border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider",
        tone.chipBg,
        tone.chipBorder,
        tone.text,
      )}
    >
      <c.icon className="size-3" />
      {c.label}
    </span>
  )
}

const CLASSIFICATION: Record<
  ReplyClassification,
  {
    code: string
    label: string
    tone: Tone
    icon: React.ComponentType<{ className?: string }>
  }
> = {
  green: { code: "GREEN", label: "Interested", tone: "success", icon: CheckCircle2 },
  yellow: { code: "YELLOW", label: "Neutral / question", tone: "warning", icon: CircleHelp },
  red: { code: "RED", label: "Not interested", tone: "danger", icon: CircleX },
}

/**
 * Reply triage verdict — deliberately unmistakable: tinted bar, bold tone code,
 * icon, and the one-line agent summary underneath.
 */
export function ClassificationBanner({
  classification,
  summary,
}: {
  classification: ReplyClassification
  summary?: string
}) {
  const c = CLASSIFICATION[classification]
  const tone = TONE_CLASSES[c.tone]
  return (
    <div
      className={cn(
        "flex flex-col gap-1.5 rounded-md border border-l-[3px] p-3",
        tone.chipBg,
        tone.chipBorder,
      )}
      style={{ borderLeftColor: TONE_VAR[c.tone] }}
    >
      <div className={cn("flex items-center gap-2", tone.text)}>
        <c.icon className="size-4 shrink-0" />
        <span className="font-mono text-xs font-medium uppercase tracking-wider">{c.code}</span>
        <span className="text-sm font-medium">· {c.label}</span>
      </div>
      {summary && (
        <p className="pl-6 text-xs leading-snug text-fg-muted">
          <span className="text-fg-subtle">Triage:</span> {summary}
        </p>
      )}
    </div>
  )
}

/** A rendered email (draft or follow-up). */
export function EmailBlock({
  email,
  from,
  to,
  accent = false,
}: {
  email: EmailDraft
  from: string
  to?: string
  accent?: boolean
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-md border bg-inset",
        accent ? "border-signal/25" : "border-line",
      )}
    >
      <div className="flex flex-col gap-1 border-b border-line px-3 py-2">
        <div className="flex items-center gap-2 font-mono text-[11px] text-fg-subtle">
          <span className="text-fg-muted">{from}</span>
          {to && (
            <>
              <ArrowUpRight className="size-3" />
              <span className="truncate">{to}</span>
            </>
          )}
        </div>
        <p className="text-sm font-medium text-foreground">{email.subject}</p>
      </div>
      <p className="whitespace-pre-line px-3 py-2.5 text-[13px] leading-relaxed text-fg-muted">
        {email.body}
      </p>
    </div>
  )
}

/** Booking win banner — only when the lead is BOOKED. */
export function BookingBanner({ bookedAt }: { bookedAt?: string }) {
  return (
    <div className="flex items-center gap-3 rounded-md border border-success/40 bg-success/10 p-3">
      <CalendarCheck className="size-5 shrink-0 text-success" />
      <div className="flex flex-1 flex-col">
        <span className="text-sm font-medium text-success">Call booked</span>
        <span className="text-xs text-fg-muted">
          {bookedAt
            ? `${shortDate(bookedAt)} · ${clockUTC(bookedAt)} UTC · via Cal.com`
            : "via Cal.com"}
        </span>
      </div>
      <span className="font-mono text-[10px] uppercase tracking-wider text-success">Won</span>
    </div>
  )
}
