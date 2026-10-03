"use client"

import { useEffect, useRef } from "react"
import { useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"
import { ScaledStage } from "@/features/portfolio/components/components/covers"

import { useCoverSteps } from "./use-cover-steps"

/** Rest, the sweep, then the refill, which the loop holds before sweeping again. */
const STEP_AT = [0, 300, 3700]
const HOLD = 1500

const BEFORE = 587
const AFTER = 32

/** The wall: one tile per variant in the old library, on an 8px pitch. */
// 31 columns leave the last row two short of full, rather than a stub.
const COLUMNS = 31
const ROWS = Math.ceil(BEFORE / COLUMNS)
const PITCH = 8
const TILE = 6
const RADIUS = 1.25
const WALL_WIDTH = COLUMNS * PITCH - (PITCH - TILE)
const WALL_HEIGHT = ROWS * PITCH - (PITCH - TILE)

/** How long one tile takes to fade, and how much faster the refill runs. */
const FADE = 280
const REFILL = 0.55

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
  return picked
})()

const TILES = Array.from({ length: BEFORE }, (_, index) => {
  const column = index % COLUMNS
  const row = Math.floor(index / COLUMNS)
  return {
    column,
    row,
    kept: KEPT.has(index),
    // One diagonal wave from the top left, in about a second.
    delay: column * 14 + row * 22,
  }
})

/** When the last tile of the sweep is half gone. */
const SWEEP_DONE = Math.max(...TILES.map((tile) => tile.delay)) + FADE / 2

function ease(t: number) {
  const c = Math.min(Math.max(t, 0), 1)
  return c < 0.5 ? 2 * c * c : 1 - (-2 * c + 2) ** 2 / 2
}

/**
 * The wall and the count, drawn together. The wall is a canvas rather than
 * 587 elements: one loop fades every tile and draws them in a single pass,
 * with each edge on a whole device pixel so every gap is the same width. The
 * count is read off the tiles in the same frame, so it always matches what
 * is on screen, even when a sweep is cut short and reversed.
 */
function useWall(swept: boolean, reduceMotion: boolean) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const swatch = useRef<HTMLSpanElement>(null)
  const count = useRef<HTMLSpanElement>(null)
  // How much of each tile is showing, from 0 (an empty square) to 1.
  const shown = useRef<Float32Array>(new Float32Array(BEFORE).fill(1))
  // Set by the measuring effect, which owns the canvas context.
  const paint = useRef<() => void>(() => {})

  useEffect(() => {
    const element = canvas.current
    const context = element?.getContext("2d")
    if (!element || !context) return

    let size = { width: 0, height: 0, scale: 1 }
    const measure = () => {
      const box = element.getBoundingClientRect()
      const ratio = window.devicePixelRatio || 1
      size = {
        width: Math.round(box.width * ratio),
        height: Math.round(box.height * ratio),
        scale: (box.width * ratio) / WALL_WIDTH,
      }
      element.width = size.width
      element.height = size.height
    }

    // Tile edges in device pixels, worked out once per size.
    let rects: [number, number, number, number][] = []
    let colors = { ink: "", slot: "" }
    let written = -1

    const readColors = () => {
      // Read once, and again when the theme changes: reading styles every
      // frame would make the browser recompute the whole page's.
      const ink = getComputedStyle(element).color
      const slot = swatch.current ? getComputedStyle(swatch.current).color : ink
      colors = { ink, slot }
    }

    const layout = () => {
      const { scale } = size
      rects = TILES.map((tile) => {
        const left = Math.round(tile.column * PITCH * scale)
        const top = Math.round(tile.row * PITCH * scale)
        return [
          left,
          top,
          Math.round((tile.column * PITCH + TILE) * scale) - left,
          Math.round((tile.row * PITCH + TILE) * scale) - top,
        ]
      })
    }

    // Tiles are filled in batches that share an opacity, so a frame is a
    // couple of dozen fills rather than a thousand.
    const LEVELS = 16
    const draw = () => {
      const radius = RADIUS * size.scale
      const slots = new Path2D()
      const inks = Array.from({ length: LEVELS + 1 }, () => new Path2D())
      let remaining = 0
      for (let index = 0; index < BEFORE; index++) {
        const [left, top, width, height] = rects[index]
        const alpha = shown.current[index]
        if (alpha >= 0.5) remaining++
        const level = Math.round(alpha * LEVELS)
        if (level < LEVELS) slots.roundRect(left, top, width, height, radius)
        if (level > 0) inks[level].roundRect(left, top, width, height, radius)
      }
      context.clearRect(0, 0, size.width, size.height)
      context.globalAlpha = 1
      context.fillStyle = colors.slot
      context.fill(slots)
      context.fillStyle = colors.ink
      for (let level = 1; level <= LEVELS; level++) {
        context.globalAlpha = level / LEVELS
        context.fill(inks[level])
      }
      context.globalAlpha = 1
      if (remaining !== written && count.current) {
        written = remaining
        count.current.textContent = String(remaining)
      }
    }

    paint.current = draw
    measure()
    layout()
    readColors()
    draw()
    const resize = new ResizeObserver(() => {
      measure()
      layout()
      draw()
    })
    resize.observe(element)
    // The site's theme is a class on the root; its colors change with it.
    // Read again once any color transition on the page has settled.
    let settle = 0
    const theme = new MutationObserver(() => {
      readColors()
      draw()
      window.clearTimeout(settle)
      settle = window.setTimeout(() => {
        readColors()
        draw()
      }, 400)
    })
    theme.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "style"],
    })
    return () => {
      paint.current = () => {}
      window.clearTimeout(settle)
      resize.disconnect()
      theme.disconnect()
    }
  }, [])

  useEffect(() => {
    const target = swept ? 0 : 1
    const from = Float32Array.from(shown.current)
    const redraw = () => paint.current()

    if (reduceMotion) {
      TILES.forEach((tile, index) => {
        if (!tile.kept) shown.current[index] = target
      })
      redraw()
      return
    }

    const start = performance.now()
    let frame = requestAnimationFrame(function tick(now) {
      const elapsed = now - start
      let moving = false
      TILES.forEach((tile, index) => {
        if (tile.kept) return
        // Out along the wave, and back in along it, faster.
        const delay = swept ? tile.delay : tile.delay * REFILL
        const progress = ease((elapsed - delay) / FADE)
        shown.current[index] = from[index] + (target - from[index]) * progress
        if (progress < 1) moving = true
      })
      redraw()
      if (moving) frame = requestAnimationFrame(tick)
    })
    return () => cancelAnimationFrame(frame)
  }, [swept, reduceMotion])

  return { canvas, swatch, count }
}

/**
 * The overhaul's headline, played out: the old library's 587 card variants
 * as a wall of tiles beside the count. A diagonal wave clears the 555 that
 * were removed, the count falling with it, until the 32 that survived stand
 * alone in the grid. Then the wall fills back in and it goes again. It plays
 * while the card is hovered or focused, or on its own with `loop` or on a
 * touch screen; with reduced motion it shows the 32, still.
 */
export function DesignSystemOverhaulCover({
  loop = false,
}: {
  loop?: boolean
}) {
  const frame = useRef<HTMLDivElement>(null)
  const reduceMotion = Boolean(useReducedMotion())
  const step = useCoverSteps(frame, STEP_AT, {
    loop,
    repeat: true,
    hold: HOLD,
  })
  // The last step is the refill, except where nothing moves.
  const swept = step === 1 || (step === 2 && reduceMotion)
  const { canvas, swatch, count } = useWall(swept, reduceMotion)

  return (
    <div
      ref={frame}
      className="absolute inset-0 bg-cover-plate text-foreground"
    >
      <ScaledStage width={480} zoom>
        <div className="flex h-full items-center gap-7 pr-7 pl-9">
          <div className="flex w-[138px] shrink-0 flex-col">
            <p className="font-mono text-[8.5px] tracking-[0.14em] text-muted-foreground uppercase">
              Card variants
            </p>
            <p className="mt-1.5 font-heading text-[68px] leading-[0.9] font-medium tracking-tight tabular-nums">
              <span ref={count}>{BEFORE}</span>
            </p>
            <div
              className={cn(
                "mt-3 flex h-4 items-center gap-1.5 transition-[opacity,translate] ease-[cubic-bezier(0.22,1,0.36,1)]",
                swept
                  ? "translate-y-0 opacity-100 duration-500"
                  : "translate-y-1 opacity-0 duration-300"
              )}
              style={{ transitionDelay: swept ? `${SWEEP_DONE}ms` : "0ms" }}
            >
              <span className="rounded-full bg-foreground px-1.5 py-0.5 font-mono text-[8px] leading-none text-background tabular-nums">
                −94%
              </span>
              <span className="font-mono text-[8px] text-muted-foreground">
                from {BEFORE}
              </span>
            </div>
          </div>
          <div className="relative shrink-0">
            <canvas
              ref={canvas}
              className="block text-foreground"
              style={{ width: WALL_WIDTH, height: WALL_HEIGHT }}
            />
            {/* Carries the empty squares' color for the canvas to read. */}
            <span ref={swatch} className="hidden text-border" />
          </div>
        </div>
      </ScaledStage>
    </div>
  )
}
