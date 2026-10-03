"use client"

import { useRef } from "react"

import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion"
import {
  PixelRabbitSprite,
  type RabbitPose,
} from "@/features/portfolio/components/fibo-hero/pixel-rabbit"

import { ThemedImage } from "./sprite-cover"
import { useCoverSteps } from "./use-cover-steps"

/** Rest, ears pinned back, then flopped forward over his eyes. */
const STEP_AT = [0, 90, 200]
const POSES: RabbitPose[] = [{}, { ears: "down" }, { ears: "cover" }]

/*
 * The cover art is 2400 by 1260 with fibo painted out. He stands where he
 * was drawn: 13-unit pixels, feet at y 637, centered on x 274.
 */
const ART = { width: 2400, height: 1260 }
const PIXEL = 13
const FEET = { x: 274, y: 637 }

/**
 * fibo's wordmark and pitch, drawn light or dark with the site. While the
 * card is hovered or focused, or on a loop with `loop` or on a touch
 * screen, fibo hides his eyes behind his ears.
 */
export function FiboCover({ loop = false }: { loop?: boolean }) {
  const frame = useRef<HTMLDivElement>(null)
  const shown = useCoverSteps(frame, STEP_AT, { loop })
  const reduceMotion = usePrefersReducedMotion()

  return (
    <div ref={frame} className="absolute inset-0 text-foreground">
      <ThemedImage
        className="size-full object-cover"
        src={{
          light: "/cover-fibo-base-light.webp",
          dark: "/cover-fibo-base-dark.webp",
        }}
        width={ART.width}
        height={ART.height}
      />
      <svg
        className="absolute inset-0 size-full"
        viewBox={`0 0 ${ART.width} ${ART.height}`}
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        {/* The sprite turns him to face right; the art has him facing left. */}
        <PixelRabbitSprite
          pixel={PIXEL}
          pose={POSES[reduceMotion ? 0 : shown]}
          transform={`translate(${FEET.x} ${FEET.y}) scale(-1 1)`}
        />
      </svg>
    </div>
  )
}
