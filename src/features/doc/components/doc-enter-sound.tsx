"use client"

import { useEffect } from "react"
import { useReducedMotion } from "motion/react"

import type { SoundPlayback } from "@/lib/soundcn/sound-engine"
import { playSound, soundSource } from "@/lib/soundcn/sound-engine"
import { toggleOnSound } from "@/lib/soundcn/toggle-on"

/**
 * Sounds once as a case study opens, and again on each move to a neighboring
 * one — `slug` in the dep array is what makes the second one happen.
 *
 * Goes through `playSound` rather than `useSound` because the buffer decodes
 * asynchronously: a hook-held buffer isn't ready at mount, which is exactly
 * when this needs to fire. Audio also needs the document to have been
 * interacted with, so a study reached by clicking a card plays and one reached
 * by pasting the URL stays quiet. That's browser policy, not something to work
 * around; the promise rejects and nothing happens.
 */
export function DocEnterSound({ slug }: { slug: string }) {
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    if (shouldReduceMotion) return

    let canceled = false
    let playback: SoundPlayback | null = null

    playSound(soundSource(toggleOnSound), { volume: 0.3 })
      .then((next) => {
        if (canceled) next.stop()
        else playback = next
      })
      .catch(() => {
        // Autoplay blocked, or the tab has no audio output. Neither is worth
        // reporting for a decorative sound.
      })

    return () => {
      canceled = true
      playback?.stop()
    }
  }, [slug, shouldReduceMotion])

  return null
}
