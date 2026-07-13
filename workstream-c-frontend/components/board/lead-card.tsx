"use client"

import { motion } from "framer-motion"
import type { Lead } from "@shared/types"
import { cn } from "@/lib/utils"
import { abbreviateMoney, relativeAge } from "@/lib/ui/format"
import { STATUS_META, TONE_VAR } from "@/lib/ui/status"
import { StatusBadge } from "@/components/frontrun/status-badge"

/** Short enrichment line: brief > contact > awaiting. */
function enrichmentSnippet(lead: Lead): { text: string; muted: boolean } {
  if (lead.brief?.summary) return { text: lead.brief.summary, muted: false }
  if (lead.contact) {
    const c = lead.contact
    return {
      text: [c.name, c.title, c.email].filter(Boolean).join(" · "),
      muted: false,
    }
  }
  const founder = lead.signal.relatedPersons[0] ?? "—"
  return { text: `Awaiting enrichment · ${founder}`, muted: true }
}

function city(address?: string): string {
  if (!address) return ""
  return address.split(",").slice(-2).join(",").trim()
}

export function LeadCard({
  lead,
  now,
  changedId,
  changeKey,
}: {
  lead: Lead
  now: number | null
  changedId: string | null
  /** store lastChangedAt — re-keys the pulse so it replays on each change. */
  changeKey: number | null
}) {
  const tone = STATUS_META[lead.status].tone
  const toneVar = TONE_VAR[tone]
  const snippet = enrichmentSnippet(lead)
  const age = now ? relativeAge(lead.updatedAt, now) : null
  const isChanged = changedId === lead.id

  return (
    <motion.article
      layout
      layoutId={lead.id}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{
        layout: { duration: 0.42, ease: [0.2, 0, 0, 1] },
        duration: 0.24,
        ease: [0.2, 0, 0, 1],
      }}
      className={cn(
        "group relative overflow-hidden rounded-md border border-line bg-surface",
        "shadow-card transition-colors hover:border-line-strong",
      )}
    >
      {/* Tone accent tick (leading edge) */}
      <span
        aria-hidden
        className="absolute inset-y-0 left-0 w-[2px]"
        style={{ background: toneVar }}
      />

      {/* Status-change pulse — replays via keyed remount */}
      {isChanged && (
        <motion.span
          key={changeKey ?? 0}
          aria-hidden
          className="pointer-events-none absolute inset-[-1px] rounded-md"
          style={{ boxShadow: `0 0 0 1.5px ${toneVar}, 0 0 18px -4px ${toneVar}` }}
          initial={{ opacity: 0.9 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: "easeOut" }}
        />
      )}

      <div className="flex flex-col gap-2 p-3 pl-3.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-medium leading-tight text-foreground">
            {lead.signal.companyName}
          </h3>
          <StatusBadge status={lead.status} compact className="shrink-0" />
        </div>

        <div className="flex items-center gap-2 font-mono text-xs tabular-nums">
          <span className="text-foreground">{abbreviateMoney(lead.signal.amountRaised)}</span>
          <span className="text-fg-faint">·</span>
          <span className="text-fg-subtle">{age ?? "·"}</span>
          {city(lead.signal.address) && (
            <>
              <span className="text-fg-faint">·</span>
              <span className="truncate text-fg-subtle">{city(lead.signal.address)}</span>
            </>
          )}
        </div>

        <p
          className={cn(
            "line-clamp-2 border-t border-line pt-2 text-xs leading-snug",
            snippet.muted ? "text-fg-subtle" : "text-fg-muted",
          )}
        >
          {snippet.text}
        </p>
      </div>
    </motion.article>
  )
}
