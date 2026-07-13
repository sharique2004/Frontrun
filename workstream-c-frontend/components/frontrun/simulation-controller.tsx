"use client"

import { useEffect } from "react"
import { useFrontrunStore } from "@/lib/ui/store"

/**
 * Boots the live simulation once, on mount. Renders nothing.
 * Replace with polling/subscription to Track A's status API when ready.
 */
export function SimulationController() {
  const start = useFrontrunStore((s) => s.startSimulation)
  const stop = useFrontrunStore((s) => s.stopSimulation)
  useEffect(() => {
    start()
    return () => stop()
  }, [start, stop])
  return null
}
