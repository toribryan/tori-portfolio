"use client"

import { PinIcon } from "lucide-react"
import { motion } from "motion/react"

import { cn } from "@/lib/utils"

export type PinnedStep = {
  title: string
}

/**
 * Where each of six cards sits on a 1000 by 440 sheet, as percentages, and
 * the dashed route between them: across the top row, down the right edge,
 * back along the bottom. Fixed rather than computed so the path lands on
 * the card edges.
 */
const SLOTS = [
  { left: 4, top: 8, rotate: 2 },
  { left: 37, top: 10, rotate: -2 },
  { left: 70, top: 8, rotate: 2 },
  { left: 70, top: 57, rotate: -2 },
  { left: 37, top: 59, rotate: 2 },
  { left: 4, top: 57, rotate: -2 },
]

const ROUTE = [
  "M 300 80 C 336 64, 334 104, 370 88",
  "M 630 80 C 666 64, 664 104, 700 88",
  "M 830 150 C 830 190, 830 220, 830 250",
  "M 700 322 C 664 338, 666 298, 630 312",
  "M 370 322 C 334 338, 336 298, 300 312",
].join(" ")

type Slot = { left: number; top: number; rotate: number; width: number }

/** Sheet margin and gutter between cards in a row, as percentages. */
const ROW_MARGIN = 4
const ROW_GAP = 3

/**
 * Up to four steps sit in one row across the sheet's middle, joined left to
 * right; more take the six-slot loop. Returns each card's slot and the
 * route between them on the 1000 by 440 sheet.
 */
function layout(count: number): { slots: Slot[]; route: string } {
  if (count > 4) {
    return {
      slots: SLOTS.map((slot) => ({ ...slot, width: 26 })),
      route: ROUTE,
    }
  }
  const width = (100 - ROW_MARGIN * 2 - ROW_GAP * (count - 1)) / count
  const slots = Array.from({ length: count }, (_, i) => ({
    left: ROW_MARGIN + i * (width + ROW_GAP),
    top: 50,
    rotate: i % 2 === 0 ? 1.5 : -1.5,
    width,
  }))
  const route = slots
    .slice(0, -1)
    .map((slot) => {
      const from = (slot.left + width) * 10
      const to = from + ROW_GAP * 10
      return `M ${from} 212 C ${from + 12} 200, ${to - 12} 232, ${to} 220`
    })
    .join(" ")
  return { slots, route }
}

/**
 * A process as it was handed over: index cards pinned to a ruled sheet,
 * joined by a dashed route that keeps marching. Six steps fill the sheet;
 * fewer leave the later slots empty. Below `md` the cards stack; above it
 * the sheet grows to whatever height its parent gives it. A `label` names
 * the journey in the sheet's corner.
 */
export function PinnedFlow({
  steps,
  label,
  className,
}: {
  steps: PinnedStep[]
  label?: string
  className?: string
}) {
  const { slots, route } = layout(Math.min(steps.length, SLOTS.length))
  const row = steps.length <= 4

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-line bg-surface-warm/60 md:flex md:flex-col",
        className
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage: "linear-gradient(var(--line) 1px, transparent 1px)",
          backgroundSize: "100% 28px",
          backgroundPosition: "0 10px",
        }}
        aria-hidden
      />

      {label && (
        <p className="relative px-4 pt-3 text-xs tracking-wide text-muted-foreground uppercase md:absolute md:top-3 md:left-4 md:z-10 md:p-0">
          {label}
        </p>
      )}

      <div
        className={cn(
          "relative md:flex-1",
          row ? "md:min-h-60" : "md:min-h-88"
        )}
      >
        <svg
          className="pointer-events-none absolute inset-0 hidden size-full md:block"
          viewBox="0 0 1000 440"
          preserveAspectRatio="none"
          aria-hidden
        >
          <motion.path
            d={route}
            className="text-muted-foreground/60"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="6 6"
            strokeLinecap="round"
            fill="none"
            vectorEffect="non-scaling-stroke"
            initial={{ strokeDashoffset: 0 }}
            animate={{ strokeDashoffset: -120 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />
        </svg>

        <ol className="flex flex-col gap-4 p-4 md:contents">
          {steps.slice(0, SLOTS.length).map((step, i) => {
            const slot = slots[i]
            return (
              <motion.li
                key={step.title}
                className={cn(
                  "md:absolute md:w-(--slot-width)",
                  row && "md:-translate-y-1/2"
                )}
                style={
                  {
                    "--slot-width": `${slot.width}%`,
                    left: `${slot.left}%`,
                    top: `${slot.top}%`,
                    rotate: `${slot.rotate}deg`,
                  } as React.CSSProperties
                }
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.1, duration: 0.45 }}
              >
                <div className="rounded-xl border border-border bg-background p-1.5 shadow-md">
                  <PinIcon
                    className="mx-auto -mt-4 mb-1 size-5 -rotate-45 text-foreground"
                    aria-hidden
                  />
                  <div className="flex flex-col gap-1.5 rounded-lg bg-surface-warm p-4 inset-ring-1 inset-ring-border/64">
                    <span className="font-handwritten text-2xl/none text-muted-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="text-sm/snug font-medium text-pretty">
                      {step.title}
                    </p>
                  </div>
                </div>
              </motion.li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}
