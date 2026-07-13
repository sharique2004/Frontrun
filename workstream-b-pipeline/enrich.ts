import {
  CompanyBrief,
  Contact,
  EmailConfidence,
  Lead,
  LeadStatus,
  ResolveEmailProvider,
  ScrapeProvider,
  VerifyProvider,
} from "../shared/types"
import { confirmFunding, YouResearchProvider } from "./confirm"
import { PipelineEnv, readPipelineEnv } from "./env"
import { CompositeCompanyScrapeProvider, FirecrawlCompanyScrapeProvider } from "./scrapeCompany"

interface NimbleContactResult {
  name?: string
  title?: string
  email?: string
  linkedinUrl?: string
  linkedin_url?: string
}

interface NimbleResponse {
  contacts?: NimbleContactResult[]
  results?: NimbleContactResult[]
}

export interface EnrichmentResult {
  brief: CompanyBrief
  contact: Contact
}

export class NimbleScrapeProvider implements ScrapeProvider {
  private readonly env: PipelineEnv

  constructor(env: PipelineEnv = {}) {
    this.env = readPipelineEnv(env)
  }

  async scrape(companyName: string, domain?: string): Promise<Partial<Contact>[]> {
    if (!this.env.NIMBLE_API_KEY) {
      // No key → no fabricated contact. The real Form D exec/director name
      // (from the filing) is used downstream instead of a placeholder.
      return []
    }

    const baseUrl = this.env.NIMBLE_API_BASE_URL ?? "https://api.webit.live/api/v1/realtime/web"
    const response = await fetch(baseUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.env.NIMBLE_API_KEY}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: domain ? `${companyName} ${domain} founder email` : `${companyName} founder email`,
      }),
    })

    if (!response.ok) {
      throw new Error(`Nimble scrape failed: ${response.status} ${response.statusText}`)
    }

    const payload = (await response.json()) as NimbleResponse
    const contacts = payload.contacts ?? payload.results ?? []

    return contacts.map((contact) => ({
      name: contact.name,
      title: contact.title,
      email: contact.email,
      linkedinUrl: contact.linkedinUrl ?? contact.linkedin_url,
      emailConfidence: contact.email ? "unverified" : "low",
      source: "nimble",
    }))
  }
}

export class HunterResolveProvider implements ResolveEmailProvider {
  private readonly env: PipelineEnv

  constructor(env: PipelineEnv = {}) {
    this.env = readPipelineEnv(env)
  }

  async resolveEmail(name: string, domain: string): Promise<Pick<Contact, "email" | "source">> {
    if (!this.env.HUNTER_API_KEY) {
      // No key → best-effort PATTERN address (first.last@domain) so enrichment
      // still yields a contact. It is labeled `unverified` downstream (never
      // "verified"), and D's isDemo guard means it is never actually emailed.
      // Add HUNTER_API_KEY + REOON_API_KEY for a real, verified resolution.
      return { email: patternEmail(name, domain), source: "manual" }
    }

    const [firstName, ...rest] = name.split(/\s+/)
    const lastName = rest.at(-1) ?? ""
    const url = new URL("https://api.hunter.io/v2/email-finder")
    url.searchParams.set("domain", domain)
    url.searchParams.set("first_name", firstName)
    url.searchParams.set("last_name", lastName)
    url.searchParams.set("api_key", this.env.HUNTER_API_KEY)

    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Hunter email resolve failed: ${response.status} ${response.statusText}`)
    }

    const payload = (await response.json()) as { data?: { email?: string } }
    return { email: payload.data?.email, source: "hunter" }
  }
}

export class ReoonVerifyProvider implements VerifyProvider {
  private readonly env: PipelineEnv

  constructor(env: PipelineEnv = {}) {
    this.env = readPipelineEnv(env)
  }

  async verify(email: string): Promise<EmailConfidence> {
    // Honesty rule (PRD §14): no verifier ran → the email stays "unverified".
    if (!this.env.REOON_API_KEY) return "unverified"

    const url = new URL("https://emailverifier.reoon.com/api/v1/verify")
    url.searchParams.set("email", email)
    url.searchParams.set("key", this.env.REOON_API_KEY)
    url.searchParams.set("mode", "power")

    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Reoon verification failed: ${response.status} ${response.statusText}`)
    }

    const payload = (await response.json()) as { status?: string; is_safe_to_send?: boolean }
    if (payload.is_safe_to_send || payload.status === "valid" || payload.status === "safe") return "high"
    if (payload.status === "catch_all" || payload.status === "unknown") return "medium"
    return "low"
  }
}

export interface EnrichLeadOptions {
  env?: PipelineEnv
  search?: YouResearchProvider
  scrape?: ScrapeProvider
  resolveEmail?: ResolveEmailProvider
  verify?: VerifyProvider
  domain?: string
}

export async function enrichLead(lead: Lead, options: EnrichLeadOptions = {}): Promise<Lead> {
  const researched = await researchLead(lead, options)
  return enrichContact(researched, options)
}

export async function researchLead(lead: Lead, options: EnrichLeadOptions = {}): Promise<Lead> {
  const search = options.search ?? new YouResearchProvider(options.env)
  const brief = await confirmFunding(lead.signal.companyName, lead.signal.amountRaised, search)
  const now = new Date().toISOString()

  return {
    ...lead,
    brief,
    updatedAt: now,
  }
}

export async function enrichContact(lead: Lead, options: EnrichLeadOptions = {}): Promise<Lead> {
  const scrape =
    options.scrape ??
    new CompositeCompanyScrapeProvider([
      new FirecrawlCompanyScrapeProvider(options.env),
      new NimbleScrapeProvider(options.env),
    ])
  const resolveEmail = options.resolveEmail ?? new HunterResolveProvider(options.env)
  const verify = options.verify ?? new ReoonVerifyProvider(options.env)

  const candidates = await scrape.scrape(lead.signal.companyName, options.domain)
  const selected = selectBestContact(lead, candidates)
  const resolved = selected.email
    ? { email: selected.email, source: selected.source ?? "nimble" }
    : await resolveEmail.resolveEmail(selected.name, options.domain ?? inferDomain(lead.signal.companyName))
  const emailConfidence = resolved.email ? await verify.verify(resolved.email) : "unverified"
  const now = new Date().toISOString()

  return {
    ...lead,
    status: LeadStatus.ENRICHED,
    contact: {
      name: selected.name,
      title: selected.title,
      email: resolved.email,
      emailConfidence,
      linkedinUrl: selected.linkedinUrl,
      source: resolved.source,
    },
    updatedAt: now,
  }
}

function selectBestContact(lead: Lead, candidates: Partial<Contact>[]): Contact {
  // Real exec/director from the Form D filing: "Name (Role)" → name + title.
  const person = parsePerson(lead.signal.relatedPersons.find(Boolean))
  const candidate =
    candidates.find((item) => item.email) ??
    candidates.find((item) => item.name && /founder|ceo|chief|president|partner/i.test(item.title ?? "")) ??
    candidates.find((item) => item.name)

  return {
    name: candidate?.name ?? person.name ?? `Founder at ${lead.signal.companyName}`,
    title: candidate?.title ?? person.title ?? "Founder / Executive",
    email: candidate?.email,
    emailConfidence: candidate?.emailConfidence ?? "unverified",
    linkedinUrl: candidate?.linkedinUrl,
    source: candidate?.source ?? "manual",
  }
}

/** Split a Form D related-person string "Jane Doe (Executive Officer)" → {name,title}. */
function parsePerson(raw?: string): { name?: string; title?: string } {
  if (!raw) return {}
  const m = raw.match(/^(.*?)\s*\((.+)\)\s*$/)
  return m ? { name: m[1].trim(), title: m[2].trim() } : { name: raw.trim() }
}

/** Best-effort first.last@domain pattern from a person name (no verification). */
function patternEmail(name: string, domain: string): string | undefined {
  const parts = name
    .toLowerCase()
    .replace(/\(.*?\)/g, "")
    .replace(/[^a-z\s]/g, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
  if (parts.length === 0) return undefined
  const local = parts.length >= 2 ? `${parts[0]}.${parts[parts.length - 1]}` : parts[0]
  return `${local}@${domain}`
}

function inferDomain(companyName: string): string {
  return `${companyName.toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 28) || "company"}.com`
}
