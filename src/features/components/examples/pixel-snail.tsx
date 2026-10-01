"use client"

import { useRef, useState, type ComponentProps } from "react"

import { Button } from "@/components/fibo/button"
import {
  PixelSnail,
  PixelSnailSprite,
  type PixelSnailLook,
} from "@/components/fibo/pixel-snail"

import { AnatomyMap, slot, type Callout } from "../components/anatomy-map"

const args = {
  size: "default",
  pace: "default",
  travel: false,
  ground: true,
  label: "Loading",
} satisfies ComponentProps<typeof PixelSnail>

export function Default() {
  return <PixelSnail {...args} />
}

export function Sizes() {
  return (
    <div className="flex flex-wrap items-end justify-center gap-4 sm:gap-8">
      <PixelSnail {...args} size="sm" />
      <PixelSnail {...args} size="default" />
      <PixelSnail {...args} size="lg" />
    </div>
  )
}

export function Slow() {
  return <PixelSnail {...args} size="lg" pace="slow" />
}

export function Fast() {
  return <PixelSnail {...args} size="lg" pace="fast" />
}

export function NoGround() {
  return <PixelSnail {...args} size="lg" ground={false} />
}

export function Travel() {
  return (
    <div className="w-full max-w-96">
      <PixelSnail {...args} travel size="lg" />
    </div>
  )
}

export function LoadingPanel() {
  return (
    <div className="flex w-80 flex-col items-center gap-3 rounded-xl border border-border bg-card p-8 text-center">
      <PixelSnail {...args} label="Loading your projects" />
      <p className="text-sm text-muted-foreground">Fetching your projects</p>
      <Button size="sm" variant="outline">
        Cancel
      </Button>
    </div>
  )
}

/*
 * The sprite demos draw PixelSnailSprite in a bare SVG. Its origin is under
 * the middle of the foot, and the art reaches about 12 art pixels either side
 * and 16 above, so this box fits it facing either way.
 */
const SPRITE_BOX = "-13 -16 27 18"

function Sprite(props: ComponentProps<typeof PixelSnailSprite>) {
  return (
    <svg
      viewBox={SPRITE_BOX}
      className="h-14 w-21 overflow-visible text-foreground sm:h-18 sm:w-27"
      aria-hidden
    >
      <PixelSnailSprite {...props} />
    </svg>
  )
}

function Captioned({
  caption,
  ...props
}: ComponentProps<typeof PixelSnailSprite> & { caption: string }) {
  return (
    <figure className="m-0 flex flex-col items-center gap-3">
      <Sprite {...props} />
      <figcaption className="font-mono text-xs text-muted-foreground">
        {caption}
      </figcaption>
    </figure>
  )
}

export function Modes() {
  return (
    <div className="flex flex-wrap items-end justify-center gap-4 sm:gap-10">
      {(["crawl", "rest", "dance"] as const).map((mode) => (
        <Captioned key={mode} mode={mode} caption={mode} />
      ))}
    </div>
  )
}

export function BuildUp() {
  const [round, setRound] = useState(0)
  const [step, setStep] = useState("waiting")
  return (
    <div className="flex flex-col items-center gap-4">
      <Sprite
        key={round}
        mode="rest"
        assembleDelay={300}
        onAssemble={(next) =>
          setStep(
            next === "whole"
              ? "whole"
              : `${next.block}px blocks, ${Math.round(next.shown * 100)}% shown`
          )
        }
      />
      <p className="m-0 font-mono text-xs text-muted-foreground">{step}</p>
      <Button
        size="sm"
        variant="outline"
        onClick={() => {
          setStep("waiting")
          setRound((r) => r + 1)
        }}
      >
        Build again
      </Button>
    </div>
  )
}

const POSES: { caption: string; look: PixelSnailLook }[] = [
  { caption: "ahead", look: { x: 1, y: 0 } },
  { caption: "up", look: { x: 0, y: -1 } },
  { caption: "down", look: { x: 0, y: 1 } },
  { caption: "behind", look: { x: 1, y: 0, facing: -1 } },
]

/** He holds each pose for as long as the look is held. */
export function Looks() {
  return (
    <div className="flex flex-wrap items-end justify-center gap-4 sm:gap-8">
      {POSES.map(({ caption, look }) => (
        <Captioned key={caption} look={look} caption={caption} />
      ))}
    </div>
  )
}

// Art pixels from the sprite's origin to its eyes, and how far off them the
// pointer must be before they move. The gap either side of the middle keeps
// him from flipping back and forth.
const EYES = { x: 6, y: -11 }
const GLANCE = 1.5
const TURN = 4

function glance(offset: number): -1 | 0 | 1 {
  if (offset < -GLANCE) return -1
  return offset > GLANCE ? 1 : 0
}

export function FollowsThePointer() {
  const svg = useRef<SVGSVGElement>(null)
  const [look, setLook] = useState<PixelSnailLook | null>(null)
  return (
    <div
      className="flex h-60 w-full max-w-lg items-end justify-center rounded-xl border border-dashed border-border pb-8"
      onPointerMove={(event) => {
        const matrix = svg.current?.getScreenCTM()?.inverse()
        if (!matrix) return
        const { x: dx, y: dy } = new DOMPoint(
          event.clientX,
          event.clientY
        ).matrixTransform(matrix)
        setLook((current) => {
          const turned = current?.facing ?? 1
          const facing = dx < -TURN ? -1 : dx > TURN ? 1 : turned
          return {
            facing,
            x: glance((dx - facing * EYES.x) * facing),
            y: glance(dy - EYES.y),
          }
        })
      }}
      onPointerLeave={() => setLook(null)}
    >
      <svg
        ref={svg}
        viewBox={SPRITE_BOX}
        className="h-14 w-21 overflow-visible text-foreground sm:h-18 sm:w-27"
        aria-hidden
      >
        <PixelSnailSprite mode="dance" look={look} />
      </svg>
    </div>
  )
}

/** The sprite standing on a line in a drawing of your own. */
export function OnALine() {
  return (
    <svg
      viewBox="0 0 200 40"
      className="w-full max-w-md text-foreground"
      aria-hidden
    >
      <line
        x1={0}
        y1={30}
        x2={200}
        y2={30}
        stroke="currentColor"
        strokeOpacity={0.4}
        strokeDasharray="2 3"
      />
      <PixelSnailSprite
        transform="translate(100 30)"
        pixel={1.5}
        mode="dance"
      />
    </svg>
  )
}

/*
 * Best practices, drawn with the real snail: each pair shows him used the
 * right way and the wrong way.
 */

export function DoLabelled() {
  return (
    <div className="flex flex-col items-center gap-2 py-4">
      <PixelSnail label="Loading your projects" />
      <span className="text-sm text-muted-foreground">
        Fetching your projects
      </span>
    </div>
  )
}

export function DontRow() {
  return (
    <div className="flex justify-center gap-2 py-4">
      {[0, 1, 2, 3].map((i) => (
        <PixelSnail key={i} size="sm" ground={false} />
      ))}
    </div>
  )
}

export function DoLongWait() {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5">
      <span className="text-sm font-medium">Importing 2,400 contacts</span>
      <PixelSnail travel label="Importing your contacts" />
      <span className="text-sm text-muted-foreground">
        This can take a minute. You can leave this page.
      </span>
    </div>
  )
}

export function DontQuickSave() {
  return (
    <div className="flex w-full items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-2.5 text-sm">
      <span className="font-medium">Q3 plan</span>
      <span className="flex items-center gap-2 text-muted-foreground">
        <PixelSnail size="sm" ground={false} label="Saving" />
        Saving
      </span>
    </div>
  )
}

/*
 * The anatomy map points into the drawing by art pixel. The drawing spans
 * 24 columns from column -1 and 17 rows from row -4, so an art pixel's
 * screen position is its offset from that corner times the rendered scale.
 */
const snailArt = (root: HTMLElement) =>
  root.querySelector("[data-slot=pixel-snail] svg")

const art =
  (x: number, y: number, side: "left" | "right") =>
  (r: DOMRect): { x: number; y: number } => {
    const unit = r.width / 24
    const nudge = side === "left" ? -unit / 2 - 3 : unit / 2 + 3
    return {
      x: r.left + (x + 1.5) * unit + nudge,
      y: r.top + (y + 4.5) * unit,
    }
  }

const LOADER_PARTS: Callout[] = [
  {
    label: "Status region",
    side: "left",
    find: slot("pixel-snail"),
    outline: true,
    point: (r) => ({ x: r.left - 4, y: r.top + 8 }),
  },
  { label: "Shell", side: "left", find: snailArt, point: art(1, 3, "left") },
  { label: "Foot", side: "left", find: snailArt, point: art(0, 10, "left") },
  {
    label: "Eyes on stalks",
    side: "right",
    find: snailArt,
    point: art(20, -1, "right"),
  },
  { label: "Head", side: "right", find: snailArt, point: art(17, 6, "right") },
  {
    label: "Ground",
    side: "right",
    find: snailArt,
    point: (r) => ({ x: r.right + 4, y: r.top + (12 + 4.5) * (r.width / 24) }),
  },
]

/** The loader, doubled in size so each part has room for its marker. */
export function AnatomyLoader() {
  return (
    <AnatomyMap callouts={LOADER_PARTS}>
      <div className="flex justify-center py-16">
        <div data-anatomy-subject className="scale-200">
          <PixelSnail size="lg" />
        </div>
      </div>
    </AnatomyMap>
  )
}
