"use client"

import { motion } from "motion/react"

import { cn } from "@/lib/utils"

const STAGES = [
  { label: "Research", name: "Pattern teardown", meta: "Mobbin" },
  { label: "Design", name: "Figma", meta: "tokens named to match CSS" },
  {
    label: "Build",
    name: "Storybook",
    meta: "every state, 200% zoom",
    focus: true,
  },
  { label: "Review", name: "Pull request", meta: "typed, tested, reviewed" },
  { label: "Preview", name: "Vercel", meta: "on a real phone" },
]

const OUTPUTS = ["Marketplace", "Agent platform"]

const STATS = [
  ["Products", "2"],
  ["Base type", "18px"],
  ["Targets", "48×48"],
  ["Floor", "AA"],
]

/** A dot travelling down the rail, one of a few spaced along it. */
function RailDot({ delay }: { delay: number }) {
  return (
    <motion.span
      className="absolute left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-foreground"
      initial={{ top: "0%", opacity: 0 }}
      animate={{ top: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
      transition={{
        duration: 4.5,
        delay,
        repeat: Infinity,
        ease: "linear",
        times: [0, 0.08, 0.92, 1],
      }}
      aria-hidden
    />
  )
}

/**
 * How a screen gets from a teardown to two products: the stages down a
 * rail with work travelling along it. Storybook is the lit stage because
 * it is where the two-product test runs.
 */
export function ShippingPipeline({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-line bg-background",
        className
      )}
    >
      <ol className="relative flex flex-col gap-1.5 p-3 pl-10">
        <div
          className="absolute top-5 bottom-5 left-5 w-px bg-line"
          aria-hidden
        >
          <RailDot delay={0} />
          <RailDot delay={1.5} />
          <RailDot delay={3} />
        </div>

        {STAGES.map((stage) => (
          <li key={stage.name} className="relative">
            <span
              className={cn(
                "absolute top-1/2 -left-[1.3125rem] size-2 -translate-y-1/2 rounded-full ring-4 ring-background",
                stage.focus ? "bg-foreground" : "bg-border"
              )}
              aria-hidden
            />
            <div
              className={cn(
                "flex min-w-0 items-baseline justify-between gap-4 rounded-lg px-3 py-2",
                stage.focus
                  ? "bg-surface inset-ring-1 inset-ring-foreground/80"
                  : "inset-ring-1 inset-ring-border/64"
              )}
            >
              <div className="flex min-w-0 items-baseline gap-3">
                <span className="w-14 shrink-0 font-mono text-[0.65rem] tracking-wide text-muted-foreground uppercase">
                  {stage.label}
                </span>
                <span className="text-sm font-medium">{stage.name}</span>
              </div>
              <span className="truncate font-mono text-xs text-muted-foreground">
                {stage.meta}
              </span>
            </div>
          </li>
        ))}

        <li className="relative">
          <span
            className="absolute top-1/2 -left-[1.3125rem] size-2 -translate-y-1/2 rounded-full bg-success ring-4 ring-background"
            aria-hidden
          />
          <div className="flex items-baseline gap-3 px-3 py-2">
            <span className="w-14 shrink-0 font-mono text-[0.65rem] tracking-wide text-muted-foreground uppercase">
              Shipped
            </span>
            <ul className="flex flex-wrap gap-2">
              {OUTPUTS.map((name) => (
                <li
                  key={name}
                  className="flex items-center gap-2 rounded-md bg-surface px-2 py-1 text-sm inset-ring-1 inset-ring-border/64"
                >
                  {name}
                  <span
                    className="size-1.5 rounded-full bg-success"
                    aria-hidden
                  />
                </li>
              ))}
            </ul>
          </div>
        </li>
      </ol>

      <dl className="grid grid-cols-4 gap-4 border-t border-line px-3 py-2">
        {STATS.map(([label, value]) => (
          <div key={label}>
            <dt className="font-mono text-[0.6rem] tracking-wide whitespace-nowrap text-muted-foreground uppercase">
              {label}
            </dt>
            <dd className="font-mono text-base tabular-nums">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
