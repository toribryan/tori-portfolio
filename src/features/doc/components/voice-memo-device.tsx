"use client"

import { useEffect, useId, type SVGProps } from "react"
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "motion/react"

import { cn } from "@/lib/utils"

/*
 * fibo's Voice memo device as an object you can pick up: the same drawn
 * aluminium face, given a back and a thickness, in CSS 3D. The face is ported
 * from fibo's voice-memo.tsx, where it's a flat button.
 */

export type Pose = { x: number; y: number }

// On the card, three-quarters on and tipped back, so the edge shows.
const ANGLED: Pose = { x: -14, y: -28 }

// The thickness is a stack of rounded slices, close enough together that
// they read as a solid edge when the device is turned side-on.
const SLICES = 22

// 85 by 55, a bank card's proportions, in a unit of 2.
const FACE = { width: 170, height: 110, radius: 12 }

export const SPRING = { type: "spring", stiffness: 120, damping: 17 } as const
export const QUICK = { duration: 0.25, ease: "easeOut" } as const

// Sizes the device from the width it's given, and its edge from that.
export const SIZE = "[--w:min(62cqw,24rem)] [--t:calc(var(--w)*0.055)]"

export type Axis = "x" | "y"

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

// The shadow on the ground narrows as the device goes edge-on. With the
// light at the top left it falls a little to the right: a soft, wide one,
// and a tighter, darker one right under the device.
export function Shadow({ ry }: { ry: MotionValue<number> }) {
  const scaleX = useTransform(
    ry,
    (y) => 0.45 + 0.55 * Math.abs(Math.cos((y * Math.PI) / 180))
  )
  return (
    <>
      <motion.span
        aria-hidden
        className="pointer-events-none absolute top-[calc(100%+var(--w)*0.06)] left-[53%] h-[calc(var(--w)*0.12)] w-(--w) -translate-x-1/2 rounded-[50%] bg-black/20 blur-xl dark:bg-black/60"
        style={{ scaleX }}
      />
      <motion.span
        aria-hidden
        className="pointer-events-none absolute top-[calc(100%+var(--w)*0.075)] left-[52%] h-[calc(var(--w)*0.04)] w-[calc(var(--w)*0.8)] -translate-x-1/2 rounded-[50%] bg-black/25 blur-md dark:bg-black/70"
        style={{ scaleX }}
      />
    </>
  )
}

/*
 * Where the reflection sits on a face, and how bright it is. At rest the
 * face looks straight back at the light and shows none; tipping it any way
 * brings a soft band in, which slides across and off the far edge as the
 * face turns further. Worked from the sine of the face's own angle, so it
 * moves smoothly through a whole spin, with no jump where the angle wraps,
 * and the back, mirrored on screen, sends it the same way as the front.
 */
function useSheen(
  rx: MotionValue<number>,
  ry: MotionValue<number>,
  rest: Pose,
  side: "front" | "back",
  axis: Axis
) {
  // The back faces the other way about the axis it's mounted on.
  const turn = (a: Axis) => (side === "back" && a === axis ? 180 : 0)
  const angles = (x: number, y: number) => ({
    across: Math.sin(((y - rest.y - turn("y")) * Math.PI) / 180),
    down: Math.sin(((x - rest.x - turn("x")) * Math.PI) / 180),
  })
  const x = useTransform([rx, ry], ([rotX, rotY]: number[]) => {
    const { across } = angles(rotX, rotY)
    return `${-across * FACE.width * 1.6}px`
  })
  const y = useTransform([rx, ry], ([rotX, rotY]: number[]) => {
    const { down } = angles(rotX, rotY)
    return `${down * FACE.height * 1.6}px`
  })
  const o = useTransform([rx, ry], ([rotX, rotY]: number[]) => {
    const { across, down } = angles(rotX, rotY)
    return Math.min(1, Math.hypot(across, down) * 4)
  })
  return { "--sheen-x": x, "--sheen-y": y, "--sheen-o": o } as Record<
    `--${string}`,
    MotionValue<string | number>
  >
}

export function Body({
  rx,
  ry,
  rest,
  axis = "y",
  recording = false,
}: {
  rx: MotionValue<number>
  ry: MotionValue<number>
  rest: Pose
  /** The axis the back is mounted on; see `useTurn`. */
  axis?: Axis
  recording?: boolean
}) {
  const frontSheen = useSheen(rx, ry, rest, "front", axis)
  const backSheen = useSheen(rx, ry, rest, "back", axis)
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
          ...frontSheen,
        }}
      >
        <Face side="front" recording={recording} />
      </motion.span>
      <motion.span
        className="absolute inset-0 [backface-visibility:hidden]"
        style={{
          transform: `rotate${axis.toUpperCase()}(180deg) translateZ(calc(var(--t) * 0.5 + 1px))`,
          opacity: back,
          ...backSheen,
        }}
      >
        <Face side="back" />
      </motion.span>
    </motion.span>
  )
}

/*
 * Lettering raised off the metal, lit from the top left: a bright rim on
 * the edges facing the light, a shadow along the far ones and a softer one
 * cast beyond. Drawn only as filled copies of the word, the light nudged up
 * and left, the shade down and right, then the word itself in the same
 * layers as the bare metal, so its face matches the face around it.
 *
 * An SVG filter draws this too, but Chrome rasterises filtered content
 * apart from the rest, so it slid against the face as the device turned.
 * Clipping the metal back onto a word drawn in light fared no better: in a
 * fast spin Chrome skipped the clip on some tiles and showed the light.
 * Plain fills have neither to go wrong. Built from the word's own outline,
 * letters that overlap, as the f and i do, show no edge inside the join.
 */
function Raised({
  depth: [dx, dy],
  metal,
  children,
  ...text
}: SVGProps<SVGTextElement> & {
  /** How far the shadow falls, in face units, across and down. */
  depth: [number, number]
  /** The layers of the bare metal, painted on the letters' faces. */
  metal: MetalLayer[]
}) {
  const shifted = (by: number) => `translate(${dx * by} ${dy * by})`
  const copy = (key: string, className: string, extra = {}) => (
    <text
      key={key}
      {...text}
      {...extra}
      className={cn(text.className, className)}
    >
      {children}
    </text>
  )
  return (
    <g stroke="none">
      {copy("cast", "fill-black opacity-[0.06] dark:opacity-25", {
        transform: shifted(2),
      })}
      {copy("shade", "fill-black opacity-20 dark:opacity-50", {
        transform: shifted(1),
      })}
      {copy("light", "fill-white opacity-90 dark:opacity-30", {
        transform: shifted(-0.6),
      })}
      {metal.map((layer, index) =>
        copy(`metal-${index}`, layer.className, { fill: layer.fill })
      )}
    </g>
  )
}

type MetalLayer = { className: string; fill?: string }

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
    light: `${id}-light`,
    dark: `${id}-dark`,
    rim: `${id}-rim`,
    glow: `${id}-glow`,
    sheen: `${id}-sheen`,
    clip: `${id}-clip`,
  }
  const { width, height, radius } = FACE
  const wordmark = "fibo"
  // The bare metal, lit from the top left. Anodized aluminium is a mid
  // gray, and the muted role alone is near white in the light theme and
  // near black in the dark one, so each is pulled toward the middle. The
  // light and the shade are white and black in both themes, only stronger
  // or weaker, so the light falls the same way on silver and space gray.
  const metal: MetalLayer[] = [
    { className: "fill-muted" },
    {
      className:
        "fill-black opacity-[0.13] dark:fill-white dark:opacity-[0.07]",
    },
    { fill: `url(#${ids.light})`, className: "opacity-100 dark:opacity-25" },
    { fill: `url(#${ids.dark})`, className: "opacity-50 dark:opacity-70" },
  ]

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
        {/* A broad wash of light from the top left, falling away by the
            middle, and the shade gathering toward the bottom right. */}
        <radialGradient
          id={ids.light}
          gradientUnits="userSpaceOnUse"
          cx={width * 0.05}
          cy={-height * 0.15}
          r={width * 0.95}
        >
          <stop offset="0" stopColor="white" stopOpacity={0.55} />
          <stop offset="0.55" stopColor="white" stopOpacity={0.12} />
          <stop offset="1" stopColor="white" stopOpacity={0} />
        </radialGradient>
        <linearGradient
          id={ids.dark}
          gradientUnits="userSpaceOnUse"
          x1={width * 0.35}
          y1={height * 0.3}
          x2={width}
          y2={height}
        >
          <stop offset="0" stopColor="black" stopOpacity={0} />
          <stop offset="1" stopColor="black" stopOpacity={0.32} />
        </linearGradient>
        {/* The chamfer round the face catches the light on its top and left
            and turns dark on its bottom and right. */}
        <linearGradient
          id={ids.rim}
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="0"
          x2={width}
          y2={height}
        >
          <stop offset="0" stopColor="white" stopOpacity={1} />
          <stop offset="0.5" stopColor="white" stopOpacity={0.35} />
          <stop offset="1" stopColor="white" stopOpacity={0} />
        </linearGradient>
        <linearGradient id={ids.sheen} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="white" stopOpacity={0} />
          <stop offset="0.3" stopColor="white" stopOpacity={0.12} />
          <stop offset="0.5" stopColor="white" stopOpacity={0.32} />
          <stop offset="0.7" stopColor="white" stopOpacity={0.12} />
          <stop offset="1" stopColor="white" stopOpacity={0} />
        </linearGradient>
        <radialGradient id={ids.glow}>
          <stop offset="0" style={{ stopColor: "var(--destructive)" }} />
          <stop
            offset="1"
            style={{ stopColor: "var(--destructive)", stopOpacity: 0 }}
          />
        </radialGradient>
        <clipPath id={ids.clip}>
          <rect width={width} height={height} rx={radius} />
        </clipPath>
      </defs>

      {metal.map((layer, index) => (
        <rect
          key={index}
          width={width}
          height={height}
          rx={radius}
          fill={layer.fill}
          className={layer.className}
        />
      ))}

      {side === "front" ? (
        <Raised
          depth={[0.7, 0.8]}
          metal={metal}
          x={14}
          y={height - 16}
          fontSize={50}
          className="font-serif"
        >
          {wordmark}
        </Raised>
      ) : (
        <Raised
          depth={[0.35, 0.4]}
          metal={metal}
          x={width / 2}
          y={height - 12}
          fontSize={7.5}
          letterSpacing={1.2}
          textAnchor="middle"
          className="font-sans font-semibold"
        >
          TORI BRYAN
        </Raised>
      )}
      <rect
        width={width}
        height={height}
        rx={radius}
        filter={`url(#${ids.pits})`}
        className="fill-black opacity-[0.14] dark:opacity-40"
      />
      <rect
        width={width}
        height={height}
        rx={radius}
        filter={`url(#${ids.glints})`}
        className="fill-white opacity-40 dark:opacity-[0.08]"
      />

      {side === "back" ? (
        // A magnet ring pressed into the back, lit from above: dark on its
        // upper wall, bright on its lower one.
        <g fill="none" strokeWidth={1.4}>
          <circle
            cx={width / 2}
            cy={height / 2 - 4}
            r={28}
            className="stroke-black opacity-[0.18] dark:opacity-60"
            transform="translate(0 -0.6)"
          />
          <circle
            cx={width / 2}
            cy={height / 2 - 4}
            r={28}
            className="stroke-white opacity-80 dark:opacity-[0.14]"
            transform="translate(0 0.6)"
          />
        </g>
      ) : null}

      {/* The reflection, placed by useSheen as the device turns. */}
      <g clipPath={`url(#${ids.clip})`}>
        <g className="opacity-100 dark:opacity-40">
          <g
            style={{
              opacity: "var(--sheen-o, 0)",
              transform: "translate(var(--sheen-x, 0px), var(--sheen-y, 0px))",
            }}
          >
            <rect
              x={width / 2 - 35}
              y={-height}
              width={70}
              height={height * 3}
              fill={`url(#${ids.sheen})`}
              transform={`rotate(24 ${width / 2} ${height / 2})`}
            />
          </g>
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
        stroke={`url(#${ids.rim})`}
        className="opacity-90 dark:opacity-25"
      />
      <rect
        width={width}
        height={height}
        rx={radius}
        fill="none"
        strokeWidth={0.75}
        className="stroke-black opacity-20 dark:opacity-70"
      />

      {side === "front" ? (
        <g>
          <circle
            cx={width - 16}
            cy={16.4}
            r={1.9}
            className="fill-white opacity-70 dark:opacity-15"
          />
          <circle
            cx={width - 16}
            cy={16}
            r={1.8}
            className="fill-black opacity-55 dark:opacity-80"
          />
        </g>
      ) : null}
      {/* The pinhole glows while it listens. */}
      {side === "front" && recording ? (
        <g className="animate-pulse motion-reduce:animate-none">
          <circle cx={width - 16} cy={16} r={7} fill={`url(#${ids.glow})`} />
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
