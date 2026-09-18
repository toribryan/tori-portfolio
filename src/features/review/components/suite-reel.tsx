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
 * The product suites side by side, set like the project cards on the home
 * page: a looping clip in a ringed frame, name and one line under it,
 * hairlines between the columns. Hovering one pauses the other two and
 * drops them back, so the one under the pointer is the only thing moving.
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
    <div
      className={cn(
        "screen-line-top screen-line-bottom relative py-4",
        className
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 -z-1 grid gap-4 max-md:hidden md:grid-cols-3"
        aria-hidden
      >
        <div className="border-r border-line" />
        <div className="border-x border-line" />
        <div className="border-l border-line" />
      </div>

      <ul
        className="grid gap-4 md:grid-cols-3"
        onMouseLeave={() => focus(null)}
      >
        {items.map((item, i) => {
          const dimmed = active !== null && active !== i
          return (
            <li
              key={item.name}
              className={cn(
                "flex flex-col gap-2 rounded-xl p-2 transition-[opacity,background-color] duration-300 ease-out hover:bg-accent-muted",
                dimmed && "opacity-50"
              )}
              onMouseEnter={() => focus(i)}
              onFocus={() => focus(i)}
              onBlur={() => focus(null)}
              tabIndex={0}
              aria-label={`${item.name}: ${item.line}`}
            >
              <div className="relative select-none">
                <video
                  ref={(el) => {
                    videos.current[i] = el
                  }}
                  className="aspect-square w-full rounded-xl bg-surface object-cover"
                  src={item.src}
                  autoPlay
                  loop
                  muted
                  playsInline
                  aria-hidden
                />
                <div className="pointer-events-none absolute inset-0 rounded-xl inset-ring-1 inset-ring-black/15 dark:inset-ring-white/15" />
              </div>

              <div className="flex flex-col gap-1 p-2">
                <p className="text-lg leading-snug font-medium">{item.name}</p>
                <p className="text-sm leading-snug text-pretty text-muted-foreground">
                  {item.line}
                </p>
                <p className="font-mono text-xs tracking-wide text-muted-foreground">
                  {item.featured ? "Today’s walkthrough" : "Proctorio suite"}
                </p>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
