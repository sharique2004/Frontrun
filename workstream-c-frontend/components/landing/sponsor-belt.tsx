import { Reveal } from "./reveal"
import { SponsorLogo, type Sponsor } from "./sponsor-logo"

const BELT: Sponsor[] = [
  { slug: "insforge", name: "InsForge" },
  { slug: "youcom", name: "You.com" },
  { slug: "nimble", name: "Nimble" },
  { slug: "rocketride", name: "RocketRide" },
  { slug: "band", name: "Band" },
  { slug: "hydra", name: "Hydra DB" },
  { slug: "resend", name: "Resend" },
  { slug: "calcom", name: "Cal.com" },
  { slug: "tavily", name: "Tavily" },
]

/**
 * Infinite horizontal marquee of the full reward stack. Two identical copies
 * of the row scroll -50%; the loop is seamless because copy 2 lands exactly
 * where copy 1 started. Pauses on hover; reduced motion stops it globally.
 */
export function SponsorBelt() {
  return (
    <section className="overflow-hidden border-b border-line py-14">
      <Reveal>
        <p className="kicker mx-auto w-full max-w-6xl px-6">
          05 / The reward stack
        </p>
      </Reveal>
      <div
        className="belt group relative mt-8"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
        }}
      >
        <style>{`
          @keyframes belt-scroll {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
          .belt-track {
            animation: belt-scroll 36s linear infinite;
            width: max-content;
          }
          .belt:hover .belt-track {
            animation-play-state: paused;
          }
        `}</style>
        <div className="belt-track flex items-center">
          {[0, 1].map((copy) => (
            <ul
              key={copy}
              aria-hidden={copy === 1}
              className="flex shrink-0 items-center"
            >
              {BELT.map((s) => (
                <li
                  key={s.slug}
                  className="flex h-16 items-center border-r border-line px-10 opacity-70 transition-opacity duration-[var(--dur-fast)] hover:opacity-100"
                >
                  <SponsorLogo sponsor={s} imgClassName="h-5" />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  )
}
