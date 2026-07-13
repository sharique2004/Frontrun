/**
 * Frontrun — mock leads (Track C, frontend-only).
 *
 * Typed to the shared contract in `shared/types.ts`. This is FAKE data used to
 * build and demo the UI with no backend and no network calls. All companies,
 * people, emails, and filings below are invented — no real PII.
 *
 * Coverage: every lifecycle state appears as some lead's current `status`, so
 * the funnel board is fully populated from t=0. The client store then simulates
 * live forward transitions on a timer (see `lib/ui/store.ts`).
 */
import { type Lead, LeadStatus } from "@shared/types"

/** Seeded "companies detected today" counter — the live top-bar number. */
export const INITIAL_DETECTED_TODAY = 47

const edgar = (accession: string) =>
  `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&type=D&accession_number=${accession}`

export const MOCK_LEADS: Lead[] = [
  // 01 — DETECTED · fresh Form D, not yet enriched
  {
    id: "ld_northwind",
    status: LeadStatus.DETECTED,
    isDemo: false,
    signal: {
      accessionNumber: "0001884210-26-004417",
      companyName: "Northwind Robotics",
      relatedPersons: ["Priya Raman", "Devin Osei"],
      address: "4400 Airport Blvd, Austin, TX 78722",
      amountRaised: "$18,000,000",
      filedAt: "2026-07-13T13:42:00Z",
      edgarUrl: edgar("0001884210-26-004417"),
    },
    createdAt: "2026-07-13T13:42:11Z",
    updatedAt: "2026-07-13T13:42:11Z",
  },

  // 02 — ENRICHED · brief + resolved contact, not yet drafted
  {
    id: "ld_cobalt",
    status: LeadStatus.ENRICHED,
    isDemo: false,
    signal: {
      accessionNumber: "0001772022-26-006120",
      companyName: "Cobalt Health",
      relatedPersons: ["Elena Voss", "Marcus Feld"],
      address: "255 State St, Boston, MA 02109",
      amountRaised: "$32,000,000",
      filedAt: "2026-07-13T11:08:00Z",
      edgarUrl: edgar("0001772022-26-006120"),
    },
    brief: {
      summary:
        "Cobalt Health builds a clinical-operations platform that automates staffing and shift coverage for mid-size hospital systems. The $32M Series B (led by Amberline Ventures) is earmarked for a 40-person commercial and clinical hiring push over the next two quarters.",
      citations: [
        {
          title: "Cobalt Health raises $32M Series B to automate hospital staffing",
          url: "https://techcrunch.com/2026/07/13/cobalt-health-series-b",
          snippet: "…plans to roughly double headcount, hiring across clinical ops, sales, and engineering…",
        },
        {
          title: "Cobalt Health — Company overview",
          url: "https://www.cobalthealth.com/about",
          snippet: "Clinical operations, reimagined. Boston, MA.",
        },
      ],
      fundingConfirmed: true,
    },
    contact: {
      name: "Elena Voss",
      title: "CEO & Co-founder",
      email: "elena@cobalthealth.com",
      emailConfidence: "high",
      linkedinUrl: "https://www.linkedin.com/in/elena-voss-cobalt",
      source: "nimble",
    },
    createdAt: "2026-07-13T11:08:19Z",
    updatedAt: "2026-07-13T12:55:03Z",
  },

  // 03 — DRAFTED · outreach written, ready to send
  {
    id: "ld_latchkey",
    status: LeadStatus.DRAFTED,
    isDemo: false,
    signal: {
      accessionNumber: "0001955001-26-001988",
      companyName: "Latchkey Security",
      relatedPersons: ["Sam Okafor"],
      address: "1160 Battery St E, San Francisco, CA 94111",
      amountRaised: "$6,500,000",
      filedAt: "2026-07-13T09:31:00Z",
      edgarUrl: edgar("0001955001-26-001988"),
    },
    brief: {
      summary:
        "Latchkey Security offers continuous API security posture management for fintech and healthtech teams. The $6.5M seed (First Byte Capital) funds the company's first go-to-market hires and a small applied-security engineering team.",
      citations: [
        {
          title: "Latchkey lands $6.5M seed to secure the API layer",
          url: "https://www.axios.com/2026/07/13/latchkey-seed",
          snippet: "…first sales and security engineering hires planned for Q3…",
        },
      ],
      fundingConfirmed: true,
    },
    contact: {
      name: "Sam Okafor",
      title: "Founder & CEO",
      email: "sam@latchkey.io",
      emailConfidence: "medium",
      linkedinUrl: "https://www.linkedin.com/in/sam-okafor",
      source: "hunter",
    },
    draft: {
      subject: "Congrats on the $6.5M — first security + GTM hires?",
      body:
        "Hi Sam,\n\nSaw Latchkey just closed the $6.5M seed — congrats. Seed-stage security teams usually need to land their first applied-security and GTM hires fast, before the roadmap outpaces the org.\n\nWe place exactly those roles for API-security startups and can share a shortlist this week. Worth a 15-minute call?\n\n— Dana, Harbor Talent",
      createdAt: "2026-07-13T10:04:00Z",
    },
    createdAt: "2026-07-13T09:31:22Z",
    updatedAt: "2026-07-13T10:04:00Z",
  },

  // 04 — SENT · demo company #1, awaiting delivery confirmation
  {
    id: "ld_verdano",
    status: LeadStatus.SENT,
    isDemo: true,
    signal: {
      accessionNumber: "0001640152-26-003301",
      companyName: "Verdano",
      relatedPersons: ["Lucia Marín"],
      address: "1550 Wewatta St, Denver, CO 80202",
      amountRaised: "$14,000,000",
      filedAt: "2026-07-13T08:12:00Z",
      edgarUrl: edgar("0001640152-26-003301"),
    },
    brief: {
      summary:
        "Verdano runs a produce supply-chain marketplace connecting regional growers with grocery buyers. The $14M Series A (Cropline Partners) backs expansion into three new metros and a doubling of the ops and sales teams.",
      citations: [
        {
          title: "Verdano raises $14M to rewire the produce supply chain",
          url: "https://www.forbes.com/2026/07/12/verdano-series-a",
          snippet: "…expanding to Dallas, Phoenix, and Seattle; hiring across ops and sales…",
        },
      ],
      fundingConfirmed: true,
    },
    contact: {
      name: "Lucia Marín",
      title: "Co-founder & COO",
      email: "lucia@verdano.co",
      emailConfidence: "high",
      source: "nimble",
    },
    draft: {
      subject: "Congrats on the $14M — scaling ops across 3 metros?",
      body:
        "Hi Lucia,\n\nCongrats on the Series A. Opening Dallas, Phoenix, and Seattle at once is an ops-hiring marathon — regional ops leads and field sales, fast.\n\nWe staff exactly this for supply-chain startups. Happy to send 3–4 pre-vetted profiles per metro. Open to a quick call?\n\n— Dana, Harbor Talent",
      createdAt: "2026-07-13T08:40:00Z",
    },
    outreach: {
      messageId: "re_demo_verdano_001",
      sentAt: "2026-07-13T14:02:09Z",
    },
    createdAt: "2026-07-13T08:12:40Z",
    updatedAt: "2026-07-13T14:02:09Z",
  },

  // 05 — DELIVERED · demo company #2, delivered + opened (opened is directional only)
  {
    id: "ld_pallas",
    status: LeadStatus.DELIVERED,
    isDemo: true,
    signal: {
      accessionNumber: "0001511144-26-005570",
      companyName: "Pallas Analytics",
      relatedPersons: ["Theo Nakamura", "Ruth Adeyemi"],
      address: "600 W Chicago Ave, Chicago, IL 60654",
      amountRaised: "$22,000,000",
      filedAt: "2026-07-13T07:55:00Z",
      edgarUrl: edgar("0001511144-26-005570"),
    },
    brief: {
      summary:
        "Pallas Analytics sells a retail-media measurement suite to consumer brands. The $22M Series A (Northlight, Verso) funds a large enterprise sales build-out and a new solutions-engineering function.",
      citations: [
        {
          title: "Pallas Analytics closes $22M to measure retail media",
          url: "https://www.businessinsider.com/2026/07/pallas-analytics-a",
          snippet: "…hiring 25+ across enterprise sales and solutions engineering…",
        },
        {
          title: "Pallas Analytics — Careers",
          url: "https://www.pallas.io/careers",
          snippet: "We're hiring across GTM. Chicago / remote.",
        },
      ],
      fundingConfirmed: true,
    },
    contact: {
      name: "Theo Nakamura",
      title: "CEO",
      email: "theo@pallas.io",
      emailConfidence: "high",
      source: "nimble",
    },
    draft: {
      subject: "Congrats on the $22M — building the enterprise sales team?",
      body:
        "Hi Theo,\n\nCongrats on the raise. Standing up enterprise sales + solutions engineering from scratch is where most post-Series-A teams stall on hiring speed.\n\nWe specialize in retail/adtech GTM talent and can send a calibrated shortlist this week. 15 minutes?\n\n— Dana, Harbor Talent",
      createdAt: "2026-07-13T09:12:00Z",
    },
    outreach: {
      messageId: "re_demo_pallas_002",
      sentAt: "2026-07-13T14:02:09Z",
      deliveredAt: "2026-07-13T14:02:41Z",
      openedAt: "2026-07-13T14:19:52Z",
    },
    createdAt: "2026-07-13T07:55:12Z",
    updatedAt: "2026-07-13T14:19:52Z",
  },

  // 06 — GREEN · demo company #3, replied positive, classified green, next step drafted
  {
    id: "ld_meridian",
    status: LeadStatus.GREEN,
    isDemo: true,
    signal: {
      accessionNumber: "0001803289-26-002044",
      companyName: "Meridian Freight Cloud",
      relatedPersons: ["Grace Bello", "Idris Khan"],
      address: "1180 Peachtree St NE, Atlanta, GA 30309",
      amountRaised: "$41,000,000",
      filedAt: "2026-07-12T16:20:00Z",
      edgarUrl: edgar("0001803289-26-002044"),
    },
    brief: {
      summary:
        "Meridian Freight Cloud is a transportation management system (TMS) for mid-market shippers. The $41M Series B (Kestrel Growth) funds a national sales expansion and a large customer-success and implementation org.",
      citations: [
        {
          title: "Meridian Freight Cloud raises $41M Series B",
          url: "https://www.freightwaves.com/news/meridian-series-b",
          snippet: "…plans to triple its go-to-market and implementation headcount…",
        },
      ],
      fundingConfirmed: true,
    },
    contact: {
      name: "Grace Bello",
      title: "VP People",
      email: "grace@meridianfreight.cloud",
      emailConfidence: "high",
      source: "nimble",
    },
    draft: {
      subject: "Congrats on the $41M — tripling GTM + implementation?",
      body:
        "Hi Grace,\n\nCongrats on the Series B. Tripling GTM and implementation headcount is a huge hiring lift on a tight clock.\n\nWe place TMS/logistics GTM and implementation talent and can run a calibrated pipeline for you. Worth a short call this week?\n\n— Dana, Harbor Talent",
      createdAt: "2026-07-12T17:02:00Z",
    },
    outreach: {
      messageId: "re_demo_meridian_003",
      sentAt: "2026-07-12T17:30:00Z",
      deliveredAt: "2026-07-12T17:30:38Z",
      openedAt: "2026-07-12T18:11:00Z",
    },
    replies: [
      {
        id: "rp_meridian_1",
        receivedAt: "2026-07-13T13:58:20Z",
        from: "grace@meridianfreight.cloud",
        rawText:
          "This is timely — we're way behind on implementation hiring. Can you send a few profiles and grab time this week?",
        summary: "Interested. Behind on implementation hiring; wants profiles and a call this week.",
        classification: "green",
        nextStepDraft: {
          subject: "Re: Congrats on the $41M — 4 profiles + a time to talk",
          body:
            "Hi Grace,\n\nGreat — attaching four implementation leads we've placed at TMS companies. Here's my calendar; grab whatever works: cal.com/dana/frontrun\n\nTalk soon,\nDana",
          createdAt: "2026-07-13T14:00:10Z",
        },
      },
    ],
    createdAt: "2026-07-12T16:20:33Z",
    updatedAt: "2026-07-13T14:00:10Z",
  },

  // 07 — FOLLOW_UP_DRAFTED · green earlier, booking-nudge follow-up now drafted
  {
    id: "ld_helio",
    status: LeadStatus.FOLLOW_UP_DRAFTED,
    isDemo: false,
    signal: {
      accessionNumber: "0001999210-26-000771",
      companyName: "Helio Grid",
      relatedPersons: ["Nadia Rostami"],
      address: "1211 SW 5th Ave, Portland, OR 97204",
      amountRaised: "$19,000,000",
      filedAt: "2026-07-12T10:05:00Z",
      edgarUrl: edgar("0001999210-26-000771"),
    },
    brief: {
      summary:
        "Helio Grid builds operations software for distributed solar installers. The $19M Series A (Sunrise Capital) backs a national installer-success team and a first enterprise sales cohort.",
      citations: [
        {
          title: "Helio Grid raises $19M to run distributed solar ops",
          url: "https://www.canarymedia.com/articles/helio-grid-series-a",
          snippet: "…hiring installer-success and enterprise sales across the West…",
        },
      ],
      fundingConfirmed: true,
    },
    contact: {
      name: "Nadia Rostami",
      title: "Head of Talent",
      email: "nadia@heliogrid.com",
      emailConfidence: "high",
      source: "nimble",
    },
    draft: {
      subject: "Congrats on the $19M — installer-success + enterprise sales?",
      body:
        "Hi Nadia,\n\nCongrats on the raise. Distributed-solar ops hiring is a specialized market — installer-success and enterprise reps who actually know the space.\n\nWe've placed both. Can I send a shortlist?\n\n— Dana, Harbor Talent",
      createdAt: "2026-07-12T11:00:00Z",
    },
    outreach: {
      messageId: "re_helio_010",
      sentAt: "2026-07-12T11:20:00Z",
      deliveredAt: "2026-07-12T11:20:31Z",
      openedAt: "2026-07-12T13:44:00Z",
    },
    replies: [
      {
        id: "rp_helio_1",
        receivedAt: "2026-07-12T15:02:00Z",
        from: "nadia@heliogrid.com",
        rawText: "Yes, send the shortlist. We're hiring installer-success now.",
        summary: "Positive. Wants the installer-success shortlist immediately.",
        classification: "green",
        nextStepDraft: {
          subject: "Re: Congrats on the $19M — shortlist + quick call",
          body:
            "Hi Nadia,\n\nShortlist attached — five installer-success leads with distributed-solar experience. Want to walk through them live? Here's my calendar: cal.com/dana/frontrun\n\n— Dana",
          createdAt: "2026-07-12T15:30:00Z",
        },
      },
    ],
    createdAt: "2026-07-12T10:05:41Z",
    updatedAt: "2026-07-12T15:30:00Z",
  },

  // 08 — YELLOW · neutral / "who are you?" reply, clarifier drafted
  {
    id: "ld_sundeck",
    status: LeadStatus.YELLOW,
    isDemo: false,
    signal: {
      accessionNumber: "0001466321-26-004402",
      companyName: "Sundeck Bio",
      relatedPersons: ["Aaron Feld", "Mei Lin"],
      address: "10578 Science Center Dr, San Diego, CA 92121",
      amountRaised: "$9,000,000",
      filedAt: "2026-07-12T09:14:00Z",
      edgarUrl: edgar("0001466321-26-004402"),
    },
    brief: {
      summary:
        "Sundeck Bio is a synthetic-biology startup engineering enzymes for industrial detergents. The $9M seed (Helix Seed) funds a small wet-lab team and its first business hire.",
      citations: [
        {
          title: "Sundeck Bio raises $9M seed for industrial enzymes",
          url: "https://www.endpts.com/sundeck-bio-seed",
          snippet: "…building out the wet-lab team; first commercial hire planned…",
        },
      ],
      fundingConfirmed: true,
    },
    contact: {
      name: "Aaron Feld",
      title: "Co-founder & CSO",
      email: "aaron@sundeckbio.com",
      emailConfidence: "medium",
      source: "hunter",
    },
    draft: {
      subject: "Congrats on the $9M seed — first commercial + lab hires?",
      body:
        "Hi Aaron,\n\nCongrats on the seed. Early synth-bio teams have a narrow talent pool for both wet-lab and that first commercial hire.\n\nWe recruit in this space. Want a shortlist?\n\n— Dana, Harbor Talent",
      createdAt: "2026-07-12T09:50:00Z",
    },
    outreach: {
      messageId: "re_sundeck_020",
      sentAt: "2026-07-12T10:10:00Z",
      deliveredAt: "2026-07-12T10:10:44Z",
    },
    replies: [
      {
        id: "rp_sundeck_1",
        receivedAt: "2026-07-13T09:40:00Z",
        from: "aaron@sundeckbio.com",
        rawText: "Who is this? How did you get my email, and what exactly do you do?",
        summary: "Neutral / skeptical. Wants to know who we are and what we do before engaging.",
        classification: "yellow",
        nextStepDraft: {
          subject: "Re: Quick context on Harbor Talent",
          body:
            "Hi Aaron,\n\nFair question. I'm Dana at Harbor Talent — we recruit for early biotech teams. I saw Sundeck's seed in public filings, no list-buying. No pressure; if hiring isn't front-of-mind yet, I'll check back after the lab team lands.\n\n— Dana",
          createdAt: "2026-07-13T09:55:00Z",
        },
      },
    ],
    createdAt: "2026-07-12T09:14:20Z",
    updatedAt: "2026-07-13T09:55:00Z",
  },

  // 09 — RED · not interested, stop
  {
    id: "ld_ironclad",
    status: LeadStatus.RED,
    isDemo: false,
    signal: {
      accessionNumber: "0001700455-26-007781",
      companyName: "Ironclad Payments",
      relatedPersons: ["Victor Hale"],
      address: "85 Broad St, New York, NY 10004",
      amountRaised: "$55,000,000",
      filedAt: "2026-07-11T14:47:00Z",
      edgarUrl: edgar("0001700455-26-007781"),
    },
    brief: {
      summary:
        "Ironclad Payments provides B2B payment orchestration for enterprise finance teams. The $55M Series C (Meridian Growth) is primarily for international expansion; hiring is led internally.",
      citations: [
        {
          title: "Ironclad Payments raises $55M Series C",
          url: "https://www.pymnts.com/2026/07/ironclad-series-c",
          snippet: "…expansion into EMEA; recruiting handled by an in-house talent team…",
        },
      ],
      fundingConfirmed: true,
    },
    contact: {
      name: "Victor Hale",
      title: "VP Talent",
      email: "victor@ironcladpay.com",
      emailConfidence: "high",
      source: "nimble",
    },
    draft: {
      subject: "Congrats on the $55M — EMEA hiring support?",
      body:
        "Hi Victor,\n\nCongrats on the Series C. As you scale into EMEA, external recruiting partners can take pressure off the in-house team for hard-to-fill roles.\n\nOpen to a quick intro?\n\n— Dana, Harbor Talent",
      createdAt: "2026-07-11T15:30:00Z",
    },
    outreach: {
      messageId: "re_ironclad_030",
      sentAt: "2026-07-11T16:00:00Z",
      deliveredAt: "2026-07-11T16:00:29Z",
      openedAt: "2026-07-11T16:35:00Z",
    },
    replies: [
      {
        id: "rp_ironclad_1",
        receivedAt: "2026-07-12T08:20:00Z",
        from: "victor@ironcladpay.com",
        rawText: "We handle all recruiting internally and aren't using agencies. Please remove me.",
        summary: "Not interested. Recruiting is in-house; asked to be removed.",
        classification: "red",
      },
    ],
    createdAt: "2026-07-11T14:47:10Z",
    updatedAt: "2026-07-12T08:20:00Z",
  },

  // 10 — BOOKED · the win. Green → follow-up → booked a Cal.com call
  {
    id: "ld_cirrus",
    status: LeadStatus.BOOKED,
    isDemo: false,
    signal: {
      accessionNumber: "0001588123-26-003115",
      companyName: "Cirrus Talent",
      relatedPersons: ["Maya Okonkwo", "Ben Suri"],
      address: "1201 3rd Ave, Seattle, WA 98101",
      amountRaised: "$27,000,000",
      filedAt: "2026-07-10T12:33:00Z",
      edgarUrl: edgar("0001588123-26-003115"),
    },
    brief: {
      summary:
        "Cirrus Talent sells an HR-tech platform for hourly workforce scheduling. The $27M Series A (Anthem Ventures) funds a major product and enterprise sales expansion — 30+ hires planned for the half.",
      citations: [
        {
          title: "Cirrus Talent raises $27M to fix hourly scheduling",
          url: "https://techcrunch.com/2026/07/10/cirrus-talent-series-a",
          snippet: "…30+ hires across product and enterprise sales this half…",
        },
      ],
      fundingConfirmed: true,
    },
    contact: {
      name: "Maya Okonkwo",
      title: "COO",
      email: "maya@cirrustalent.com",
      emailConfidence: "high",
      source: "nimble",
    },
    draft: {
      subject: "Congrats on the $27M — 30 hires this half?",
      body:
        "Hi Maya,\n\nCongrats on the Series A. 30+ hires across product and enterprise sales in one half is a real pipeline problem.\n\nWe run calibrated pipelines for HR-tech GTM and product. Worth a call?\n\n— Dana, Harbor Talent",
      createdAt: "2026-07-10T13:10:00Z",
    },
    outreach: {
      messageId: "re_cirrus_040",
      sentAt: "2026-07-10T13:30:00Z",
      deliveredAt: "2026-07-10T13:30:35Z",
      openedAt: "2026-07-10T14:02:00Z",
      bookedAt: "2026-07-11T10:15:00Z",
    },
    replies: [
      {
        id: "rp_cirrus_1",
        receivedAt: "2026-07-10T17:45:00Z",
        from: "maya@cirrustalent.com",
        rawText: "Yes — pipeline is exactly the problem. Send a time.",
        summary: "Very interested. Confirmed hiring pipeline is the bottleneck; asked for a time.",
        classification: "green",
        nextStepDraft: {
          subject: "Re: Congrats on the $27M — grab a time",
          body:
            "Hi Maya,\n\nPerfect. Here's my calendar — grab whatever works: cal.com/dana/frontrun\n\nLooking forward,\nDana",
          createdAt: "2026-07-10T18:00:00Z",
        },
      },
    ],
    createdAt: "2026-07-10T12:33:14Z",
    updatedAt: "2026-07-11T10:15:00Z",
  },
]
