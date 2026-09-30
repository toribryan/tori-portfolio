"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"

import { cn } from "@/lib/utils"

export type Callout = {
  /** The part's name, shown in the marker. */
  label: string
  /** Which side of the subject the marker sits on. */
  side: "left" | "right"
  /** Finds the part inside the map once the example has rendered. */
  find: (root: HTMLElement) => Element | null | undefined
  /** Outlines the part, for a region rather than a single element. */
  outline?: boolean
  /**
   * Where the leader line ends, in viewport coordinates. Defaults to just
   * outside the part's near edge, level with its middle.
   */
  point?: (part: DOMRect, subject: DOMRect) => { x: number; y: number }
}

type Placed = {
  callout: Callout
  x: number
  y: number
  labelY: number
  box?: { x: number; y: number; w: number; h: number }
}

// Space between one marker's bottom and the next one's top on the same side.
const GAP = 8

/** Finds a part by its `data-slot`. */
export const slot = (name: string) => (root: HTMLElement) =>
  root.querySelector(`[data-slot=${name}]`)

/**
 * Anatomy as an annotated map: a live example with a marker beside each
 * part, a leader line to it, and a dashed outline around regions, so a
 * designer reads the parts straight off the picture. Markers sit in the
 * space beside the subject, the element marked `data-anatomy-subject` (or
 * the one `subject` finds), keep level with their part, and push apart by
 * their measured heights where parts crowd.
 */
export function AnatomyMap({
  callouts,
  subject,
  measureKey,
  className,
  children,
}: {
  callouts: Callout[]
  /** The element the markers are laid out around. */
  subject?: (root: HTMLElement) => Element | null | undefined
  /** Measures again when it changes, such as once an example reaches its state. */
  measureKey?: unknown
  className?: string
  children: ReactNode
}) {
  const frame = useRef<HTMLDivElement>(null)
  const markers = useRef(new Map<string, HTMLDivElement>())
  const [placed, setPlaced] = useState<Placed[]>([])
  const [bounds, setBounds] = useState({ width: 0, left: 0, right: 0 })

  useEffect(() => {
    const root = frame.current
    if (!root) return
    const measure = () => {
      const base = root.getBoundingClientRect()
      const target =
        subject?.(root) ??
        root.querySelector("[data-anatomy-subject]") ??
        root.firstElementChild
      if (!target) return
      const around = target.getBoundingClientRect()
      const rows: Placed[] = []
      for (const callout of callouts) {
        const el = callout.find(root)
        if (!el) continue
        const r = el.getBoundingClientRect()
        const point = callout.point?.(r, around) ?? {
          x: callout.side === "left" ? r.left - 4 : r.right + 4,
          y: r.top + r.height / 2,
        }
        const y = point.y - base.top
        rows.push({
          callout,
          x: point.x - base.left,
          y,
          labelY: y,
          box: callout.outline
            ? {
                x: r.left - base.left,
                y: r.top - base.top,
                w: r.width,
                h: r.height,
              }
            : undefined,
        })
      }
      for (const side of ["left", "right"] as const) {
        let bottom = -Infinity
        for (const row of rows
          .filter((r) => r.callout.side === side)
          .sort((a, b) => a.y - b.y)) {
          const half =
            (markers.current.get(row.callout.label)?.offsetHeight ?? 28) / 2
          row.labelY = Math.max(row.y, bottom + GAP + half)
          bottom = row.labelY + half
        }
      }
      setPlaced(rows)
      setBounds({
        width: base.width,
        left: around.left - base.left,
        right: around.right - base.left,
      })
    }
    measure()
    // Once more after the markers exist, so their real heights space them.
    const frameId = requestAnimationFrame(measure)
    const observer = new ResizeObserver(measure)
    observer.observe(root)
    return () => {
      cancelAnimationFrame(frameId)
      observer.disconnect()
    }
  }, [callouts, subject, measureKey])

  const edge = (side: Callout["side"]) =>
    side === "left" ? bounds.left - 20 : bounds.right + 24

  return (
    <div ref={frame} className={cn("relative w-full min-w-[680px]", className)}>
      {children}
      <ul className="sr-only">
        {callouts.map((callout) => (
          <li key={callout.label}>{callout.label}</li>
        ))}
      </ul>
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-60 size-full overflow-visible text-foreground"
      >
        {placed.map(({ callout, x, y, labelY, box }) => (
          <g key={callout.label}>
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
            <line
              x1={edge(callout.side)}
              y1={labelY}
              x2={x}
              y2={y}
              stroke="currentColor"
              strokeOpacity={0.7}
            />
            <circle
              cx={x}
              cy={y}
              r={3.5}
              fill="currentColor"
              stroke="var(--background)"
              strokeWidth={1.5}
            />
          </g>
        ))}
      </svg>
      {placed.map(({ callout, labelY }) => (
        <div
          key={callout.label}
          ref={(node) => {
            if (node) markers.current.set(callout.label, node)
            else markers.current.delete(callout.label)
          }}
          aria-hidden="true"
          style={
            callout.side === "left"
              ? { top: labelY, right: bounds.width - edge("left") }
              : { top: labelY, left: edge("right") }
          }
          className="pointer-events-none absolute z-60 w-max -translate-y-1/2 rounded-md bg-background px-2.5 py-1.5 text-sm leading-none font-medium whitespace-nowrap shadow-xs ring-1 ring-border"
        >
          {callout.label}
        </div>
      ))}
    </div>
  )
}
