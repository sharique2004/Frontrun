import { LeadsTable } from "@/components/leads/leads-table"

export default function LeadsPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8">
      <header className="flex flex-col gap-1.5">
        <p className="kicker">03 / All leads</p>
        <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground">
          Leads
        </h2>
        <p className="max-w-xl text-sm text-fg-muted">
          Every detected company in one dense table. Sort by column; click a row to open the
          full research, draft, and conversation.
        </p>
      </header>

      <LeadsTable />
    </div>
  )
}
