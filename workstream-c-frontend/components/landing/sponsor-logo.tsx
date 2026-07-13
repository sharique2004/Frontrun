"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

export type Sponsor = {
  slug: string
  name: string
  /** What this sponsor powers in Frontrun (shown in the stack section). */
  layer?: string
}

/**
 * Sponsor logo loaded from /public/logos/{slug}.svg. The type-led text
 * wordmark renders first (also the SSR output) and the image only swaps in
 * once it has actually loaded — a missing file never flashes a broken glyph.
 */
export function SponsorLogo({
  sponsor,
  className,
  imgClassName,
}: {
  sponsor: Sponsor
  className?: string
  imgClassName?: string
}) {
  const [loaded, setLoaded] = useState(false)
  const ref = useRef<HTMLImageElement>(null)

  // The img can finish loading before hydration attaches onLoad; catch it here.
  useEffect(() => {
    const img = ref.current
    if (img && img.complete && img.naturalWidth > 0) setLoaded(true)
  }, [])

  return (
    <span className={cn("inline-flex items-center", className)}>
      {!loaded && (
        <span className="inline-flex items-baseline font-display text-base font-semibold tracking-tight text-fg-muted">
          {sponsor.name}
        </span>
      )}
      {/* eslint-disable-next-line @next/next/no-img-element -- local svg, no optimization pass needed */}
      <img
        ref={ref}
        src={`/logos/${sponsor.slug}.svg`}
        alt={loaded ? sponsor.name : ""}
        aria-hidden={!loaded}
        onLoad={() => setLoaded(true)}
        className={cn("h-6 w-auto", imgClassName, !loaded && "hidden")}
      />
    </span>
  )
}
