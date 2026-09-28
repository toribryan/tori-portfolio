"use client"

import { useRef, useState } from "react"

import { cn } from "@/lib/utils"

/*
 * The name set in monoline condensed capitals, each letter in its own window.
 * On load every window spins a short reel of other letters and lands on the
 * real one; hover a letter and it spins again. The real name is the page's
 * h1, so this band is decoration and hidden from assistive tech.
 */

const H = 100 // cap height, in viewBox units
const W = 46 // letter width
const S = 9 // stroke
const GAP = 14
const SPACE = 44
const PAD = S

// Only the letters the reel needs: the name, plus what it spins through.
const ALPHABET = "ABINORTY"

function glyph(ch: string, w: number): string {
  const i = S / 2
  const x0 = i
  const x1 = w - i
  const y0 = i
  const y1 = H - i
  const xm = w / 2
  const ym = H / 2
  const r = (x1 - x0) / 2
  const arc = (rad: number, x: number, y: number) =>
    `A ${rad} ${rad} 0 0 1 ${x} ${y}`
  // A closed-top bowl from the stem, used by R and both halves of B.
  const bowl = (top: number, bottom: number) => {
    const k = Math.min(r, (bottom - top) / 2)
    return `M ${x0} ${top} H ${x1 - k} ${arc(k, x1, top + k)} V ${bottom - k} ${arc(k, x1 - k, bottom)} H ${x0}`
  }
  switch (ch) {
    case "A": {
      const bar = y0 + (y1 - y0) * 0.66
      const t = (y1 - bar) / (y1 - y0)
      return `M ${x0} ${y1} L ${xm} ${y0} L ${x1} ${y1} M ${x0 + (xm - x0) * t} ${bar} H ${x1 - (x1 - xm) * t}`
    }
    case "B":
      return `M ${x0} ${y1} V ${y0} ${bowl(y0, ym)} ${bowl(ym, y1)}`
    case "I":
      return `M ${xm} ${y0} V ${y1}`
    case "N":
      return `M ${x0} ${y1} V ${y0} L ${x1} ${y1} V ${y0}`
    case "O":
      return `M ${x0} ${y0 + r} ${arc(r, x1, y0 + r)} V ${y1 - r} ${arc(r, x0, y1 - r)} Z`
    case "R":
      return `M ${x0} ${y1} V ${y0} ${bowl(y0, ym + 2)} M ${xm - 2} ${ym + 2} L ${x1} ${y1}`
    case "T":
      return `M ${x0} ${y0} H ${x1} M ${xm} ${y0} V ${y1}`
    case "Y":
      return `M ${x0} ${y0} L ${xm} ${ym} L ${x1} ${y0} M ${xm} ${ym} V ${y1}`
    default:
      return ""
  }
}

const widthOf = (ch: string) => (ch === "I" ? S : ch === " " ? SPACE : W)

// Deterministic, so the server and the first client render draw the same reel.
function hash(n: number) {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

const REEL_LENGTH = 7
const PITCH = H + PAD * 2 + 16

function Letter({
  ch,
  index,
  x,
  accent,
}: {
  ch: string
  index: number
  x: number
  accent: boolean
}) {
  const [spin, setSpin] = useState(0)
  const last = useRef(0)
  const w = widthOf(ch)

  const reel = Array.from({ length: REEL_LENGTH - 1 }, (_, k) => {
    const pick =
      ALPHABET[
        Math.floor(hash(index * 131 + spin * 977 + k * 53) * ALPHABET.length)
      ]!
    return { ch: pick, w: widthOf(pick) }
  })

  return (
    <g
      className="cursor-crosshair"
      onPointerEnter={(event) => {
        if (event.pointerType === "touch") return
        const now = performance.now()
        if (now - last.current < 700) return
        last.current = now
        setSpin((s) => s + 1)
      }}
    >
      <rect x={x} y={0} width={w} height={H} fill="transparent" />
      <svg
        x={x - PAD}
        y={-PAD}
        width={w + PAD * 2}
        height={H + PAD * 2}
        viewBox={`${-PAD} ${-PAD} ${w + PAD * 2} ${H + PAD * 2}`}
        overflow="hidden"
      >
        <g
          key={spin}
          className="name-reel-spin"
          style={
            {
              "--dist": `${(REEL_LENGTH - 1) * PITCH}px`,
              "--delay": spin ? "0s" : `${0.15 + index * 0.06}s`,
            } as React.CSSProperties
          }
          fill="none"
          stroke={accent ? "#B75D69" : "#EACDC2"}
          strokeWidth={S}
          strokeLinecap="square"
        >
          <path d={glyph(ch, w)} />
          {reel.map((r, k) => (
            <path
              key={k}
              transform={`translate(${(w - r.w) / 2} ${-(k + 1) * PITCH})`}
              d={glyph(r.ch, r.w)}
            />
          ))}
        </g>
      </svg>
    </g>
  )
}

export function NameReel({
  name,
  className,
}: {
  name: string
  className?: string
}) {
  const chars = [...name.toUpperCase()]
  let x = 0
  const placed = chars.map((ch, index) => {
    const at = x
    x += widthOf(ch) + GAP
    return { ch, index, x: at }
  })
  const width = x - GAP
  // The first letter of the surname takes the accent, like an initial.
  const accentAt = chars.indexOf(" ") + 1

  return (
    <div className={cn("relative", className)} aria-hidden>
      <style>{CSS}</style>
      <svg
        className="block h-full w-auto max-w-full"
        viewBox={`${-PAD} ${-PAD} ${width + PAD * 2} ${H + PAD * 2}`}
      >
        {placed
          .filter((p) => p.ch !== " ")
          .map((p) => (
            <Letter
              key={p.index}
              ch={p.ch}
              index={p.index}
              x={p.x}
              accent={p.index === accentAt}
            />
          ))}
      </svg>
    </div>
  )
}

const CSS = `
.name-reel-spin{animation:name-reel-roll .9s var(--delay,0s) both}
@keyframes name-reel-roll{
0%{transform:translateY(var(--dist));animation-timing-function:cubic-bezier(.5,0,.25,1)}
82%{transform:translateY(-8px);animation-timing-function:ease-in-out}
100%{transform:translateY(0)}
}
@media (prefers-reduced-motion:reduce){.name-reel-spin{animation:none}}
`
