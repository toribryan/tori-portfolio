"use client"

import { useEffect, useRef, type ReactNode } from "react"

import { cn } from "@/lib/utils"

// A stand-in photo, so the stories need no network.
export const PHOTO = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 180"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d6d3d1"/><stop offset="1" stop-color="#78716c"/></linearGradient></defs><rect width="320" height="180" fill="url(#g)"/><circle cx="240" cy="54" r="22" fill="#f5f5f4"/><path d="M0 150 L90 90 L150 130 L210 80 L320 150 V180 H0Z" fill="#44403c"/></svg>`
)}`

export type Place = {
  id: string
  label: string
  x: number
  y: number
  meta: string
  description: string
  price: string
}

export const PLACES: Place[] = [
  {
    id: "cafe",
    label: "Blue Bottle Coffee",
    x: 32,
    y: 38,
    meta: "Café · 4 min walk",
    description: "Single-origin pour-overs and a quiet back room.",
    price: "$6",
  },
  {
    id: "books",
    label: "Golden Ratio Books",
    x: 61,
    y: 30,
    meta: "Bookshop · 7 min walk",
    description: "Design, maths and a shelf of pixel art zines.",
    price: "$18",
  },
  {
    id: "park",
    label: "Sunflower Park",
    x: 46,
    y: 66,
    meta: "Park · 9 min walk",
    description: "A ring of sunflowers around a fountain.",
    price: "Free",
  },
  {
    id: "studio",
    label: "Pixel Studio",
    x: 78,
    y: 58,
    meta: "Gallery · 12 min walk",
    description: "Dithered prints, rotating every month.",
    price: "$12",
  },
]

// The minor street grid, in the map's 640 by 400 view box.
const STREETS_X = [70, 140, 205, 265, 400, 465, 530, 595]
const STREETS_Y = [38, 150, 205]

// A fixed seed, so the city looks the same on every render and in every
// visual snapshot.
function seeded(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Building footprints filling each block between the streets, a few to a
// block, in varied sizes like a real city's.
const PARK =
  "M232 228 C260 218 330 214 368 222 C378 248 380 272 372 292 C330 300 282 302 246 296 C236 274 230 250 232 228Z"
const RIVER =
  "M640 232 C590 244 540 290 470 300 C400 310 330 318 270 326 C200 336 110 330 0 340 V376 C110 368 200 372 276 362 C340 354 410 346 480 336 C556 324 600 284 640 270Z"

const BUILDINGS = (() => {
  const random = seeded(1618)
  const xs = [0, ...STREETS_X, 640]
  const ys = [0, ...STREETS_Y, 90, 400].sort((a, b) => a - b)
  const out: { x: number; y: number; w: number; h: number }[] = []
  for (let i = 0; i < xs.length - 1; i++) {
    for (let j = 0; j < ys.length - 1; j++) {
      const left = xs[i]! + 7
      const right = xs[i + 1]! - 7
      const top = ys[j]! + 7
      const bottom = ys[j + 1]! - 7
      let y = top
      while (y < bottom - 6) {
        let x = left
        const h = Math.min(8 + random() * 14, bottom - y)
        while (x < right - 6) {
          const w = Math.min(8 + random() * 18, right - x)
          if (random() > 0.18) out.push({ x, y, w: w - 2, h: h - 2 })
          x += w
        }
        y += h
      }
    }
  }
  return out
})()

/**
 * A stand-in for a map library's canvas: a small city of streets, building
 * footprints, a park and a river, drawn with fibo's tokens so it follows
 * light and dark. Markers sit on it at percentages, the way a map library
 * places them at coordinates.
 */
export function StandInMap({
  className,
  children,
}: {
  className?: string
  children?: ReactNode
}) {
  return (
    <div
      className={cn(
        "relative aspect-[16/10] w-[40rem] max-w-full overflow-hidden rounded-xl border border-border bg-muted dark:bg-card",
        className
      )}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 640 400"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 size-full"
        fill="none"
        strokeLinecap="round"
      >
        {/* Minor streets, a darker casing under a lighter fill. */}
        <g className="stroke-border">
          {STREETS_X.map((x) => (
            <path key={x} d={`M${x} 0V400`} strokeWidth="8" />
          ))}
          {STREETS_Y.map((y) => (
            <path key={y} d={`M0 ${y}H640`} strokeWidth="8" />
          ))}
        </g>
        <g className="stroke-background dark:stroke-muted">
          {STREETS_X.map((x) => (
            <path key={x} d={`M${x} 0V400`} strokeWidth="6" />
          ))}
          {STREETS_Y.map((y) => (
            <path key={y} d={`M0 ${y}H640`} strokeWidth="6" />
          ))}
        </g>

        <g className="fill-border dark:fill-secondary">
          {BUILDINGS.map((b, i) => (
            <rect key={i} x={b.x} y={b.y} width={b.w} height={b.h} rx="1.5" />
          ))}
        </g>

        {/* The park covers the streets inside it, with paths of its own. The
            tints are translucent, so each sits on a land-colored base. */}
        <path d={PARK} className="fill-muted dark:fill-card" />
        <path
          d={PARK}
          className="fill-success-subtle stroke-border"
          strokeWidth="1"
        />
        <path
          d="M246 290 C270 262 300 252 330 246 S362 236 368 226 M300 300 C296 280 304 260 330 246"
          className="stroke-background dark:stroke-muted"
          strokeWidth="2"
          strokeDasharray="3 3"
        />
        <circle
          cx="318"
          cy="258"
          r="9"
          className="fill-info-subtle stroke-border"
        />

        {/* The river, wider than any street, winding under the bridges. */}
        <path d={RIVER} className="fill-muted dark:fill-card" />
        <path
          d={RIVER}
          className="fill-info-subtle stroke-border"
          strokeWidth="1"
        />

        {/* The main roads, drawn last so they bridge the river. */}
        <g className="stroke-border">
          <path d="M0 92 C160 86 320 98 640 88" strokeWidth="14" />
          <path d="M332 0 C328 120 340 240 330 400" strokeWidth="14" />
          <path
            d="M0 250 C120 236 200 198 300 170 S520 120 640 132"
            strokeWidth="12"
          />
        </g>
        <g className="stroke-background dark:stroke-muted">
          <path d="M0 92 C160 86 320 98 640 88" strokeWidth="11" />
          <path d="M332 0 C328 120 340 240 330 400" strokeWidth="11" />
          <path
            d="M0 250 C120 236 200 198 300 170 S520 120 640 132"
            strokeWidth="9"
          />
        </g>

        <g
          className="fill-muted-foreground font-sans"
          fontSize="8.5"
          fontWeight="500"
          letterSpacing="0.04em"
        >
          <text x="420" y="84">
            Fibonacci Ave
          </text>
          <text x="40" y="232" transform="rotate(-9 40 232)">
            Golden Blvd
          </text>
          <text x="342" y="40" transform="rotate(90 342 40)">
            Spiral St
          </text>
          <text
            x="520"
            y="296"
            className="fill-info"
            fontStyle="italic"
            transform="rotate(-14 520 296)"
          >
            River Phi
          </text>
          <text x="262" y="240" className="fill-success">
            Sunflower Park
          </text>
        </g>
      </svg>
      {children}
    </div>
  )
}

export function Pin({
  place,
  children,
}: {
  place: Place
  children: ReactNode
}) {
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${place.x}%`, top: `${place.y}%` }}
    >
      {children}
    </div>
  )
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * A marker with its card held open for a picture. The card is portalled to
 * the body, takes focus when it opens and closes on any outside click, so it
 * can't stay open inside a doc. Instead the real card is opened once, its
 * settled copy is placed above the marker, and the real one closes. The copy
 * is inert: it only shows what the open card looks like.
 */
export function PreviewHeldOpen({
  onReady,
  children,
}: {
  onReady?: () => void
  /** A single MapMarker with something to preview. */
  children: ReactNode
}) {
  const root = useRef<HTMLDivElement>(null)
  const layer = useRef<HTMLDivElement>(null)
  const ready = useRef(onReady)

  useEffect(() => {
    ready.current = onReady
  })

  useEffect(() => {
    const node = root.current
    const host = layer.current
    if (!node || !host) return
    let canceled = false

    const snapshot = async () => {
      const marker = node.querySelector<HTMLElement>("[data-slot=map-marker]")
      if (!marker || canceled) return
      const previous = document.activeElement
      marker.click()
      let card: HTMLElement | null = null
      for (let i = 0; i < 60 && !card; i++) {
        await wait(16)
        card = document.querySelector("[data-slot=map-marker-preview]")
      }
      // Let the spring settle before copying it.
      await wait(500)
      if (!card || canceled) {
        marker.click()
        return
      }
      const copy = card.cloneNode(true) as HTMLElement
      copy.removeAttribute("id")
      host.replaceChildren(copy)
      const base = node.getBoundingClientRect()
      const at = marker.getBoundingClientRect()
      host.style.left = `${at.left - base.left + at.width / 2 - copy.offsetWidth / 2}px`
      host.style.bottom = `${base.bottom - at.top + 12}px`

      marker.click()
      await wait(300)
      if (previous instanceof HTMLElement && previous !== document.body) {
        previous.focus({ preventScroll: true })
      } else if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur()
      }
      // React set the marker back to closed; show it as it looks while open.
      marker.setAttribute("data-popup-open", "")
      await wait(300)
      if (!canceled) ready.current?.()
    }

    // Wait until it's on screen: opening the card moves focus into it, which
    // would otherwise scroll the page down to it.
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return
      observer.disconnect()
      void snapshot()
    })
    observer.observe(node)
    return () => {
      canceled = true
      observer.disconnect()
    }
  }, [])

  return (
    <div
      ref={root}
      data-anatomy-subject
      className="relative inline-flex w-64 justify-center pt-80"
    >
      {children}
      <div ref={layer} inert className="absolute" />
    </div>
  )
}
