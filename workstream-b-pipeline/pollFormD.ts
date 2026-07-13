import { FormDSignal, Lead, LeadStatus } from "../shared/types"
import { PipelineEnv, readPipelineEnv, requireEdgarUserAgent } from "./env"

interface EdgarHit {
  _id?: string
  accessionNo?: string
  adsh?: string
  cik?: string
  companyName?: string
  entityName?: string
  display_names?: string[]
  form?: string
  filedAt?: string
  filed?: string
  file_date?: string
  linkToFilingDetails?: string
  linkToHtml?: string
}

interface EdgarSearchResponse {
  hits?: {
    hits?: Array<{
      _id?: string
      _source?: EdgarHit
    }>
  }
}

export interface PollFormDOptions {
  env?: PipelineEnv
  limit?: number
  fromDate?: string
  lookbackDays?: number
  fallbackLookbackDays?: number
  includeFunds?: boolean
}

export async function pollRecentFormD(options: PollFormDOptions = {}): Promise<FormDSignal[]> {
  const env = readPipelineEnv(options.env)
  const limit = options.limit ?? 10
  const lookbackDays = options.lookbackDays ?? 30
  const fallbackLookbackDays = options.fallbackLookbackDays ?? 365
  const fromDate = options.fromDate ?? isoDateDaysAgo(lookbackDays)
  const fallbackFromDate = options.fromDate ? fromDate : isoDateDaysAgo(fallbackLookbackDays)
  const url = new URL("https://efts.sec.gov/LATEST/search-index")
  url.searchParams.set("forms", "D")
  url.searchParams.set("q", "Form D")
  url.searchParams.set("from", "0")
  url.searchParams.set("size", String(Math.max(limit * 3, 25)))
  url.searchParams.set("sort", "filedAt:desc")
  url.searchParams.set("dateRange", "custom")
  url.searchParams.set("startdt", fromDate)

  const response = await fetch(url, {
    headers: {
      "User-Agent": requireEdgarUserAgent(env),
      Accept: "application/json",
    },
  })

  if (!response.ok) {
    throw new Error(`EDGAR Form D search failed: ${response.status} ${response.statusText}`)
  }

  const payload = (await response.json()) as EdgarSearchResponse
  const hits = payload.hits?.hits ?? []

  const recent = normalizeAndSortSignals(hits, fromDate, limit, options.includeFunds ?? false)
  if (recent.length > 0 || fallbackLookbackDays <= lookbackDays) return recent

  return normalizeAndSortSignals(hits, fallbackFromDate, limit, options.includeFunds ?? false)
}

function normalizeAndSortSignals(
  hits: Array<{
    _id?: string
    _source?: EdgarHit
  }>,
  fromDate: string,
  limit: number,
  includeFunds: boolean,
): FormDSignal[] {
  const cutoff = new Date(fromDate).getTime()
  const normalized = hits
    .map((hit) => normalizeEdgarHit(hit._source ?? { _id: hit._id }))
    .filter((signal): signal is FormDSignal => Boolean(signal))
    .filter((signal) => new Date(signal.filedAt).getTime() >= cutoff)
    .sort((a, b) => new Date(b.filedAt).getTime() - new Date(a.filedAt).getTime())

  const operatingCompanies = includeFunds ? normalized : normalized.filter((signal) => !isFundLike(signal.companyName))
  const candidates = operatingCompanies.length > 0 ? operatingCompanies : normalized

  return candidates
    .slice(0, limit)
}

export function detectedLeadFromSignal(signal: FormDSignal): Lead {
  const now = new Date().toISOString()

  return {
    id: `form-d-${slug(signal.accessionNumber || signal.companyName)}`,
    status: LeadStatus.DETECTED,
    isDemo: false,
    signal,
    createdAt: now,
    updatedAt: now,
  }
}

function normalizeEdgarHit(hit: EdgarHit): FormDSignal | null {
  const accessionNumber = hit.accessionNo ?? hit.adsh ?? hit._id
  const companyName =
    hit.companyName ?? hit.entityName ?? hit.display_names?.[0]?.replace(/\s+\(.*\)$/, "")

  if (!accessionNumber || !companyName) return null

  const filedAt = hit.filedAt ?? hit.filed ?? hit.file_date ?? new Date().toISOString()
  const edgarUrl = hit.linkToFilingDetails ?? hit.linkToHtml ?? accessionUrl(accessionNumber)

  return {
    accessionNumber,
    companyName,
    relatedPersons: [],
    filedAt: new Date(filedAt).toISOString(),
    edgarUrl: edgarUrl?.startsWith("http") ? edgarUrl : edgarUrl ? `https://www.sec.gov${edgarUrl}` : undefined,
  }
}

function slug(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
}

function isoDateDaysAgo(days: number): string {
  const date = new Date()
  date.setUTCDate(date.getUTCDate() - days)
  return date.toISOString().slice(0, 10)
}

function isFundLike(companyName: string): boolean {
  return /\b(fund|lp|l\.p\.|reit|portfolio|partners|holdings|capital|credit|income|bond|arbitrage|offshore|onshore|master|series)\b/i.test(
    companyName,
  )
}

function accessionUrl(accessionNumber: string): string {
  const cik = accessionNumber.split("-")[0]
  const compactAccession = accessionNumber.replace(/-/g, "")
  return `https://www.sec.gov/Archives/edgar/data/${Number(cik)}/${compactAccession}/primary_doc.xml`
}
