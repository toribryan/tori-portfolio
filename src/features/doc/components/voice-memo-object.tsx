"use client"

import {
  useEffect,
  useId,
  useRef,
  useState,
  type MouseEvent,
  type PointerEvent,
} from "react"
import { RotateCwIcon } from "lucide-react"
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "motion/react"
import { toast } from "sonner"

import {
  decodeAudioData,
  playSound,
  soundSource,
} from "@/lib/soundcn/sound-engine"
import type { SoundAsset } from "@/lib/soundcn/sound-types"
import {
  cardSlideSound,
  click8bitSound,
  dropSound,
  maximizeSound,
} from "@/lib/soundcn/voice-memo"
import { cn } from "@/lib/utils"
import { Button } from "@/components/base/ui/button"
import { VoiceMemo } from "@/components/fibo/voice-memo"

/*
 * fibo's Voice memo device as an object you can pick up: the same drawn
 * aluminium face, given a back and a thickness, in CSS 3D. The face is ported
 * from fibo's voice-memo.tsx, where it's a flat button.
 */

type Pose = { x: number; y: number }

// On the card, three-quarters on and tipped back, so the edge shows.
const ANGLED: Pose = { x: -14, y: -28 }

// On its page, square to the screen, the way you'd hold it up to read.
const STRAIGHT: Pose = { x: 0, y: 0 }

// The thickness is a stack of rounded slices, close enough together that
// they read as a solid edge when the device is turned side-on.
const SLICES = 22

// 85 by 55, a bank card's proportions, in a unit of 2.
const FACE = { width: 170, height: 110, radius: 12 }

const SPRING = { type: "spring", stiffness: 120, damping: 17 } as const
const QUICK = { duration: 0.25, ease: "easeOut" } as const

// Sizes the device from the width it's given, and its edge from that.
const SIZE = "[--w:min(62cqw,24rem)] [--t:calc(var(--w)*0.055)]"

// Degrees a millisecond at release, about 1,800 pixels a second, past which
// a flick spins the device through a few fast turns.
const SPIN_SPEED = 1
// Two and a half turns lands it on its other face.
const SPIN_TURNS = 900
const SPIN = { duration: 0.8, ease: [0.16, 1, 0.3, 1] } as const

/**
 * Rotation for the device, with a drag that turns it, coasts when let go and
 * settles on whichever face is nearest. A hard flick spins it instead, and
 * calls `onSpin`. A drag never also counts as a press, so the device can be
 * a button underneath.
 */
function useTurn(rest: Pose, { onSpin }: { onSpin?: () => void } = {}) {
  const reduceMotion = useReducedMotion()
  const rx = useMotionValue(rest.x)
  const ry = useMotionValue(rest.y)
  const [back, setBack] = useState(false)

  const nearestFace = (y: number) =>
    Math.round((y - rest.y) / 180) * 180 + rest.y

  const settle = (target: number, spin = false) => {
    const transition = reduceMotion ? QUICK : SPRING
    animate(ry, target, spin ? SPIN : transition)
    animate(rx, rest.x, transition)
    setBack(Math.abs(Math.round((target - rest.y) / 180)) % 2 === 1)
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
  const dragged = useRef(false)

  const handlers = {
    onPointerDown: (event: PointerEvent<HTMLElement>) => {
      if (event.button !== 0) return
      dragged.current = false
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
    },
    onPointerMove: (event: PointerEvent<HTMLElement>) => {
      const current = drag.current
      if (!current || current.id !== event.pointerId) return
      const dx = event.clientX - current.x
      const dy = event.clientY - current.y
      if (!current.moved) {
        if (Math.hypot(dx, dy) < 6) return
        current.moved = true
        // Captured only once it's a drag, so a tap still reaches the button.
        event.currentTarget.setPointerCapture(event.pointerId)
      }
      ry.set(current.ry + dx * 0.55)
      rx.set(Math.max(-70, Math.min(70, current.rx - dy * 0.35)))
      // Degrees a millisecond, smoothed, for the coast after letting go.
      const dt = Math.max(1, event.timeStamp - current.lastT)
      const instant = ((event.clientX - current.lastX) * 0.55) / dt
      current.velocity = current.velocity * 0.6 + instant * 0.4
      current.lastX = event.clientX
      current.lastT = event.timeStamp
    },
    onPointerUp: (event: PointerEvent<HTMLElement>) => {
      const current = drag.current
      if (!current || current.id !== event.pointerId) return
      drag.current = null
      if (!current.moved) return
      dragged.current = true
      // A flick carries on turning; it lands on whichever face it's nearest
      // once it would have slowed down.
      if (!reduceMotion && Math.abs(current.velocity) > SPIN_SPEED) {
        settle(
          nearestFace(ry.get() + Math.sign(current.velocity) * SPIN_TURNS),
          true
        )
        onSpin?.()
        return
      }
      const coast = reduceMotion ? 0 : current.velocity * 280
      settle(nearestFace(ry.get() + coast))
    },
    onPointerCancel: () => {
      drag.current = null
      settle(nearestFace(ry.get()))
    },
    // The click a drag ends on would otherwise press the button.
    onClickCapture: (event: MouseEvent) => {
      if (!dragged.current) return
      dragged.current = false
      event.preventDefault()
      event.stopPropagation()
    },
  }

  return { rx, ry, back, flip, handlers }
}

// Small on its page, so the transcript has room beside it.
const SMALL = "[--w:min(44cqw,13rem)]"

/**
 * The device on its page: a record button you can also pick up. Press it and
 * it slides to the right as the transcript opens on its left, filling in as
 * you talk; press it again to stop, then copy the text or save it as
 * Markdown. Drag it to turn it over. In a narrow column the transcript opens
 * underneath instead.
 */
export function VoiceMemoHero({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion()
  // Quiet under reduced motion, like the site's other sounds.
  const play = (sound: SoundAsset) => {
    if (reduceMotion) return
    playSound(soundSource(sound), { volume: 0.5 }).catch(() => {
      // No audio output, or the browser hasn't allowed sound yet. Neither is
      // worth reporting for a decorative sound.
    })
  }
  const { rx, ry, back, flip, handlers } = useTurn(STRAIGHT, {
    onSpin: () => play(maximizeSound),
  })
  const [recording, setRecording] = useState(false)
  const [, setDismissals] = useState(0)

  // Decoded ahead, so the first press sounds at once.
  useEffect(() => {
    for (const sound of [
      dropSound,
      click8bitSound,
      maximizeSound,
      cardSlideSound,
    ]) {
      decodeAudioData(soundSource(sound)).catch(() => {})
    }
  }, [])

  return (
    <div
      className={cn(
        "not-prose @container flex w-full flex-col items-center gap-6 px-4 pt-14 pb-2",
        SIZE,
        SMALL,
        className
      )}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
          event.preventDefault()
          flip(event.key === "ArrowRight" ? 1 : -1)
        }
      }}
    >
      <VoiceMemo
        title="Voice memo"
        recording={recording}
        onRecordingChange={(next) => {
          setRecording(next)
          play(next ? dropSound : click8bitSound)
        }}
        onCopy={() => toast.success("Transcript copied")}
        onDismiss={() => play(cardSlideSound)}
        // The device only glides when it re-renders, and closing the
        // transcript re-renders nothing here; this does, in the same render
        // that removes it.
        onDismissed={() => setDismissals((count) => count + 1)}
        side="bottom"
        // Device first, then the transcript: a column when narrow, and from
        // @xl a row run right to left, so the transcript opens on the left.
        className="flex w-full flex-col items-center gap-[calc(var(--w)*0.22)] @xl:flex-row-reverse @xl:justify-center @xl:gap-12"
        panelClassName={cn(
          "relative top-auto left-auto w-80 max-w-full origin-top before:left-1/2 before:-translate-x-1/2",
          // Beside the device, its notch points right, back at it.
          "@xl:origin-right @xl:before:top-1/2 @xl:before:right-[-7px] @xl:before:left-auto @xl:before:translate-x-0 @xl:before:-translate-y-1/2 @xl:before:border-t @xl:before:border-r @xl:before:border-b-0 @xl:before:border-l-0 @xl:starting:translate-x-2 @xl:starting:translate-y-0",
          // Leaving, it slips back toward the device: up when it sits below,
          // right when it sits beside.
          "data-closing:-translate-y-2 motion-reduce:data-closing:translate-0 @xl:data-closing:translate-x-2 @xl:data-closing:translate-y-0"
        )}
        device={
          // `layout` glides the device to wherever the row puts it, so it
          // slides right as the transcript opens and back when it closes.
          <motion.span
            layout={!reduceMotion}
            // Eases out of rest and into place, so it never lurches.
            transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
            className="relative block aspect-[85/55] w-(--w) cursor-grab touch-pan-y [perspective:1400px] active:cursor-grabbing"
            {...handlers}
          >
            <Shadow ry={ry} />
            <motion.span
              className="block size-full"
              animate={!reduceMotion ? { y: [0, -6, 0] } : undefined}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <Body rx={rx} ry={ry} rest={STRAIGHT} recording={recording} />
            </motion.span>
          </motion.span>
        }
      />

      <div className="mt-[calc(var(--w)*0.16)] flex items-center gap-3 text-sm text-muted-foreground">
        <span className="hidden sm:inline">
          {recording ? "Press again to stop" : "Press to record, drag to turn"}
        </span>
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
    </div>
  )
}

/**
 * The device for a card's cover: three-quarters on, turned `turns`
 * half-turns from rest, so 1 shows its back.
 */
export function VoiceMemoObject({
  turns = 0,
  className,
}: {
  turns?: number
  className?: string
}) {
  const reduceMotion = useReducedMotion()
  const rx = useMotionValue(ANGLED.x)
  const ry = useMotionValue(ANGLED.y)

  useEffect(() => {
    const controls = animate(
      ry,
      ANGLED.y + turns * 180,
      reduceMotion ? QUICK : { ...SPRING, stiffness: 70 }
    )
    return () => controls.stop()
  }, [turns, ry, reduceMotion])

  return (
    <div
      aria-hidden
      className={cn(
        "@container relative flex size-full items-center justify-center",
        SIZE,
        className
      )}
    >
      <span className="relative block aspect-[85/55] w-(--w) [perspective:1400px]">
        <Shadow ry={ry} />
        <Body rx={rx} ry={ry} rest={ANGLED} />
      </span>
    </div>
  )
}

// The shadow on the ground narrows as the device goes edge-on.
function Shadow({ ry }: { ry: MotionValue<number> }) {
  const scaleX = useTransform(
    ry,
    (y) => 0.45 + 0.55 * Math.abs(Math.cos((y * Math.PI) / 180))
  )
  return (
    <motion.span
      aria-hidden
      className="pointer-events-none absolute top-[calc(100%+var(--w)*0.06)] left-1/2 h-[calc(var(--w)*0.1)] w-(--w) -translate-x-1/2 rounded-[50%] bg-black/25 blur-xl dark:bg-black/60"
      style={{ scaleX }}
    />
  )
}

function Body({
  rx,
  ry,
  rest,
  recording = false,
}: {
  rx: MotionValue<number>
  ry: MotionValue<number>
  rest: Pose
  recording?: boolean
}) {
  // The reflection slides across the metal as it turns.
  const sheen = useTransform(ry, (y) => {
    const turned = ((((y - rest.y) % 360) + 540) % 360) - 180
    return `${turned * 0.9}px`
  })
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
    <motion.span
      aria-hidden
      className="relative block size-full"
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
      {/* The record button's focus ring, drawn on the device rather than
          the button around it, so it floats, turns and flips with the metal
          instead of staying behind as a box. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[7%/11%] outline-2 outline-offset-4 outline-transparent transition-[outline-color] duration-150 group-focus-visible/device:outline-ring"
        style={{ transform: "translateZ(calc(var(--t) * 0.5 + 2px))" }}
      />
      <motion.span
        className="absolute inset-0 [backface-visibility:hidden]"
        style={{
          transform: "translateZ(calc(var(--t) * 0.5 + 1px))",
          opacity: front,
        }}
      >
        <Face side="front" recording={recording} />
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
    </motion.span>
  )
}

/*
 * One face of the aluminium, drawn rather than photographed so it takes the
 * theme: silver in light, space gray in dark. The front carries the raised
 * wordmark and the microphone pinhole, the back a debossed magnet ring.
 */
function Face({
  side,
  recording = false,
}: {
  side: "front" | "back"
  recording?: boolean
}) {
  const id = useId()
  const ids = {
    pits: `${id}-pits`,
    glints: `${id}-glints`,
    shade: `${id}-shade`,
    sheen: `${id}-sheen`,
    clip: `${id}-clip`,
    edges: `${id}-edges`,
    engrave: `${id}-engrave`,
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
        {/* Lettering cut into the face, lit from the top left: its floor
            a shade darker, a shadow under the wall facing the light and a
            bright ledge along the far one. */}
        <filter
          id={ids.engrave}
          x="-10%"
          y="-30%"
          width="120%"
          height="160%"
          colorInterpolationFilters="sRGB"
        >
          <feOffset in="SourceAlpha" dx="0.35" dy="0.4" result="down" />
          <feOffset in="SourceAlpha" dx="-0.35" dy="-0.4" result="up" />
          <feComposite
            in="SourceAlpha"
            in2="down"
            operator="out"
            result="wall"
          />
          <feComposite
            in="SourceAlpha"
            in2="up"
            operator="out"
            result="ledge"
          />
          <feFlood
            style={{ floodColor: "var(--foreground)", floodOpacity: 0.16 }}
          />
          <feComposite in2="SourceAlpha" operator="in" result="floor" />
          <feFlood
            style={{ floodColor: "var(--foreground)", floodOpacity: 0.45 }}
          />
          <feComposite in2="wall" operator="in" result="shade" />
          <feFlood
            style={{ floodColor: "var(--background)", floodOpacity: 0.9 }}
          />
          <feComposite in2="ledge" operator="in" result="lit" />
          <feMerge>
            <feMergeNode in="floor" />
            <feMergeNode in="shade" />
            <feMergeNode in="lit" />
          </feMerge>
        </filter>
        {/* The rim of raised lettering lit from the top left: a bright line
            along the edges facing the light, where the shape shifted away
            from it leaves them uncovered, a hard shadow along the far edges
            and a soft one cast beyond them. */}
        <filter
          id={ids.edges}
          x="-5%"
          y="-20%"
          width="110%"
          height="140%"
          colorInterpolationFilters="sRGB"
        >
          <feOffset in="SourceAlpha" dx="0.7" dy="0.8" result="down" />
          <feComposite
            in="SourceAlpha"
            in2="down"
            operator="out"
            result="top"
          />
          <feComposite
            in="down"
            in2="SourceAlpha"
            operator="out"
            result="under"
          />
          <feFlood
            style={{ floodColor: "var(--background)", floodOpacity: 0.85 }}
          />
          <feComposite in2="top" operator="in" result="lit" />
          <feFlood
            style={{ floodColor: "var(--foreground)", floodOpacity: 0.3 }}
          />
          <feComposite in2="under" operator="in" result="shade" />
          <feGaussianBlur in="down" stdDeviation="0.9" result="soft" />
          <feComposite
            in="soft"
            in2="SourceAlpha"
            operator="out"
            result="cast"
          />
          <feFlood
            style={{ floodColor: "var(--foreground)", floodOpacity: 0.12 }}
          />
          <feComposite in2="cast" operator="in" result="glow" />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="shade" />
            <feMergeNode in="lit" />
          </feMerge>
        </filter>
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
        // break up the only thing that says the letters are raised. Drawn by
        // a filter from the word's merged shape, so where letters overlap,
        // as the f and i do, no edge shows inside the join.
        <text
          x={14}
          y={height - 16}
          fontSize={50}
          filter={`url(#${ids.edges})`}
          className="font-serif"
        >
          {wordmark}
        </text>
      ) : (
        // A magnet ring pressed into the back, lit from above: dark on its
        // upper wall, bright on its lower one. Then the owner's name, engraved.
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
            fontSize={10}
            letterSpacing={0.3}
            textAnchor="middle"
            stroke="none"
            fill="black"
            filter={`url(#${ids.engrave})`}
            className="font-serif"
          >
            Tori Bryan
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
      {/* The pinhole glows while it listens. */}
      {side === "front" && recording ? (
        <g className="animate-pulse motion-reduce:animate-none">
          <circle
            cx={width - 16}
            cy={16}
            r={5}
            className="fill-destructive blur-[3px]"
          />
          <circle
            cx={width - 16}
            cy={16}
            r={1.6}
            className="fill-destructive"
          />
        </g>
      ) : null}
    </svg>
  )
}
