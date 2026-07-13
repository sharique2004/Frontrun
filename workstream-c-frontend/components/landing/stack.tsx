import { Reveal, RevealGroup, RevealItem } from "./reveal"
import { SponsorLogo, type Sponsor } from "./sponsor-logo"

const STACK: Sponsor[] = [
  { slug: "insforge", name: "InsForge", layer: "Backend — database, auth, storage, functions" },
  { slug: "youcom", name: "You.com", layer: "Cited company research, real-time confirmation" },
  { slug: "nimble", name: "Nimble", layer: "Web + contact enrichment, email resolve" },
  { slug: "rocketride", name: "RocketRide", layer: "Enrich → verify → draft, one pipeline tool" },
  { slug: "band", name: "Band", layer: "Agent orchestration + reply triage" },
  { slug: "hydra", name: "Hydra DB", layer: "Columnar analytics — reply rate, funnel" },
]

export function Stack() {
  return (
    <section className="border-b border-line">
      <div className="mx-auto w-full max-w-6xl px-6 py-24">
        <Reveal>
          <p className="kicker">04 / Built on the stack</p>
          <h2 className="mt-5 max-w-xl font-display text-3xl font-semibold tracking-tight text-fg md:text-4xl">
            Every layer, a sponsor doing real work.
          </h2>
        </Reveal>

        <RevealGroup className="mt-12" stagger={0.08}>
          <ul className="border-t border-line">
            {STACK.map((s) => (
              <RevealItem key={s.slug}>
                <li className="grid items-center gap-x-8 gap-y-2 border-b border-line py-5 sm:grid-cols-[180px_1fr]">
                  <SponsorLogo sponsor={s} imgClassName="max-w-[150px]" />
                  <p className="text-sm text-fg-muted">{s.layer}</p>
                </li>
              </RevealItem>
            ))}
          </ul>
        </RevealGroup>
      </div>
    </section>
  )
}
