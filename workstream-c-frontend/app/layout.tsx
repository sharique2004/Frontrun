import type { Metadata } from "next"
import { Inter, Space_Grotesk, DM_Mono } from "next/font/google"
import "./globals.css"
import { ShellGate } from "@/components/landing/shell-gate"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
})

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-mono",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "Frontrun — Autonomous SDR",
  description:
    "Frontrun detects the moment a company raises funding, researches it, and runs the entire outreach conversation as an AI employee.",
  openGraph: {
    title: "Frontrun — Autonomous SDR",
    description:
      "Reach them first. Frontrun catches the raise the day it files — then researches, drafts, sends, and books.",
    images: ["/brand/og-card.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Frontrun — Autonomous SDR",
    description: "Reach them first.",
    images: ["/brand/og-card.png"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${dmMono.variable} dark h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-svh bg-background text-foreground">
        <ShellGate>{children}</ShellGate>
      </body>
    </html>
  )
}
