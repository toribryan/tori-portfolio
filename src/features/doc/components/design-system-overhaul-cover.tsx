"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/fibo/button"
import { ScaledStage } from "@/features/portfolio/components/components/covers"

import { useCoverSteps } from "./use-cover-steps"

/** Rest, the sweep, the survivors gathering, the one slotted card. */
const STEP_AT = [0, 250, 1700, 3100]

const BEFORE = 587
const AFTER = 32

/** The wall: one tile per variant in the old library, on an 8px pitch. */
// 31 columns leave the last row two short of full, rather than a stub.
const COLUMNS = 31
const ROWS = Math.ceil(BEFORE / COLUMNS)
const PITCH = 8
const TILE = 6
const WALL_WIDTH = COLUMNS * PITCH - (PITCH - TILE)
const WALL_HEIGHT = ROWS * PITCH - (PITCH - TILE)

/** Where the survivors gather: an 8 by 4 block in the middle of the wall. */
const BLOCK_COLUMNS = 8
const BLOCK_LEFT = Math.round((COLUMNS - BLOCK_COLUMNS) / 2)
const BLOCK_TOP = Math.round((ROWS - AFTER / BLOCK_COLUMNS) / 2)

/**
 * The 32 variants that survived, scattered over the wall. A fixed seed keeps
 * the pattern the same on the server and in every browser.
 */
const KEPT = (() => {
  const picked = new Set<number>()
  let seed = 20251101
  while (picked.size < AFTER) {
    seed = (seed * 1103515245 + 12345) % 2147483648
    picked.add(seed % BEFORE)
  }
  return [...picked].sort((a, b) => a - b)
})()

const TILES = Array.from({ length: BEFORE }, (_, index) => {
  const column = index % COLUMNS
  const row = Math.floor(index / COLUMNS)
  const rank = KEPT.indexOf(index)
  return {
    column,
    row,
    rank,
    // A diagonal wave from the top left, done in under a second.
    delay: column * 14 + row * 22,
    // Survivors travel to their place in the block.
    to:
      rank < 0
        ? null
        : {
            x: (BLOCK_LEFT + (rank % BLOCK_COLUMNS) - column) * PITCH,
            y: (BLOCK_TOP + Math.floor(rank / BLOCK_COLUMNS) - row) * PITCH,
          },
  }
})

/** Counts from `from` to `to` while `running`, easing out; snaps back after. */
function useCountdown(from: number, to: number, running: boolean) {
  const [value, setValue] = useState(from)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (!running) return
    const duration = reduceMotion ? 0 : 1300
    const start = performance.now()
    let frame = requestAnimationFrame(function tick(now) {
      const t = duration ? Math.min((now - start) / duration, 1) : 1
      const eased = 1 - (1 - t) ** 2
      setValue(Math.round(from + (to - from) * eased))
      if (t < 1) frame = requestAnimationFrame(tick)
    })
    return () => {
      cancelAnimationFrame(frame)
      setValue(from)
    }
  }, [from, to, running, reduceMotion])

  return value
}

/** One slot of the card, outlined and named, as the case study draws them. */
function Slot({
  name,
  shown,
  delay,
  children,
}: {
  name: string
  shown: boolean
  delay: number
  children: ReactNode
}) {
  return (
    <div
      className={cn(
        "relative rounded-md border border-dashed border-border px-2 pt-2 pb-1.5 transition-[opacity,translate] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
        shown ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
      )}
      style={{ transitionDelay: shown ? `${delay}ms` : "0ms" }}
    >
      <span className="absolute -top-1.5 right-1.5 bg-card px-0.5 font-mono text-[6.5px] leading-3 tracking-wide text-muted-foreground uppercase">
        {name}
      </span>
      {children}
    </div>
  )
}

/**
 * The overhaul's headline, played out: the old library's 587 card variants
 * as a wall, swept down to the 32 that survived, which gather and give way
 * to the one slotted Card that replaced them. It plays while the card is
 * hovered or focused, or on a loop with `loop` or on a touch screen.
 */
export function DesignSystemOverhaulCover({
  loop = false,
}: {
  loop?: boolean
}) {
  const frame = useRef<HTMLDivElement>(null)
  const step = useCoverSteps(frame, STEP_AT, { loop, hold: 3000 })
  const swept = step >= 1
  const gathered = step >= 2
  const composed = step >= 3
  const count = useCountdown(BEFORE, AFTER, swept)

  return (
    <div
      ref={frame}
      className="absolute inset-0 bg-[color-mix(in_oklab,var(--muted)_60%,var(--background))] text-foreground"
    >
      <ScaledStage width={480} zoom>
        <div className="flex h-full items-center gap-7 pr-7 pl-9">
          {/* The count. */}
          <div className="flex w-[138px] shrink-0 flex-col">
            <p className="font-mono text-[8.5px] tracking-[0.14em] text-muted-foreground uppercase">
              Card variants
            </p>
            <p className="mt-1.5 font-heading text-[68px] leading-[0.9] font-medium tracking-tight tabular-nums">
              {count}
            </p>
            <div className="mt-3 flex h-4 items-center gap-1.5">
              <span
                className={cn(
                  "rounded-full bg-foreground px-1.5 py-0.5 font-mono text-[8px] leading-none text-background tabular-nums transition-[opacity,scale] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
                  gathered ? "scale-100 opacity-100" : "scale-75 opacity-0"
                )}
              >
                −94%
              </span>
              <span
                className={cn(
                  "font-mono text-[8px] text-muted-foreground transition-opacity duration-300",
                  gathered ? "opacity-100" : "opacity-0"
                )}
              >
                from {BEFORE}
              </span>
            </div>
            <p
              className={cn(
                "mt-5 text-[9px] leading-snug text-muted-foreground transition-opacity duration-500",
                composed ? "opacity-100" : "opacity-0"
              )}
            >
              What&rsquo;s left is one card with slots, filled per screen.
            </p>
          </div>

          {/* The wall, and the card that replaced it. */}
          <div
            className="relative shrink-0"
            style={{ width: WALL_WIDTH, height: WALL_HEIGHT }}
          >
            {/* One SVG rather than 587 boxes, so every gap renders the
                same width at any scale. */}
            <svg
              viewBox={`0 0 ${WALL_WIDTH} ${WALL_HEIGHT}`}
              width={WALL_WIDTH}
              height={WALL_HEIGHT}
              className={cn(
                "absolute inset-0 overflow-visible transition-opacity duration-500",
                composed ? "opacity-25" : "opacity-100"
              )}
            >
              {TILES.map((tile, index) => {
                const kept = tile.rank >= 0
                const gone = swept && !kept
                return (
                  <rect
                    key={index}
                    x={tile.column * PITCH}
                    y={tile.row * PITCH}
                    width={TILE}
                    height={TILE}
                    rx={1.25}
                    className={cn(
                      kept
                        ? "fill-foreground transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)]"
                        : cn(
                            "transition-[fill,opacity] ease-out",
                            gone
                              ? "fill-border duration-500"
                              : "fill-foreground duration-300",
                            // Once the survivors gather, the rest step back
                            // so the block of 32 reads on its own.
                            gathered ? "opacity-40" : "opacity-100"
                          )
                    )}
                    style={{
                      transitionDelay: kept
                        ? gathered
                          ? `${tile.rank * 12}ms`
                          : "0ms"
                        : gone && !gathered
                          ? `${tile.delay}ms`
                          : "0ms",
                      transform:
                        gathered && tile.to
                          ? `translate(${tile.to.x}px, ${tile.to.y}px)`
                          : "translate(0px, 0px)",
                    }}
                  />
                )
              })}
            </svg>

            <div
              className={cn(
                "absolute top-1/2 left-1/2 flex w-[176px] -translate-x-1/2 flex-col gap-2.5 rounded-lg border border-line bg-card p-2 pt-3 shadow-[0_10px_30px_rgb(0_0_0/0.12)] transition-[opacity,translate,scale] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                composed
                  ? "-translate-y-1/2 scale-100 opacity-100"
                  : "-translate-y-[45%] scale-95 opacity-0"
              )}
            >
              <Slot name="Header" shown={composed} delay={150}>
                <p className="text-[9.5px] font-medium">Escalated</p>
                <p className="text-[7.5px] text-muted-foreground">
                  Last 7 days
                </p>
              </Slot>
              <Slot name="Content" shown={composed} delay={260}>
                <p className="font-mono text-[22px] leading-none tabular-nums">
                  14
                </p>
              </Slot>
              <Slot name="Footer" shown={composed} delay={370}>
                <Button
                  size="xs"
                  className="pointer-events-none h-5 px-2 text-[8px]"
                  tabIndex={-1}
                >
                  Open queue
                </Button>
              </Slot>
            </div>
          </div>
        </div>
      </ScaledStage>
    </div>
  )
}
