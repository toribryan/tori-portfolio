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
import badgeBackground from "@/features/doc/data/iso/badge-background.json"
import badgeBorder from "@/features/doc/data/iso/badge-border.json"
import badgeIcon from "@/features/doc/data/iso/badge-icon.json"
import badgeText from "@/features/doc/data/iso/badge-text.json"
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
 * Dot grids exported by pixel-studio's `iso` command: 0 empty, 1 a light dot,
 * 2 a dark dot. Regenerate them there rather than editing the JSON.
 */
const ART = {
  "stack-source": stackSource,
  "stack-context": stackContext,
  "stack-agent": stackAgent,
  "stack-guardrails": stackGuardrails,
  "stack-review": stackReview,
  "tier-primitive": tierPrimitive,
  "tier-semantic": tierSemantic,
  "tier-component": tierComponent,
  "badge-background": badgeBackground,
  "badge-icon": badgeIcon,
  "badge-text": badgeText,
  "badge-border": badgeBorder,
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
const LIGHT_ALPHA = 0.5

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

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
    let shown = reduced.matches ? filled.length : 0
    let flipped = new Set<number>()
    let colors = { dark: "", light: "", faint: "" }

    const readColors = () => {
      const style = getComputedStyle(canvas)
      colors = {
        dark: style.getPropertyValue("--foreground"),
        light: style.getPropertyValue("--muted-foreground"),
        faint: style.getPropertyValue("--border"),
      }
    }

    const draw = () => {
      const pitch = canvas.clientWidth / field.w
      const dpr = window.devicePixelRatio || 1
      canvas.width = Math.round(canvas.clientWidth * dpr)
      canvas.height = Math.round(pitch * field.h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const dot = pitch * 0.62
      const visible = new Set(filled.slice(0, shown))
      for (let fy = 0; fy < field.h; fy++) {
        for (let fx = 0; fx < field.w; fx++) {
          const x = fx - ox
          const y = fy - oy
          const inside = x >= 0 && y >= 0 && x < grid.width && y < grid.height
          const i = y * grid.width + x
          let v = inside && visible.has(i) ? level(i) : "0"
          if (v !== "0" && flipped.has(i)) v = v === "1" ? "2" : "1"
          ctx.fillStyle =
            v === "2" ? colors.dark : v === "1" ? colors.light : colors.faint
          // Light dots sit back so solid features read in either theme.
          ctx.globalAlpha = v === "1" ? LIGHT_ALPHA : 1
          const size = v === "0" ? dot * 0.35 : dot
          const offset = (pitch - size) / 2
          ctx.fillRect(fx * pitch + offset, fy * pitch + offset, size, size)
        }
      }
    }

    readColors()
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
      if (reduced.matches) return
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
    theme.observe(document.documentElement, { attributes: true })
    const resize = new ResizeObserver(draw)
    resize.observe(canvas)

    return () => {
      cancelAnimationFrame(frame)
      window.clearInterval(timer)
      observer.disconnect()
      theme.disconnect()
      resize.disconnect()
    }
  }, [art, seed, field.w, field.h])

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
