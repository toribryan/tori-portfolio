"use client"

import { useEffect, useRef, useState } from "react"
import { useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"
import { ScaledStage } from "@/features/portfolio/components/components/covers"

import { useCoverSteps } from "./use-cover-steps"

/**
 * Rest, the sweep, the survivors gathering, then back to rest, so the loop
 * runs in reverse before it starts again rather than snapping.
 */
const STEP_AT = [0, 250, 1700, 4600]
/** The rest held between the return and the next sweep. */
const HOLD = 1600

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
    x: column * PITCH,
    y: row * PITCH,
    rank,
    // A diagonal wave from the top left, done in under a second.
    delay: column * 14 + row * 22,
    // Survivors travel whole cells, so they land square on the grid.
    to:
      rank < 0
        ? null
        : {
            x: (BLOCK_LEFT + (rank % BLOCK_COLUMNS) - column) * PITCH,
            y: (BLOCK_TOP + Math.floor(rank / BLOCK_COLUMNS) - row) * PITCH,
          },
  }
})

/** Eases the shown count toward `target`, in either direction. */
function useCount(target: number) {
  const [value, setValue] = useState(target)
  const current = useRef(target)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const from = current.current
    if (from === target) return
    const duration = reduceMotion ? 0 : target < from ? 1300 : 900
    const start = performance.now()
    let frame = requestAnimationFrame(function tick(now) {
      const t = duration ? Math.min((now - start) / duration, 1) : 1
      const eased = 1 - (1 - t) ** 2
      current.current = Math.round(from + (target - from) * eased)
      setValue(current.current)
      if (t < 1) frame = requestAnimationFrame(tick)
    })
    return () => cancelAnimationFrame(frame)
  }, [target, reduceMotion])

  return value
}

/** How long a survivor takes to hop one cell. */
const HOP = 55

/**
 * A surviving tile that hops to its place in the block a cell at a time,
 * across then down together, so it sits square on the grid in every frame
 * rather than gliding between cells. Each axis steps once per cell it
 * crosses.
 */
function Survivor({
  x,
  y,
  to,
  rank,
  gathered,
}: {
  x: number
  y: number
  to: { x: number; y: number }
  rank: number
  gathered: boolean
}) {
  const across = Math.abs(to.x) / PITCH
  const down = Math.abs(to.y) / PITCH
  const delay = `${rank * 12}ms`
  const hops = (cells: number) =>
    cells
      ? `transform ${cells * HOP}ms steps(${cells}, jump-start) ${delay}`
      : "none"

  return (
    <g
      style={{
        transform: `translate(${gathered ? to.x : 0}px, 0px)`,
        transition: hops(across),
      }}
    >
      <rect
        x={x}
        y={y}
        width={TILE}
        height={TILE}
        rx={1.25}
        className="fill-foreground"
        style={{
          transform: `translate(0px, ${gathered ? to.y : 0}px)`,
          transition: hops(down),
        }}
      />
    </g>
  )
}

/**
 * The overhaul's headline, played out: the old library's 587 card variants
 * as a wall of tiles beside the count. A diagonal sweep clears the 555 that
 * were removed while the count runs down to 32, and the survivors gather
 * into one block on the grid. Then it runs back and starts again. It plays
 * while the card is hovered or focused, or on its own with `loop` or on a
 * touch screen; with reduced motion it shows the gathered block, still.
 */
export function DesignSystemOverhaulCover({
  loop = false,
}: {
  loop?: boolean
}) {
  const frame = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const step = useCoverSteps(frame, STEP_AT, {
    loop,
    repeat: true,
    hold: HOLD,
  })
  const last = STEP_AT.length - 1
  // The last step is the return to rest, except where nothing moves.
  const phase = step === last ? (reduceMotion ? 2 : 0) : step
  const swept = phase >= 1
  const gathered = phase >= 2
  const count = useCount(swept ? AFTER : BEFORE)

  return (
    <div
      ref={frame}
      className="absolute inset-0 bg-[color-mix(in_oklab,var(--muted)_60%,var(--background))] text-foreground"
    >
      <ScaledStage width={480} zoom>
        <div className="flex h-full items-center gap-7 pr-7 pl-9">
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
          </div>

          {/* One SVG rather than 587 boxes, so every gap renders the same
              width at any scale. */}
          <svg
            viewBox={`0 0 ${WALL_WIDTH} ${WALL_HEIGHT}`}
            width={WALL_WIDTH}
            height={WALL_HEIGHT}
            className="shrink-0 overflow-visible"
          >
            {/* The grid itself: an empty square under every tile, so a
                removed variant leaves one behind and a survivor always
                lands on one. */}
            {TILES.map((tile, index) => (
              <rect
                key={`slot-${index}`}
                x={tile.x}
                y={tile.y}
                width={TILE}
                height={TILE}
                rx={1.25}
                className="fill-border"
              />
            ))}
            {TILES.map((tile, index) =>
              tile.to ? (
                <Survivor
                  key={index}
                  x={tile.x}
                  y={tile.y}
                  to={tile.to}
                  rank={tile.rank}
                  gathered={gathered}
                />
              ) : (
                <rect
                  key={index}
                  x={tile.x}
                  y={tile.y}
                  width={TILE}
                  height={TILE}
                  rx={1.25}
                  className={cn(
                    "fill-foreground transition-opacity ease-out",
                    swept
                      ? "opacity-0 duration-500"
                      : "opacity-100 duration-400"
                  )}
                  // Out along the wave, and back in along it too.
                  style={{
                    transitionDelay: `${swept ? tile.delay : tile.delay * 0.6}ms`,
                  }}
                />
              )
            )}
          </svg>
        </div>
      </ScaledStage>
    </div>
  )
}
