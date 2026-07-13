"use client"

import { useState } from "react"
import type { Lead } from "@shared/types"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { LeadDetail } from "./lead-detail"

/**
 * Right-side slide-over holding the lead detail + conversation panel.
 * Controlled by the parent. Keeps the last lead during the close animation so
 * the panel doesn't blank out as it slides away (React's adjust-state-in-render
 * pattern — live store updates to the open lead still flow through).
 */
export function LeadDetailSheet({
  lead,
  onClose,
}: {
  lead: Lead | null
  onClose: () => void
}) {
  const [shown, setShown] = useState<Lead | null>(lead)
  if (lead && lead !== shown) setShown(lead)

  return (
    <Sheet
      open={!!lead}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <SheetContent
        side="right"
        className="w-full gap-0 border-line bg-background p-0 sm:w-[580px] sm:max-w-[92vw]"
      >
        <SheetTitle className="sr-only">
          {shown?.signal.companyName ?? "Lead detail"}
        </SheetTitle>
        <div className="flex h-full flex-col overflow-y-auto">
          {shown && <LeadDetail lead={shown} />}
        </div>
      </SheetContent>
    </Sheet>
  )
}
