/**
 * Live funnel analytics derived from the mock store — mirrors the shape Track A's
 * Hydra `AnalyticsProvider.funnel()` will return, so the strip swaps cleanly.
 */
import { type Lead, LeadStatus } from "@shared/types"

type Cls = "green" | "yellow" | "red" | null

/** A lead's outcome tone — status-first, reply-classification as fallback. */
function classifyLead(l: Lead): Cls {
  switch (l.status) {
    case LeadStatus.GREEN:
    // A booked meeting is a win regardless of the prior reply tone.
    case LeadStatus.BOOKED:
      return "green"
    case LeadStatus.YELLOW:
      return "yellow"
    case LeadStatus.RED:
    case LeadStatus.LOST:
      return "red"
    // FOLLOW_UP_DRAFTED does NOT encode sentiment — a green booking-nudge and a
    // yellow clarifier are both "follow-up drafted". Fall back to the reply verdict.
    default:
      return l.replies?.[l.replies.length - 1]?.classification ?? null
  }
}

export interface AnalyticsView {
  detectedToday: number
  delivered: number
  replied: number
  /** replied / delivered, 0..1 */
  replyRate: number
  /** mean delivered→first-reply latency, ms (null if none yet) */
  avgResponseMs: number | null
  green: number
  yellow: number
  red: number
  booked: number
  /** green / red (null if no reds and no greens) */
  greenRedRatio: number | null
}

export function computeAnalytics(leads: Lead[], detectedToday: number): AnalyticsView {
  let delivered = 0
  let replied = 0
  let green = 0
  let yellow = 0
  let red = 0
  let booked = 0
  const responseTimes: number[] = []

  for (const l of leads) {
    if (l.outreach?.deliveredAt) delivered++
    if ((l.replies?.length ?? 0) > 0) replied++

    const cls = classifyLead(l)
    if (cls === "green") green++
    else if (cls === "yellow") yellow++
    else if (cls === "red") red++

    if (l.status === LeadStatus.BOOKED) booked++

    const firstReply = l.replies?.[0]?.receivedAt
    if (l.outreach?.deliveredAt && firstReply) {
      const dt = new Date(firstReply).getTime() - new Date(l.outreach.deliveredAt).getTime()
      if (dt > 0) responseTimes.push(dt)
    }
  }

  const replyRate = delivered ? replied / delivered : 0
  const avgResponseMs = responseTimes.length
    ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
    : null
  const greenRedRatio = red > 0 ? green / red : green > 0 ? green : null

  return {
    detectedToday,
    delivered,
    replied,
    replyRate,
    avgResponseMs,
    green,
    yellow,
    red,
    booked,
    greenRedRatio,
  }
}
