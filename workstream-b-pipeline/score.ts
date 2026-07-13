import { Lead, LeadScore } from "../shared/types"

export function scoreLead(lead: Lead): Lead {
  const leadScore = createLeadScore(lead)

  return {
    ...lead,
    leadScore,
    updatedAt: new Date().toISOString(),
  }
}

export function createLeadScore(lead: Lead): LeadScore {
  const reasons: string[] = []
  let score = 35

  if (lead.brief?.fundingConfirmed) {
    score += 25
    reasons.push("Funding signal confirmed by research.")
  }

  if (lead.contact?.email && lead.contact.emailConfidence !== "unverified") {
    score += 20
    reasons.push(`Email resolved with ${lead.contact.emailConfidence} confidence.`)
  }

  if (lead.signal.amountRaised) {
    score += 10
    reasons.push(`Amount raised is disclosed: ${lead.signal.amountRaised}.`)
  }

  if (lead.signal.edgarUrl) {
    score += 5
    reasons.push("EDGAR source URL is available.")
  }

  if (isOperatingCompany(lead.signal.companyName)) {
    score += 5
    reasons.push("Company name looks like an operating-company target.")
  } else {
    score -= 15
    reasons.push("Company name looks fund-like; lower recruiting-agency fit.")
  }

  const normalized = Math.max(0, Math.min(100, score))

  return {
    score: normalized,
    tier: normalized >= 75 ? "hot" : normalized >= 50 ? "warm" : "cold",
    reasons,
    createdAt: new Date().toISOString(),
  }
}

function isOperatingCompany(companyName: string): boolean {
  return !/\b(fund|lp|l\.p\.|reit|portfolio|holdings|credit|bond|arbitrage|offshore|onshore|master|series)\b/i.test(
    companyName,
  )
}
