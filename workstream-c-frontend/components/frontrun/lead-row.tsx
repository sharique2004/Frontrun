"use client"

import { motion } from "framer-motion"
import type { Lead } from "@shared/types"
import { cn } from "@/lib/utils"
import { abbreviateMoney, relativeAge } from "@/lib/ui/format"
import { StatusBadge } from "./status-badge"

/**
 * One row in the signal feed. Intentionally lightweight for the scaffold —
 * the full expandable card + draft view lands in the feature-screen pass.
 */
export function LeadRow({
  lead,
  now,
  flash,
  onSelect,
}: {
  lead: Lead
  now: number | null
  flash: boolean
  onSelect?: () => void
}) {
  const founder = lead.signal.relatedPersons[0] ?? "—"
  const age = now ? relativeAge(lead.updatedAt, now) : null

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: [0.2, 0, 0, 1] }}
      onClick={onSelect}
      role={onSelect ? "button" : undefined}
      tabIndex={onSelect ? 0 : undefined}
      onKeyDown={
        onSelect
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                onSelect()
              }
            }
          : undefined
      }
      className={cn(
        "group relative flex items-center gap-4 border-b border-line px-4 py-3 transition-colors sm:px-5",
        "hover:bg-elevated/40 focus-visible:bg-elevated/40 focus-visible:outline-none",
        onSelect && "cursor-pointer",
        flash && "bg-signal/[0.06]",
      )}
    >
      {/* Company + founder */}
      <div className="flex min-w-0 flex-[2] flex-col">
        <span className="truncate text-sm font-medium text-foreground">
          {lead.signal.companyName}
        </span>
        <span className="truncate text-xs text-fg-subtle">
          {founder}
          {lead.signal.address ? (
            <span className="hidden text-fg-faint sm:inline"> · {lead.signal.address.split(",").slice(-2).join(",").trim()}</span>
          ) : null}
        </span>
      </div>

      {/* Amount raised */}
      <div className="hidden w-20 shrink-0 text-right font-mono text-sm tabular-nums text-foreground sm:block">
        {abbreviateMoney(lead.signal.amountRaised)}
      </div>

      {/* Status */}
      <div className="flex w-[132px] shrink-0 justify-start">
        <StatusBadge status={lead.status} />
      </div>

      {/* Age */}
      <div className="w-10 shrink-0 text-right font-mono text-[11px] tabular-nums text-fg-subtle">
        {age ?? "·"}
      </div>
    </motion.div>
  )
}
