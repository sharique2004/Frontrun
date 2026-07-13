import { CornerDownRight } from "lucide-react"
import type { Lead, ReplyClassification } from "@shared/types"
import { clockUTC, shortDate } from "@/lib/ui/format"
import { ClassificationBanner, EmailBlock } from "./primitives"

const NEXT_STEP_LABEL: Record<ReplyClassification, string> = {
  green: "Booking nudge",
  yellow: "Clarifier",
  red: "Stop",
}

export function ReplyThread({ lead }: { lead: Lead }) {
  const replies = lead.replies ?? []
  const prospect = lead.contact?.name ?? lead.signal.relatedPersons[0] ?? "Prospect"

  if (replies.length === 0) {
    return (
      <p className="rounded-md border border-dashed border-line bg-inset/50 p-3 text-xs text-fg-subtle">
        No replies yet. Frontrun triages inbound replies the moment they land.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {replies.map((reply) => (
        <div key={reply.id} className="flex flex-col gap-2.5">
          {/* Inbound reply */}
          <div className="rounded-md border border-line bg-surface p-3">
            <div className="flex items-center justify-between gap-2 pb-1.5">
              <span className="text-xs font-medium text-foreground">{prospect}</span>
              <span className="font-mono text-[10px] tabular-nums text-fg-subtle">
                {shortDate(reply.receivedAt)} · {clockUTC(reply.receivedAt)}
              </span>
            </div>
            <p className="text-[13px] leading-relaxed text-fg-muted">{reply.rawText}</p>
          </div>

          {/* Triage verdict */}
          {reply.classification && (
            <ClassificationBanner classification={reply.classification} summary={reply.summary} />
          )}

          {/* Drafted next step */}
          {reply.nextStepDraft && (
            <div className="flex flex-col gap-1.5 pl-3">
              <span className="flex items-center gap-1.5 kicker text-signal">
                <CornerDownRight className="size-3" />
                Drafted next step
                {reply.classification && (
                  <span className="text-fg-subtle">· {NEXT_STEP_LABEL[reply.classification]}</span>
                )}
                <span className="ml-1 rounded-sm border border-line-strong px-1 py-px text-fg-faint">
                  not sent
                </span>
              </span>
              <EmailBlock
                email={reply.nextStepDraft}
                from="Frontrun · Dana"
                to={reply.from}
                accent
              />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
