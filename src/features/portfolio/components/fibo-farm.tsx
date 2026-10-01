"use client"

import { Fragment, useEffect, useRef, useState } from "react"
import { PauseIcon, PlayIcon } from "lucide-react"
import { useInView } from "motion/react"

import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/base/ui/button"

import { PixelRabbitSprite } from "./fibo-hero/pixel-rabbit"

type Pair = {
  id: number
  age: number
  /** The pair in the month above this one comes from: itself, or the parent
   * of a newborn. */
  from?: number
  /** When a newborn starts building itself up. */
  delay?: number
}

const LAST_MONTH = 8
const PHI = (1 + Math.sqrt(5)) / 2
// Long enough for a month's newborns to finish building themselves up.
const MONTH_MS = 1600
const HOLD_MS = 4000

// A month per row, centred right of a gutter for the row's count. Grown
// pairs draw at two units per art pixel, newborns at one.
const GUTTER = 40
const SLOT = { grown: 44, newborn: 26 }
const ROW = 54
const WIDTH = GUTTER + 13 * SLOT.grown + 8 * SLOT.newborn + 24
const HEIGHT = LAST_MONTH * ROW + 2
const ART = 20

// Fibonacci's rules: a pair needs a month to grow up, then has a new pair
// every month, and nobody dies. Each newborn sits right after its parent, so
// the lines down the tree barely cross.
function buildMonths() {
  const months: Pair[][] = [[{ id: 0, age: 0 }]]
  let nextId = 1
  for (let m = 1; m < LAST_MONTH; m++) {
    const row: Pair[] = []
    let born = 0
    for (const pair of months[m - 1]) {
      row.push({ id: pair.id, age: pair.age + 1, from: pair.id })
      if (pair.age >= 1) {
        row.push({ id: nextId++, age: 0, from: pair.id, delay: born++ * 120 })
      }
    }
    months.push(row)
  }
  return months
}

const MONTHS = buildMonths()

const isGrown = (pair: Pair) => pair.age >= 1

// Where each pair stands in its month's row: x under its feet, and the row's
// baseline.
const LAYOUT = MONTHS.map((row, m) => {
  const width = row.reduce(
    (sum, pair) => sum + (isGrown(pair) ? SLOT.grown : SLOT.newborn),
    0
  )
  let x = GUTTER + (WIDTH - GUTTER - width) / 2
  const y = (m + 1) * ROW - 8
  const at = new Map<number, number>()
  for (const pair of row) {
    const slot = isGrown(pair) ? SLOT.grown : SLOT.newborn
    at.set(pair.id, x + slot / 2)
    x += slot
  }
  return { y, at }
})

/**
 * Fibonacci's rabbit puzzle as a family tree, a month a row, growing down
 * while it's on screen and then starting over. Lines join each pair to
 * itself a month earlier, and each newborn to its parent. With reduced
 * motion the whole tree shows at once.
 */
export function FiboFarm() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.3 })
  // Matches the server on the first render, then switches, so hydration
  // doesn't trip over the month.
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)")
  const [playing, setPlaying] = useState(true)
  const [step, setStep] = useState(1)

  const month = reduced ? LAST_MONTH : step
  const count = MONTHS[month - 1].length
  const previous = month > 1 ? MONTHS[month - 2].length : null

  useEffect(() => {
    if (reduced || !playing || !inView) return
    const id = window.setTimeout(
      () => setStep(step === LAST_MONTH ? 1 : step + 1),
      step === LAST_MONTH ? HOLD_MS : MONTH_MS
    )
    return () => window.clearTimeout(id)
  }, [reduced, playing, inView, step])

  return (
    <div
      ref={ref}
      className="not-prose flex flex-col overflow-hidden rounded-xl border border-line bg-card"
    >
      <p className="sr-only">
        An animation of Fibonacci&apos;s rabbit puzzle as a family tree, one row
        per month. Over eight months the pairs go{" "}
        {MONTHS.map((row) => row.length).join(", ")}.
      </p>

      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="block w-full px-2 pt-2 text-foreground"
        aria-hidden
      >
        {MONTHS.slice(0, month).map((row, m) => {
          const { y, at } = LAYOUT[m]
          const above = m > 0 ? LAYOUT[m - 1] : null
          return (
            <Fragment key={m}>
              <text
                x={8}
                y={y - 6}
                className="fill-muted-foreground font-mono"
                fontSize={16}
              >
                {row.length}
              </text>
              {above
                ? row.map((pair) => (
                    <line
                      key={`line-${pair.id}`}
                      x1={above.at.get(pair.from!)}
                      y1={above.y + 3}
                      x2={at.get(pair.id)}
                      y2={y - (isGrown(pair) ? 2 : 1) * ART - 3}
                      className="stroke-line"
                      vectorEffect="non-scaling-stroke"
                    />
                  ))
                : null}
              {row.map((pair) => (
                <PixelRabbitSprite
                  key={pair.id}
                  pixel={isGrown(pair) ? 2 : 1}
                  assembleDelay={reduced ? undefined : pair.delay}
                  transform={`translate(${at.get(pair.id)} ${y})`}
                />
              ))}
            </Fragment>
          )
        })}
      </svg>

      <div className="flex items-center justify-between gap-2 border-t border-line py-2 pr-2 pl-4">
        <p className="m-0 font-mono text-xs text-muted-foreground" aria-hidden>
          {previous === null
            ? "Month 1: one newborn pair."
            : `Month ${month}: ${count} ÷ ${previous} = ${(count / previous).toFixed(3)}, φ = ${PHI.toFixed(3)}`}
        </p>
        {reduced ? null : (
          <Button
            size="icon-sm"
            variant="ghost"
            className="shrink-0"
            aria-label={playing ? "Pause the animation" : "Play the animation"}
            onClick={() => setPlaying(!playing)}
          >
            {playing ? <PauseIcon /> : <PlayIcon />}
          </Button>
        )}
      </div>
    </div>
  )
}
