import { EmailDraft, Lead, LeadStatus } from "../shared/types"

export function draftOutreach(lead: Lead): Lead {
  const draft = createEmailDraft(lead)
  const now = new Date().toISOString()

  return {
    ...lead,
    status: LeadStatus.DRAFTED,
    draft,
    updatedAt: now,
  }
}

export function createEmailDraft(lead: Lead): EmailDraft {
  const company = lead.signal.companyName
  const contactName = firstName(lead.contact?.name)
  const raise = lead.signal.amountRaised ? ` on the ${lead.signal.amountRaised} raise` : " after the Form D filing"
  const proof = lead.brief?.fundingConfirmed
    ? "I saw the raise confirmed in recent coverage"
    : "I saw the new Form D signal"

  return {
    subject: `${company} hiring after the raise?`,
    body: [
      `Hi ${contactName},`,
      "",
      `${proof}${raise}. Teams usually turn that capital into a hiring plan quickly, and that is where my team can help.`,
      "",
      `We specialize in fast technical recruiting for venture-backed companies: calibrated searches, founder-friendly reporting, and shortlist delivery before the market catches up.`,
      "",
      `Worth a 15 minute intro this week to compare your hiring plan against the roles that usually follow this kind of funding event?`,
      "",
      "Best,",
      "Dana",
    ].join("\n"),
    createdAt: new Date().toISOString(),
  }
}

function firstName(name?: string): string {
  if (!name) return "there"
  if (/^founder at/i.test(name)) return "there"
  return name.split(/\s+/)[0] ?? "there"
}
