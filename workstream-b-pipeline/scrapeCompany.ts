import { Contact, ScrapeProvider } from "../shared/types"
import { PipelineEnv, readPipelineEnv } from "./env"

interface FirecrawlScrapeResponse {
  success?: boolean
  data?: {
    markdown?: string
    links?: string[]
    metadata?: {
      title?: string
      description?: string
      sourceURL?: string
    }
  }
  error?: string
}

export interface CompanyScrapeEvidence {
  url: string
  title?: string
  description?: string
  emails: string[]
  linkedinUrls: string[]
  executiveNames: string[]
}

export class FirecrawlCompanyScrapeProvider implements ScrapeProvider {
  private readonly env: PipelineEnv

  constructor(env: PipelineEnv = {}) {
    this.env = readPipelineEnv(env)
  }

  async scrape(companyName: string, domain?: string): Promise<Partial<Contact>[]> {
    if (!this.env.FIRECRAWL_API_KEY || !domain) return []

    const evidence = await this.scrapeEvidence(companyName, domain)
    return contactsFromEvidence(companyName, evidence)
  }

  async scrapeEvidence(companyName: string, domain: string): Promise<CompanyScrapeEvidence> {
    const url = normalizeCompanyUrl(domain)
    const baseUrl = this.env.FIRECRAWL_API_URL ?? "https://api.firecrawl.dev"
    const response = await fetch(`${baseUrl.replace(/\/$/, "")}/v1/scrape`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.env.FIRECRAWL_API_KEY}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        url,
        formats: ["markdown", "links"],
        onlyMainContent: true,
      }),
    })

    if (!response.ok) {
      throw new Error(`Firecrawl company scrape failed: ${response.status} ${response.statusText}`)
    }

    const payload = (await response.json()) as FirecrawlScrapeResponse
    if (payload.success === false) {
      throw new Error(`Firecrawl company scrape failed: ${payload.error ?? "unknown error"}`)
    }

    const markdown = payload.data?.markdown ?? ""
    const links = payload.data?.links ?? []

    return {
      url,
      title: payload.data?.metadata?.title,
      description: payload.data?.metadata?.description,
      emails: extractEmails(markdown),
      linkedinUrls: extractLinkedinUrls(markdown, links),
      executiveNames: extractExecutiveNames(companyName, markdown),
    }
  }
}

export class CompositeCompanyScrapeProvider implements ScrapeProvider {
  constructor(private readonly providers: ScrapeProvider[]) {}

  async scrape(companyName: string, domain?: string): Promise<Partial<Contact>[]> {
    const settled = await Promise.allSettled(
      this.providers.map((provider) => provider.scrape(companyName, domain)),
    )

    return settled.flatMap((result) => (result.status === "fulfilled" ? result.value : []))
  }
}

function contactsFromEvidence(companyName: string, evidence: CompanyScrapeEvidence): Partial<Contact>[] {
  const names = evidence.executiveNames.length > 0 ? evidence.executiveNames : [`Founder at ${companyName}`]
  const linkedinUrl = evidence.linkedinUrls[0]

  return names.map((name, index) => ({
    name,
    title: inferTitleForName(name, evidence.description),
    email: evidence.emails[index] ?? evidence.emails[0],
    emailConfidence: evidence.emails.length > 0 ? "unverified" : "low",
    linkedinUrl,
    source: "manual",
  }))
}

function normalizeCompanyUrl(domain: string): string {
  if (/^https?:\/\//i.test(domain)) return domain
  return `https://${domain}`
}

function extractEmails(markdown: string): string[] {
  return unique(markdown.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) ?? [])
}

function extractLinkedinUrls(markdown: string, links: string[]): string[] {
  return unique([...links, ...markdown.match(/https?:\/\/(?:www\.)?linkedin\.com\/[^\s)]+/gi) ?? []]).filter((url) =>
    /linkedin\.com\/(in|company)\//i.test(url),
  )
}

function extractExecutiveNames(companyName: string, markdown: string): string[] {
  const escapedCompany = escapeRegExp(companyName)
  const patterns = [
    new RegExp(`([A-Z][a-z]+(?:\\s+[A-Z][a-z]+){1,3}),?\\s+(?:Founder|Co-Founder|CEO|Chief Executive Officer|President)`, "g"),
    /\b(?:Founder|Co-Founder|CEO|Chief Executive Officer|President)\s*:?\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})/g,
    new RegExp(`([A-Z][a-z]+(?:\\s+[A-Z][a-z]+){1,3})\\s+(?:founded|leads|runs)\\s+${escapedCompany}`, "gi"),
  ]

  return unique(
    patterns.flatMap((pattern) =>
      [...markdown.matchAll(pattern)].map((match) => match[1]).filter((name): name is string => Boolean(name)),
    ),
  ).slice(0, 5)
}

function inferTitleForName(name: string, description?: string): string {
  if (description && /co-founder/i.test(description)) return "Co-Founder"
  if (/founder at/i.test(name)) return "Founder / Executive"
  return "Founder / Executive"
}

function unique(values: string[]): string[] {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))]
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}
