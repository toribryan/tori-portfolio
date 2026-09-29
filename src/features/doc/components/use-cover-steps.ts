"use client"

import { useEffect, useState, type RefObject } from "react"
import { useInView, useReducedMotion } from "motion/react"

import { useMediaQuery } from "@/hooks/use-media-query"

/**
 * Steps a live cover through a short sequence. `stepAt` gives each step's
 * start in milliseconds, the first being rest. The sequence plays while the
 * card around the cover is hovered or focused. With `loop`, or on a touch
 * screen, where nothing can hover, it plays on its own while in view,
 * holding the last step for `hold` before starting over. With `repeat` a
 * hovered card starts over the same way rather than holding. With reduced
 * motion the cover shows the last step, still.
 */
export function useCoverSteps(
  frame: RefObject<HTMLElement | null>,
  stepAt: number[],
  {
    loop = false,
    repeat = false,
    hold = 2600,
  }: { loop?: boolean; repeat?: boolean; hold?: number } = {}
) {
  const [engaged, setEngaged] = useState(false)
  const [step, setStep] = useState(0)
  const inView = useInView(frame, { amount: 0.5 })
  const reduceMotion = useReducedMotion()
  const touch = useMediaQuery("(hover: none)")
  const autoplay = loop || touch
  const active = autoplay ? inView : engaged
  const last = stepAt.length - 1
  const timing = stepAt.join()

  useEffect(() => {
    if (!active || reduceMotion) return
    const starts = timing.split(",").map(Number)
    const timers: number[] = []
    const play = () => {
      starts.forEach((at, index) => {
        timers.push(window.setTimeout(() => setStep(index), at))
      })
    }
    play()
    const id =
      autoplay || repeat
        ? window.setInterval(play, starts[starts.length - 1] + hold)
        : undefined
    return () => {
      window.clearInterval(id)
      timers.forEach((timer) => window.clearTimeout(timer))
      setStep(0)
    }
  }, [active, autoplay, repeat, reduceMotion, timing, hold])

  // Covers are inert, so they listen on the card or hero around them.
  useEffect(() => {
    const card = frame.current?.closest("[data-cover-host]")
    if (!card || autoplay) return
    const on = () => setEngaged(true)
    const off = () => setEngaged(false)
    card.addEventListener("pointerenter", on)
    card.addEventListener("pointerleave", off)
    card.addEventListener("focusin", on)
    card.addEventListener("focusout", off)
    return () => {
      card.removeEventListener("pointerenter", on)
      card.removeEventListener("pointerleave", off)
      card.removeEventListener("focusin", on)
      card.removeEventListener("focusout", off)
    }
  }, [frame, autoplay])

  return !active ? 0 : reduceMotion ? last : step
}
