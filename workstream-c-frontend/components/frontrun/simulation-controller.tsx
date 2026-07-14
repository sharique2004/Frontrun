"use client"

import { useEffect } from "react"
import { useFrontrunStore } from "@/lib/ui/store"

/**
 * LIVE data controller. Polls A's real backend (/api/leads) every 4s while the
 * feed is "running" (top-bar play/pause toggles it). Cards move only when the
 * backend actually changes — there is no client-side simulation.
 */
export function SimulationController() {
  const hydrate = useFrontrunStore((s) => s.hydrateFromBackend)
  const running = useFrontrunStore((s) => s.running)

  useEffect(() => {
    if (!running) return
    let cancelled = false
    const tick = () => {
      if (!cancelled) void hydrate()
    }
    tick() // immediate
    const poll = setInterval(tick, 4000)
    return () => {
      cancelled = true
      clearInterval(poll)
    }
  }, [hydrate, running])

  return null
}
