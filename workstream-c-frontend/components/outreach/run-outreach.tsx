"use client"

import { Send, Loader2 } from "lucide-react"
import type { Lead } from "@shared/types"
import { useFrontrunStore } from "@/lib/ui/store"
import { MOCK_LEADS } from "@/lib/mock/leads"
import { Button } from "@/components/ui/button"
import { LiveDot } from "@/components/frontrun/live-dot"
import { OutreachCard } from "./outreach-card"

/** Demo companies in filing order — matches the store's verdict assignment. */
const DEMO_ORDER = MOCK_LEADS.filter((l) => l.isDemo).map((l) => l.id)

export function RunOutreach() {
  const leads = useFrontrunStore((s) => s.leads)
  const active = useFrontrunStore((s) => s.outreachActive)
  const run = useFrontrunStore((s) => s.runOutreachDemo)

  const demoLeads = DEMO_ORDER.map((id) => leads.find((l) => l.id === id)).filter(
    Boolean,
  ) as Lead[]

  const hasResult = demoLeads.some((l) => (l.replies?.length ?? 0) > 0)

  return (
    <section className="flex flex-col gap-4 rounded-lg border border-line bg-surface/40 p-4 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <span className="kicker">Parallel outreach</span>
          <h3 className="font-display text-lg font-semibold tracking-tight text-foreground">
            Run outreach · 3 companies
          </h3>
          <p className="max-w-md text-xs text-fg-muted">
            One click sends to three seeded demo inboxes at once — watch Sent → Delivered →
            Replied fire in parallel, each triaged green / yellow / red.
          </p>
        </div>

        <Button
          size="lg"
          onClick={run}
          disabled={active}
          className="shrink-0 gap-2 px-4"
        >
          {active ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Sending…
            </>
          ) : (
            <>
              <Send className="size-4" />
              {hasResult ? "Re-run outreach" : "Run outreach"}
            </>
          )}
        </Button>
      </div>

      {active && (
        <div className="flex items-center gap-2.5 rounded-md border border-signal/25 bg-signal/5 px-3 py-2">
          <div className="flex items-center gap-1">
            <LiveDot tone="signal" live />
            <LiveDot tone="signal" live />
            <LiveDot tone="signal" live />
          </div>
          <span className="font-mono text-[11px] uppercase tracking-wider text-signal">
            Sending to 3 inboxes in parallel
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {demoLeads.map((lead) => (
          <OutreachCard key={lead.id} lead={lead} active={active} />
        ))}
      </div>
    </section>
  )
}
