"use client"

import { AnimatePresence } from "framer-motion"
import type { Lead } from "@shared/types"
import { padCount } from "@/lib/ui/format"
import type { StatusGroup } from "@/lib/ui/status"
import { LeadCard } from "./lead-card"

type Column = { group: StatusGroup; label: string; n: string }

export function BoardColumn({
  col,
  leads,
  now,
  changedId,
  changeKey,
}: {
  col: Column
  leads: Lead[]
  now: number | null
  changedId: string | null
  changeKey: number | null
}) {
  return (
    <div className="flex w-[280px] shrink-0 flex-col">
      <div className="flex items-center justify-between px-1 pb-2.5">
        <span className="kicker">
          {col.n} / {col.label}
        </span>
        <span className="font-mono text-[11px] tabular-nums text-fg-subtle">
          {padCount(leads.length, 2)}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 overflow-y-auto rounded-lg border border-line bg-inset/50 p-2">
        <AnimatePresence mode="popLayout" initial={false}>
          {leads.map((lead) => (
            <LeadCard
              key={lead.id}
              lead={lead}
              now={now}
              changedId={changedId}
              changeKey={changeKey}
            />
          ))}
        </AnimatePresence>

        {leads.length === 0 && (
          <div className="flex flex-1 items-center justify-center py-8">
            <span className="font-mono text-[11px] uppercase tracking-wider text-fg-faint">
              empty
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
