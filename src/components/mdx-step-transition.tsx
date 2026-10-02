"use client"

import { useEffect, useRef, useState } from "react"
import { useInView, useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"

/*
 * The wizard's step change, from its motion tokens: the outgoing step fades
 * and blurs out on ease-in, the incoming one fades in on ease-out once the
 * exit is done, and both slide the same 60px over 400ms.
 */
const EXIT_MS = 150
const ENTER_MS = 210
const MOVE_MS = 400
const SLIDE_PX = 60
const HOLD_MS = 2200

/**
 * Screens of a flow played as the product plays them: content steps forward
 * with the step-change motion, then back to the start the way the Back button
 * would, while the footer stays pinned and only its progress changes.
 *
 * Props are strings because expression attributes don't survive the MDX
 * pipeline (see `mdx-figure.tsx`): `srcs` and `footers` are comma-separated,
 * one footer per screen, all screens the same size. Screens are cropped to
 * the content above the pinned footer.
 */
export function StepTransition({
  srcs,
  footers,
  alt,
  caption,
}: {
  srcs: string
  footers: string
  alt: string
  caption?: React.ReactNode
}) {
  const screens = srcs.split(",").map((s) => s.trim())
  const bars = footers.split(",").map((s) => s.trim())
  const frame = useRef<HTMLDivElement>(null)
  const layers = useRef<(HTMLImageElement | null)[]>([])
  const inView = useInView(frame, { amount: 0.5 })
  const reduceMotion = useReducedMotion()
  const [shown, setShown] = useState(0)

  useEffect(() => {
    if (!inView || reduceMotion) return
    const nodes = layers.current
    let current = 0
    let forward = true
    const id = window.setInterval(() => {
      if (current === screens.length - 1) forward = false
      if (current === 0) forward = true
      const next = current + (forward ? 1 : -1)
      const out = nodes[current]
      const into = nodes[next]
      const dir = forward ? 1 : -1
      ;[out, into].forEach((layer) =>
        layer?.getAnimations().forEach((a) => a.cancel())
      )
      const move = {
        duration: MOVE_MS,
        easing: "ease-in-out",
        fill: "both" as const,
      }
      out?.animate(
        [
          { transform: "translateX(0)" },
          { transform: `translateX(${-dir * SLIDE_PX}px)` },
        ],
        move
      )
      out?.animate(
        [
          { opacity: 1, filter: "blur(0)" },
          { opacity: 0, filter: "blur(3px)" },
        ],
        { duration: EXIT_MS, easing: "ease-in", fill: "both" }
      )
      into?.animate(
        [
          { transform: `translateX(${dir * SLIDE_PX}px)` },
          { transform: "translateX(0)" },
        ],
        move
      )
      into?.animate(
        [
          { opacity: 0, filter: "blur(3px)" },
          { opacity: 1, filter: "blur(0)" },
        ],
        { duration: ENTER_MS, delay: EXIT_MS, easing: "ease-out", fill: "both" }
      )
      current = next
      setShown(next)
    }, HOLD_MS + MOVE_MS)
    return () => {
      window.clearInterval(id)
      nodes.forEach((layer) =>
        layer?.getAnimations().forEach((a) => a.cancel())
      )
      setShown(0)
    }
  }, [inView, reduceMotion, screens.length])

  return (
    <figure className="not-prose my-8">
      <div
        ref={frame}
        className="flex justify-center rounded-xl bg-[#e9939e] px-6 py-10 inset-ring-1 inset-ring-black/15 dark:inset-ring-white/15"
        role="img"
        aria-label={alt}
      >
        <div className="w-full max-w-[300px] overflow-hidden rounded-[22px] bg-white shadow-[0_20px_48px_rgb(74_15_31/0.14)]">
          <div className="relative grid aspect-[390/696] items-start overflow-hidden">
            {screens.map((src, index) => (
              <img
                key={src}
                ref={(node) => {
                  layers.current[index] = node
                }}
                className={cn(
                  "col-start-1 row-start-1 w-full",
                  index !== 0 && "opacity-0"
                )}
                src={src}
                alt=""
                loading="lazy"
              />
            ))}
          </div>
          <div className="grid">
            {bars.map((src, index) => (
              <img
                key={src}
                className={cn(
                  "col-start-1 row-start-1 w-full",
                  index === shown ? "opacity-100" : "opacity-0"
                )}
                src={src}
                alt=""
                loading="lazy"
              />
            ))}
          </div>
        </div>
      </div>

      {caption && (
        <figcaption className="mt-3 text-sm text-pretty text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
