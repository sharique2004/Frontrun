"use client"

import { useEffect, useState } from "react"

/**
 * Ticking clock that stays null until after mount, so any relative-time UI
 * renders a stable placeholder on the server and never mismatches on hydration.
 */
export function useNow(intervalMs = 1000): number | null {
  const [now, setNow] = useState<number | null>(null)
  useEffect(() => {
    // Defer the first read to the next frame so the initial (null) render
    // matches the server, avoiding a synchronous-setState cascade.
    const raf = requestAnimationFrame(() => setNow(Date.now()))
    const id = setInterval(() => setNow(Date.now()), intervalMs)
    return () => {
      cancelAnimationFrame(raf)
      clearInterval(id)
    }
  }, [intervalMs])
  return now
}
