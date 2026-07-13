import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Reveal } from "./reveal"

export function Close() {
  return (
    <section id="live-demo" className="scroll-mt-16">
      <div className="mx-auto w-full max-w-6xl px-6 py-28 md:py-36">
        <Reveal>
          <p className="kicker">06 / The demo</p>
          <h2 className="mt-6 max-w-2xl font-display text-4xl font-semibold leading-[1.05] tracking-tight text-fg md:text-6xl">
            The raise just filed.
            <br />
            You&apos;re already in the inbox.
            <span
              aria-hidden
              className="ml-3 inline-block h-[0.14em] w-[0.32em] rounded-[2px] bg-signal align-baseline"
            />
          </h2>
          <p className="mt-7 max-w-md leading-relaxed text-fg-muted">
            Real filings, real research, live sends, live triage — watch the
            whole loop run.
          </p>
          <div className="mt-10 flex items-center gap-6">
            <Link
              href="/"
              className="inline-flex h-11 items-center gap-2 rounded-md bg-signal px-5 font-medium text-signal-foreground transition-colors duration-[var(--dur-fast)] hover:bg-signal-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
            >
              See the live demo
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </Reveal>
      </div>
      <footer className="border-t border-line">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-fg-faint">
            Frontrun · Build Your Own AI Company
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-fg-faint">
            US B2B only · CAN-SPAM compliant · demo inboxes, no cold sends
          </span>
        </div>
      </footer>
    </section>
  )
}
