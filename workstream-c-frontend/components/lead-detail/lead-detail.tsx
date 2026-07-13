import { Mail, ExternalLink, Link2, BadgeCheck } from "lucide-react"
import { type Lead, LeadStatus } from "@shared/types"
import { cn } from "@/lib/utils"
import { abbreviateMoney, clockUTC, shortDate } from "@/lib/ui/format"
import { StatusBadge } from "@/components/frontrun/status-badge"
import {
  SectionHeader,
  Field,
  CitationChip,
  ConfidenceTier,
  EmailBlock,
  BookingBanner,
} from "./primitives"
import { ReplyThread } from "./reply-thread"

function Section({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3 border-b border-line p-4 last:border-b-0 sm:p-5">
      {children}
    </section>
  )
}

function DeliveryTimeline({ lead }: { lead: Lead }) {
  const o = lead.outreach
  if (!o?.sentAt) return null
  const steps: { label: string; at?: string; muted?: boolean }[] = [
    { label: "Sent", at: o.sentAt },
    { label: "Delivered", at: o.deliveredAt },
    { label: "Opened", at: o.openedAt, muted: true },
  ]
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] tabular-nums text-fg-subtle">
      {steps
        .filter((s) => s.at)
        .map((s) => (
          <span key={s.label} className={cn(s.muted && "opacity-70")}>
            <span className="text-fg-faint">{s.label} </span>
            {clockUTC(s.at!)}
            {s.muted && " (directional)"}
          </span>
        ))}
    </div>
  )
}

export function LeadDetail({ lead }: { lead: Lead }) {
  const { signal, brief, contact, draft } = lead
  const isBooked = lead.status === LeadStatus.BOOKED || !!lead.outreach?.bookedAt

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex flex-col gap-3 border-b border-line p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <h2 className="font-display text-xl font-semibold tracking-tight text-foreground">
                {signal.companyName}
              </h2>
              {lead.isDemo && (
                <span className="rounded-sm border border-signal/30 bg-signal/10 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-signal">
                  Demo
                </span>
              )}
            </div>
            <StatusBadge status={lead.status} />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 font-mono text-xs tabular-nums">
          <span className="text-foreground">{abbreviateMoney(signal.amountRaised)}</span>
          <span className="text-fg-subtle">Filed {shortDate(signal.filedAt)}</span>
          {signal.edgarUrl && (
            <a
              href={signal.edgarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-fg-muted transition-colors hover:text-signal"
            >
              Form D <ExternalLink className="size-3" />
            </a>
          )}
          <span className="text-fg-faint">{signal.accessionNumber}</span>
        </div>
      </div>

      {/* Booking win */}
      {isBooked && (
        <div className="border-b border-line p-4 sm:p-5">
          <BookingBanner bookedAt={lead.outreach?.bookedAt} />
        </div>
      )}

      {/* Research brief */}
      <Section>
        <SectionHeader
          n="01"
          label="Research"
          right={
            brief?.fundingConfirmed ? (
              <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-success">
                <BadgeCheck className="size-3" /> Raise confirmed
              </span>
            ) : undefined
          }
        />
        {brief ? (
          <>
            <p className="text-sm leading-relaxed text-fg-muted">{brief.summary}</p>
            {brief.citations.length > 0 && (
              <div className="flex flex-col gap-1.5">
                <span className="kicker text-[9px]">Citations</span>
                <div className="flex flex-wrap gap-1.5">
                  {brief.citations.map((c) => (
                    <CitationChip key={c.url} citation={c} />
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <p className="text-sm text-fg-subtle">Awaiting research — You.com brief runs at enrichment.</p>
        )}
      </Section>

      {/* Enrichment */}
      <Section>
        <SectionHeader n="02" label="Enrichment" />
        {contact ? (
          <>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              <Field label="Contact">{contact.name}</Field>
              <Field label="Title">{contact.title ?? "—"}</Field>
              <Field label="Source">
                <span className="font-mono text-xs uppercase text-fg-muted">{contact.source}</span>
              </Field>
              <Field label="Location">{signal.address ?? "—"}</Field>
            </div>

            {/* Resolved email + confidence */}
            <div className="flex flex-col gap-1.5">
              <span className="kicker text-[9px]">Resolved email</span>
              <div className="flex items-center justify-between gap-2 rounded-md border border-line bg-inset p-2.5">
                <div className="flex min-w-0 items-center gap-2">
                  <Mail className="size-4 shrink-0 text-fg-subtle" />
                  <span className="truncate font-mono text-sm text-foreground">
                    {contact.email ?? "not resolved"}
                  </span>
                </div>
                <ConfidenceTier confidence={contact.emailConfidence} />
              </div>
            </div>

            {contact.linkedinUrl && (
              <a
                href={contact.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-fg-muted transition-colors hover:text-signal"
              >
                <Link2 className="size-3.5" /> LinkedIn
                <span className="text-fg-faint">· draft-only, no automation</span>
              </a>
            )}
          </>
        ) : (
          <p className="text-sm text-fg-subtle">
            Awaiting enrichment — Nimble scrape + email resolve + Reoon verify.
          </p>
        )}
      </Section>

      {/* Outreach draft */}
      <Section>
        <SectionHeader n="03" label="Outreach draft" />
        {draft ? (
          <>
            <EmailBlock email={draft} from="Frontrun · Dana" to={contact?.email} />
            <DeliveryTimeline lead={lead} />
          </>
        ) : (
          <p className="text-sm text-fg-subtle">No draft yet — written after enrichment.</p>
        )}
      </Section>

      {/* Conversation */}
      <Section>
        <SectionHeader n="04" label="Conversation" />
        <ReplyThread lead={lead} />
      </Section>
    </div>
  )
}
