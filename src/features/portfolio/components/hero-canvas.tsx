"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"
import { RECOMMENDATIONS } from "@/features/portfolio/data/recommendations"

/*
 * A pannable dot-grid canvas with Figma-style comment pins, one per LinkedIn
 * recommendation. Drag (or scroll sideways) to look around; hover, tap or tab
 * to a pin to open its comment. The world is larger than the header, so some
 * comments start out of view.
 *
 * Panning moves the world with `left`/`top` rather than a transform, so the
 * canvas never becomes a stacking context: an open comment can rise above
 * the avatar and name cells that sit on top of the canvas.
 */

const WORLD = { width: 1100, height: 400 }

// Avatar fills, in RECOMMENDATIONS order, so shared initials stay apart.
const COLORS = [
  "#3E97A8",
  "#7C5CD6",
  "#D9704F",
  "#4C8A5A",
  "#C2577A",
  "#4A6FD1",
]

// World coordinates for each pin, in RECOMMENDATIONS order, clustered around
// the centre so most are in view before any panning.
const PINS = [
  { x: 420, y: 24 },
  { x: 600, y: 84 },
  { x: 820, y: 36 },
  { x: 250, y: 72 },
  { x: 740, y: 124 },
  { x: 470, y: 132 },
]

type Offset = { x: number; y: number }

export function HeroCanvas({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState<Offset | null>(null)
  const [dragging, setDragging] = useState(false)
  const drag = useRef<{ pointer: Offset; start: Offset } | null>(null)

  const clamp = useCallback((next: Offset): Offset => {
    const el = ref.current
    if (!el) return next
    const minX = Math.min(0, el.clientWidth - WORLD.width)
    const minY = Math.min(0, el.clientHeight - WORLD.height)
    return {
      x: Math.round(Math.min(0, Math.max(minX, next.x))),
      y: Math.round(Math.min(0, Math.max(minY, next.y))),
    }
  }, [])

  const current = useCallback(
    (): Offset =>
      offset ?? {
        x: ((ref.current?.clientWidth ?? 0) - WORLD.width) / 2,
        y: 0,
      },
    [offset]
  )

  const panBy = useCallback(
    (dx: number, dy: number) => {
      setOffset((prev) => {
        const base = prev ?? {
          x: ((ref.current?.clientWidth ?? 0) - WORLD.width) / 2,
          y: 0,
        }
        return clamp({ x: base.x + dx, y: base.y + dy })
      })
    },
    [clamp]
  )

  // Sideways trackpad scrolls pan the canvas; vertical ones still scroll the
  // page. Registered natively because React's wheel listener is passive.
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return
      event.preventDefault()
      panBy(-event.deltaX, 0)
    }
    el.addEventListener("wheel", onWheel, { passive: false })
    return () => el.removeEventListener("wheel", onWheel)
  }, [panBy])

  useEffect(() => {
    const onResize = () => setOffset((prev) => (prev ? clamp(prev) : prev))
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [clamp])

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return
    if ((event.target as HTMLElement).closest("button, a")) return
    event.currentTarget.setPointerCapture(event.pointerId)
    drag.current = {
      pointer: { x: event.clientX, y: event.clientY },
      start: current(),
    }
    setDragging(true)
  }

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current
    if (!d) return
    setOffset(
      clamp({
        x: d.start.x + event.clientX - d.pointer.x,
        y: d.start.y + event.clientY - d.pointer.y,
      })
    )
  }

  const endDrag = () => {
    drag.current = null
    setDragging(false)
  }

  // Keyboard users can't drag, so focusing a pin brings it into view.
  const reveal = (pin: Offset) => {
    const el = ref.current
    if (!el) return
    const at = current()
    const vx = pin.x + at.x
    const vy = pin.y + at.y
    const margin = 48
    if (
      vx >= margin &&
      vx <= el.clientWidth - margin &&
      vy >= 0 &&
      vy <= el.clientHeight / 2
    )
      return
    setOffset(clamp({ x: el.clientWidth / 2 - pin.x, y: 24 - pin.y }))
  }

  const position = offset
    ? { left: offset.x, top: offset.y }
    : { left: `calc(50% - ${WORLD.width / 2}px)`, top: 0 }

  return (
    <div
      ref={ref}
      className={cn(
        "touch-pan-y overflow-hidden bg-[color-mix(in_oklab,var(--color-foreground)_2.5%,var(--color-background))] [background-image:radial-gradient(color-mix(in_oklab,var(--color-foreground)_14%,transparent)_1px,transparent_1px)] [background-size:16px_16px] select-none",
        dragging ? "cursor-grabbing" : "cursor-grab",
        className
      )}
      style={{
        backgroundPosition: offset
          ? `${offset.x}px ${offset.y}px`
          : `calc(50% - ${WORLD.width / 2}px) 0`,
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <div
        className="absolute"
        style={{ ...position, width: WORLD.width, height: WORLD.height }}
      >
        {RECOMMENDATIONS.map((rec, index) => {
          const pin = PINS[index]
          if (!pin) return null
          return (
            <Pin
              key={rec.name}
              id={`hero-comment-${index}`}
              index={index}
              pin={pin}
              color={COLORS[index % COLORS.length]!}
              canvas={ref}
              onFocus={() => reveal(pin)}
              {...rec}
            />
          )
        })}
      </div>
    </div>
  )
}

function Pin({
  id,
  index,
  pin,
  color,
  canvas,
  onFocus,
  name,
  role,
  date,
  quote,
}: {
  id: string
  index: number
  pin: Offset
  color: string
  canvas: React.RefObject<HTMLDivElement | null>
  onFocus: () => void
} & (typeof RECOMMENDATIONS)[number]) {
  const comment = useRef<HTMLDivElement>(null)
  const [place, setPlace] = useState({ x: "right", y: "up" })

  // Open up and to the right like Figma, flipping on either axis when the
  // comment would run out of the canvas that way.
  const aim = (event: React.SyntheticEvent<HTMLElement>) => {
    const box = canvas.current?.getBoundingClientRect()
    const card = comment.current
    if (!box || !card) return
    const at = event.currentTarget.getBoundingClientRect()
    setPlace({
      x: at.left - box.left + card.offsetWidth > box.width ? "left" : "right",
      y: at.bottom - box.top - card.offsetHeight < 0 ? "down" : "up",
    })
  }

  const avatar = (
    <span
      className="grid size-7 shrink-0 place-items-center rounded-full text-sm font-medium text-white"
      style={{ backgroundColor: color }}
      aria-hidden
    >
      {name[0]}
    </span>
  )

  // Each line of the comment rises in just after the card opens, one after
  // another; closing drops them at once.
  const line =
    "translate-y-1 opacity-0 transition-[opacity,translate] duration-300 ease-out group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:translate-y-0 group-hover:opacity-100 motion-reduce:translate-y-0 motion-reduce:transition-none"

  return (
    <div
      className="group absolute z-0 focus-within:z-20 hover:z-20"
      style={{ left: pin.x, top: pin.y }}
      onPointerEnter={aim}
    >
      <span
        className="block animate-pin group-focus-within:[animation-play-state:paused] group-hover:[animation-play-state:paused] motion-reduce:animate-none"
        style={{ "--pin-delay": `${index * 70}ms` } as React.CSSProperties}
      >
        <button
          type="button"
          aria-describedby={id}
          aria-label={`Recommendation from ${name}`}
          onFocus={(event) => {
            aim(event)
            onFocus()
          }}
          className="block cursor-pointer rounded-full rounded-bl-none bg-background p-0.5 shadow-md transition-[scale,box-shadow] duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] outline-none group-hover:scale-110 group-hover:shadow-lg focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none"
        >
          {avatar}
        </button>
      </span>

      {/* The comment grows out of the pin the way Figma's does, springing
          open from the corner that sits on the pin. */}
      <div
        ref={comment}
        id={id}
        role="tooltip"
        className={cn(
          "pointer-events-none absolute flex w-72 scale-[0.6] items-start gap-2.5 rounded-[1.25rem] bg-popover p-2.5 pr-4 opacity-0 shadow-lg ring-1 ring-line blur-[2px] transition-[opacity,scale,filter] duration-300 ease-[cubic-bezier(0.34,1.3,0.64,1)] group-focus-within:scale-100 group-focus-within:opacity-100 group-focus-within:blur-none group-hover:scale-100 group-hover:opacity-100 group-hover:blur-none motion-reduce:scale-100 motion-reduce:blur-none motion-reduce:transition-none",
          place.x === "right"
            ? "-left-2"
            : "-right-2 flex-row-reverse pr-2.5 pl-4",
          place.y === "up" ? "-bottom-1" : "-top-2",
          // The pointed corner and the growth origin sit on the pin.
          {
            "origin-bottom-left rounded-bl-none":
              place.y === "up" && place.x === "right",
            "origin-bottom-right rounded-br-none":
              place.y === "up" && place.x === "left",
            "origin-top-left rounded-tl-none":
              place.y === "down" && place.x === "right",
            "origin-top-right rounded-tr-none":
              place.y === "down" && place.x === "left",
          }
        )}
      >
        {avatar}
        <div className="min-w-0 flex-1 pt-0.5">
          <p
            className={cn(
              "flex flex-wrap items-baseline gap-x-1.5 text-sm group-focus-within:delay-75 group-hover:delay-75",
              line
            )}
          >
            <span className="font-medium text-foreground">{name}</span>
            <time className="text-muted-foreground" dateTime={date}>
              {ago(date)}
            </time>
          </p>
          <p
            className={cn(
              "mt-0.5 text-sm text-pretty text-foreground group-focus-within:delay-125 group-hover:delay-125",
              line
            )}
          >
            {quote}
          </p>
          <p
            className={cn(
              "mt-1.5 text-xs text-muted-foreground group-focus-within:delay-175 group-hover:delay-175",
              line
            )}
          >
            {role}, via LinkedIn
          </p>
        </div>
      </div>
    </div>
  )
}

/** Figma-style relative time for a `YYYY-MM` month: "3 mo. ago", "2 yr. ago". */
function ago(date: string) {
  const [year, month] = date.split("-").map(Number)
  const now = new Date()
  const months =
    (now.getUTCFullYear() - year!) * 12 + (now.getUTCMonth() + 1 - month!)
  if (months < 1) return "this month"
  if (months < 12) return `${months} mo. ago`
  return `${Math.floor(months / 12)} yr. ago`
}
