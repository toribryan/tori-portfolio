"use client"

import { useRef } from "react"
import { useInView, usePageInView } from "motion/react"

import { cn } from "@/lib/utils"
import { TextFlip } from "@/registry/components/text-flip"

export function FlipSentences({
  children,
  ...props
}: Omit<React.ComponentProps<"div">, "children" | "ref"> & {
  children: string[]
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isPageInView = usePageInView()
  const isInView = useInView(ref)

  const text = "font-mono text-sm text-balance max-[22.5rem]:text-[0.8125rem]"

  // Every sentence is laid out invisibly in the same cell as the flip, so the
  // row is as tall as the longest one at this width and never jumps.
  return (
    <div ref={ref} {...props}>
      <div className="grid *:col-start-1 *:row-start-1">
        {children.map((sentence) => (
          <p key={sentence} aria-hidden className={cn("invisible", text)}>
            {sentence}
          </p>
        ))}
        <TextFlip
          className={cn(
            "shimmer self-center text-muted-foreground shimmer-duration-1500 shimmer-once not-dark:shimmer-color-foreground",
            text
          )}
          interval={3}
          play={isPageInView && isInView}
        >
          {children}
        </TextFlip>
      </div>
    </div>
  )
}
