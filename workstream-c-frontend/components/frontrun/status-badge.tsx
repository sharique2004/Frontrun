import { cn } from "@/lib/utils"
import { LeadStatus } from "@shared/types"
import { STATUS_META, TONE_CLASSES } from "@/lib/ui/status"
import { LiveDot } from "./live-dot"

/**
 * Status chip — mono label + tone dot, driven entirely by STATUS_META so the
 * whole app stays consistent. `directional` states (OPENED) render dimmed.
 */
export function StatusBadge({
  status,
  className,
  compact = false,
}: {
  status: LeadStatus
  className?: string
  compact?: boolean
}) {
  const meta = STATUS_META[status]
  const tone = TONE_CLASSES[meta.tone]
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-sm border px-1.5 py-0.5 font-mono text-[10px] uppercase leading-none tracking-wider",
        tone.chipBg,
        tone.chipBorder,
        tone.text,
        meta.directional && "opacity-70",
        className,
      )}
    >
      <LiveDot tone={meta.tone} live={meta.live} />
      {compact ? meta.short : meta.label}
    </span>
  )
}
