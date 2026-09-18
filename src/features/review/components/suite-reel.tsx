"use client"

import { useRef, useState } from "react"

import { cn } from "@/lib/utils"

import { Frame, HairlineGrid } from "./slide-primitives"

export type SuiteItem = {
  name: string
  line: string
  /** WebM under `public/`, played muted on a loop. */
  src: string
  /** Marks the suite the walkthrough goes on to. */
  featured?: boolean
}

/**
 * The product suites side by side, each a looping clip set like a project
 * card. Hovering one pauses the other two and drops them back, so the one
 * under the pointer is the only thing moving.
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
    <HairlineGrid columns={3} className={className}>
      <ul className="contents" onMouseLeave={() => focus(null)}>
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
              <Frame>
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
              </Frame>

              <div className="flex flex-col gap-1 px-4 py-2">
                <p className="text-lg leading-snug font-medium">{item.name}</p>
                <p className="text-sm leading-snug text-pretty text-muted-foreground">
                  {item.line}
                </p>
                <p className="text-xs tracking-wide text-muted-foreground">
                  {item.featured ? "Today’s walkthrough" : "Proctorio suite"}
                </p>
              </div>
            </li>
          )
        })}
      </ul>
    </HairlineGrid>
  )
}
