"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "motion/react"

import { cn } from "@/lib/utils"

/** What the pipeline reports as it runs, one line at a time. */
const LOG = [
  "Teardown: marketplace search and listing creation, in Mobbin",
  "Figma: home-card v3, foundations locked, tokens named to match CSS",
  "Storybook: HomeCard · 6 states · 200% zoom · AA passes",
  "Pull request: feat(home-card): availability badge, save, carousel",
  "Vercel preview ready · opened on a phone in a parking lot",
  "Merged. Marketplace and agent platform pick up the change together.",
  "Learned shipping: carousel dots need 48px targets. Back into the system.",
  "Idle. Listening for the next screen...",
]

const STAGES = [
  { label: "Research", name: "Pattern teardown", meta: "Mobbin" },
  { label: "Design", name: "Figma", meta: "tokens named to match CSS" },
  {
    label: "Build",
    name: "Storybook",
    meta: "every state, every size, 200% zoom",
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
 * rail with work travelling along it, a log line ticking underneath.
 * Storybook is the lit stage because it is where the two-product test runs.
 */
export function ShippingPipeline({ className }: { className?: string }) {
  const [line, setLine] = useState(0)

  useEffect(() => {
    const lines = setInterval(() => {
      setLine((current) => (current + 1) % LOG.length)
    }, 2700)
    return () => clearInterval(lines)
  }, [])

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-line bg-background",
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
        <div className="flex items-center gap-2">
          <motion.span
            className="inline-block size-1.5 rounded-full bg-success"
            animate={{ opacity: [1, 0.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <span className="font-mono text-[0.65rem] tracking-wide text-muted-foreground uppercase">
            Shipping pipeline · live
          </span>
        </div>
        <span className="font-mono text-[0.65rem] tracking-wide text-muted-foreground/70 uppercase">
          1 library · 2 products
        </span>
      </div>

      <ol className="relative flex flex-col gap-2 p-4 pl-11">
        <div
          className="absolute top-6 bottom-6 left-6 w-px bg-line"
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
                "flex items-baseline justify-between gap-4 rounded-lg px-3 py-2.5",
                stage.focus
                  ? "bg-surface inset-ring-1 inset-ring-foreground/80"
                  : "inset-ring-1 inset-ring-border/64"
              )}
            >
              <div className="flex items-baseline gap-3">
                <span className="w-16 shrink-0 font-mono text-[0.65rem] tracking-wide text-muted-foreground uppercase">
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
          <div className="flex items-baseline gap-3 px-3 py-2.5">
            <span className="w-16 shrink-0 font-mono text-[0.65rem] tracking-wide text-muted-foreground uppercase">
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

      <div className="flex h-11 items-start gap-2 border-t border-line px-4 py-2.5">
        <span className="shrink-0 font-mono text-sm/snug text-muted-foreground">
          ›
        </span>
        <div className="relative h-full flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={line}
              className="absolute inset-0 truncate font-mono text-xs/snug text-muted-foreground"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.25 }}
            >
              {LOG[line]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      <dl className="grid grid-cols-4 gap-4 border-t border-line px-4 py-2.5">
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
