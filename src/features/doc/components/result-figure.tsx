"use client"

import { useRef } from "react"
import { useInView, useReducedMotion } from "motion/react"

import { CountingNumber } from "@/components/ui/counting-number"

/** Splits "1,160", "94%" or "60 days" into the number and what surrounds it. */
const FIGURE = /^(\D*)(\d[\d,]*)(\D*)$/

const COUNT = {
  duration: 1.6,
  ease: [0.22, 1, 0.36, 1],
  type: "tween",
} as const

/**
 * A results value that counts up from zero the first time it scrolls into
 * view. Values that aren't a single whole number, such as "1.5 days" or a
 * phrase, render as written.
 */
export function ResultFigure({ value }: { value: string }) {
  const frame = useRef<HTMLSpanElement>(null)
  const inView = useInView(frame, { once: true, amount: 0.6 })
  const reduceMotion = useReducedMotion()
  const match = value.match(FIGURE)

  if (!match || reduceMotion) return <>{value}</>

  const [, prefix, number, suffix] = match
  const target = Number(number.replaceAll(",", ""))

  return (
    <span ref={frame} aria-label={value}>
      <span aria-hidden>
        {prefix}
        {inView ? (
          <CountingNumber target={target} transition={COUNT} />
        ) : (
          <span className="tabular-nums">0</span>
        )}
        {suffix}
      </span>
    </span>
  )
}
