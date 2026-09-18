"use client"

import { useState } from "react"
import { DM_Sans } from "next/font/google"
import { MoonIcon, SunIcon } from "lucide-react"

import { cn } from "@/lib/utils"

import { Card, HairlineGrid } from "./slide-primitives"

/** The marketplace's own face, so the type layer is shown in it. */
const dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "700"] })

/**
 * Modern Care Homes' foundations, read off the live site's stylesheet:
 * its radius scale, shadow set, hairline and both semantic value sets.
 */
const MCH = {
  "--mch-ink": "#090b0c",
  "--mch-muted": "#4b585b",
  "--mch-line": "#e3e7e8",
  "--mch-brand": "#1447e6",
} as React.CSSProperties

/**
 * The semantic tokens a component reads, with the value each mode gives
 * them. Same names in both columns: that is the point of the panel.
 */
const THEMES = {
  light: {
    "--background": "#ffffff",
    "--foreground": "#090b0c",
    "--card": "#ffffff",
    "--card-foreground": "#090b0c",
    "--primary": "#1447e6",
    "--primary-foreground": "oklch(97% 0.014 254.604)",
    "--muted": "oklch(96.3% 0.002 197.1)",
    "--muted-foreground": "#4b585b",
    "--border": "oklch(92.5% 0.005 214.3)",
    "--input": "oklch(72.3% 0.014 214.4)",
  },
  dark: {
    "--background": "oklch(14.8% 0.004 228.8)",
    "--foreground": "oklch(98.7% 0.002 197.1)",
    "--card": "oklch(21.8% 0.008 223.9)",
    "--card-foreground": "oklch(98.7% 0.002 197.1)",
    "--primary": "oklch(42.4% 0.199 265.638)",
    "--primary-foreground": "oklch(97% 0.014 254.604)",
    "--muted": "oklch(27.5% 0.011 216.9)",
    "--muted-foreground": "oklch(72.3% 0.014 214.4)",
    "--border": "oklch(100% 0 0 / 0.1)",
    "--input": "oklch(100% 0 0 / 0.28)",
  },
} as const

type Mode = keyof typeof THEMES

/** `--radius` is 10px; the scale steps off it the way Tailwind 4 derives it. */
const RADII = [
  { token: "xs", px: 2 },
  { token: "sm", px: 6 },
  { token: "md", px: 8 },
  { token: "lg", px: 10 },
  { token: "xl", px: 14 },
  { token: "full", px: 999 },
]

const SHADOWS = [
  { token: "xs", value: "0 1px 2px 0 rgb(0 0 0 / 0.05)" },
  {
    token: "sm",
    value: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
  },
  {
    token: "md",
    value: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  },
  {
    token: "lg",
    value: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  },
  {
    token: "xl",
    value:
      "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  },
]

function Panel({
  children,
  className,
  style,
}: {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <div
      className={cn(
        "flex flex-1 flex-col gap-3 rounded-xl bg-white p-4 text-(--mch-ink) inset-ring-1 inset-ring-(--mch-line)",
        className
      )}
      style={style}
    >
      {children}
    </div>
  )
}

function Theme() {
  const [mode, setMode] = useState<Mode>("light")

  return (
    <Panel
      className={cn("flex flex-col gap-3", dmSans.className)}
      style={THEMES[mode] as React.CSSProperties}
    >
      <div
        className="flex w-fit gap-0.5 rounded-lg bg-(--muted) p-0.5"
        role="radiogroup"
        aria-label="Theme"
      >
        {(["light", "dark"] as const).map((option) => (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={mode === option}
            className={cn(
              "flex h-7 items-center gap-1.5 rounded-md px-2 text-xs capitalize transition-colors",
              mode === option
                ? "bg-(--card) text-(--card-foreground) shadow-xs"
                : "text-(--muted-foreground)"
            )}
            onClick={() => setMode(option)}
          >
            {option === "light" ? (
              <SunIcon className="size-3.5" />
            ) : (
              <MoonIcon className="size-3.5" />
            )}
            {option}
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-2 rounded-lg border border-(--border) bg-(--background) p-3 transition-colors">
        <div className="flex flex-col gap-1 rounded-md border border-(--border) bg-(--card) p-2.5 text-(--card-foreground)">
          <span className="text-sm font-medium">Desert Bloom Care Home</span>
          <span className="text-xs text-(--muted-foreground)">
            Scottsdale · from $4,200
          </span>
        </div>
        <div className="flex gap-2">
          <span className="flex h-8 flex-1 items-center rounded-md border border-(--input) bg-(--background) px-2 text-xs text-(--muted-foreground)">
            Search homes
          </span>
          <span className="flex h-8 items-center rounded-md bg-(--primary) px-3 text-xs font-medium text-(--primary-foreground)">
            Contact
          </span>
        </div>
      </div>
    </Panel>
  )
}

function Radius() {
  return (
    <Panel>
      <div className="grid grid-cols-3 gap-3">
        {RADII.map((r) => (
          <div key={r.token} className="flex flex-col items-center gap-1.5">
            <span
              className="size-14 border border-(--mch-line) bg-white"
              style={{
                borderRadius: r.px,
                borderTopColor: "var(--mch-brand)",
                borderLeftColor: "var(--mch-brand)",
              }}
            />
            <span className="text-xs text-(--mch-muted)">
              {r.token} · {r.px === 999 ? "∞" : r.px}
            </span>
          </div>
        ))}
      </div>
    </Panel>
  )
}

function Shadow() {
  return (
    <Panel className="bg-[#f6f7f8]">
      <div className="grid grid-cols-5 gap-3">
        {SHADOWS.map((s) => (
          <div key={s.token} className="flex flex-col items-center gap-2">
            <span
              className="h-12 w-full rounded-lg bg-white"
              style={{ boxShadow: s.value }}
            />
            <span className="text-xs text-(--mch-muted)">{s.token}</span>
          </div>
        ))}
      </div>
    </Panel>
  )
}

/**
 * The foundation layers under the color tokens: theme, radius and border,
 * shadow. Each panel is drawn from the marketplace's real values so it
 * reads as the system, not an illustration of one.
 */
export function FoundationLayers() {
  return (
    <HairlineGrid columns={3} style={MCH}>
      <Card label="Theme" title="Semantic tokens, two value sets">
        <Theme />
      </Card>
      <Card label="Radius and border" title="One hairline, six radii">
        <Radius />
      </Card>
      <Card label="Shadow" title="Elevation in five steps">
        <Shadow />
      </Card>
    </HairlineGrid>
  )
}
