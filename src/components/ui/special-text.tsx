"use client"

import { useEffect, useRef, useState } from "react"
import { useInView, useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"

const RANDOM_CHARS = "_!X$0-+*#"

function randomChar(previous?: string) {
  let char: string
  do {
    char = RANDOM_CHARS[Math.floor(Math.random() * RANDOM_CHARS.length)]
  } while (char === previous)
  return char
}

/**
 * Text that resolves out of noise: glyphs scramble in from the left, then a
 * cursor walks across and settles each character in turn.
 *
 * The final string is laid out invisibly underneath so the line never
 * reflows while the noise runs, which matters at display sizes where a
 * scrambled `#` and a settled `i` differ by half a character.
 */
export function SpecialText({
  children: text,
  speed = 20,
  delay = 0,
  className,
  inView = false,
  once = true,
}: {
  children: string
  /** Milliseconds per step. Each character costs four steps end to end. */
  speed?: number
  /** Seconds to wait before starting. */
  delay?: number
  className?: string
  /** Wait until the element scrolls into view before starting. */
  inView?: boolean
  once?: boolean
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once, margin: "-100px" })
  const shouldAnimate = inView ? isInView : true
  const reduceMotion = useReducedMotion()

  const [display, setDisplay] = useState(() => " ".repeat(text.length))

  useEffect(() => {
    if (!shouldAnimate || reduceMotion) return

    const length = text.length
    const stepsPerPhase = length * 2
    let phase: 1 | 2 = 1
    let step = 0

    const tick = () => {
      const chars: string[] = []

      if (phase === 1) {
        const filled = Math.min(step + 1, length)
        for (let i = 0; i < filled; i++) {
          chars.push(randomChar(chars[i - 1]))
        }
        for (let i = filled; i < length; i++) {
          chars.push(" ")
        }
        setDisplay(chars.join(""))

        if (step < stepsPerPhase - 1) {
          step += 1
        } else {
          phase = 2
          step = 0
        }
        return
      }

      const revealed = Math.floor(step / 2)
      for (let i = 0; i < revealed && i < length; i++) {
        chars.push(text[i])
      }
      if (revealed < length) {
        chars.push(step % 2 === 0 ? "_" : randomChar())
      }
      for (let i = chars.length; i < length; i++) {
        chars.push(randomChar(chars[i - 1]))
      }

      if (step < stepsPerPhase - 1) {
        setDisplay(chars.join(""))
        step += 1
      } else {
        setDisplay(text)
      }
    }

    // Steps are scheduled against the clock rather than counted per frame,
    // so a throttled or hidden tab catches up instead of crawling.
    let frame = 0
    let done = 0
    const startedAt = performance.now() + delay * 1000
    const totalSteps = stepsPerPhase * 2

    const loop = (now: number) => {
      const due = Math.min(Math.floor((now - startedAt) / speed), totalSteps)
      while (done < due) {
        tick()
        done += 1
      }
      if (done < totalSteps) frame = window.requestAnimationFrame(loop)
    }
    frame = window.requestAnimationFrame(loop)

    return () => window.cancelAnimationFrame(frame)
  }, [shouldAnimate, reduceMotion, text, speed, delay])

  const shown = reduceMotion ? text : display

  return (
    <span
      ref={ref}
      className={cn("relative inline-block whitespace-pre", className)}
    >
      <span className="invisible" aria-hidden>
        {text}
      </span>
      <span className="absolute inset-0" aria-hidden>
        {shown}
      </span>
      <span className="sr-only">{text}</span>
    </span>
  )
}
