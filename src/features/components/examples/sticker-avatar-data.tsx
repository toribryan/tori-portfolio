"use client"

import { useSyncExternalStore } from "react"

import type { StickerAvatarStatus } from "@/components/fibo/sticker-avatar"

/*
 * Sample images from fibo's sticker-avatar.fixtures.ts, drawn on a canvas so
 * they need no network. A canvas only exists in the browser, so the server
 * renders the initials fallback and the image arrives on hydration.
 */

export const BONZO = "/images/fibo/bonzo.webp"

// fibo, the pixel rabbit, from fibo's brand/rabbit.js. 1 is line, 2 is fill.
const RABBIT = [
  "01110001110000000000",
  "12221012221000000000",
  "12121012121000000000",
  "12121012121000000000",
  "01221012121000000000",
  "01221112210000000000",
  "00122222221000000000",
  "01222222222100000000",
  "12222222222100000000",
  "12122221222100000000",
  "12122221222111100000",
  "12221122221222210000",
  "01122222112222221000",
  "00122222222212222100",
  "00122222222122222111",
  "00122212221222222121",
  "00122212212222222121",
  "00122212212222222110",
  "01122112112222221000",
  "01111111111111111000",
]

let rabbit: string | undefined

function drawRabbit() {
  if (rabbit) return rabbit
  const canvas = document.createElement("canvas")
  canvas.width = 20
  canvas.height = 20
  const ctx = canvas.getContext("2d")!
  // Mirrored, so he faces into the page.
  ctx.translate(20, 0)
  ctx.scale(-1, 1)
  RABBIT.forEach((row, y) =>
    [...row].forEach((cell, x) => {
      if (cell === "0") return
      ctx.fillStyle = cell === "1" ? "#171717" : "#f5f5f5"
      ctx.fillRect(x, y, 1, 1)
    })
  )
  rabbit = canvas.toDataURL("image/png")
  return rabbit
}

const subscribe = () => () => {}

/** fibo as a transparent cut-out, once the browser can draw him. Draw it with `pixelated`. */
export function useRabbit() {
  return useSyncExternalStore(subscribe, drawRabbit, () => undefined)
}

export const STATUS_NAMES: Record<StickerAvatarStatus, string> = {
  present: "Present",
  away: "Away",
  offline: "Offline",
}
