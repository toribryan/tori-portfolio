import { Caveat, Fraunces } from "next/font/google"
import localFont from "next/font/local"
import { GeistMono } from "geist/font/mono"
import { GeistSans } from "geist/font/sans"

import { cn } from "@/lib/utils"

// Geist sans + mono carry over unchanged from the Astro site — they were
// already --font-sans and --font-mono there.
const fontSans = GeistSans
const fontMono = GeistMono

// Nohemi is the display face: the wordmark, page headings, and section titles.
// Self-hosted; only Medium and SemiBold were ever licensed/shipped.
const fontDisplay = localFont({
  src: [
    { path: "../assets/fonts/Nohemi-Medium.woff2", weight: "500" },
    { path: "../assets/fonts/Nohemi-SemiBold.woff2", weight: "600" },
  ],
  display: "swap",
  fallback: ["Inter", "sans-serif"],
  variable: "--font-display",
})

// Fraunces was named in the Astro theme but never actually loaded — there was
// no @font-face and no import, so it silently fell back to Iowan Old Style.
// Loading it properly here is the fix.
const fontSerif = Fraunces({
  weight: ["400", "600"],
  display: "swap",
  variable: "--font-serif",
})

const fontHandwritten = Caveat({
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-handwritten",
})

export const fontVariables = cn(
  fontSans.variable,
  fontMono.variable,
  fontDisplay.variable,
  fontSerif.variable,
  fontHandwritten.variable,
  "[--font-sans:var(--font-geist-sans)]",
  "[--font-mono:var(--font-geist-mono)]"
)
