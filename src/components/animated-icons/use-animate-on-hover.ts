"use client"

import { useEffect } from "react"
import { useReducedMotion, type useAnimation } from "motion/react"

/** Plays the icon's animation while its closest link or button is hovered. */
export function useAnimateOnHover(
  iconRef: React.RefObject<SVGSVGElement | null>,
  controls: ReturnType<typeof useAnimation>
) {
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const target = iconRef.current?.closest("a, button")
    if (!target || reduceMotion) return

    const start = () => controls.start("animate")
    const stop = () => controls.start("normal")

    target.addEventListener("pointerenter", start)
    target.addEventListener("pointerleave", stop)
    return () => {
      target.removeEventListener("pointerenter", start)
      target.removeEventListener("pointerleave", stop)
    }
  }, [iconRef, controls, reduceMotion])
}
