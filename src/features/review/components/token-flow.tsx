"use client"

import { useId } from "react"
import { motion } from "motion/react"

import { cn } from "@/lib/utils"
import { Chip } from "@/components/ui/chip"

export type TokenRow = {
  /** The raw value, as written in CSS. */
  base: string
  /** The primitive it is named as, e.g. a palette step. */
  primitive: string
  /** The semantic role that points at the primitive. */
  semantic: string
  /** What the role is for, shown under the semantic chip. */
  use: string
}

const W = 900
const ROW_H = 52
const PAD = 50
const COLS = [0.16, 0.5, 0.84]

function Wire({ d, id, delay }: { d: string; id: string; delay: number }) {
  return (
    <>
      <path d={d} className="text-border" stroke="currentColor" fill="none" />
      <motion.path
        d={d}
        stroke={`url(#${id})`}
        strokeWidth="2"
        fill="none"
        strokeDasharray="40 160"
        initial={{ strokeDashoffset: 200 }}
        animate={{ strokeDashoffset: -200 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear", delay }}
      />
      <defs>
        <linearGradient id={id} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="50%" stopColor="var(--foreground)" stopOpacity="0.6" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>
    </>
  )
}

/**
 * How a colour travels through the token tiers: a raw value, the primitive
 * that names it, and the semantic role that uses it. One row per colour,
 * wired left to right on the same dotted plate as the suite diagram.
 */
export function TokenFlow({
  rows,
  className,
}: {
  rows: TokenRow[]
  className?: string
}) {
  const id = useId()
  const H = PAD * 2 + ROW_H * (rows.length - 1)
  const y = (i: number) => PAD + i * ROW_H

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-line bg-muted/60",
        className
      )}
      style={{ aspectRatio: `${W} / ${H}` }}
    >
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle, var(--foreground) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
        aria-hidden
      />

      <svg
        className="pointer-events-none absolute inset-0 size-full"
        viewBox={`0 0 ${W} ${H}`}
        fill="none"
        aria-hidden
      >
        {rows.map((row, i) => (
          <Wire
            key={row.semantic}
            id={`${id}-${i}`}
            delay={i * 0.5}
            d={`M ${COLS[0] * W} ${y(i)} H ${COLS[2] * W}`}
          />
        ))}
      </svg>

      <div className="absolute inset-x-0 top-3 grid grid-cols-3 px-2 text-center">
        {["Base", "Primitive", "Semantic"].map((tier) => (
          <p
            key={tier}
            className="font-mono text-[10px] tracking-wide text-muted-foreground uppercase"
          >
            {tier}
          </p>
        ))}
      </div>

      {rows.map((row, i) => {
        const top = `${(y(i) / H) * 100}%`
        const swatch = (
          <span
            className="ml-1 size-2.5 shrink-0 rounded-full ring-1 ring-border/64"
            style={{ background: row.base }}
            aria-hidden
          />
        )
        return (
          <motion.div
            key={row.semantic}
            className="contents"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 + i * 0.12 }}
          >
            <Chip
              size="sm"
              variant="tertiary"
              startContent={swatch}
              className="absolute -translate-x-1/2 -translate-y-1/2 bg-background font-mono"
              style={{ left: `${COLS[0] * 100}%`, top }}
            >
              {row.base}
            </Chip>
            <Chip
              size="sm"
              variant="tertiary"
              startContent={swatch}
              className="absolute -translate-x-1/2 -translate-y-1/2 bg-background font-mono"
              style={{ left: `${COLS[1] * 100}%`, top }}
            >
              {row.primitive}
            </Chip>
            <span
              className="absolute flex -translate-x-1/2 -translate-y-[40%] flex-col items-center gap-0.5"
              style={{ left: `${COLS[2] * 100}%`, top }}
            >
              <Chip
                size="sm"
                variant="dot"
                startContent={swatch}
                className="font-mono"
              >
                {row.semantic}
              </Chip>
              <span className="font-mono text-[9px] whitespace-nowrap text-muted-foreground">
                {row.use}
              </span>
            </span>
          </motion.div>
        )
      })}
    </div>
  )
}
