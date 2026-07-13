"use client"

import { AnimatePresence, motion } from "framer-motion"
import { Check, CheckCircle2, CircleHelp, CircleX } from "lucide-react"
import { type Lead, LeadStatus, type ReplyClassification } from "@shared/types"
import { cn } from "@/lib/utils"
import { abbreviateMoney } from "@/lib/ui/format"
import { TONE_CLASSES, type Tone } from "@/lib/ui/status"

/** How far through Sent → Delivered → Replied a status has reached (0..3). */
const REACHED: Partial<Record<LeadStatus, number>> = {
  [LeadStatus.DRAFTED]: 0,
  [LeadStatus.SENT]: 1,
  [LeadStatus.DELIVERED]: 2,
  [LeadStatus.OPENED]: 2,
  [LeadStatus.REPLIED]: 3,
  [LeadStatus.GREEN]: 3,
  [LeadStatus.YELLOW]: 3,
  [LeadStatus.RED]: 3,
  [LeadStatus.FOLLOW_UP_DRAFTED]: 3,
  [LeadStatus.BOOKED]: 3,
}

const STEPS = [
  { k: 1, label: "Sent" },
  { k: 2, label: "Delivered" },
  { k: 3, label: "Replied" },
] as const

const VERDICT: Record<
  ReplyClassification,
  { code: string; label: string; tone: Tone; icon: React.ComponentType<{ className?: string }> }
> = {
  green: { code: "GREEN", label: "Interested", tone: "success", icon: CheckCircle2 },
  yellow: { code: "YELLOW", label: "Neutral", tone: "warning", icon: CircleHelp },
  red: { code: "RED", label: "Not interested", tone: "danger", icon: CircleX },
}

function verdictOf(lead: Lead): ReplyClassification | null {
  switch (lead.status) {
    case LeadStatus.GREEN:
      return "green"
    case LeadStatus.YELLOW:
      return "yellow"
    case LeadStatus.RED:
      return "red"
    default:
      return lead.replies?.[lead.replies.length - 1]?.classification ?? null
  }
}

export function OutreachCard({ lead, active }: { lead: Lead; active: boolean }) {
  const reached = REACHED[lead.status] ?? 0
  const verdict = verdictOf(lead)
  const inFlight = active && reached > 0 && reached < 3

  return (
    <motion.div
      layout
      className={cn(
        "flex flex-col gap-4 rounded-lg border bg-surface p-4 transition-colors",
        inFlight ? "border-signal/40" : "border-line",
      )}
      animate={inFlight ? { boxShadow: "0 0 0 1px var(--signal)" } : { boxShadow: "0 0 0 0px transparent" }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-sm font-medium text-foreground">
            {lead.signal.companyName}
          </span>
          <span className="truncate font-mono text-[11px] text-fg-subtle">
            {lead.contact?.email ?? lead.signal.relatedPersons[0]}
          </span>
        </div>
        <span className="shrink-0 font-mono text-xs tabular-nums text-fg-muted">
          {abbreviateMoney(lead.signal.amountRaised)}
        </span>
      </div>

      {/* Pipeline stepper — fills left → right as the status advances */}
      <div className="grid grid-cols-3 gap-1.5">
        {STEPS.map((s) => {
          const on = reached >= s.k
          return (
            <div key={s.k} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    "font-mono text-[10px] uppercase tracking-wider",
                    on ? "text-signal" : "text-fg-subtle",
                  )}
                >
                  {s.label}
                </span>
                {on && <Check className="size-3 text-signal" />}
              </div>
              <div className="h-1 overflow-hidden rounded-full bg-elevated">
                <motion.div
                  className="h-full rounded-full bg-signal"
                  initial={false}
                  animate={{ width: on ? "100%" : "0%" }}
                  transition={{ duration: 0.5, ease: [0.2, 0, 0, 1] }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Verdict — reserved height so cards don't jump */}
      <div className="flex h-7 items-center">
        <AnimatePresence mode="wait">
          {verdict ? (
            <motion.div
              key={verdict}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.24, ease: [0.2, 0, 0, 1] }}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md border px-2 py-1",
                TONE_CLASSES[VERDICT[verdict].tone].chipBg,
                TONE_CLASSES[VERDICT[verdict].tone].chipBorder,
                TONE_CLASSES[VERDICT[verdict].tone].text,
              )}
            >
              {(() => {
                const Icon = VERDICT[verdict].icon
                return <Icon className="size-3.5" />
              })()}
              <span className="font-mono text-[11px] font-medium uppercase tracking-wider">
                {VERDICT[verdict].code}
              </span>
              <span className="text-xs">· {VERDICT[verdict].label}</span>
            </motion.div>
          ) : reached >= 2 ? (
            <span className="font-mono text-[11px] uppercase tracking-wider text-fg-subtle">
              awaiting reply…
            </span>
          ) : (
            <span className="font-mono text-[11px] uppercase tracking-wider text-fg-faint">
              {reached === 0 ? "ready" : "in flight…"}
            </span>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
