"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Radar, Columns3, Rows3, ChartNoAxesColumn, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { Wordmark } from "./signature"
import { LiveDot } from "./live-dot"

interface NavEntry {
  n: string
  label: string
  href?: string
  icon: React.ComponentType<{ className?: string }>
  /** Not built yet in this scaffold — shown, not linked. */
  soon?: boolean
}

const NAV: NavEntry[] = [
  { n: "01", label: "Signal Feed", href: "/", icon: Radar },
  { n: "02", label: "Funnel", href: "/funnel", icon: Columns3 },
  { n: "03", label: "Leads", href: "/leads", icon: Rows3 },
  { n: "04", label: "Analytics", href: "/analytics", icon: ChartNoAxesColumn },
]

function NavItem({ entry, active }: { entry: NavEntry; active: boolean }) {
  const inner = (
    <>
      <entry.icon
        className={cn(
          "h-4 w-4 shrink-0 transition-colors",
          active ? "text-signal" : "text-fg-subtle group-hover:text-fg-muted",
        )}
      />
      <span className="flex-1 truncate text-sm">{entry.label}</span>
      {active ? (
        <span className="font-mono text-[9px] uppercase tracking-wider text-signal">live</span>
      ) : entry.soon ? (
        <span className="font-mono text-[9px] uppercase tracking-wider text-fg-faint">soon</span>
      ) : null}
    </>
  )

  const base = cn(
    "group tick relative flex items-center gap-2.5 rounded-md px-2.5 py-2 transition-colors",
    active ? "bg-elevated text-foreground" : "text-fg-muted",
    entry.soon && !active && "cursor-default text-fg-faint",
    !entry.soon && !active && "hover:bg-elevated/60 hover:text-foreground",
  )

  // Only active items get the accent tick; strip it otherwise.
  const cls = active ? base : cn(base, "before:hidden")

  if (entry.href && !entry.soon) {
    return (
      <Link href={entry.href} className={cls} aria-current={active ? "page" : undefined}>
        {inner}
      </Link>
    )
  }
  return (
    <div className={cls} aria-disabled="true">
      {inner}
    </div>
  )
}

export function SidebarNav() {
  const pathname = usePathname()
  return (
    <div className="flex h-full flex-col gap-6 p-4">
      <div className="px-1.5 pt-1">
        <Wordmark />
      </div>

      <nav className="flex flex-col gap-0.5">
        <p className="kicker px-2.5 pb-2">Workspace</p>
        {NAV.map((entry) => (
          <NavItem
            key={entry.label}
            entry={entry}
            active={!!entry.href && pathname === entry.href}
          />
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-3">
        {/* Live system status — reinforces the always-on signal loop */}
        <div className="rounded-md border border-line bg-inset p-3">
          <p className="kicker pb-2.5">System</p>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-xs text-fg-muted">
                <LiveDot tone="success" live />
                EDGAR poll
              </span>
              <span className="font-mono text-[10px] uppercase tracking-wide text-success">
                live
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-xs text-fg-muted">
                <LiveDot tone="signal" />
                Demo mode
              </span>
              <span className="font-mono text-[10px] uppercase tracking-wide text-fg-subtle">
                on
              </span>
            </div>
          </div>
        </div>

        <div
          className="group tick relative flex cursor-default items-center gap-2.5 rounded-md px-2.5 py-2 text-fg-faint before:hidden"
          aria-disabled="true"
        >
          <Settings className="h-4 w-4 shrink-0 text-fg-faint" />
          <span className="flex-1 text-sm">Settings</span>
          <span className="font-mono text-[9px] uppercase tracking-wider text-fg-faint">soon</span>
        </div>
      </div>
    </div>
  )
}
