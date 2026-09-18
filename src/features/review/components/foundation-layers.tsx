"use client"

import { DM_Sans } from "next/font/google"

import { cn } from "@/lib/utils"

import { Card, HairlineGrid } from "./slide-primitives"

/** The marketplace's own face, so the type layer is shown in it. */
const dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "700"] })

/**
 * Modern Care Homes' foundations, read off the live site's stylesheet:
 * its type scale, radius scale, shadow set and hairline.
 */
const MCH = {
  "--mch-ink": "#090b0c",
  "--mch-muted": "#4b585b",
  "--mch-line": "#e3e7e8",
  "--mch-brand": "#1447e6",
} as React.CSSProperties

const TYPE_SCALE = [
  { token: "text-4xl", px: 40, leading: 56 },
  { token: "text-2xl", px: 28, leading: 40 },
  { token: "text-xl", px: 24, leading: 32 },
  { token: "text-md", px: 18, leading: 26, base: true },
  { token: "text-sm", px: 16, leading: 20 },
  { token: "text-xs", px: 14, leading: 18 },
]

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
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "rounded-xl bg-white p-4 text-(--mch-ink) inset-ring-1 inset-ring-(--mch-line)",
        className
      )}
    >
      {children}
    </div>
  )
}

function Typography() {
  return (
    <Panel className={cn("flex flex-col gap-2", dmSans.className)}>
      {TYPE_SCALE.map((step) => (
        <div
          key={step.token}
          className="flex items-baseline justify-between gap-4"
        >
          <span
            className={cn(step.base ? "font-medium" : "font-normal")}
            style={{ fontSize: step.px, lineHeight: `${step.leading}px` }}
          >
            Phoenix
          </span>
          <span className="shrink-0 text-xs text-(--mch-muted)">
            {step.token} · {step.px}
            {step.base ? " · base" : ""}
          </span>
        </div>
      ))}
    </Panel>
  )
}

function Radius() {
  return (
    <Panel className="flex flex-col gap-3">
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
      <p className="text-xs text-(--mch-muted)">
        1px hairline, #e3e7e8, on every border. Radius steps off 10px.
      </p>
    </Panel>
  )
}

function Shadow() {
  return (
    <Panel className="flex flex-col gap-3 bg-[#f6f7f8]">
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
      <p className="text-xs text-(--mch-muted)">
        Five steps, xs to xl, and nothing in between.
      </p>
    </Panel>
  )
}

/**
 * The foundation layers under the colour tokens: type, radius and border,
 * shadow. Each panel is drawn from the marketplace's real values so it
 * reads as the system, not an illustration of one.
 */
export function FoundationLayers() {
  return (
    <HairlineGrid columns={3} style={MCH}>
      <Card label="Typography" title="DM Sans, 18px base">
        <Typography />
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
