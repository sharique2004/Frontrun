import { AnalyticsStrip } from "@/components/analytics/analytics-strip"
import { RunOutreach } from "@/components/outreach/run-outreach"

export default function AnalyticsPage() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8">
      <header className="flex flex-col gap-1.5">
        <p className="kicker">04 / Analytics</p>
        <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground">
          Analytics
        </h2>
        <p className="max-w-xl text-sm text-fg-muted">
          Live funnel health — updates as leads move. Run the parallel outreach below and watch
          the numbers react.
        </p>
      </header>

      <AnalyticsStrip />
      <RunOutreach />
    </div>
  )
}
