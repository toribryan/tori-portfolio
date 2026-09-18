"use client"

import { motion } from "motion/react"

import { cn } from "@/lib/utils"
import { Chip as BaseChip } from "@/components/ui/chip"

function Chip(props: React.ComponentProps<typeof BaseChip>) {
  return (
    <BaseChip
      size="sm"
      variant="tertiary"
      {...props}
      className={cn("bg-white dark:bg-card", props.className)}
    />
  )
}

export type TokenRow = {
  /** The raw value, as written in CSS. */
  base: string
  /** The primitive it is named as, e.g. a palette step. */
  primitive: string
  /** The semantic role that points at the primitive. */
  semantic: string
  /** What the role is for, shown under the semantic chip when `showUse` is set. */
  use?: string
}

/**
 * A hairline with a pulse travelling along it. Fills whatever cell it is
 * in; `vertical` runs it top to bottom for the stacked layout.
 */
function Wire({
  delay,
  vertical = false,
  className,
}: {
  delay: number
  vertical?: boolean
  className?: string
}) {
  const end = vertical ? { x2: 4, y2: 100 } : { x2: 100, y2: 4 }
  const start = vertical ? { x1: 4, y1: 0 } : { x1: 0, y1: 4 }
  return (
    <svg
      className={cn(vertical ? "h-6 w-2" : "h-2 w-full", className)}
      viewBox={vertical ? "0 0 8 100" : "0 0 100 8"}
      preserveAspectRatio="none"
      aria-hidden
    >
      <line
        {...start}
        {...end}
        className="text-border"
        stroke="currentColor"
        vectorEffect="non-scaling-stroke"
      />
      <motion.line
        {...start}
        {...end}
        className="text-foreground/60"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        pathLength={1}
        strokeDasharray="0.25 1"
        initial={{ strokeDashoffset: 1.25 }}
        animate={{ strokeDashoffset: -1.25 }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "linear", delay }}
      />
    </svg>
  )
}

function Swatch({ color }: { color: string }) {
  return (
    <span
      className="ml-1 size-2.5 shrink-0 rounded-full ring-1 ring-border/60"
      style={{ background: color }}
      aria-hidden
    />
  )
}

/**
 * How a colour travels through the token tiers: a raw value, the primitive
 * that names it, and the semantic role that uses it. One row per colour,
 * wired left to right across a dotted plate, with a pulse travelling along
 * each wire.
 */
export function TokenFlow({
  rows,
  showUse = false,
  className,
}: {
  rows: TokenRow[]
  /** Print each row's `use` under its semantic chip. */
  showUse?: boolean
  className?: string
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-border/60 bg-muted/60 px-6 py-4",
        className
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle, var(--foreground) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
        aria-hidden
      />

      <div className="relative grid grid-cols-1 items-center gap-y-6 sm:grid-cols-[auto_minmax(2rem,1fr)_auto_minmax(2rem,1fr)_auto] sm:gap-x-3 sm:gap-y-3">
        {["Base", "", "Primitive", "", "Semantic"].map((tier, i) => (
          <p
            key={i}
            className="hidden text-center font-mono text-[10px] tracking-wide text-muted-foreground uppercase sm:block"
          >
            {tier}
          </p>
        ))}

        {rows.map((row, i) => (
          <div
            key={row.semantic}
            className="flex flex-col items-center gap-1.5 sm:col-span-5 sm:grid sm:grid-cols-subgrid sm:gap-0"
          >
            <Chip
              startContent={<Swatch color={row.base} />}
              className="justify-self-center font-mono"
            >
              {row.base}
            </Chip>
            <Wire delay={i * 0.5} className="max-sm:hidden" />
            <Wire delay={i * 0.5} vertical className="sm:hidden" />
            <Chip
              startContent={<Swatch color={row.base} />}
              className="justify-self-center font-mono"
            >
              {row.primitive}
            </Chip>
            <Wire delay={i * 0.5 + 0.8} className="max-sm:hidden" />
            <Wire delay={i * 0.5 + 0.8} vertical className="sm:hidden" />
            <div className="flex flex-col items-center gap-1 justify-self-center">
              <Chip
                startContent={<Swatch color={row.base} />}
                className="font-mono"
              >
                {row.semantic}
              </Chip>
              {showUse && row.use && (
                <span className="font-mono text-[9px] whitespace-nowrap text-muted-foreground">
                  {row.use}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
