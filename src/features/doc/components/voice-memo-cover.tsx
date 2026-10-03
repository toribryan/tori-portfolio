"use client"

import { useRef, useState } from "react"

import { useMediaQuery } from "@/hooks/use-media-query"
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion"

import { useCoverSteps } from "./use-cover-steps"
import { VoiceMemoObject } from "./voice-memo-device"

/** At rest, then spun. */
const STEP_AT = [0, 250]

/**
 * The voice memo device on its card, three-quarters on. Hovering or focusing
 * the card spins it fast onto its back, and leaving spins it on round to its
 * face. With `loop`, or on a touch screen, it keeps spinning on, a face at a
 * time, while in view.
 */
export function VoiceMemoCover({ loop = false }: { loop?: boolean }) {
  const frame = useRef<HTMLDivElement>(null)
  const step = useCoverSteps(frame, STEP_AT, { loop, hold: 1400 })
  const touch = useMediaQuery("(hover: none)")
  const reduceMotion = usePrefersReducedMotion()
  const autoplay = loop || touch

  // Counts spins rather than following the step, so a loop keeps turning the
  // same way instead of winding back each time it starts over.
  const [spins, setSpins] = useState(0)
  const [seen, setSeen] = useState(step)
  if (step !== seen) {
    setSeen(step)
    if (step === 1 || (!autoplay && spins % 2 === 1)) setSpins(spins + 1)
  }

  return (
    <div ref={frame} className="flex size-full items-center justify-center">
      <VoiceMemoObject
        spins={reduceMotion ? 0 : spins}
        className="[--w:min(44cqw,22rem)]"
      />
    </div>
  )
}
