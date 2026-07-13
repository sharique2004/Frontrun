"use client"

import { usePathname } from "next/navigation"
import { Menu, Pause, Play } from "lucide-react"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useFrontrunStore } from "@/lib/ui/store"
import { useNow } from "@/lib/ui/use-now"
import { relativeAge } from "@/lib/ui/format"
import { SidebarNav } from "./sidebar"
import { DetectedCounter } from "./detected-counter"

const SECTIONS: Record<string, { n: string; label: string }> = {
  "/": { n: "01", label: "Signal Feed" },
  "/funnel": { n: "02", label: "Funnel" },
  "/leads": { n: "03", label: "Leads" },
  "/analytics": { n: "04", label: "Analytics" },
}

function SyncTicker() {
  const now = useNow(1000)
  const lastChangedAt = useFrontrunStore((s) => s.lastChangedAt)
  const running = useFrontrunStore((s) => s.running)

  const age =
    now && lastChangedAt ? relativeAge(new Date(lastChangedAt).toISOString(), now) : null

  return (
    <div className="hidden flex-col items-end md:flex">
      <span className="kicker">Sync</span>
      <span className="font-mono text-xs tabular-nums text-fg-muted">
        {running ? (age ? `${age} ago` : "·") : "paused"}
      </span>
    </div>
  )
}

function LiveToggle() {
  const running = useFrontrunStore((s) => s.running)
  const start = useFrontrunStore((s) => s.startSimulation)
  const stop = useFrontrunStore((s) => s.stopSimulation)
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => (running ? stop() : start())}
      aria-label={running ? "Pause live feed" : "Resume live feed"}
      className="size-9 border-line-strong bg-elevated text-fg-muted hover:text-foreground"
    >
      {running ? <Pause className="size-4" /> : <Play className="size-4" />}
    </Button>
  )
}

export function TopBar() {
  const pathname = usePathname()
  const section = SECTIONS[pathname] ?? { n: "00", label: "Frontrun" }

  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-3 border-b border-line bg-background/85 px-4 backdrop-blur-md sm:px-6">
      {/* Mobile nav trigger */}
      <Sheet>
        <SheetTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              className="size-9 text-fg-muted hover:text-foreground lg:hidden"
              aria-label="Open navigation"
            />
          }
        >
          <Menu className="size-5" />
        </SheetTrigger>
        <SheetContent side="left" className="w-72 border-line bg-sidebar p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SidebarNav />
        </SheetContent>
      </Sheet>

      {/* Section label */}
      <div className="flex min-w-0 flex-col">
        <span className="kicker hidden sm:block">
          {section.n} / {section.label}
        </span>
        <h1 className="truncate font-display text-base font-semibold leading-tight tracking-tight text-foreground">
          {section.label}
        </h1>
      </div>

      {/* Right cluster */}
      <div className={cn("ml-auto flex items-center gap-4 sm:gap-5")}>
        <SyncTicker />
        <div className="hidden h-8 w-px bg-line sm:block" />
        <DetectedCounter />
        <LiveToggle />
      </div>
    </header>
  )
}
