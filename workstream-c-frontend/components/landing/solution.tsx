import { FileText, Search, Send, CalendarCheck } from "lucide-react"
import { Reveal, RevealGroup, RevealItem } from "./reveal"

const STEPS = [
  {
    n: "01",
    icon: FileText,
    title: "Detect the raise",
    body: "SEC Form D filings hit EDGAR the day a company raises. Frontrun catches them same-day — before the press does.",
    data: "FORM D · T+0",
  },
  {
    n: "02",
    icon: Search,
    title: "Enrich + research",
    body: "A cited company brief, the right contact, and a verified email — resolved automatically, with confidence shown honestly.",
    data: "EMAIL · HIGH",
  },
  {
    n: "03",
    icon: Send,
    title: "Draft + send",
    body: "A personalized outreach email, drafted from the research and sent with live delivered-status tracking.",
    data: "DELIVERED",
  },
  {
    n: "04",
    icon: CalendarCheck,
    title: "Triage + book",
    body: "Replies come back classified green / yellow / red with the next step already drafted — through to a booked call.",
    data: "BOOKED",
  },
]

export function Solution() {
  return (
    <section className="border-b border-line">
      <div className="mx-auto w-full max-w-6xl px-6 py-24">
        <Reveal>
          <p className="kicker">03 / How it works</p>
          <h2 className="mt-5 max-w-xl font-display text-3xl font-semibold tracking-tight text-fg md:text-4xl">
            One loop, no hand-offs.
          </h2>
          <p className="mt-5 max-w-md leading-relaxed text-fg-muted">
            An AI employee that runs the whole conversation — detect to booked —
            not a chatbot waiting for a prompt.
          </p>
        </Reveal>

        <RevealGroup
          className="mt-14 grid gap-px overflow-hidden rounded-lg border border-line bg-line md:grid-cols-4"
          stagger={0.14}
        >
          {STEPS.map((step) => (
            <RevealItem key={step.n} className="bg-surface">
              <div className="flex h-full flex-col p-6">
                <div className="flex items-center justify-between">
                  <span className="kicker">{step.n}</span>
                  <step.icon className="size-4 text-fg-subtle" aria-hidden />
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold tracking-tight text-fg">
                  {step.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-fg-muted">
                  {step.body}
                </p>
                <div className="mt-6 flex items-center gap-2 border-t border-line pt-4">
                  <span
                    aria-hidden
                    className="h-3 w-[2px] rounded-[2px] bg-signal"
                  />
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-fg-subtle">
                    {step.data}
                  </span>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        {/* Triage legend — status is its own functional system, never the accent */}
        <Reveal delay={0.1}>
          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
            {(
              [
                ["bg-success", "Green · interested → booking nudge"],
                ["bg-warning", "Yellow · question → clarifier"],
                ["bg-danger", "Red · not interested → stop"],
              ] as const
            ).map(([dot, label]) => (
              <span key={label} className="flex items-center gap-2">
                <span aria-hidden className={`size-2 rounded-full ${dot}`} />
                <span className="font-mono text-[11px] tracking-[0.08em] text-fg-subtle">
                  {label}
                </span>
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
