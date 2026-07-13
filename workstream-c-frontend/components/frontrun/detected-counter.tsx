"use client"

import { AnimatePresence, motion } from "framer-motion"
import { useFrontrunStore } from "@/lib/ui/store"
import { padCount } from "@/lib/ui/format"
import { LiveDot } from "./live-dot"

/**
 * The live "N companies detected today" counter — the top bar's heartbeat.
 * The number rolls when the simulator detects a new company.
 */
export function DetectedCounter() {
  const n = useFrontrunStore((s) => s.detectedToday)
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1.5">
        <LiveDot tone="signal" live />
        <span className="kicker text-signal">Live</span>
      </div>

      <div className="flex items-baseline gap-2.5">
        <div className="relative h-7 overflow-hidden font-mono text-[26px] font-medium leading-7 tabular-nums text-foreground">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={n}
              initial={{ y: "-70%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "70%", opacity: 0 }}
              transition={{ duration: 0.24, ease: [0.2, 0, 0, 1] }}
              className="inline-block"
            >
              {padCount(n)}
            </motion.span>
          </AnimatePresence>
        </div>
        <span className="hidden text-xs leading-tight text-fg-muted sm:block">
          companies detected
          <br />
          <span className="text-fg-subtle">today</span>
        </span>
      </div>
    </div>
  )
}
