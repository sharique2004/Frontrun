import { CompanyBrief, SearchProvider } from "../shared/types"
import { PipelineEnv, readPipelineEnv } from "./env"

interface YouSearchResult {
  title?: string
  url?: string
  snippet?: string
  description?: string
}

interface YouResponse {
  answer?: string
  results?: YouSearchResult[]
  search_results?: YouSearchResult[]
  citations?: YouSearchResult[]
}

interface McpJsonRpcResponse<T = unknown> {
  id?: number
  result?: T
  error?: {
    code: number
    message: string
  }
}

interface McpToolResult {
  content?: Array<{
    type?: string
    text?: string
  }>
  structuredContent?: {
    output?: {
      content?: string
      sources?: YouResearchSource[]
    }
  }
}

interface YouResearchSource {
  url?: string
  title?: string
  snippets?: string[]
}

export class YouResearchProvider implements SearchProvider {
  private readonly env: PipelineEnv

  constructor(env: PipelineEnv = {}) {
    this.env = readPipelineEnv(env)
  }

  async search(query: string): Promise<CompanyBrief> {
    if (this.env.YOU_API_KEY) {
      return new YouMcpResearchProvider(this.env).search(query).catch(() => this.searchWithRestApi(query))
    }

    return new YouMcpSearchProvider(this.env).search(query).catch(() => fallbackBrief(query))
  }

  private async searchWithRestApi(query: string): Promise<CompanyBrief> {
    const apiKey = this.env.YOU_API_KEY
    if (!apiKey) return fallbackBrief(query)

    const baseUrl = this.env.YOU_API_BASE_URL ?? "https://api.ydc-index.io/search"
    const url = new URL(baseUrl)
    url.searchParams.set("query", query)

    const response = await fetch(url, {
      headers: {
        "X-API-Key": apiKey,
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`You.com research failed: ${response.status} ${response.statusText}`)
    }

    const payload = (await response.json()) as YouResponse
    const results = payload.results ?? payload.search_results ?? payload.citations ?? []
    const citations = results
      .filter((result) => result.title && result.url)
      .slice(0, 5)
      .map((result) => ({
        title: result.title as string,
        url: result.url as string,
        snippet: result.snippet ?? result.description,
      }))

    return {
      summary: payload.answer ?? summarizeFromCitations(query, citations),
      citations,
      fundingConfirmed: isFundingConfirmed(
        `${payload.answer ?? ""}\n${citations.map((citation) => `${citation.title} ${citation.snippet ?? ""}`).join("\n")}`,
      ),
    }
  }
}

class YouMcpClient {
  private readonly endpoint: string
  private readonly apiKey?: string
  private sessionId?: string
  private nextId = 1

  constructor(env: PipelineEnv = {}, endpointFallback = "https://api.you.com/mcp?profile=free", forceEndpoint = false) {
    const resolved = readPipelineEnv(env)
    this.apiKey = resolved.YOU_API_KEY
    this.endpoint = forceEndpoint ? endpointFallback : resolved.YOU_MCP_URL ?? endpointFallback
  }

  async initialize(): Promise<void> {
    if (this.sessionId) return

    await this.request("initialize", {
      protocolVersion: "2025-06-18",
      capabilities: {},
      clientInfo: {
        name: "frontrun-track-b",
        version: "0.1.0",
      },
    })

    await this.notify("notifications/initialized", {})
  }

  async callTool<T = McpToolResult>(name: string, args: Record<string, unknown>): Promise<T> {
    await this.initialize()
    return this.request<T>("tools/call", {
      name,
      arguments: args,
    })
  }

  private async notify(method: string, params: unknown): Promise<void> {
    await this.post({
      jsonrpc: "2.0",
      method,
      params,
    })
  }

  private async request<T>(method: string, params: unknown): Promise<T> {
    const response = await this.post({
      jsonrpc: "2.0",
      id: this.nextId++,
      method,
      params,
    })
    const parsed = parseMcpResponse<T>(response.body)

    if (parsed.error) {
      throw new Error(`You.com MCP ${method} failed: ${parsed.error.message}`)
    }
    if (!parsed.result) {
      throw new Error(`You.com MCP ${method} returned no result`)
    }

    return parsed.result
  }

  private async post(payload: unknown): Promise<{ body: string }> {
    const response = await fetch(this.endpoint, {
      method: "POST",
      headers: {
        Accept: "application/json, text/event-stream",
        "Content-Type": "application/json",
        "MCP-Protocol-Version": "2025-06-18",
        ...(this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : {}),
        ...(this.sessionId ? { "Mcp-Session-Id": this.sessionId } : {}),
      },
      body: JSON.stringify(payload),
    })

    const sessionId = response.headers.get("mcp-session-id")
    if (sessionId) this.sessionId = sessionId

    if (!response.ok) {
      throw new Error(`You.com MCP request failed: ${response.status} ${response.statusText}`)
    }

    return { body: await response.text() }
  }
}

export class YouMcpResearchProvider implements SearchProvider {
  private readonly client: YouMcpClient

  constructor(env: PipelineEnv = {}) {
    this.client = new YouMcpClient(env, "https://api.you.com/mcp", true)
  }

  async search(query: string): Promise<CompanyBrief> {
    const result = await this.client.callTool<McpToolResult>("you-research", {
      input: query,
      research_effort: "lite",
    })
    const output = result.structuredContent?.output
    const text = output?.content ?? result.content?.map((item) => item.text).filter((value): value is string => Boolean(value)).join("\n\n") ?? ""
    const citations = output?.sources ? citationsFromResearchSources(output.sources) : citationsFromMcpText(text)

    return {
      summary: summaryFromMcpText(query, text),
      citations,
      fundingConfirmed: isFundingConfirmed(text),
    }
  }
}

export class YouMcpSearchProvider implements SearchProvider {
  private readonly client: YouMcpClient

  constructor(env: PipelineEnv = {}) {
    this.client = new YouMcpClient(env)
  }

  async search(query: string): Promise<CompanyBrief> {
    const result = await this.client.callTool<McpToolResult>("you-search", {
      query,
      count: 10,
      country: "US",
    })
    const text = result.content?.map((item) => item.text).filter((value): value is string => Boolean(value)).join("\n\n") ?? ""
    const citations = citationsFromMcpText(text)

    return {
      summary: summaryFromMcpText(query, text),
      citations,
      fundingConfirmed: isFundingConfirmed(text),
    }
  }
}

export async function confirmFunding(companyName: string, amountRaised?: string, provider = new YouResearchProvider()): Promise<CompanyBrief> {
  const amount = amountRaised ? ` ${amountRaised}` : ""
  return provider.search(`${companyName}${amount} raised funding recent`)
}

function fallbackBrief(query: string): CompanyBrief {
  return {
    summary: `Demo brief for ${query}: funding signal detected from SEC Form D. Add YOU_API_KEY for You Research or use YOU_MCP_URL for free you-search.`,
    citations: [
      {
        title: "SEC EDGAR Form D signal",
        url: "https://www.sec.gov/edgar/search/",
        snippet: "Detected from EDGAR full-text search; funding confirmation awaits You.com credentials.",
      },
    ],
    fundingConfirmed: false,
  }
}

function parseMcpResponse<T>(body: string): McpJsonRpcResponse<T> {
  const jsonLine = body
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find((line) => line.startsWith("{") || line.startsWith("data: {"))

  if (!jsonLine) {
    return JSON.parse(body) as McpJsonRpcResponse<T>
  }

  return JSON.parse(jsonLine.replace(/^data:\s*/, "")) as McpJsonRpcResponse<T>
}

function citationsFromMcpText(text: string): CompanyBrief["citations"] {
  const markdownLinks = [...text.matchAll(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g)].map((match) => ({
    title: match[1],
    url: match[2],
  }))
  const bareUrls = [...text.matchAll(/https?:\/\/[^\s)]+/g)].map((match) => ({
    title: match[0],
    url: match[0],
  }))

  return uniqueCitations([...markdownLinks, ...bareUrls]).slice(0, 5)
}

function citationsFromResearchSources(sources: YouResearchSource[]): CompanyBrief["citations"] {
  return sources
    .filter((source) => source.url)
    .slice(0, 5)
    .map((source) => ({
      title: source.title ?? source.url as string,
      url: source.url as string,
      snippet: source.snippets?.[0],
    }))
}

function summaryFromMcpText(query: string, text: string): string {
  const cleaned = text.replace(/\s+/g, " ").trim()
  if (!cleaned) return `You.com MCP search returned no text for ${query}.`

  return cleaned.length > 700 ? `${cleaned.slice(0, 697)}...` : cleaned
}

function uniqueCitations(citations: CompanyBrief["citations"]): CompanyBrief["citations"] {
  const seen = new Set<string>()
  return citations.filter((citation) => {
    if (seen.has(citation.url)) return false
    seen.add(citation.url)
    return true
  })
}

function isFundingConfirmed(text: string): boolean {
  if (/\b(did not raise|not raised|no recent funding|not conducting a securities offering|submitted in error|filed in error|not a securities offering|limited specific information|specific recent funding raises.*not found|were not found|could you clarify)\b/i.test(text)) {
    return false
  }

  return /\b(raised \$|raised [0-9]|raised a|raises \$|funding round|series [a-f]\b|seed round|closed.*round|secured.*funding|form d filing)\b/i.test(
    text,
  )
}

function summarizeFromCitations(query: string, citations: CompanyBrief["citations"]): string {
  if (citations.length === 0) return `Research requested for ${query}, but no citations were returned.`

  return `Recent funding research for ${query}: ${citations
    .slice(0, 3)
    .map((citation) => citation.snippet ?? citation.title)
    .join(" ")}`
}
