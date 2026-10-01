"use client"

import { Fragment, useEffect, useRef, useState } from "react"
import { PauseIcon, PlayIcon } from "lucide-react"
import { useInView } from "motion/react"

import { useMediaQuery } from "@/hooks/use-media-query"
import { SpecialText } from "@/components/ui/special-text"
import { Button } from "@/components/base/ui/button"

import { ASSEMBLE_MS, PixelRabbitSprite } from "./fibo-hero/pixel-rabbit"

type Pair = {
  id: number
  age: number
  /** The pair in the month above this one comes from: itself, or the parent
   * of a newborn. */
  from?: number
}

const LAST_MONTH = 8
const PHI = (1 + Math.sqrt(5)) / 2
// Long enough for the widest row to build itself up and power up.
const MONTH_MS = 2200
// A row's rabbits build up left to right, the whole row within this.
const ROW_STAGGER_MS = 600
// Mario's power-up: once its row has built, a pair that just grew up flickers
// between its old and new size, in step with the rest of the row, then stays
// big.
const POWER_UP = [2, 1, 2, 1, 2, 1, 2] as const
const POWER_UP_FRAME_MS = 70
const POWER_UP_AFTER_MS = ROW_STAGGER_MS + ASSEMBLE_MS + 120
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
    for (const pair of months[m - 1]) {
      row.push({ id: pair.id, age: pair.age + 1, from: pair.id })
      if (pair.age >= 1) {
        row.push({ id: nextId++, age: 0, from: pair.id })
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

/** A pair that just grew up: it builds in at newborn size, then powers up. */
function PowerUpRabbit({
  assembleDelay,
  transform,
}: {
  assembleDelay: number
  transform: string
}) {
  const [frame, setFrame] = useState(-1)

  useEffect(() => {
    const ids = POWER_UP.map((_, i) =>
      window.setTimeout(
        () => setFrame(i),
        POWER_UP_AFTER_MS + i * POWER_UP_FRAME_MS
      )
    )
    return () => ids.forEach((id) => window.clearTimeout(id))
  }, [])

  return (
    <PixelRabbitSprite
      pixel={frame < 0 ? 1 : POWER_UP[frame]}
      assembleDelay={assembleDelay}
      transform={transform}
    />
  )
}

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
  // Bumped on each loop, so every row mounts and builds up afresh.
  const [cycle, setCycle] = useState(0)

  const month = reduced ? LAST_MONTH : step
  const count = MONTHS[month - 1].length
  const previous = month > 1 ? MONTHS[month - 2].length : null

  useEffect(() => {
    if (reduced || !playing || !inView) return
    const id = window.setTimeout(
      () => {
        if (step < LAST_MONTH) return setStep(step + 1)
        setStep(1)
        setCycle(cycle + 1)
      },
      step === LAST_MONTH ? HOLD_MS : MONTH_MS
    )
    return () => window.clearTimeout(id)
  }, [reduced, playing, inView, step, cycle])

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

      <div className="relative px-2 pt-2">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="block w-full text-foreground"
          aria-hidden
        >
          {MONTHS.slice(0, month).map((row, m) => {
            const { y, at } = LAYOUT[m]
            const above = m > 0 ? LAYOUT[m - 1] : null
            const stagger = Math.min(80, ROW_STAGGER_MS / row.length)
            return (
              <Fragment key={`${cycle}-${m}`}>
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
                {row.map((pair, i) =>
                  pair.age === 1 && !reduced ? (
                    <PowerUpRabbit
                      key={pair.id}
                      assembleDelay={i * stagger}
                      transform={`translate(${at.get(pair.id)} ${y})`}
                    />
                  ) : (
                    <PixelRabbitSprite
                      key={pair.id}
                      pixel={isGrown(pair) ? 2 : 1}
                      assembleDelay={reduced ? undefined : i * stagger}
                      transform={`translate(${at.get(pair.id)} ${y})`}
                    />
                  )
                )}
              </Fragment>
            )
          })}
        </svg>

        {/* The counts are HTML over the tree so they stay legible when it
          scales down. They mount once the farm is in view, never on the
          server, so the scramble can't trip hydration. */}
        <div
          className="pointer-events-none absolute inset-x-2 top-2 bottom-0"
          aria-hidden
        >
          {inView || reduced
            ? MONTHS.slice(0, month).map((row, m) => (
                <span
                  key={`${cycle}-${m}`}
                  className="absolute -translate-y-full font-mono text-xs text-muted-foreground sm:text-sm"
                  style={{
                    left: `${(8 / WIDTH) * 100}%`,
                    top: `${((LAYOUT[m].y - 4) / HEIGHT) * 100}%`,
                  }}
                >
                  {reduced ? (
                    row.length
                  ) : (
                    <SpecialText speed={60}>{String(row.length)}</SpecialText>
                  )}
                </span>
              ))
            : null}
        </div>
      </div>

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
