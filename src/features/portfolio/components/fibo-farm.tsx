"use client"

import { useState } from "react"
import { RotateCcwIcon } from "lucide-react"

import { cn } from "@/lib/utils"
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

const FIRST: Pair[] = [{ id: 0, age: 0 }]

// Fibonacci's rules: a pair needs a month to grow up, then has a new pair
// every month, and nobody dies.
function nextMonth(pairs: Pair[]): Pair[] {
  const born = pairs
    .filter((pair) => pair.age >= 1)
    .map((_, i) => ({ id: pairs.length + i, age: 0, delay: i * 120 }))
  return [...pairs.map((pair) => ({ ...pair, age: pair.age + 1 })), ...born]
}

function countFor(month: number) {
  let [a, b] = [0, 1]
  for (let m = 1; m < month; m++) [a, b] = [b, a + b]
  return b
}

/**
 * Fibonacci's rabbit puzzle, one month per click. Each pair is one rabbit:
 * grown pairs at double size, newborns at single size, building themselves
 * up as they arrive.
 */
export function FiboFarm() {
  const [month, setMonth] = useState(1)
  const [pairs, setPairs] = useState(FIRST)

  const sequence = Array.from({ length: LAST_MONTH }, (_, i) => countFor(i + 1))
  const count = pairs.length
  const previous = month > 1 ? countFor(month - 1) : null

  return (
    <div className="not-prose flex flex-col overflow-hidden rounded-xl border border-line bg-card">
      <div className="flex items-center justify-between gap-2 border-b border-line py-2 pr-2 pl-4">
        <span className="font-mono text-sm">
          Month {month}
          <span className="text-muted-foreground">
            {" "}
            · {count} {count === 1 ? "pair" : "pairs"}
          </span>
        </span>
        <div className="flex gap-1.5">
          <Button
            size="icon-sm"
            variant="ghost"
            aria-label="Start over"
            disabled={month === 1}
            onClick={() => {
              setMonth(1)
              setPairs(FIRST)
            }}
          >
            <RotateCcwIcon />
          </Button>
          <Button
            size="sm"
            disabled={month === LAST_MONTH}
            onClick={() => {
              setMonth(month + 1)
              setPairs(nextMonth(pairs))
            }}
          >
            Next month
          </Button>
        </div>
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
            assembleDelay={pair.delay}
            transform={`translate(${(i % COLUMNS) * CELL + CELL / 2} ${(Math.floor(i / COLUMNS) + 1) * ROW - 4})`}
          />
        ))}
      </svg>

      <div className="flex flex-col gap-2 border-t border-line px-4 py-3">
        <ol className="m-0 flex list-none flex-wrap gap-1.5 p-0 font-mono text-sm">
          {sequence.map((n, i) => (
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
        <p
          className="m-0 font-mono text-xs text-muted-foreground"
          aria-live="polite"
        >
          {previous === null
            ? "One newborn pair. Click Next month."
            : `${count} ÷ ${previous} = ${(count / previous).toFixed(3)}, φ = ${PHI.toFixed(3)}`}
        </p>
        {month === LAST_MONTH ? (
          <p className="m-0 text-xs text-muted-foreground">
            That&apos;s as many as fit. They don&apos;t stop, though.
          </p>
        ) : null}
      </div>
    </div>
  )
}
