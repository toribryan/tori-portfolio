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

const NODE_H = 44
const ROW_Y = 88

/** The stages, left to right, in a 780 by 172 drawing. */
const STAGES = [
  { x: 12, w: 96, label: "Research", name: "Pattern teardown", meta: "Mobbin" },
  { x: 140, w: 96, label: "Design", name: "Figma", meta: "tokens 1:1" },
  {
    x: 268,
    w: 118,
    label: "Build",
    name: "Storybook",
    meta: "every state",
    focus: true,
  },
  {
    x: 418,
    w: 96,
    label: "Review",
    name: "Pull request",
    meta: "typed, tested",
  },
  { x: 546, w: 96, label: "Preview", name: "Vercel", meta: "on a real phone" },
]

const OUTPUTS = [
  { y: 50, name: "Marketplace" },
  { y: 108, name: "Agent platform" },
]

const OUT_X = 668
const OUT_W = 100

function link(from: (typeof STAGES)[number], to: (typeof STAGES)[number]) {
  return `M${from.x + from.w},${ROW_Y} L${to.x},${ROW_Y}`
}

const PATHS = [
  link(STAGES[0], STAGES[1]),
  link(STAGES[1], STAGES[2]),
  link(STAGES[2], STAGES[3]),
  link(STAGES[3], STAGES[4]),
  ...OUTPUTS.map(
    (out) =>
      `M${STAGES[4].x + STAGES[4].w},${ROW_Y} C${OUT_X - 18},${ROW_Y} ${OUT_X - 18},${out.y + 15} ${OUT_X},${out.y + 15}`
  ),
]

function Dot({
  path,
  duration,
  delay,
  size,
  opacity,
}: {
  path: string
  duration: number
  delay: number
  size: number
  opacity: number
}) {
  return (
    <circle r={size} className="fill-info" opacity={opacity}>
      <animateMotion
        dur={`${duration}s`}
        repeatCount="indefinite"
        begin={`${delay}s`}
        path={path}
      />
    </circle>
  )
}

function Pulse({ cx, cy, delay }: { cx: number; cy: number; delay: number }) {
  return (
    <motion.circle
      cx={cx}
      cy={cy}
      r={2.6}
      className="fill-info"
      animate={{ opacity: [0.15, 1, 0.15] }}
      transition={{ duration: 1.2, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  )
}

/**
 * How a screen gets from a teardown to two products, as a live pipeline:
 * stages on a rail, work flowing along it, a log line ticking underneath.
 * Storybook is the lit node because it is where the two-product test runs.
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

      <svg viewBox="0 0 780 172" className="block w-full" aria-hidden>
        <defs>
          <marker
            id="pipeline-arrow"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto"
          >
            <path
              d="M2 1.5L7.5 5L2 8.5"
              fill="none"
              className="stroke-info/50"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </marker>
        </defs>

        {PATHS.map((d, i) => (
          <path
            key={d}
            d={d}
            fill="none"
            className={i < 4 ? "stroke-info/25" : "stroke-info/15"}
            strokeWidth="1.5"
            strokeDasharray="3 5"
            markerEnd={i < 4 ? "url(#pipeline-arrow)" : undefined}
          />
        ))}

        {PATHS.map((d, i) => (
          <g key={d}>
            <Dot
              path={d}
              duration={1 + i * 0.08}
              delay={i * 0.18}
              size={2.4}
              opacity={1}
            />
            <Dot
              path={d}
              duration={1 + i * 0.08}
              delay={i * 0.18 + 0.4}
              size={1.6}
              opacity={0.55}
            />
          </g>
        ))}

        {STAGES.map((stage) => {
          const cx = stage.x + stage.w / 2
          const top = stage.focus ? ROW_Y - 35 : ROW_Y - NODE_H / 2
          const h = stage.focus ? 70 : NODE_H
          return (
            <g key={stage.name}>
              <rect
                x={stage.x}
                y={top}
                width={stage.w}
                height={h}
                rx={stage.focus ? 10 : 8}
                className={
                  stage.focus
                    ? "fill-info/8 stroke-info"
                    : "fill-surface stroke-border"
                }
                strokeWidth={stage.focus ? 1 : 0.75}
              />
              <text
                x={cx}
                y={top + 17}
                textAnchor="middle"
                fontSize="8.5"
                letterSpacing=".08em"
                className={cn(
                  "font-mono uppercase",
                  stage.focus ? "fill-info" : "fill-muted-foreground"
                )}
              >
                {stage.label}
              </text>
              <text
                x={cx}
                y={top + (stage.focus ? 40 : 34)}
                textAnchor="middle"
                fontSize={stage.focus ? 13 : 12}
                fontWeight="500"
                className="fill-foreground font-sans"
              >
                {stage.name}
              </text>
              {stage.focus ? (
                <>
                  <Pulse cx={cx - 12} cy={top + 56} delay={0} />
                  <Pulse cx={cx} cy={top + 56} delay={0.4} />
                  <Pulse cx={cx + 12} cy={top + 56} delay={0.8} />
                </>
              ) : null}
              <text
                x={cx}
                y={top + h + 15}
                textAnchor="middle"
                fontSize="8.5"
                className="fill-muted-foreground/70 font-mono"
              >
                {stage.meta}
              </text>
            </g>
          )
        })}

        {OUTPUTS.map((out) => (
          <g key={out.name}>
            <rect
              x={OUT_X}
              y={out.y}
              width={OUT_W}
              height={30}
              rx={7}
              className="fill-surface stroke-border"
              strokeWidth="0.75"
            />
            <text
              x={OUT_X + 10}
              y={out.y + 19}
              fontSize="10"
              className="fill-foreground font-sans"
            >
              {out.name}
            </text>
            <circle
              cx={OUT_X + OUT_W - 10}
              cy={out.y + 15}
              r={2.5}
              className="fill-success"
            />
          </g>
        ))}
      </svg>

      <div className="flex h-11 items-start gap-2 border-t border-line px-4 py-2.5">
        <span className="shrink-0 font-mono text-sm/snug text-info/70">›</span>
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

      <dl className="flex items-center gap-6 border-t border-line px-4 py-2.5">
        {[
          ["Products", "2"],
          ["Base type", "18px"],
          ["Targets", "48×48"],
          ["Floor", "AA"],
        ].map(([label, value]) => (
          <div key={label}>
            <dt className="font-mono text-[0.6rem] tracking-wide text-muted-foreground uppercase">
              {label}
            </dt>
            <dd className="font-mono text-base tabular-nums">{value}</dd>
          </div>
        ))}
        <div className="ml-auto text-right">
          <dt className="font-mono text-[0.6rem] tracking-wide text-muted-foreground uppercase">
            Stack
          </dt>
          <dd className="font-mono text-xs text-info">
            Next.js · Tailwind · Base UI
          </dd>
        </div>
      </dl>
    </div>
  )
}
