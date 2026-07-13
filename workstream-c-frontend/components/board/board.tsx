"use client"

import { useMemo } from "react"
import { LayoutGroup } from "framer-motion"
import type { Lead } from "@shared/types"
import { useFrontrunStore } from "@/lib/ui/store"
import { useNow } from "@/lib/ui/use-now"
import { GROUP_COLUMNS, STATUS_META, type StatusGroup } from "@/lib/ui/status"
import { BoardColumn } from "./board-column"

function groupLeads(leads: Lead[]): Record<StatusGroup, Lead[]> {
  const out = {
    detect: [],
    enrich: [],
    draft: [],
    outreach: [],
    reply: [],
    closed: [],
  } as Record<StatusGroup, Lead[]>
  for (const lead of leads) out[STATUS_META[lead.status].group].push(lead)
  // Most-recently-updated on top within each column.
  for (const g of Object.keys(out) as StatusGroup[]) {
    out[g].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  }
  return out
}

export function FunnelBoard() {
  const leads = useFrontrunStore((s) => s.leads)
  const changedId = useFrontrunStore((s) => s.lastChangedId)
  const changeKey = useFrontrunStore((s) => s.lastChangedAt)
  const now = useNow(1000)

  const grouped = useMemo(() => groupLeads(leads), [leads])

  return (
    <LayoutGroup>
      <div className="flex h-[calc(100svh-4rem)] gap-3 overflow-x-auto px-4 py-5 sm:px-6">
        {GROUP_COLUMNS.map((col) => (
          <BoardColumn
            key={col.group}
            col={col}
            leads={grouped[col.group]}
            now={now}
            changedId={changedId}
            changeKey={changeKey}
          />
        ))}
      </div>
    </LayoutGroup>
  )
}
