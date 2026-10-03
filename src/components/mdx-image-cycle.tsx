"use client"

import { useEffect, useRef, useState } from "react"
import { useInView, useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"

/**
 * A short loop between screenshots of the same screen in different states,
 * crossfading while it is in view. With reduced motion it holds the last
 * state, still.
 *
 * Props are strings because expression attributes don't survive the MDX
 * pipeline (see `mdx-figure.tsx`): `srcs` is a comma-separated list, all the
 * same size, and `interval` is milliseconds. `width` and `height` are that
 * size in pixels, so the frame keeps its room while the images load.
 */
export function ImageCycle({
  srcs,
  alt,
  caption,
  interval = "2600",
  width,
  height,
  className,
}: {
  srcs: string
  alt: string
  caption?: React.ReactNode
  interval?: string
  width?: string
  height?: string
  className?: string
}) {
  const frames = srcs.split(",").map((src) => src.trim())
  const frame = useRef<HTMLDivElement>(null)
  const inView = useInView(frame, { amount: 0.4 })
  const reduceMotion = useReducedMotion()
  const [shown, setShown] = useState(0)

  useEffect(() => {
    if (!inView || reduceMotion) return
    const id = window.setInterval(
      () => setShown((index) => (index + 1) % frames.length),
      Number(interval) || 2600
    )
    return () => window.clearInterval(id)
  }, [inView, reduceMotion, interval, frames.length])

  const active = reduceMotion ? frames.length - 1 : shown

  return (
    <figure className={cn("not-prose my-8", className)}>
      <div
        ref={frame}
        className="grid overflow-hidden rounded-xl inset-ring-1 inset-ring-black/15 dark:inset-ring-white/15"
        role="img"
        aria-label={alt}
      >
        {frames.map((src, index) => (
          <img
            key={src}
            className={cn(
              "col-start-1 row-start-1 h-auto w-full transition-opacity duration-500 ease-in-out",
              index === active ? "opacity-100" : "opacity-0"
            )}
            src={src}
            width={width}
            height={height}
            alt=""
            loading="lazy"
          />
        ))}
      </div>

      {caption && (
        <figcaption className="mt-3 text-sm text-pretty text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
