"use client"

import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  type ReactElement,
} from "react"

import { cn } from "@/lib/utils"
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion"
import arcContracts from "@/features/doc/data/iso/arc-contracts.json"
import arcNow from "@/features/doc/data/iso/arc-now.json"
import arcStart from "@/features/doc/data/iso/arc-start.json"
import arcToday from "@/features/doc/data/iso/arc-today.json"
import badgeBackground from "@/features/doc/data/iso/badge-background.json"
import badgeBorder from "@/features/doc/data/iso/badge-border.json"
import badgeIcon from "@/features/doc/data/iso/badge-icon.json"
import badgeText from "@/features/doc/data/iso/badge-text.json"
import expMcp from "@/features/doc/data/iso/exp-mcp.json"
import expPrompt from "@/features/doc/data/iso/exp-prompt.json"
import expVariable from "@/features/doc/data/iso/exp-variable.json"
import fiboEnforced from "@/features/doc/data/iso/fibo-enforced.json"
import fiboWritten from "@/features/doc/data/iso/fibo-written.json"
import stackAgent from "@/features/doc/data/iso/stack-agent.json"
import stackContext from "@/features/doc/data/iso/stack-context.json"
import stackGuardrails from "@/features/doc/data/iso/stack-guardrails.json"
import stackReview from "@/features/doc/data/iso/stack-review.json"
import stackSource from "@/features/doc/data/iso/stack-source.json"
import tierComponent from "@/features/doc/data/iso/tier-component.json"
import tierPrimitive from "@/features/doc/data/iso/tier-primitive.json"
import tierSemantic from "@/features/doc/data/iso/tier-semantic.json"

type IsoGrid = { width: number; height: number; rows: string[] }

/*
 * Dot grids exported by pixel-studio's `iso` command: 0 empty, then 1 to 4
 * from the palest face to ink outlines. Regenerate them there rather than
 * editing the JSON.
 */
const ART = {
  "arc-contracts": arcContracts,
  "arc-now": arcNow,
  "arc-start": arcStart,
  "arc-today": arcToday,
  "badge-background": badgeBackground,
  "badge-border": badgeBorder,
  "badge-icon": badgeIcon,
  "badge-text": badgeText,
  "exp-mcp": expMcp,
  "exp-prompt": expPrompt,
  "exp-variable": expVariable,
  "fibo-enforced": fiboEnforced,
  "fibo-written": fiboWritten,
  "stack-agent": stackAgent,
  "stack-context": stackContext,
  "stack-guardrails": stackGuardrails,
  "stack-review": stackReview,
  "stack-source": stackSource,
  "tier-component": tierComponent,
  "tier-primitive": tierPrimitive,
  "tier-semantic": tierSemantic,
} satisfies Record<string, IsoGrid>

export type IsoArt = keyof typeof ART

type Field = { w: number; h: number }

// Every card in a row draws into the same field, so dots keep one pitch.
function fieldFor(arts: IsoArt[]): Field {
  const grids: IsoGrid[] = arts.map((a) => ART[a])
  return {
    w: Math.max(...grids.map((g) => g.width)) + 2,
    h: Math.max(...grids.map((g) => g.height)) + 2,
  }
}

const BUILD_MS = 1400
const FLICKER_MS = 120
const FLICKER_CELLS = 6
// Each strength is the foreground at this opacity, so faces stay flat planes
// and the art follows the theme. Index 0 is the empty field.
const STRENGTH = [1, 0.16, 0.34, 0.58, 1]

function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function IsoCanvas({
  art,
  seed,
  field,
}: {
  art: IsoArt
  seed: number
  field: Field
}) {
  const ref = useRef<HTMLCanvasElement>(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return
    const grid: IsoGrid = ART[art]
    const random = rng(seed)

    const filled: number[] = []
    grid.rows.forEach((row, y) => {
      for (let x = 0; x < row.length; x++)
        if (row[x] !== "0") filled.push(y * grid.width + x)
    })
    // Shuffled once, so dots arrive in an even, seeded order.
    for (let i = filled.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1))
      ;[filled[i], filled[j]] = [filled[j]!, filled[i]!]
    }

    const ox = Math.floor((field.w - grid.width) / 2)
    const oy = Math.floor((field.h - grid.height) / 2)
    const level = (i: number) =>
      grid.rows[Math.floor(i / grid.width)]![i % grid.width]

    // Each cell's place in the arrival order, so a draw can tell what has
    // arrived without building a set from `filled`.
    const order = new Int32Array(grid.width * grid.height)
    filled.forEach((cell, n) => (order[cell] = n))

    let shown = reduced ? filled.length : 0
    let flipped = new Set<number>()
    let colors = { ink: "", faint: "" }

    const readColors = () => {
      const style = getComputedStyle(canvas)
      colors = {
        ink: style.getPropertyValue("--foreground"),
        faint: style.getPropertyValue("--border"),
      }
    }

    // Setting a canvas's size reallocates and clears it, so it happens only
    // when the canvas resizes, not on every frame of the build-up.
    let pitch = 0
    const size = () => {
      pitch = canvas.clientWidth / field.w
      const dpr = window.devicePixelRatio || 1
      canvas.width = Math.round(canvas.clientWidth * dpr)
      canvas.height = Math.round(pitch * field.h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const draw = () => {
      ctx.clearRect(0, 0, pitch * field.w, pitch * field.h)
      const dot = pitch * 0.62
      for (let fy = 0; fy < field.h; fy++) {
        for (let fx = 0; fx < field.w; fx++) {
          const x = fx - ox
          const y = fy - oy
          const inside = x >= 0 && y >= 0 && x < grid.width && y < grid.height
          const i = y * grid.width + x
          const v = inside && order[i]! < shown ? level(i) : "0"
          let n = Number(v)
          if (n > 0 && n < 4 && flipped.has(i)) n += 1
          ctx.fillStyle = n === 0 ? colors.faint : colors.ink
          ctx.globalAlpha = STRENGTH[n]!
          const size = n === 0 ? dot * 0.35 : dot
          const offset = (pitch - size) / 2
          ctx.fillRect(fx * pitch + offset, fy * pitch + offset, size, size)
        }
      }
    }

    readColors()
    size()
    draw()

    let frame = 0
    let timer = 0
    let onScreen = false

    const flicker = () => {
      flipped = new Set(
        Array.from(
          { length: FLICKER_CELLS },
          () => filled[Math.floor(random() * filled.length)]!
        )
      )
      draw()
    }

    const build = (start: number) => {
      const step = (now: number) => {
        shown = Math.min(
          filled.length,
          Math.round(((now - start) / BUILD_MS) * filled.length)
        )
        draw()
        if (shown < filled.length) frame = requestAnimationFrame(step)
        else if (onScreen) timer = window.setInterval(flicker, FLICKER_MS)
      }
      frame = requestAnimationFrame(step)
    }

    const observer = new IntersectionObserver(([entry]) => {
      onScreen = !!entry?.isIntersecting
      if (reduced) return
      if (onScreen && shown === 0) build(performance.now())
      else if (onScreen && shown === filled.length && !timer)
        timer = window.setInterval(flicker, FLICKER_MS)
      else if (!onScreen && timer) {
        window.clearInterval(timer)
        timer = 0
        flipped = new Set()
        draw()
      }
    })
    observer.observe(canvas)

    // The theme toggle swaps a class on <html>, so the tokens change under us.
    const theme = new MutationObserver(() => {
      readColors()
      draw()
    })
    theme.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })
    const resize = new ResizeObserver(() => {
      size()
      draw()
    })
    resize.observe(canvas)

    return () => {
      cancelAnimationFrame(frame)
      window.clearInterval(timer)
      observer.disconnect()
      theme.disconnect()
      resize.disconnect()
    }
  }, [art, seed, field.w, field.h, reduced])

  return <canvas ref={ref} className="block w-full" aria-hidden />
}

function Bracket({ className }: { className: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute size-3 border-border",
        className
      )}
    />
  )
}

/**
 * One card in an `<IsoCards>` row: a title, a mono index, and an isometric
 * dot drawing from pixel-studio that builds in when it scrolls into view.
 *
 * Every prop is a string because expression attributes don't survive the MDX
 * pipeline. See the note in `mdx-inbox-regions.tsx`.
 */
export function IsoCard({
  title,
  index,
  art,
  detail,
  seed = "1",
  field,
}: {
  title: string
  index?: string
  art: IsoArt
  detail?: string
  seed?: string
  /** Set by `IsoCards` so a row shares one dot pitch. */
  field?: Field
}) {
  return (
    <figure className="flex flex-col gap-4 border border-border p-5">
      <figcaption className="flex items-start justify-between gap-3">
        <span className="flex min-w-0 flex-col gap-1">
          <span className="font-medium text-foreground">{title}</span>
          {detail && (
            <span className="text-xs break-words text-muted-foreground">
              {detail}
            </span>
          )}
        </span>
        {index && (
          <span className="shrink-0 font-mono text-xs text-muted-foreground">
            {index}
          </span>
        )}
      </figcaption>

      <div className="relative mt-auto p-3">
        <Bracket className="top-0 left-0 border-t border-l" />
        <Bracket className="top-0 right-0 border-t border-r" />
        <Bracket className="bottom-0 left-0 border-b border-l" />
        <Bracket className="right-0 bottom-0 border-r border-b" />
        <IsoCanvas
          art={art}
          seed={Number(seed)}
          field={field ?? fieldFor([art])}
        />
      </div>
    </figure>
  )
}

const COLUMNS = {
  "2": "grid-cols-2",
  "3": "grid-cols-2 md:grid-cols-3",
  "4": "grid-cols-2 md:grid-cols-4",
}

/**
 * A row of `<IsoCard>` children: two across on a phone, then `columns`
 * across from `md` up.
 */
export function IsoCards({
  children,
  columns = "3",
}: {
  children?: React.ReactNode
  columns?: keyof typeof COLUMNS
}) {
  const cards = Children.toArray(children).filter(
    isValidElement
  ) as ReactElement<{ art: IsoArt; field?: Field }>[]
  if (cards.length === 0) return null
  const field = fieldFor(cards.map((card) => card.props.art))

  return (
    <div className={cn("not-prose my-8 grid gap-3", COLUMNS[columns])}>
      {cards.map((card) => cloneElement(card, { field }))}
    </div>
  )
}
