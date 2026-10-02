"use client"

import { useEffect, useId, useRef, useState } from "react"
import { RotateCwIcon } from "lucide-react"
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "motion/react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/base/ui/button"

/*
 * fibo's Voice memo device as an object you can pick up: the same drawn
 * aluminium face, given a back and a thickness, in CSS 3D. The face is ported
 * from fibo's voice-memo.tsx, where it's a flat button.
 */

// Three-quarters on, tipped back a little, so the edge shows at rest.
const REST = { x: -14, y: -28 }

// The thickness is a stack of rounded slices, close enough together that
// they read as a solid edge when the device is turned side-on.
const SLICES = 22

// 85 by 55, a bank card's proportions, in a unit of 2.
const FACE = { width: 170, height: 110, radius: 12 }

const SPRING = { type: "spring", stiffness: 120, damping: 17 } as const
const QUICK = { duration: 0.25, ease: "easeOut" } as const

// The angle of the face nearest `y`, front or back.
function nearestFace(y: number) {
  return Math.round((y - REST.y) / 180) * 180 + REST.y
}

function isBack(y: number) {
  return Math.abs(Math.round((y - REST.y) / 180)) % 2 === 1
}

/**
 * The device in 3D. Interactive, it turns under a drag, coasts and settles
 * on a face when let go, and flips on a click, Space or Enter. Otherwise it
 * turns to `turns` half-turns from rest, for a cover.
 */
export function VoiceMemoObject({
  interactive = true,
  turns = 0,
  float = interactive,
  className,
}: {
  interactive?: boolean
  /** Half-turns from rest when not interactive: 1 shows the back. */
  turns?: number
  /** Bobs gently in place. */
  float?: boolean
  className?: string
}) {
  const reduceMotion = useReducedMotion()
  const rx = useMotionValue(REST.x)
  const ry = useMotionValue(REST.y)
  const [back, setBack] = useState(false)

  // The reflection slides across the metal as it turns, and the shadow on
  // the ground narrows as the device goes edge-on.
  const sheen = useTransform(ry, (y) => {
    const turned = ((((y - REST.y) % 360) + 540) % 360) - 180
    return `${turned * 0.9}px`
  })
  const shadowScale = useTransform(
    ry,
    (y) => 0.45 + 0.55 * Math.abs(Math.cos((y * Math.PI) / 180))
  )

  useEffect(() => {
    if (interactive) return
    const controls = animate(
      ry,
      REST.y + turns * 180,
      reduceMotion ? QUICK : { ...SPRING, stiffness: 70 }
    )
    return () => controls.stop()
  }, [interactive, turns, ry, reduceMotion])

  const settle = (target: number) => {
    const transition = reduceMotion ? QUICK : SPRING
    animate(ry, target, transition)
    animate(rx, REST.x, transition)
    setBack(isBack(target))
  }

  const flip = (direction = 1) =>
    settle(nearestFace(ry.get()) + 180 * direction)

  const drag = useRef<{
    id: number
    x: number
    y: number
    rx: number
    ry: number
    moved: boolean
    lastX: number
    lastT: number
    velocity: number
  } | null>(null)

  return (
    <div
      className={cn(
        "not-prose @container relative flex w-full flex-col items-center",
        className
      )}
    >
      <div
        role={interactive ? "group" : undefined}
        aria-roledescription={interactive ? "3D model" : undefined}
        aria-label={
          interactive
            ? "fibo voice memo device. Drag to turn it, or press Enter to flip it over."
            : undefined
        }
        tabIndex={interactive ? 0 : undefined}
        className={cn(
          "relative flex aspect-[16/10] w-full touch-pan-y items-center justify-center outline-none select-none [perspective:1400px]",
          "[--t:calc(var(--w)*0.055)] [--w:min(62cqw,24rem)]",
          interactive &&
            "cursor-grab rounded-2xl focus-visible:ring-[3px] focus-visible:ring-ring/50 active:cursor-grabbing"
        )}
        onKeyDown={(event) => {
          if (!interactive) return
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault()
            flip()
          } else if (event.key === "ArrowRight") {
            event.preventDefault()
            flip(1)
          } else if (event.key === "ArrowLeft") {
            event.preventDefault()
            flip(-1)
          }
        }}
        onPointerDown={(event) => {
          if (!interactive || event.button !== 0) return
          event.currentTarget.setPointerCapture(event.pointerId)
          rx.stop()
          ry.stop()
          drag.current = {
            id: event.pointerId,
            x: event.clientX,
            y: event.clientY,
            rx: rx.get(),
            ry: ry.get(),
            moved: false,
            lastX: event.clientX,
            lastT: event.timeStamp,
            velocity: 0,
          }
        }}
        onPointerMove={(event) => {
          const current = drag.current
          if (!current || current.id !== event.pointerId) return
          const dx = event.clientX - current.x
          const dy = event.clientY - current.y
          if (!current.moved && Math.hypot(dx, dy) < 4) return
          current.moved = true
          ry.set(current.ry + dx * 0.55)
          rx.set(Math.max(-70, Math.min(70, current.rx - dy * 0.35)))
          // Degrees a millisecond, smoothed, for the coast after letting go.
          const dt = Math.max(1, event.timeStamp - current.lastT)
          const instant = ((event.clientX - current.lastX) * 0.55) / dt
          current.velocity = current.velocity * 0.6 + instant * 0.4
          current.lastX = event.clientX
          current.lastT = event.timeStamp
        }}
        onPointerUp={(event) => {
          const current = drag.current
          if (!current || current.id !== event.pointerId) return
          drag.current = null
          if (!current.moved) {
            flip()
            return
          }
          // A flick carries on turning; it lands on whichever face it's
          // nearest once it would have slowed down.
          const coast = reduceMotion ? 0 : current.velocity * 280
          settle(nearestFace(ry.get() + coast))
        }}
        onPointerCancel={() => {
          drag.current = null
          settle(nearestFace(ry.get()))
        }}
      >
        <motion.span
          aria-hidden
          className="pointer-events-none absolute top-[calc(50%+var(--w)*0.36)] left-1/2 h-[calc(var(--w)*0.1)] w-(--w) -translate-x-1/2 rounded-[50%] bg-black/25 blur-xl dark:bg-black/60"
          style={{ scaleX: shadowScale }}
        />
        <motion.div
          aria-hidden
          className="relative"
          animate={float && !reduceMotion ? { y: [0, -6, 0] } : undefined}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformStyle: "preserve-3d" }}
        >
          <Body rx={rx} ry={ry} sheen={sheen} />
        </motion.div>
      </div>

      {interactive ? (
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span className="hidden sm:inline">Drag to turn it</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => flip()}
            aria-label={back ? "Flip to the front" : "Flip to the back"}
          >
            <RotateCwIcon data-icon="inline-start" />
            Flip
          </Button>
          <span role="status" className="sr-only">
            {back ? "Showing the back" : "Showing the front"}
          </span>
        </div>
      ) : null}
    </div>
  )
}

function Body({
  rx,
  ry,
  sheen,
}: {
  rx: MotionValue<number>
  ry: MotionValue<number>
  sheen: MotionValue<string>
}) {
  // Which way the front faces, from the two rotations. backface-visibility
  // alone lets the back's filtered drawing ghost through mid-turn, so the
  // face turned away is hidden outright.
  const facing = useTransform(
    [rx, ry],
    ([x, y]: number[]) =>
      Math.cos((x * Math.PI) / 180) * Math.cos((y * Math.PI) / 180)
  )
  const front = useTransform(facing, (f) => (f >= 0 ? 1 : 0))
  const back = useTransform(facing, (f) => (f < 0 ? 1 : 0))

  return (
    <motion.div
      className="relative aspect-[85/55] w-(--w)"
      style={
        {
          rotateX: rx,
          rotateY: ry,
          transformStyle: "preserve-3d",
          "--sheen": sheen,
        } as never
      }
    >
      {Array.from({ length: SLICES }, (_, index) => {
        const depth = index / (SLICES - 1) - 0.5
        // The edge darkens toward its middle, away from the light catching
        // the chamfers at either face.
        const shade = 10 + (1 - Math.abs(depth) * 2) * 14
        return (
          <span
            key={index}
            className="absolute inset-0 rounded-[7%/11%]"
            style={{
              transform: `translateZ(calc(var(--t) * ${depth * 0.96}))`,
              background: `color-mix(in oklab, var(--muted), black ${shade}%)`,
            }}
          />
        )
      })}
      <motion.span
        className="absolute inset-0 [backface-visibility:hidden]"
        style={{
          transform: "translateZ(calc(var(--t) * 0.5 + 1px))",
          opacity: front,
        }}
      >
        <Face side="front" />
      </motion.span>
      <motion.span
        className="absolute inset-0 [backface-visibility:hidden]"
        style={{
          transform: "rotateY(180deg) translateZ(calc(var(--t) * 0.5 + 1px))",
          opacity: back,
        }}
      >
        <Face side="back" />
      </motion.span>
    </motion.div>
  )
}

/*
 * One face of the aluminium, drawn rather than photographed so it takes the
 * theme: silver in light, space gray in dark. The front carries the raised
 * wordmark and the microphone pinhole, the back a debossed magnet ring.
 */
function Face({ side }: { side: "front" | "back" }) {
  const id = useId()
  const ids = {
    pits: `${id}-pits`,
    glints: `${id}-glints`,
    shade: `${id}-shade`,
    sheen: `${id}-sheen`,
    clip: `${id}-clip`,
  }
  const { width, height, radius } = FACE
  const wordmark = "fibo"

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="absolute inset-0 size-full overflow-visible"
    >
      <defs>
        {/* Bead-blasted grain: fine noise, the same in every direction,
            pushed so only its peaks survive as specks. Two seeds give dark
            pits and bright glints that don't line up. */}
        {[
          { id: ids.pits, seed: side === "front" ? 4 : 7 },
          { id: ids.glints, seed: side === "front" ? 11 : 13 },
        ].map((grain) => (
          <filter
            key={grain.id}
            id={grain.id}
            x="0"
            y="0"
            width="100%"
            height="100%"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="1.6"
              numOctaves="2"
              seed={grain.seed}
            />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  2.4 0 0 0 -1.05"
            />
            <feComposite in="SourceGraphic" operator="in" />
          </filter>
        ))}
        <linearGradient
          id={ids.shade}
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="0"
          x2={width * 0.6}
          y2={height}
        >
          <stop
            offset="0"
            style={{ stopColor: "var(--background)", stopOpacity: 0.6 }}
          />
          <stop
            offset="0.45"
            style={{ stopColor: "var(--background)", stopOpacity: 0 }}
          />
          <stop
            offset="1"
            style={{ stopColor: "var(--foreground)", stopOpacity: 0.13 }}
          />
        </linearGradient>
        <linearGradient id={ids.sheen} x1="0" y1="0" x2="1" y2="0">
          <stop
            offset="0"
            style={{ stopColor: "var(--background)", stopOpacity: 0 }}
          />
          <stop
            offset="0.5"
            style={{ stopColor: "var(--background)", stopOpacity: 0.5 }}
          />
          <stop
            offset="1"
            style={{ stopColor: "var(--background)", stopOpacity: 0 }}
          />
        </linearGradient>
        <clipPath id={ids.clip}>
          <rect width={width} height={height} rx={radius} />
        </clipPath>
      </defs>

      <rect width={width} height={height} rx={radius} className="fill-muted" />
      <rect
        width={width}
        height={height}
        rx={radius}
        fill={`url(#${ids.shade})`}
      />

      {side === "front" ? (
        <g fontSize={50} className="font-serif">
          {[
            { dy: -0.9, className: "fill-background opacity-90" },
            { dy: 0.9, className: "fill-foreground opacity-25" },
            { dy: 0, className: "fill-muted" },
          ].map((layer) => (
            <text
              key={layer.dy}
              x={14}
              y={height - 16 + layer.dy}
              className={layer.className}
            >
              {wordmark}
            </text>
          ))}
        </g>
      ) : null}

      {/* Anodized aluminium is a mid gray; the muted role alone is near
          white in the light theme. */}
      <rect
        width={width}
        height={height}
        rx={radius}
        className="fill-foreground opacity-[0.12] dark:opacity-0"
      />
      <rect
        width={width}
        height={height}
        rx={radius}
        filter={`url(#${ids.pits})`}
        className="fill-foreground opacity-20"
      />
      <rect
        width={width}
        height={height}
        rx={radius}
        filter={`url(#${ids.glints})`}
        className="fill-background opacity-35"
      />

      {side === "front" ? (
        // The lettering's edges again, over the grain, which would otherwise
        // break up the only thing that says the letters are raised.
        <g fontSize={50} fill="none" strokeWidth={0.7} className="font-serif">
          <text
            x={14}
            y={height - 16.5}
            className="stroke-background opacity-80"
          >
            {wordmark}
          </text>
          <text
            x={14}
            y={height - 15.5}
            className="stroke-foreground opacity-25"
          >
            {wordmark}
          </text>
        </g>
      ) : (
        // A magnet ring pressed into the back, lit from above: dark on its
        // upper wall, bright on its lower one. Then a line of small print.
        <g fill="none" strokeWidth={1.4}>
          <circle
            cx={width / 2}
            cy={height / 2 - 4}
            r={28}
            className="stroke-foreground opacity-25"
            transform="translate(0 -0.6)"
          />
          <circle
            cx={width / 2}
            cy={height / 2 - 4}
            r={28}
            className="stroke-background opacity-80"
            transform="translate(0 0.6)"
          />
          <text
            x={width / 2}
            y={height - 12}
            fontSize={5.2}
            letterSpacing={0.8}
            textAnchor="middle"
            stroke="none"
            className="fill-foreground font-mono opacity-40"
          >
            VOICE MEMO · FIBO.TORIBRYAN.COM
          </text>
        </g>
      )}

      {/* The reflection, moved along by --sheen as the device turns. */}
      <g clipPath={`url(#${ids.clip})`}>
        <g style={{ transform: "translateX(var(--sheen, 0px))" }}>
          <rect
            x={-20}
            y={-height}
            width={36}
            height={height * 3}
            fill={`url(#${ids.sheen})`}
            transform={`rotate(24 ${width / 2} ${height / 2})`}
          />
        </g>
      </g>

      <rect
        x={0.9}
        y={0.9}
        width={width - 1.8}
        height={height - 1.8}
        rx={radius - 0.9}
        fill="none"
        strokeWidth={1.2}
        className="stroke-background opacity-80"
      />
      <rect
        width={width}
        height={height}
        rx={radius}
        fill="none"
        strokeWidth={0.75}
        className="stroke-foreground opacity-15"
      />

      {side === "front" ? (
        <circle
          cx={width - 16}
          cy={16}
          r={1.8}
          className="fill-foreground opacity-50"
        />
      ) : null}
    </svg>
  )
}
