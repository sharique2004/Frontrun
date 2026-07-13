import { Lead, StoreProvider } from "../shared/types"
import { draftOutreach } from "./draft"
import { enrichContact, EnrichLeadOptions, researchLead } from "./enrich"
import { PipelineEnv } from "./env"
import { detectedLeadFromSignal, pollRecentFormD } from "./pollFormD"
import { scoreLead } from "./score"

export interface RocketRidePipelineInput {
  lead?: Lead
  domain?: string
  persist?: boolean
  includeFunds?: boolean
}

export interface RocketRidePipelineOutput {
  lead: Lead
  steps: Array<
    | "detected"
    | "posted"
    | "research_patched"
    | "email_patched"
    | "score_patched"
    | "draft_patched"
    | "enriched"
    | "verified"
    | "drafted"
    | "stored"
  >
}

export interface RocketRidePipelineOptions extends EnrichLeadOptions {
  env?: PipelineEnv
  store?: StoreProvider
}

export async function runRocketRidePipeline(
  input: RocketRidePipelineInput = {},
  options: RocketRidePipelineOptions = {},
): Promise<RocketRidePipelineOutput> {
  const steps: RocketRidePipelineOutput["steps"] = []
  const detectedSignals = input.lead
    ? []
    : await pollRecentFormD({ env: options.env, limit: 1, includeFunds: input.includeFunds })
  const signal = detectedSignals[0]
  const lead = input.lead ?? (signal ? detectedLeadFromSignal(signal) : undefined)

  if (!lead) {
    throw new Error("No recent Form D filings were returned by EDGAR")
  }

  steps.push("detected")

  let current = lead

  if (input.persist && options.store) {
    current = await options.store.upsertLead(current)
    steps.push("posted")
  }

  current = await researchLead(current, { ...options, domain: input.domain })
  current = await patchOrUpsert(input.persist, options.store, current, {
    researchSummary: current.brief?.summary,
    brief: current.brief,
  })
  if (input.persist && options.store) steps.push("research_patched")

  const enriched = await enrichContact(current, { ...options, domain: input.domain })
  steps.push("enriched")
  if (enriched.contact?.emailConfidence && enriched.contact.emailConfidence !== "unverified") {
    steps.push("verified")
  }
  current = await patchOrUpsert(input.persist, options.store, enriched, {
    email: enriched.contact?.email,
    contact: enriched.contact,
    status: enriched.status,
  })
  if (input.persist && options.store) steps.push("email_patched")

  const scored = scoreLead(current)
  current = await patchOrUpsert(input.persist, options.store, scored, {
    leadScore: scored.leadScore,
  })
  if (input.persist && options.store) steps.push("score_patched")

  const drafted = draftOutreach(current)
  steps.push("drafted")
  current = await patchOrUpsert(input.persist, options.store, drafted, {
    draftEmail: drafted.draft,
    status: drafted.status,
  })
  if (input.persist && options.store) steps.push("draft_patched")

  if (input.persist && options.store) {
    steps.push("stored")
  }

  return { lead: current, steps }
}

interface PatchableStoreProvider extends StoreProvider {
  patchLead?: (
    id: string,
    patch: {
      researchSummary?: string
      brief?: Lead["brief"]
      email?: string
      contact?: Lead["contact"]
      leadScore?: Lead["leadScore"]
      draftEmail?: Lead["draft"]
      status?: Lead["status"]
    },
  ) => Promise<Lead>
}

async function patchOrUpsert(
  persist: boolean | undefined,
  store: StoreProvider | undefined,
  lead: Lead,
  patch: Parameters<NonNullable<PatchableStoreProvider["patchLead"]>>[1],
): Promise<Lead> {
  if (!persist || !store) return lead

  const patchable = store as PatchableStoreProvider
  if (patchable.patchLead) return patchable.patchLead(lead.id, patch)

  return store.upsertLead(lead)
}

export const rocketRideToolDefinition = {
  name: "frontrun_enrich_verify_draft",
  description:
    "Frontrun Track B RocketRide tool: take a detected Form D lead, research it, enrich contact data, verify email confidence, and draft first-touch outreach.",
  inputSchema: {
    type: "object",
    properties: {
      lead: { type: "object", description: "Lead with DETECTED status and Form D signal." },
      domain: { type: "string", description: "Optional company domain for email resolution." },
      persist: { type: "boolean", description: "Set true when a StoreProvider is wired by workstream A." },
      includeFunds: { type: "boolean", description: "Allow fund/LP filings instead of preferring operating companies." },
    },
  },
}
