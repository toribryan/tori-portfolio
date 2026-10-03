"use client"

import { useEffect, useRef, useState } from "react"
import { useInView } from "motion/react"

import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"

/**
 * A card's cover clip that stays hidden behind the still image until the
 * card is hovered or focused, then fades in and plays from the start. Touch
 * screens have no hover, so there it plays on its own while in view, as it
 * does everywhere with `autoplay`.
 */
export function CoverVideo({
  src,
  start = 0,
  autoplay = false,
  className,
}: {
  src: string
  /** Seconds into the clip to start from. */
  start?: number
  autoplay?: boolean
  className?: string
}) {
  const video = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  const touch = useMediaQuery("(hover: none)")
  const inView = useInView(video, { amount: 0.5 })
  const playsAlone = autoplay || touch

  useEffect(() => {
    const element = video.current
    if (!element || !playsAlone) return
    if (!inView) {
      element.pause()
      return
    }
    element.play().catch(() => {})
    const start = () => setPlaying(true)
    element.addEventListener("playing", start)
    return () => element.removeEventListener("playing", start)
  }, [playsAlone, inView])

  // The video is aria-hidden and inert, so it listens on the card around it.
  useEffect(() => {
    const element = video.current
    const card = element?.closest("[data-cover-host]")
    if (!element || !card || playsAlone) return
    const on = () => {
      element.currentTime = start
      element.play().catch(() => {})
      setPlaying(true)
    }
    const off = () => {
      element.pause()
      setPlaying(false)
    }
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
  }, [playsAlone, start])

  return (
    <video
      ref={video}
      className={cn(
        "transition-opacity duration-300 ease-[cubic-bezier(0.42,0,0.58,1)]",
        playing ? "opacity-100" : "opacity-0",
        className
      )}
      src={start ? `${src}#t=${start}` : src}
      loop
      muted
      playsInline
      preload="metadata"
      aria-hidden
    />
  )
}
