"use client"

import { useMemo, useState } from "react"
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react"
import { type Lead, type ReplyClassification, LeadStatus } from "@shared/types"
import { cn } from "@/lib/utils"
import { useFrontrunStore } from "@/lib/ui/store"
import { useNow } from "@/lib/ui/use-now"
import { STATUS_META, TONE_CLASSES } from "@/lib/ui/status"
import { abbreviateMoney, relativeAge, shortDate } from "@/lib/ui/format"
import { StatusBadge } from "@/components/frontrun/status-badge"
import { ConfidenceTier } from "@/components/lead-detail/primitives"
import { LeadDetailSheet } from "@/components/lead-detail/lead-detail-sheet"

type SortKey = "detected" | "round" | "status" | "activity"
type SortDir = "asc" | "desc"

const amountValue = (l: Lead) =>
  Number((l.signal.amountRaised ?? "").replace(/[^0-9.]/g, "")) || 0
const time = (iso: string) => new Date(iso).getTime()

function verdictOf(l: Lead): ReplyClassification | null {
  switch (l.status) {
    case LeadStatus.GREEN:
      return "green"
    case LeadStatus.YELLOW:
      return "yellow"
    case LeadStatus.RED:
      return "red"
    default:
      return l.replies?.[l.replies.length - 1]?.classification ?? null
  }
}

const VERDICT_TONE = { green: "success", yellow: "warning", red: "danger" } as const
const VERDICT_CODE = { green: "GREEN", yellow: "YELLOW", red: "RED" } as const

function VerdictCell({ lead }: { lead: Lead }) {
  const v = verdictOf(lead)
  if (!v) return <span className="text-fg-faint">—</span>
  const tone = TONE_CLASSES[VERDICT_TONE[v]]
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-sm border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider",
        tone.chipBg,
        tone.chipBorder,
        tone.text,
      )}
    >
      <span className={cn("size-1.5 rounded-full", tone.dot)} />
      {VERDICT_CODE[v]}
    </span>
  )
}

function SortHead({
  label,
  col,
  sort,
  onSort,
  className,
}: {
  label: string
  col: SortKey
  sort: { key: SortKey; dir: SortDir }
  onSort: (k: SortKey) => void
  className?: string
}) {
  const active = sort.key === col
  return (
    <th className={cn("px-3 py-2 text-left font-normal", className)}>
      <button
        onClick={() => onSort(col)}
        className={cn(
          "kicker flex items-center gap-1 transition-colors hover:text-fg-muted",
          active && "text-signal",
        )}
      >
        {label}
        {active ? (
          sort.dir === "asc" ? (
            <ChevronUp className="size-3" />
          ) : (
            <ChevronDown className="size-3" />
          )
        ) : (
          <ChevronsUpDown className="size-3 opacity-40" />
        )}
      </button>
    </th>
  )
}

export function LeadsTable() {
  const leads = useFrontrunStore((s) => s.leads)
  const now = useNow(1000)
  const [sort, setSort] = useState<{ key: SortKey; dir: SortDir }>({
    key: "detected",
    dir: "desc",
  })
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = leads.find((l) => l.id === selectedId) ?? null

  const onSort = (key: SortKey) =>
    setSort((prev) =>
      prev.key === key
        ? { key, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { key, dir: key === "status" ? "asc" : "desc" },
    )

  const sorted = useMemo(() => {
    const arr = [...leads]
    const mul = sort.dir === "asc" ? 1 : -1
    arr.sort((a, b) => {
      switch (sort.key) {
        case "round":
          return (amountValue(a) - amountValue(b)) * mul
        case "status":
          return (STATUS_META[a.status].order - STATUS_META[b.status].order) * mul
        case "activity":
          return (time(a.updatedAt) - time(b.updatedAt)) * mul
        case "detected":
        default:
          return (time(a.signal.filedAt) - time(b.signal.filedAt)) * mul
      }
    })
    return arr
  }, [leads, sort])

  return (
    <>
      <div className="overflow-x-auto rounded-lg border border-line bg-surface">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-line">
              <th className="px-3 py-2 text-left font-normal">
                <span className="kicker">Company</span>
              </th>
              <SortHead label="Round" col="round" sort={sort} onSort={onSort} className="text-right" />
              <SortHead label="Status" col="status" sort={sort} onSort={onSort} />
              <th className="hidden px-3 py-2 text-left font-normal lg:table-cell">
                <span className="kicker">Email</span>
              </th>
              <SortHead
                label="Detected"
                col="detected"
                sort={sort}
                onSort={onSort}
                className="hidden md:table-cell"
              />
              <SortHead label="Activity" col="activity" sort={sort} onSort={onSort} className="text-right" />
              <th className="px-3 py-2 text-left font-normal">
                <span className="kicker">Verdict</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((lead) => {
              const open = () => setSelectedId(lead.id)
              return (
                <tr
                  key={lead.id}
                  onClick={open}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      open()
                    }
                  }}
                  className="cursor-pointer border-b border-line/60 transition-colors last:border-b-0 hover:bg-elevated/40 focus-visible:bg-elevated/40 focus-visible:outline-none"
                >
                  {/* Company */}
                  <td className="px-3 py-2.5">
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">{lead.signal.companyName}</span>
                      <span className="truncate text-xs text-fg-subtle">
                        {lead.signal.relatedPersons[0] ?? "—"}
                      </span>
                    </div>
                  </td>

                  {/* Round */}
                  <td className="px-3 py-2.5 text-right font-mono tabular-nums text-foreground">
                    {abbreviateMoney(lead.signal.amountRaised)}
                  </td>

                  {/* Status */}
                  <td className="px-3 py-2.5">
                    <StatusBadge status={lead.status} compact />
                  </td>

                  {/* Email + confidence */}
                  <td className="hidden max-w-[240px] px-3 py-2.5 lg:table-cell">
                    {lead.contact?.email ? (
                      <div className="flex items-center gap-2">
                        <span className="truncate font-mono text-xs text-fg-muted">
                          {lead.contact.email}
                        </span>
                        <ConfidenceTier confidence={lead.contact.emailConfidence} />
                      </div>
                    ) : (
                      <span className="text-fg-faint">—</span>
                    )}
                  </td>

                  {/* Detected */}
                  <td className="hidden px-3 py-2.5 font-mono text-xs tabular-nums text-fg-subtle md:table-cell">
                    {shortDate(lead.signal.filedAt)}
                  </td>

                  {/* Last activity */}
                  <td className="px-3 py-2.5 text-right font-mono text-xs tabular-nums text-fg-subtle">
                    {now ? relativeAge(lead.updatedAt, now) : "·"}
                  </td>

                  {/* Verdict */}
                  <td className="px-3 py-2.5">
                    <VerdictCell lead={lead} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <LeadDetailSheet lead={selected} onClose={() => setSelectedId(null)} />
    </>
  )
}
