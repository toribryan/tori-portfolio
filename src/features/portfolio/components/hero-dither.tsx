"use client"

import { useEffect, useRef } from "react"

import { ditherField } from "@/lib/pixel/pixel-fx"
import { cn } from "@/lib/utils"

/*
 * The profile header's fibo dither: the headphones bunny, built from paper
 * on load, then idling with a few cells blinking. A photo lens follows the
 * pointer and a press ripples the cells. The cell data and photo come from
 * pixel-studio's `poster --field` export; regenerate them there rather than
 * editing the JSON.
 */

const FIELD = "/images/header/bunny-field.json"
const PHOTO = "/images/header/bunny-field-photo.jpg"

// The site's light surface and ink, read from the theme tokens. The strip
// stays a light plate in dark mode too, since the dark background would
// swallow the ink cells.
function lightTokens() {
  const probe = document.createElement("div")
  probe.className = "light"
  probe.hidden = true
  document.body.append(probe)
  const style = getComputedStyle(probe)
  const tokens = {
    paper: style.getPropertyValue("--background").trim(),
    ink: style.getPropertyValue("--foreground").trim(),
  }
  probe.remove()
  return tokens
}

export function HeroDither({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    let stop: (() => void) | undefined
    let cancelled = false

    const photo = new Image()
    photo.src = PHOTO
    fetch(FIELD)
      .then((res) => res.json())
      .then((field) => {
        if (cancelled) return
        stop = ditherField(canvas, field, {
          ...lightTokens(),
          photo,
          lens: [96, 54],
          align: "right",
        })
      })
      .catch(() => {})

    return () => {
      cancelled = true
      stop?.()
    }
  }, [])

  return (
    <div className={cn("overflow-hidden", className)}>
      {/* The field covers the strip anchored right, so narrow screens crop
          the dark field on the left and keep the bunny. */}
      <canvas
        ref={ref}
        role="img"
        aria-label="A white bunny wearing earbuds, drawn in 1-bit dither"
        className="absolute inset-0 size-full cursor-crosshair"
      />
    </div>
  )
}
