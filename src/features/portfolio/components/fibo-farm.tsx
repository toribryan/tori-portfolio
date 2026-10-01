"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { PauseIcon, PlayIcon } from "lucide-react"
import { useInView } from "motion/react"

import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/base/ui/button"

import { PixelRabbitSprite } from "./fibo-hero/pixel-rabbit"

type Pair = {
  id: number
  age: number
  /** When a newborn starts building itself up. Fixed at birth, so a pair
   * that grows up doesn't build again. */
  delay?: number
}

// Month 8 is 21 pairs, three full rows. Past that they stop fitting.
const LAST_MONTH = 8
const COLUMNS = 7
const CELL = 48
const ROW = 52
const PHI = (1 + Math.sqrt(5)) / 2
// Long enough for a month's newborns to finish building themselves up.
const MONTH_MS = 1600
const HOLD_MS = 4000

const SEQUENCE = Array.from({ length: LAST_MONTH }, (_, i) => countFor(i + 1))

// Fibonacci's rules: a pair needs a month to grow up, then has a new pair
// every month, and nobody dies.
function nextMonth(pairs: Pair[]): Pair[] {
  const born = pairs
    .filter((pair) => pair.age >= 1)
    .map((_, i) => ({ id: pairs.length + i, age: 0, delay: i * 120 }))
  return [...pairs.map((pair) => ({ ...pair, age: pair.age + 1 })), ...born]
}

// Replayed from the first pair, so a rabbit keeps its id, and its sprite,
// from month to month.
function pairsFor(month: number) {
  let pairs: Pair[] = [{ id: 0, age: 0 }]
  for (let m = 1; m < month; m++) pairs = nextMonth(pairs)
  return pairs
}

function countFor(month: number) {
  let [a, b] = [0, 1]
  for (let m = 1; m < month; m++) [a, b] = [b, a + b]
  return b
}

/**
 * Fibonacci's rabbit puzzle, playing a month at a time while it's on screen,
 * then starting over. Each pair is one rabbit: grown pairs at double size,
 * newborns at single size, building themselves up as they arrive. With
 * reduced motion it holds on the last month.
 */
export function FiboFarm() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.4 })
  // Matches the server on the first render, then switches, so hydration
  // doesn't trip over the month.
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)")
  const [playing, setPlaying] = useState(true)
  const [step, setStep] = useState(1)

  const month = reduced ? LAST_MONTH : step
  const pairs = useMemo(() => pairsFor(month), [month])
  const count = pairs.length
  const previous = month > 1 ? countFor(month - 1) : null

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
        An animation of Fibonacci&apos;s rabbit puzzle. Over eight months the
        pairs go {SEQUENCE.join(", ")}.
      </p>

      <div className="flex min-h-12 items-center justify-between gap-2 border-b border-line py-2 pr-2 pl-4">
        <span className="font-mono text-sm" aria-hidden>
          Month {month}
          <span className="text-muted-foreground">
            {" "}
            · {count} {count === 1 ? "pair" : "pairs"}
          </span>
        </span>
        {reduced ? null : (
          <Button
            size="icon-sm"
            variant="ghost"
            aria-label={playing ? "Pause the animation" : "Play the animation"}
            onClick={() => setPlaying(!playing)}
          >
            {playing ? <PauseIcon /> : <PlayIcon />}
          </Button>
        )}
      </div>

      <svg
        viewBox={`0 0 ${COLUMNS * CELL} ${3 * ROW}`}
        className="block w-full text-foreground"
        aria-hidden
      >
        {pairs.map((pair, i) => (
          <PixelRabbitSprite
            key={pair.id}
            pixel={pair.age >= 1 ? 2 : 1}
            assembleDelay={reduced ? undefined : pair.delay}
            transform={`translate(${(i % COLUMNS) * CELL + CELL / 2} ${(Math.floor(i / COLUMNS) + 1) * ROW - 4})`}
          />
        ))}
      </svg>

      <div
        className="flex flex-col gap-2 border-t border-line px-4 py-3"
        aria-hidden
      >
        <ol className="m-0 flex list-none flex-wrap gap-1.5 p-0 font-mono text-sm">
          {SEQUENCE.map((n, i) => (
            <li
              key={i}
              className={cn(
                "rounded-md px-1.5 py-0.5 tabular-nums transition-colors",
                i + 1 === month
                  ? "bg-foreground text-background"
                  : i + 1 < month
                    ? "text-foreground"
                    : "text-muted-foreground/50"
              )}
            >
              {n}
            </li>
          ))}
        </ol>
        <p className="m-0 font-mono text-xs text-muted-foreground">
          {previous === null
            ? "One newborn pair."
            : `${count} ÷ ${previous} = ${(count / previous).toFixed(3)}, φ = ${PHI.toFixed(3)}`}
        </p>
      </div>
    </div>
  )
}
