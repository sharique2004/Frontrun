import { cn } from "@/lib/utils"
import { TONE_CLASSES, type Tone } from "@/lib/ui/status"

/**
 * Status dot. When `live`, emits a radar "ping" (expanding ring) — reserved for
 * genuinely in-flight states. Reduced-motion is honored globally in CSS.
 */
export function LiveDot({
  tone,
  live = false,
  className,
}: {
  tone: Tone
  live?: boolean
  className?: string
}) {
  const dot = TONE_CLASSES[tone].dot
  return (
    <span className={cn("relative inline-flex h-2 w-2 shrink-0", className)}>
      {live && (
        <span
          className={cn(
            "absolute inline-flex h-full w-full animate-ping rounded-full opacity-60",
            dot,
          )}
        />
      )}
      <span className={cn("relative inline-flex h-2 w-2 rounded-full", dot)} />
    </span>
  )
}
