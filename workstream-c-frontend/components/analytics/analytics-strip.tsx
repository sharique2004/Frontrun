"use client"

import { AnimatePresence, motion } from "framer-motion"
import { useFrontrunStore } from "@/lib/ui/store"
import { computeAnalytics } from "@/lib/ui/analytics"
import { formatDuration, padCount } from "@/lib/ui/format"

/** A value that rolls when it changes — so the strip visibly reacts. */
function Rolling({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <div className="relative h-8 overflow-hidden">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={k}
          initial={{ y: "-65%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "65%", opacity: 0 }}
          transition={{ duration: 0.24, ease: [0.2, 0, 0, 1] }}
          className="font-mono text-[26px] font-medium leading-8 tabular-nums text-foreground"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function Tile({
  label,
  valueKey,
  value,
  sub,
  bar,
}: {
  label: string
  valueKey: string
  value: React.ReactNode
  sub: React.ReactNode
  bar?: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2 bg-surface p-4">
      <span className="kicker">{label}</span>
      <Rolling k={valueKey}>{value}</Rolling>
      {bar}
      <span className="text-[11px] leading-tight text-fg-subtle">{sub}</span>
    </div>
  )
}

export function AnalyticsStrip() {
  const leads = useFrontrunStore((s) => s.leads)
  const detectedToday = useFrontrunStore((s) => s.detectedToday)
  const a = computeAnalytics(leads, detectedToday)

  const replyPct = Math.round(a.replyRate * 100)
  const grTotal = a.green + a.red
  const greenPct = grTotal ? (a.green / grTotal) * 100 : 0
  const redPct = grTotal ? (a.red / grTotal) * 100 : 0

  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line lg:grid-cols-4">
      <Tile
        label="Reply rate"
        valueKey={`rr-${replyPct}`}
        value={`${replyPct}%`}
        sub={`${a.replied} replied · ${a.delivered} delivered`}
      />

      <Tile
        label="Avg response"
        valueKey={`ar-${a.avgResponseMs ?? "na"}`}
        value={formatDuration(a.avgResponseMs)}
        sub="delivered → first reply"
      />

      <Tile
        label="Green / Red"
        valueKey={`gr-${a.green}-${a.red}`}
        value={
          <span>
            <span className="text-success">{a.green}</span>
            <span className="mx-1 text-fg-faint">/</span>
            <span className="text-danger">{a.red}</span>
          </span>
        }
        bar={
          <div className="flex h-1 gap-px overflow-hidden rounded-full bg-elevated">
            <motion.div
              className="h-full bg-success"
              animate={{ width: `${greenPct}%` }}
              transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
            />
            <motion.div
              className="h-full bg-danger/80"
              animate={{ width: `${redPct}%` }}
              transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
            />
          </div>
        }
        sub={`${a.yellow} neutral · ${a.booked} booked`}
      />

      <Tile
        label="Detected today"
        valueKey={`dt-${detectedToday}`}
        value={padCount(detectedToday)}
        sub="Form D filings"
      />
    </div>
  )
}
