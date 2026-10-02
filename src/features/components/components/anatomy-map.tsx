"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { createPortal } from "react-dom"

import { cn } from "@/lib/utils"

export type Callout = {
  /** The part's name, shown in the key under the example. */
  label: string
  /** Which side of the part its marker sits on. */
  side: "left" | "right"
  /** Finds the part inside the map once the example has rendered. */
  find: (root: HTMLElement) => Element | null | undefined
  /** Outlines the part, for a region rather than a single element. */
  outline?: boolean
  /**
   * Where the marker points, in viewport coordinates. Defaults to just
   * outside the part's near edge, level with its middle.
   */
  point?: (part: DOMRect, subject: DOMRect) => { x: number; y: number }
}

type Placed = {
  number: number
  side: Callout["side"]
  /** The point on the part, relative to the map. */
  x: number
  y: number
  /** The marker's center, nudged down where markers would overlap. */
  markerY: number
  box?: { x: number; y: number; w: number; h: number }
}

const MARKER = 20
// How far a marker's center sits from the point it marks.
const OFFSET = 14
const GAP = 4
// Room kept free inside the map's edges, so a part at the edge still has
// space for its marker beside it.
const GUTTER = 24

/** Finds a part by its `data-slot`. */
export const slot = (name: string) => (root: HTMLElement) =>
  root.querySelector(`[data-slot=${name}]`)

/**
 * Anatomy as numbered markers: a live example with a small numbered dot
 * beside each part and a dashed outline around regions, keyed by a list of
 * the parts' names underneath. It needs no room beside the example, so it
 * fits a phone. Positions are measured every frame while the map is on
 * screen, so markers stay with parts that move on their own, such as a
 * preview portalled to the body.
 */
export function AnatomyMap({
  callouts,
  subject,
  measureKey,
  className,
  children,
}: {
  callouts: Callout[]
  /** The element the parts' default points are measured around. */
  subject?: (root: HTMLElement) => Element | null | undefined
  /** Measures again when it changes, such as once an example reaches its state. */
  measureKey?: unknown
  className?: string
  children: ReactNode
}) {
  const frame = useRef<HTMLDivElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const [placed, setPlaced] = useState<Placed[]>([])
  const [zoom, setZoom] = useState(1)
  const [width, setWidth] = useState(Infinity)
  // The map's top-left corner in document coordinates, for the markers.
  const [origin, setOrigin] = useState({ x: 0, y: 0 })

  // An example wider than the space it has is zoomed down to fit rather than
  // scrolled, so on a phone every part, and its marker, stays on screen.
  useEffect(() => {
    const root = frame.current
    const inner = stage.current
    if (!root || !inner) return
    let measured = -1
    const fit = () => {
      if (root.clientWidth === measured) return
      measured = root.clientWidth
      // Measured unzoomed, so the fit never feeds on its own result.
      const current = inner.style.zoom
      inner.style.zoom = "1"
      const natural = inner.scrollWidth
      inner.style.zoom = current
      setZoom(natural > 0 ? Math.min(1, (measured - 2 * GUTTER) / natural) : 1)
    }
    fit()
    const observer = new ResizeObserver(fit)
    observer.observe(root)
    return () => observer.disconnect()
  }, [measureKey])

  useEffect(() => {
    const root = frame.current
    if (!root) return
    let last = ""
    let raf = 0
    let visible = false

    const measure = () => {
      const base = root.getBoundingClientRect()
      const target =
        subject?.(root) ??
        root.querySelector("[data-anatomy-subject]") ??
        stage.current?.firstElementChild
      if (!target) return
      const around = target.getBoundingClientRect()
      const rows: Placed[] = []
      callouts.forEach((callout, index) => {
        const el = callout.find(root)
        if (!el) return
        const r = el.getBoundingClientRect()
        let side = callout.side
        let point = callout.point?.(r, around) ?? {
          x: side === "left" ? r.left - 4 : r.right + 4,
          y: r.top + r.height / 2,
        }
        // Kept inside the map, a marker can end up on its own part, as when
        // a phone squeezes a part past the map's edge. Mark the part's other
        // edge instead.
        const local = point.x - base.left
        const clamped = Math.min(
          Math.max(
            side === "left" ? local - OFFSET : local + OFFSET,
            MARKER / 2 + 2
          ),
          base.width - MARKER / 2 - 2
        )
        const onPart =
          side === "right"
            ? clamped - MARKER / 2 < r.right - base.left
            : clamped + MARKER / 2 > r.left - base.left
        if (onPart) {
          side = side === "right" ? "left" : "right"
          point = {
            x: side === "left" ? r.left - 4 : r.right + 4,
            y: point.y,
          }
        }
        const y = Math.round(point.y - base.top)
        rows.push({
          number: index + 1,
          side,
          x: Math.round(point.x - base.left),
          y,
          markerY: y,
          box: callout.outline
            ? {
                x: Math.round(r.left - base.left),
                y: Math.round(r.top - base.top),
                w: Math.round(r.width),
                h: Math.round(r.height),
              }
            : undefined,
        })
      })
      // Push a marker down only past the markers it would actually overlap:
      // same side and close enough across to touch.
      const sorted = [...rows].sort((a, b) => a.y - b.y)
      sorted.forEach((row, i) => {
        const x = row.side === "left" ? row.x - OFFSET : row.x + OFFSET
        let bottom = -Infinity
        for (const above of sorted.slice(0, i)) {
          const ax = above.side === "left" ? above.x - OFFSET : above.x + OFFSET
          if (Math.abs(ax - x) < MARKER + GAP) {
            bottom = Math.max(bottom, above.markerY + MARKER / 2)
          }
        }
        row.markerY = Math.max(row.y, bottom + GAP + MARKER / 2)
      })
      // Re-render only when something moved.
      const at = {
        x: Math.round(base.left + window.scrollX),
        y: Math.round(base.top + window.scrollY),
      }
      const next = JSON.stringify([rows, base.width, at])
      if (next !== last) {
        last = next
        setPlaced(rows)
        setWidth(base.width)
        setOrigin(at)
      }
    }

    const loop = () => {
      measure()
      if (visible) raf = requestAnimationFrame(loop)
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = !!entry?.isIntersecting
      cancelAnimationFrame(raf)
      if (visible) raf = requestAnimationFrame(loop)
    })
    observer.observe(root)
    measure()
    return () => {
      observer.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [callouts, subject, measureKey])

  // Beside its point, but never past the map's edge, where the frame around
  // the example would clip it; a part that pokes out, such as a preview
  // portalled to the body, gets its marker at the edge instead.
  const markerX = (side: Callout["side"], x: number) =>
    Math.min(
      Math.max(side === "left" ? x - OFFSET : x + OFFSET, MARKER / 2 + 2),
      width - MARKER / 2 - 2
    )

  return (
    <div className={cn("flex w-full flex-col items-center gap-6", className)}>
      <div
        ref={frame}
        className="relative w-full"
        style={{ padding: `0 ${GUTTER}px` }}
      >
        <div
          ref={stage}
          className="flex w-max min-w-full justify-center"
          style={{ zoom }}
        >
          {children}
        </div>
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-60 size-full overflow-visible text-foreground"
        >
          {placed.map(({ number, side, x, y, markerY, box }) => {
            const cx = markerX(side, x)
            return (
              <g key={number}>
                {box ? (
                  <rect
                    x={box.x - 3}
                    y={box.y - 3}
                    width={box.w + 6}
                    height={box.h + 6}
                    rx={8}
                    fill="none"
                    stroke="currentColor"
                    strokeOpacity={0.5}
                    strokeDasharray="4 3"
                  />
                ) : null}
                {markerY !== y ? (
                  <line
                    x1={cx}
                    y1={markerY}
                    x2={x}
                    y2={y}
                    stroke="currentColor"
                    strokeOpacity={0.6}
                  />
                ) : null}
              </g>
            )
          })}
        </svg>
      </div>

      {/* On the body, like the parts some examples portal there, so no
          stacking context in the page can cover them. In document
          coordinates, so they scroll with the page instead of trailing it. */}
      {placed.length > 0
        ? createPortal(
            placed.map(({ number, side, x, markerY }) => (
              <span
                key={number}
                aria-hidden="true"
                style={{
                  left: origin.x + markerX(side, x),
                  top: origin.y + markerY,
                  width: MARKER,
                  height: MARKER,
                }}
                className="pointer-events-none absolute z-60 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-foreground font-mono text-[11px] leading-none font-medium text-background ring-2 ring-background"
              >
                {number}
              </span>
            )),
            document.body
          )
        : null}

      <ol className="m-0 flex list-none flex-wrap justify-center gap-x-5 gap-y-2 p-0 text-sm">
        {callouts.map((callout, index) => (
          <li key={callout.label} className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="flex size-5 shrink-0 items-center justify-center rounded-full bg-foreground font-mono text-[11px] leading-none font-medium text-background"
            >
              {index + 1}
            </span>
            {callout.label}
          </li>
        ))}
      </ol>
    </div>
  )
}
