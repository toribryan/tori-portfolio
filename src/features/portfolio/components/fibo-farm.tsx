"use client"

import { Fragment, useEffect, useRef, useState } from "react"
import { PauseIcon, PlayIcon } from "lucide-react"
import { useInView } from "motion/react"

import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/base/ui/button"

import { PixelRabbitSprite } from "./fibo-hero/pixel-rabbit"

type Pair = { id: number; age: number }

const LAST_MONTH = 8
const MONTH_MS = 1400
const HOLD_MS = 3500
// A row's rabbits start building within this, left to right.
const STAGGER_MS = 300

// A month per row, centred right of a gutter for the row's count. Grown
// pairs draw at two units per art pixel, newborns at one.
const GUTTER = 40
const SLOT = { grown: 44, newborn: 26 }
const ROW = 54
const WIDTH = GUTTER + 13 * SLOT.grown + 8 * SLOT.newborn + 24
const HEIGHT = LAST_MONTH * ROW + 2

// Fibonacci's rules: a pair needs a month to grow up, then has a new pair
// every month, and nobody dies. Each newborn sits right after its parent.
function buildMonths() {
  const months: Pair[][] = [[{ id: 0, age: 0 }]]
  let nextId = 1
  for (let m = 1; m < LAST_MONTH; m++) {
    const row: Pair[] = []
    for (const pair of months[m - 1]) {
      row.push({ id: pair.id, age: pair.age + 1 })
      if (pair.age >= 1) row.push({ id: nextId++, age: 0 })
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
  const at = new Map<number, number>()
  for (const pair of row) {
    const slot = isGrown(pair) ? SLOT.grown : SLOT.newborn
    at.set(pair.id, x + slot / 2)
    x += slot
  }
  return { y: (m + 1) * ROW - 8, at }
})

/**
 * Fibonacci's rabbit puzzle, a month a row. It starts the first time it
 * scrolls into view, adds a row per month, holds on the last and starts
 * over. With reduced motion the whole tree shows at once.
 */
export function FiboFarm() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.3 })
  // Matches the server on the first render, then switches, so hydration
  // doesn't trip over the month.
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)")
  const [started, setStarted] = useState(false)
  const [playing, setPlaying] = useState(true)
  const [step, setStep] = useState(1)
  // Bumped on each loop, so every row mounts and builds up afresh.
  const [cycle, setCycle] = useState(0)

  if (inView && !started) setStarted(true)

  const month = reduced ? LAST_MONTH : step
  const rows = started || reduced ? MONTHS.slice(0, month) : []

  useEffect(() => {
    if (reduced || !started || !playing || !inView) return
    const id = window.setTimeout(
      () => {
        if (step < LAST_MONTH) return setStep(step + 1)
        setStep(1)
        setCycle(cycle + 1)
      },
      step === LAST_MONTH ? HOLD_MS : MONTH_MS
    )
    return () => window.clearTimeout(id)
  }, [reduced, started, playing, inView, step, cycle])

  return (
    <div
      ref={ref}
      className="not-prose relative overflow-hidden rounded-xl border border-line bg-card p-2"
    >
      <p className="sr-only">
        An animation of Fibonacci&apos;s rabbit puzzle, one row per month. Over
        eight months the pairs go {MONTHS.map((row) => row.length).join(", ")}.
      </p>

      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="block w-full text-foreground"
        aria-hidden
      >
        {rows.map((row, m) => {
          const { y, at } = LAYOUT[m]
          const stagger = row.length > 1 ? STAGGER_MS / (row.length - 1) : 0
          return (
            <Fragment key={`${cycle}-${m}`}>
              <text
                x={8}
                y={y - 6}
                className="fill-muted-foreground font-mono"
                fontSize={16}
              >
                {row.length}
              </text>
              {row.map((pair, i) => (
                <PixelRabbitSprite
                  key={pair.id}
                  pixel={isGrown(pair) ? 2 : 1}
                  assembleDelay={reduced ? undefined : i * stagger}
                  transform={`translate(${at.get(pair.id)} ${y})`}
                />
              ))}
            </Fragment>
          )
        })}
      </svg>

      {reduced ? null : (
        <Button
          size="icon-sm"
          variant="ghost"
          className="absolute top-2 right-2"
          aria-label={playing ? "Pause the animation" : "Play the animation"}
          onClick={() => setPlaying(!playing)}
        >
          {playing ? <PauseIcon /> : <PlayIcon />}
        </Button>
      )}
    </div>
  )
}
