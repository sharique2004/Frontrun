"use client"

import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Wordmark } from "@/components/frontrun/signature"

const EASE_SIGNAL = [0.2, 0, 0, 1] as const

/** The live-signal readout that plays behind/beside the hero headline. */
const SIGNAL_ROWS = [
  { label: "FORM D FILED", value: "SEC EDGAR · same day", live: true },
  { label: "COMPANY", value: "Acme Robotics · Series A" },
  { label: "AMOUNT", value: "$18,000,000" },
  { label: "RESEARCH", value: "brief ready · 6 citations" },
  { label: "EMAIL", value: "resolved · confidence high" },
  { label: "DRAFT", value: "ready to send" },
]

export function Hero() {
  const reduce = useReducedMotion()

  const enter = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay, ease: EASE_SIGNAL },
        }

  return (
    <header className="relative overflow-hidden border-b border-line">
      {/* Signal-pulse background: faint hairline grid + one slow scan line. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "linear-gradient(to right, var(--line) 1px, transparent 1px)",
            backgroundSize: "160px 100%",
          }}
        />
        {!reduce && (
          <motion.div
            className="absolute inset-y-0 w-px bg-signal/25"
            initial={{ left: "0%" }}
            animate={{ left: "100%" }}
            transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
          />
        )}
      </div>

      {/* Top strip */}
      <div className="relative mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
        <Wordmark showDescriptor={false} />
        <Link
          href="/"
          className="font-mono text-[11px] uppercase tracking-[0.16em] text-fg-subtle transition-colors duration-[var(--dur-fast)] hover:text-fg"
        >
          Open dashboard →
        </Link>
      </div>

      <div className="relative mx-auto grid w-full max-w-6xl gap-14 px-6 pb-24 pt-20 md:grid-cols-[1fr_auto] md:gap-20 md:pb-32 md:pt-28">
        {/* Headline block */}
        <div>
          <motion.p className="kicker" {...enter(0)}>
            01 / Autonomous SDR
          </motion.p>
          <motion.h1
            className="mt-6 font-display text-5xl font-semibold leading-[1.02] tracking-tight text-fg md:text-7xl"
            {...enter(0.08)}
          >
            Reach them
            <br />
            first.
            <span
              aria-hidden
              className="ml-3 inline-block h-[0.14em] w-[0.32em] rounded-[2px] bg-signal align-baseline"
            />
          </motion.h1>
          <motion.p
            className="mt-7 max-w-md text-base leading-relaxed text-fg-muted md:text-lg"
            {...enter(0.16)}
          >
            Frontrun detects the raise the day it files — then researches,
            drafts, sends, and books. End to end.
          </motion.p>
          <motion.div className="mt-10" {...enter(0.24)}>
            <a
              href="#live-demo"
              className="inline-flex h-11 items-center gap-2 rounded-md bg-signal px-5 font-medium text-signal-foreground transition-colors duration-[var(--dur-fast)] hover:bg-signal-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
            >
              Watch it live
              <ArrowRight className="size-4" />
            </a>
          </motion.div>
        </div>

        {/* Live signal readout */}
        <motion.aside
          className="hidden self-center md:block"
          {...enter(0.3)}
          aria-label="Example detection signal"
        >
          <div className="w-72 border-l border-line pl-6">
            <div className="mb-4 flex items-center gap-2">
              <span className="relative flex size-2">
                {!reduce && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-60" />
                )}
                <span className="relative inline-flex size-2 rounded-full bg-signal" />
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-signal">
                Live signal
              </span>
            </div>
            <dl className="space-y-3">
              {SIGNAL_ROWS.map((row) => (
                <div
                  key={row.label}
                  className="flex items-baseline justify-between gap-4 border-b border-line pb-2.5"
                >
                  <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-fg-subtle">
                    {row.label}
                  </dt>
                  <dd className="font-mono text-xs text-fg-muted">
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </motion.aside>
      </div>
    </header>
  )
}
