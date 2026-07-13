/**
 * Small formatting helpers. Time helpers take an explicit `now` so callers keep
 * them client-only (no Date.now() during SSR → no hydration mismatch).
 */

/** "3s" / "12m" / "4h" / "2d" — compact relative age. */
export function relativeAge(iso: string, nowMs: number): string {
  const then = new Date(iso).getTime()
  const diff = Math.max(0, nowMs - then)
  const s = Math.floor(diff / 1000)
  if (s < 60) return `${s}s`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h`
  const d = Math.floor(h / 24)
  return `${d}d`
}

/** "14:02:41" — 24h clock, UTC-stable for mono timestamps. */
export function clockUTC(iso: string): string {
  const d = new Date(iso)
  return d.toISOString().slice(11, 19)
}

/** "Jul 13" — short date. */
export function shortDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  })
}

/** Left-pad an integer for the ticking mono counter, e.g. 47 → "047". */
export function padCount(n: number, width = 3): string {
  return String(n).padStart(width, "0")
}

/** Milliseconds → compact human duration: "42s" / "18m" / "2.4h" / "1.2d". */
export function formatDuration(ms: number | null): string {
  if (ms == null || !Number.isFinite(ms) || ms < 0) return "—"
  const s = ms / 1000
  if (s < 60) return `${Math.round(s)}s`
  const m = s / 60
  if (m < 60) return `${Math.round(m)}m`
  const h = m / 60
  if (h < 24) return `${h < 10 ? h.toFixed(1) : Math.round(h)}h`
  const d = h / 24
  return `${d < 10 ? d.toFixed(1) : Math.round(d)}d`
}

/** "$18,000,000" → "$18M", "$6,500,000" → "$6.5M". */
export function abbreviateMoney(raw?: string): string {
  if (!raw) return "—"
  const digits = raw.replace(/[^0-9.]/g, "")
  const n = Number(digits)
  if (!Number.isFinite(n) || n === 0) return raw
  if (n >= 1_000_000) {
    const m = n / 1_000_000
    return `$${m % 1 === 0 ? m.toFixed(0) : m.toFixed(1)}M`
  }
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`
  return `$${n}`
}
