"use client"

import { useEffect, useState } from "react"
import { useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"

/**
 * Types a string out one character at a time behind a blinking cursor. The
 * full text is laid out invisibly underneath so the line never reflows
 * while it types.
 */
export function Typewriter({
  text,
  speed = 45,
  delay = 0,
  cursor = "|",
  className,
  onComplete,
}: {
  text: string
  /** Milliseconds per character. */
  speed?: number
  /** Seconds to wait before the first character. */
  delay?: number
  cursor?: string
  className?: string
  onComplete?: () => void
}) {
  const reduceMotion = useReducedMotion()
  const [shown, setShown] = useState(0)
  const done = reduceMotion || shown >= text.length

  useEffect(() => {
    if (reduceMotion) return
    if (shown >= text.length) return
    const wait = shown === 0 ? delay * 1000 : speed
    const timer = window.setTimeout(() => setShown((n) => n + 1), wait)
    return () => window.clearTimeout(timer)
  }, [shown, text.length, speed, delay, reduceMotion])

  useEffect(() => {
    if (done) onComplete?.()
    // Fires once when typing finishes; the callback identity is not the trigger.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done])

  return (
    <span className={cn("relative inline-block", className)}>
      <span className="invisible" aria-hidden>
        {text}
      </span>
      <span className="absolute inset-0" aria-hidden>
        {reduceMotion ? text : text.slice(0, shown)}
        {!done && <span className="animate-pulse">{cursor}</span>}
      </span>
      <span className="sr-only">{text}</span>
    </span>
  )
}
