"use client"

import { useEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"

/**
 * A card's cover clip that stays hidden behind the still image until the
 * card is hovered or focused, then fades in and plays from the start.
 */
export function CoverVideo({
  src,
  className,
}: {
  src: string
  className?: string
}) {
  const video = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)

  // The video is aria-hidden and inert, so it listens on the card around it.
  useEffect(() => {
    const element = video.current
    const card = element?.closest("[data-cover-host]")
    if (!element || !card) return
    const on = () => {
      element.currentTime = 0
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
  }, [])

  return (
    <video
      ref={video}
      className={cn(
        "transition-opacity duration-300 ease-[cubic-bezier(0.42,0,0.58,1)]",
        playing ? "opacity-100" : "opacity-0",
        className
      )}
      src={src}
      loop
      muted
      playsInline
      preload="metadata"
      aria-hidden
    />
  )
}
