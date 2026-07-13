import { SidebarNav } from "./sidebar"
import { TopBar } from "./top-bar"
import { SimulationController } from "./simulation-controller"

/**
 * App shell: fixed left sidebar (desktop) + sticky top bar + scrollable main.
 * Mobile collapses the sidebar into a sheet (see TopBar).
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh">
      <SimulationController />

      <aside className="sticky top-0 hidden h-svh w-60 shrink-0 border-r border-line bg-sidebar lg:block">
        <SidebarNav />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}
