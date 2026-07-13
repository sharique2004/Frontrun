export interface PipelineEnv {
  EDGAR_USER_AGENT?: string
  YDC_API_KEY?: string
  YOU_API_KEY?: string
  YOUCOM_API_KEY?: string
  YOU_API_BASE_URL?: string
  YOU_MCP_URL?: string
  NIMBLE_API_KEY?: string
  NIMBLE_API_BASE_URL?: string
  HUNTER_API_KEY?: string
  REOON_API_KEY?: string
  FIRECRAWL_API_KEY?: string
  FIRECRAWL_API_URL?: string
  ROCKETRIDE_API_KEY?: string
}

type ProcessLike = {
  env?: Record<string, string | undefined>
}

declare const process: ProcessLike | undefined

export function readPipelineEnv(overrides: PipelineEnv = {}): PipelineEnv {
  const env = typeof process === "undefined" ? {} : process.env ?? {}

  return {
    EDGAR_USER_AGENT: overrides.EDGAR_USER_AGENT ?? env.EDGAR_USER_AGENT,
    YDC_API_KEY: overrides.YDC_API_KEY ?? overrides.YOU_API_KEY ?? overrides.YOUCOM_API_KEY ?? env.YDC_API_KEY ?? env.YOU_API_KEY ?? env.YOUCOM_API_KEY,
    YOU_API_KEY: overrides.YOU_API_KEY ?? overrides.YDC_API_KEY ?? overrides.YOUCOM_API_KEY ?? env.YOU_API_KEY ?? env.YDC_API_KEY ?? env.YOUCOM_API_KEY,
    YOUCOM_API_KEY: overrides.YOUCOM_API_KEY ?? overrides.YDC_API_KEY ?? overrides.YOU_API_KEY ?? env.YOUCOM_API_KEY ?? env.YDC_API_KEY ?? env.YOU_API_KEY,
    YOU_API_BASE_URL: overrides.YOU_API_BASE_URL ?? env.YOU_API_BASE_URL,
    YOU_MCP_URL: overrides.YOU_MCP_URL ?? env.YOU_MCP_URL,
    NIMBLE_API_KEY: overrides.NIMBLE_API_KEY ?? env.NIMBLE_API_KEY,
    NIMBLE_API_BASE_URL: overrides.NIMBLE_API_BASE_URL ?? env.NIMBLE_API_BASE_URL,
    HUNTER_API_KEY: overrides.HUNTER_API_KEY ?? env.HUNTER_API_KEY,
    REOON_API_KEY: overrides.REOON_API_KEY ?? env.REOON_API_KEY,
    FIRECRAWL_API_KEY: overrides.FIRECRAWL_API_KEY ?? env.FIRECRAWL_API_KEY,
    FIRECRAWL_API_URL: overrides.FIRECRAWL_API_URL ?? env.FIRECRAWL_API_URL,
    ROCKETRIDE_API_KEY: overrides.ROCKETRIDE_API_KEY ?? env.ROCKETRIDE_API_KEY,
  }
}

export function requireEdgarUserAgent(env: PipelineEnv): string {
  if (env.EDGAR_USER_AGENT) return env.EDGAR_USER_AGENT

  return "Frontrun hackathon contact: team@example.com"
}
