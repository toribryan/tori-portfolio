"use client"

import { useRef, type CSSProperties } from "react"

import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion"
import {
  COVERS,
  ScaledStage,
} from "@/features/portfolio/components/components/covers"
import {
  PixelRabbitSprite,
  type RabbitPose,
} from "@/features/portfolio/components/fibo-hero/pixel-rabbit"

import { useCoverSteps } from "./use-cover-steps"

/** The parts beside him, as the home page's component cards show them. */
const SHELF = ["map-pin", "floating-nav", "chapter-scrubber"] as const

/** Each part is laid out roomier than a home page card, then scaled down. */
const TILE = { width: 240, height: 280 }
const TILE_SCALE = 0.45

/** Rest, ears pinned back, then flopped forward over his eyes. */
const STEP_AT = [0, 90, 200]
const POSES: RabbitPose[] = [{}, { ears: "down" }, { ears: "cover" }]

/** fibo's art pixel on the stage, and his height with headroom for his ears. */
const PIXEL = 4
const RABBIT = { width: 20 * PIXEL, height: 23 * PIXEL }

/**
 * fibo beside a row of his parts. While the card is hovered or focused, or on
 * a loop with `loop` or on a touch screen, each part plays its demo and fibo
 * hides his eyes behind his ears.
 */
export function FiboCover({ loop = false }: { loop?: boolean }) {
  const frame = useRef<HTMLDivElement>(null)
  const step = useCoverSteps(frame, STEP_AT, { loop })
  const active = step > 0
  const reduceMotion = usePrefersReducedMotion()

  return (
    <div
      ref={frame}
      className="absolute inset-0 bg-cover-plate text-foreground"
      // fibo fills his body with the page's color; here the plate's.
      style={{ "--background": "var(--cover-plate)" } as CSSProperties}
    >
      <ScaledStage width={480} zoom>
        <div className="relative flex h-full flex-col px-5 pt-9">
          <p className="font-heading text-[54px] leading-none font-medium">
            fibo
          </p>

          <div className="mt-auto mb-6 flex items-end gap-2.5">
            {SHELF.map((name) => {
              const Cover = COVERS[name]!
              return (
                <div
                  key={name}
                  className="relative overflow-hidden rounded-lg bg-muted/60 inset-ring-1 inset-ring-black/10 dark:bg-black dark:inset-ring-white/10"
                  style={{
                    width: TILE.width * TILE_SCALE,
                    height: TILE.height * TILE_SCALE,
                  }}
                >
                  <div
                    className="absolute top-0 left-0"
                    style={{ ...TILE, zoom: TILE_SCALE }}
                  >
                    <Cover active={active} />
                  </div>
                </div>
              )
            })}
            <svg
              className="ml-auto shrink-0"
              width={RABBIT.width}
              height={RABBIT.height}
              viewBox={`0 0 ${RABBIT.width} ${RABBIT.height}`}
              aria-hidden
            >
              {/* The sprite turns him right by default; this faces him left,
                  toward his parts. */}
              <PixelRabbitSprite
                pixel={PIXEL}
                pose={POSES[reduceMotion ? 0 : step]}
                transform={`translate(${RABBIT.width / 2} ${RABBIT.height}) scale(-1 1)`}
              />
            </svg>
          </div>
        </div>
      </ScaledStage>
    </div>
  )
}
