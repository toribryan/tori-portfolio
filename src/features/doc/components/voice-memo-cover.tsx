"use client"

import { useRef } from "react"

import { useCoverSteps } from "./use-cover-steps"
import { VoiceMemoObject } from "./voice-memo-object"

/** At rest, then turned over to its back. */
const STEP_AT = [0, 250]

/**
 * The voice memo device on its card: it sits three-quarters on, and turns
 * over to show its back while the card is hovered.
 */
export function VoiceMemoCover({ loop = false }: { loop?: boolean }) {
  const frame = useRef<HTMLDivElement>(null)
  const turns = useCoverSteps(frame, STEP_AT, { loop })

  return (
    <div ref={frame} className="flex size-full items-center justify-center">
      <VoiceMemoObject
        interactive={false}
        turns={turns}
        className="[&>div]:aspect-auto [&>div]:h-full [&>div]:[--w:min(44cqw,22rem)]"
      />
    </div>
  )
}
