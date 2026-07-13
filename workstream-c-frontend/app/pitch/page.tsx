import type { Metadata } from "next"
import { Hero } from "@/components/landing/hero"
import { Problem } from "@/components/landing/problem"
import { Solution } from "@/components/landing/solution"
import { Stack } from "@/components/landing/stack"
import { SponsorBelt } from "@/components/landing/sponsor-belt"
import { Close } from "@/components/landing/close"

export const metadata: Metadata = {
  title: "Frontrun — Reach them first.",
  description:
    "Frontrun detects the raise the day it files — then researches, drafts, sends, and books. End to end.",
}

export default function PitchPage() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <Hero />
      <Problem />
      <Solution />
      <Stack />
      <SponsorBelt />
      <Close />
    </div>
  )
}
