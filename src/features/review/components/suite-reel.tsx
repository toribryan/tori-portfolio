"use client"

import { useRef, useState } from "react"

import { cn } from "@/lib/utils"

export type SuiteItem = {
  name: string
  line: string
  /** WebM under `public/`, played muted on a loop. */
  src: string
  /** Marks the suite the walkthrough goes on to. */
  featured?: boolean
}

/**
 * The product suites side by side, each as a looping clip. Hovering one
 * pauses the other two and drops them back, so the one under the pointer
 * is the only thing moving.
 */
export function SuiteReel({
  items,
  className,
}: {
  items: SuiteItem[]
  className?: string
}) {
  const videos = useRef<(HTMLVideoElement | null)[]>([])
  const [active, setActive] = useState<number | null>(null)

  function focus(index: number | null) {
    setActive(index)
    videos.current.forEach((video, i) => {
      if (!video) return
      if (index === null || i === index) {
        void video.play().catch(() => {})
      } else {
        video.pause()
      }
    })
  }

  return (
    <ul
      className={cn(
        "grid gap-px border-y border-line bg-line md:grid-cols-3",
        className
      )}
      onMouseLeave={() => focus(null)}
    >
      {items.map((item, i) => {
        const dimmed = active !== null && active !== i
        return (
          <li
            key={item.name}
            className={cn(
              "flex flex-col gap-3 bg-background p-4 transition-opacity duration-300",
              dimmed && "opacity-50"
            )}
            onMouseEnter={() => focus(i)}
            onFocus={() => focus(i)}
            onBlur={() => focus(null)}
            tabIndex={0}
            aria-label={`${item.name}: ${item.line}`}
          >
            <video
              ref={(el) => {
                videos.current[i] = el
              }}
              className="aspect-square w-full rounded-xl bg-surface-warm object-cover inset-ring-1 inset-ring-border/64"
              src={item.src}
              autoPlay
              loop
              muted
              playsInline
              aria-hidden
            />
            <div className="flex items-center gap-2">
              <p className="font-mono text-xs tracking-wide text-muted-foreground uppercase">
                {item.name}
              </p>
              {item.featured && (
                <span className="rounded-md bg-success/15 px-1.5 py-px font-mono text-[0.65rem] tracking-wide text-foreground uppercase">
                  Today
                </span>
              )}
            </div>
            <p className="font-heading text-lg/tight font-medium md:text-xl/tight">
              {item.line}
            </p>
          </li>
        )
      })}
    </ul>
  )
}
