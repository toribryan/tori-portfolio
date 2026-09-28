"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"
import { RECOMMENDATIONS } from "@/features/portfolio/data/recommendations"

/*
 * A pannable dot-grid canvas with Figma-style comment pins, one per LinkedIn
 * recommendation. Drag (or scroll sideways) to look around; hover, tap or tab
 * to a pin to open its comment. Touch has no hover, and a tap doesn't focus
 * a button everywhere, so a tap opens the comment through `open` instead,
 * and it stays open until the next tap, a drag or Escape. The world is larger than the header, so some
 * comments start out of view.
 *
 * The canvas is its own stacking context, so the avatar and name cells that
 * sit on top of it always cover an open comment, and comments open within
 * the strip above those cells, the part marked `data-hero-canvas-open`.
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
// the centre so most are in view before any panning. Pins sit in two bands
// of the open strip: near the top they open down, near the bottom they open
// up, so every comment has room to open inside it.
const PINS = [
  { x: 420, y: 24 },
  { x: 600, y: 148 },
  { x: 820, y: 36 },
  { x: 250, y: 140 },
  { x: 740, y: 16 },
  { x: 470, y: 160 },
]

type Offset = { x: number; y: number }

export function HeroCanvas({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState<Offset | null>(null)
  const [dragging, setDragging] = useState(false)
  const drag = useRef<{ pointer: Offset; start: Offset } | null>(null)
  const [open, setOpen] = useState<number | null>(null)

  useEffect(() => {
    if (open === null) return
    const close = (event: Event) => {
      if (event instanceof KeyboardEvent && event.key !== "Escape") return
      if ((event.target as Element | null)?.closest?.("[data-pin]")) return
      setOpen(null)
    }
    document.addEventListener("pointerdown", close)
    document.addEventListener("keydown", close)
    return () => {
      document.removeEventListener("pointerdown", close)
      document.removeEventListener("keydown", close)
    }
  }, [open])

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

  // Keyboard users can't drag, so focusing a pin pans it into view. Only
  // sideways, so the pin keeps its band in the open strip.
  const reveal = (pin: Offset) => {
    const el = ref.current
    if (!el) return
    const at = current()
    const vx = pin.x + at.x
    const margin = 48
    if (vx >= margin && vx <= el.clientWidth - margin) return
    setOffset(clamp({ x: el.clientWidth / 2 - pin.x, y: at.y }))
  }

  const position = offset
    ? { left: offset.x, top: offset.y }
    : { left: `calc(50% - ${WORLD.width / 2}px)`, top: 0 }

  return (
    <div
      ref={ref}
      className={cn(
        "isolate touch-pan-y overflow-hidden bg-[color-mix(in_oklab,var(--color-foreground)_2.5%,var(--color-background))] [background-image:radial-gradient(color-mix(in_oklab,var(--color-foreground)_14%,transparent)_1px,transparent_1px)] [background-size:16px_16px] select-none",
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
              open={open === index}
              onToggle={() =>
                setOpen((prev) => (prev === index ? null : index))
              }
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
  open,
  onToggle,
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
  open: boolean
  onToggle: () => void
  onFocus: () => void
} & (typeof RECOMMENDATIONS)[number]) {
  const comment = useRef<HTMLDivElement>(null)
  const [place, setPlace] = useState({ x: "right", y: "up", shift: 0 })

  // Open up and to the right like Figma, flipping on either axis when the
  // comment would run out of the open strip that way. On a canvas too narrow
  // for it on either side of the pin, it slides sideways to stay inside.
  const aim = (event: React.SyntheticEvent<HTMLElement>) => {
    const el = canvas.current
    const card = comment.current
    if (!el || !card) return
    const box = el.getBoundingClientRect()
    const open =
      el.parentElement
        ?.querySelector("[data-hero-canvas-open]")
        ?.getBoundingClientRect() ?? box
    const at = event.currentTarget.getBoundingClientRect()
    const above = at.bottom - open.top
    const below = open.bottom - at.top
    const inset = 8
    const toRight = box.right - inset - (at.left - 8)
    const toLeft = at.right + 8 - (box.left + inset)
    const width = card.offsetWidth
    const x =
      toRight >= width || (toLeft < width && toRight >= toLeft)
        ? "right"
        : "left"
    setPlace({
      x,
      y: above < card.offsetHeight && below > above ? "down" : "up",
      shift:
        x === "right"
          ? Math.min(0, toRight - width)
          : Math.max(0, width - toLeft),
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
    "translate-y-1 opacity-0 transition-[opacity,translate] duration-300 ease-out group-focus-within:translate-y-0 group-focus-within:opacity-100 group-data-open:translate-y-0 group-data-open:opacity-100 group-hover:translate-y-0 group-hover:opacity-100 motion-reduce:translate-y-0 motion-reduce:transition-none"

  return (
    <div
      data-pin
      data-open={open || undefined}
      className="group absolute z-0 focus-within:z-20 hover:z-20 data-open:z-20"
      style={{ left: pin.x, top: pin.y }}
      onPointerEnter={aim}
    >
      <span
        className="block animate-pin group-focus-within:[animation-play-state:paused] group-hover:[animation-play-state:paused] group-data-open:[animation-play-state:paused] motion-reduce:animate-none"
        style={{ "--pin-delay": `${index * 70}ms` } as React.CSSProperties}
      >
        <button
          type="button"
          aria-describedby={id}
          aria-label={`Recommendation from ${name}`}
          aria-expanded={open}
          onPointerUp={(event) => {
            if (event.pointerType === "mouse") return
            aim(event)
            if (open) event.currentTarget.blur()
            onToggle()
          }}
          onFocus={(event) => {
            aim(event)
            onFocus()
          }}
          className="block cursor-pointer rounded-full rounded-bl-none bg-background p-0.5 shadow-md transition-[scale,box-shadow] duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] outline-none group-hover:scale-110 group-hover:shadow-lg group-data-open:scale-110 group-data-open:shadow-lg focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none"
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
          "pointer-events-none absolute flex w-80 max-w-[calc(100vw-2rem)] scale-[0.6] items-start gap-2.5 rounded-[1.25rem] bg-popover p-2.5 pr-4 opacity-0 shadow-lg ring-1 ring-line blur-[2px] transition-[opacity,scale,filter] duration-300 ease-[cubic-bezier(0.34,1.3,0.64,1)] group-focus-within:scale-100 group-focus-within:opacity-100 group-focus-within:blur-none group-hover:scale-100 group-hover:opacity-100 group-hover:blur-none group-data-open:scale-100 group-data-open:opacity-100 group-data-open:blur-none motion-reduce:scale-100 motion-reduce:blur-none motion-reduce:transition-none",
          place.x === "right"
            ? "-left-2"
            : "-right-2 flex-row-reverse pr-2.5 pl-4",
          place.y === "up" ? "-bottom-1" : "-top-2",
          // The growth origin sits on the pin, and so does the pointed
          // corner unless the comment has slid away from it.
          {
            "origin-bottom-left": place.y === "up" && place.x === "right",
            "origin-bottom-right": place.y === "up" && place.x === "left",
            "origin-top-left": place.y === "down" && place.x === "right",
            "origin-top-right": place.y === "down" && place.x === "left",
          },
          place.shift === 0 && {
            "rounded-bl-none": place.y === "up" && place.x === "right",
            "rounded-br-none": place.y === "up" && place.x === "left",
            "rounded-tl-none": place.y === "down" && place.x === "right",
            "rounded-tr-none": place.y === "down" && place.x === "left",
          }
        )}
        style={{ translate: `${place.shift}px 0` }}
      >
        {avatar}
        <div className="min-w-0 flex-1 pt-0.5">
          <p
            className={cn(
              "flex flex-wrap items-baseline gap-x-1.5 text-sm group-focus-within:delay-75 group-hover:delay-75 group-data-open:delay-75",
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
              "mt-0.5 text-sm text-pretty text-foreground group-focus-within:delay-125 group-hover:delay-125 group-data-open:delay-125",
              line
            )}
          >
            {quote}
          </p>
          <p
            className={cn(
              "mt-1.5 text-xs text-muted-foreground group-focus-within:delay-175 group-hover:delay-175 group-data-open:delay-175",
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
