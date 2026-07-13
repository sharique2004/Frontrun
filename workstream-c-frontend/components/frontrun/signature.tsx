import { cn } from "@/lib/utils"

/**
 * Frontrun wordmark — type-led SaaS identity. The one brand device is a small
 * Signal-Cyan accent tick after the name (the Padzy accent tick). No icon mark.
 */
export function Wordmark({
  className,
  showDescriptor = true,
}: {
  className?: string
  showDescriptor?: boolean
}) {
  return (
    <div className={cn("flex flex-col", className)}>
      {showDescriptor && (
        <span className="kicker mb-1.5 text-[9px]">Autonomous SDR</span>
      )}
      <span className="flex items-end font-display text-[17px] font-semibold leading-none tracking-tight text-foreground">
        Frontrun
        <span
          aria-hidden
          className="mb-[3px] ml-1 h-[7px] w-[11px] rounded-[1px] bg-signal"
        />
      </span>
    </div>
  )
}
