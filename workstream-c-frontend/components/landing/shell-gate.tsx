"use client"

import { usePathname } from "next/navigation"
import { AppShell } from "@/components/frontrun/app-shell"

/**
 * Routes render inside the dashboard AppShell, except the standalone
 * marketing/pitch surface at /pitch which is full-bleed.
 */
export function ShellGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  if (pathname === "/pitch") return <>{children}</>
  return <AppShell>{children}</AppShell>
}
