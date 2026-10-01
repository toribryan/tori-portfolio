"use client"

import { Fragment, useEffect, useRef, useState } from "react"
import { PauseIcon, PlayIcon } from "lucide-react"
import { motion, useInView } from "motion/react"

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

// A month plays in order: the pairs from last month arrive down their lines,
// last month's newborns power up, the grown pairs have this month's babies,
// and then the row is counted. Phases with nobody in them are skipped.
const LINE_MS = 200
// A phase's rabbits start building within this, left to right.
const STAGGER_MS = 250
const GAP_MS = 120
// Mario's power-up: the pair flickers between its old and new size, the
// whole row in step, then stays big.
const POWER_UP = [2, 1, 2, 1, 2, 1, 2] as const
const POWER_UP_FRAME_MS = 60
// Roughly how long the count takes to scramble in.
const COUNT_MS = 500
const PAUSE_MS = 400
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

type Timeline = {
  /** When each pair's line starts drawing and when it starts building. */
  line: Map<number, number>
  build: Map<number, number>
  /** When last month's newborns power up, if any. */
  powerUp: number | null
  /** When the row is counted. */
  count: number
  /** When the row has finished, count included. */
  done: number
}

// Milliseconds from the moment a row mounts.
const TIMELINES: Timeline[] = MONTHS.map((row, m) => {
  const line = new Map<number, number>()
  const build = new Map<number, number>()
  let t = 0

  // Lines first, then the pairs at their ends, a little after the lines start.
  const arrive = (pairs: Pair[]) => {
    if (pairs.length === 0) return
    const lead = m > 0 ? LINE_MS / 2 : 0
    const stagger = pairs.length > 1 ? STAGGER_MS / (pairs.length - 1) : 0
    pairs.forEach((pair, i) => {
      line.set(pair.id, t + i * stagger)
      build.set(pair.id, t + lead + i * stagger)
    })
    t += lead + (pairs.length - 1) * stagger + ASSEMBLE_MS + GAP_MS
  }

  arrive(row.filter(isGrown))
  let powerUp: number | null = null
  if (row.some((pair) => pair.age === 1)) {
    powerUp = t
    t += POWER_UP.length * POWER_UP_FRAME_MS + GAP_MS
  }
  arrive(row.filter((pair) => !isGrown(pair)))

  return { line, build, powerUp, count: t, done: t + COUNT_MS }
})

/** A pair that just grew up: it arrives at newborn size, then powers up. */
function PowerUpRabbit({
  assembleDelay,
  powerUp,
  transform,
}: {
  assembleDelay: number
  powerUp: number
  transform: string
}) {
  const [frame, setFrame] = useState(-1)

  useEffect(() => {
    const ids = POWER_UP.map((_, i) =>
      window.setTimeout(() => setFrame(i), powerUp + i * POWER_UP_FRAME_MS)
    )
    return () => ids.forEach((id) => window.clearTimeout(id))
  }, [powerUp])

  return (
    <PixelRabbitSprite
      pixel={frame < 0 ? 1 : POWER_UP[frame]}
      assembleDelay={assembleDelay}
      transform={transform}
    />
  )
}

/**
 * Fibonacci's rabbit puzzle as a family tree, a month a row. It starts the
 * first time it scrolls into view, plays each month in order, holds on the
 * last and starts over. Pausing lets the current month finish, then waits.
 * With reduced motion the whole tree shows at once.
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
  // The last month whose row has been counted, in this cycle.
  const [counted, setCounted] = useState(0)

  if (inView && !started) setStarted(true)

  const month = reduced ? LAST_MONTH : step
  const shownCount = reduced ? LAST_MONTH : counted
  const count = shownCount > 0 ? MONTHS[shownCount - 1].length : null
  const previous = shownCount > 1 ? MONTHS[shownCount - 2].length : null

  // Count the row once everyone in it has arrived.
  useEffect(() => {
    if (reduced || !started) return
    const id = window.setTimeout(
      () => setCounted(step),
      TIMELINES[step - 1].count
    )
    return () => window.clearTimeout(id)
  }, [reduced, started, step, cycle])

  // Move on only after the row is counted, so a pause never splits a month.
  useEffect(() => {
    if (reduced || !playing || !inView || counted !== step) return
    const rest = TIMELINES[step - 1].done - TIMELINES[step - 1].count
    const id = window.setTimeout(
      () => {
        if (step < LAST_MONTH) return setStep(step + 1)
        setStep(1)
        setCounted(0)
        setCycle(cycle + 1)
      },
      rest + (step === LAST_MONTH ? HOLD_MS : PAUSE_MS)
    )
    return () => window.clearTimeout(id)
  }, [reduced, playing, inView, counted, step, cycle])

  const rows = started || reduced ? MONTHS.slice(0, month) : []

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
          {rows.map((row, m) => {
            const { y, at } = LAYOUT[m]
            const above = m > 0 ? LAYOUT[m - 1] : null
            const timeline = TIMELINES[m]
            return (
              <Fragment key={`${cycle}-${m}`}>
                {above
                  ? row.map((pair) => (
                      <motion.line
                        key={`line-${pair.id}`}
                        x1={above.at.get(pair.from!)}
                        y1={above.y + 3}
                        x2={at.get(pair.id)}
                        y2={y - (isGrown(pair) ? 2 : 1) * ART - 3}
                        className="stroke-line"
                        vectorEffect="non-scaling-stroke"
                        initial={reduced ? false : { pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{
                          duration: LINE_MS / 1000,
                          delay: timeline.line.get(pair.id)! / 1000,
                          ease: "easeOut",
                        }}
                      />
                    ))
                  : null}
                {row.map((pair) =>
                  pair.age === 1 && timeline.powerUp !== null && !reduced ? (
                    <PowerUpRabbit
                      key={pair.id}
                      assembleDelay={timeline.build.get(pair.id)!}
                      powerUp={timeline.powerUp}
                      transform={`translate(${at.get(pair.id)} ${y})`}
                    />
                  ) : (
                    <PixelRabbitSprite
                      key={pair.id}
                      pixel={isGrown(pair) ? 2 : 1}
                      assembleDelay={
                        reduced ? undefined : timeline.build.get(pair.id)
                      }
                      transform={`translate(${at.get(pair.id)} ${y})`}
                    />
                  )
                )}
              </Fragment>
            )
          })}
        </svg>

        {/* The counts are HTML over the tree so they stay legible when it
          scales down. They mount only once the farm has started, never on
          the server, so the scramble can't trip hydration. */}
        <div
          className="pointer-events-none absolute inset-x-2 top-2 bottom-0"
          aria-hidden
        >
          {rows.slice(0, shownCount).map((row, m) => (
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
          ))}
        </div>
      </div>

      <div className="flex min-h-11 items-center justify-between gap-2 border-t border-line py-2 pr-2 pl-4">
        <p className="m-0 font-mono text-xs text-muted-foreground" aria-hidden>
          {count === null
            ? ""
            : previous === null
              ? "Month 1: one newborn pair."
              : `Month ${shownCount}: ${count} ÷ ${previous} = ${(count / previous).toFixed(3)}, φ = ${PHI.toFixed(3)}`}
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
