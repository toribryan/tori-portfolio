"use client"

import { useState } from "react"
import { ArrowUpIcon } from "lucide-react"
import { useMotionValueEvent, useScroll } from "motion/react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/base/ui/button"

export function ScrollToTop({
  className,
  ...props
}: React.ComponentProps<"button">) {
  const { scrollY } = useScroll()

  const [visible, setVisible] = useState(false)
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("down")

  useMotionValueEvent(scrollY, "change", (latestValue) => {
    setVisible(latestValue >= 400)

    const prev = scrollY.getPrevious() ?? 0
    const diff = latestValue - prev
    setScrollDirection(diff > 0 ? "down" : "up")
  })

  return (
    <Button
      data-visible={visible}
      data-scroll-direction={scrollDirection}
      className={cn(
        "[--bottom:0.5rem] sm:[--bottom:1rem] lg:[--bottom:2rem]",
        // Below `sm` the floating nav holds the bottom of the screen, so the
        // button only shows from `sm` up.
        "fixed right-4 max-sm:hidden lg:right-8",
        "bottom-[calc(var(--bottom,0.5rem)+env(safe-area-inset-bottom,0))] z-50",
        "transition-[background-color,opacity] duration-300 data-[scroll-direction=down]:opacity-30 data-[scroll-direction=up]:opacity-100 data-[visible=false]:opacity-0",
        "data-[scroll-direction=down]:hover:opacity-100",
        className
      )}
      variant="outline"
      size="icon-sm"
      aria-label="Scroll to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      {...props}
    >
      <ArrowUpIcon />
    </Button>
  )
}
