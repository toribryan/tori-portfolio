"use client"

import { useId } from "react"
import { motion } from "motion/react"

import { cn } from "@/lib/utils"

const W = 400
const H = 260
const CX = W / 2
const CY = H / 2

/**
 * Four satellites around a centre tile, each joined to it by a path that
 * leaves the tile's edge and turns once. Fixed positions rather than
 * computed so the routes stay tidy.
 */
const SLOTS = [
  {
    x: 72,
    y: 62,
    path: `M ${CX - 14} ${CY} V 77 Q ${CX - 14} 62 ${CX - 29} 62 H 72`,
  },
  {
    x: 328,
    y: 62,
    path: `M ${CX + 14} ${CY} V 77 Q ${CX + 14} 62 ${CX + 29} 62 H 328`,
  },
  {
    x: 72,
    y: 198,
    path: `M ${CX - 14} ${CY} V 183 Q ${CX - 14} 198 ${CX - 29} 198 H 72`,
  },
  {
    x: 328,
    y: 198,
    path: `M ${CX + 14} ${CY} V 183 Q ${CX + 14} 198 ${CX + 29} 198 H 328`,
  },
]

export type IntegrationItem = {
  title: string
  Icon: React.ComponentType<{ className?: string }>
}

function Wire({ d, id, delay }: { d: string; id: string; delay: number }) {
  return (
    <>
      <path d={d} className="text-border" stroke="currentColor" fill="none" />
      <motion.path
        d={d}
        stroke={`url(#${id})`}
        strokeWidth="2"
        fill="none"
        strokeDasharray="40 160"
        initial={{ strokeDashoffset: 200 }}
        animate={{ strokeDashoffset: -200 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear", delay }}
      />
      <defs>
        <linearGradient id={id} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="50%" stopColor="var(--foreground)" stopOpacity="0.6" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>
    </>
  )
}

/**
 * The integration diagram from the reference card: a dotted plate, a centre
 * tile, and up to four tools wired into it. `center` is whatever names the
 * hub: a mark, a number, a word.
 */
export function IntegrationVisual({
  center,
  items,
  className,
}: {
  center: React.ReactNode
  items: IntegrationItem[]
  className?: string
}) {
  const id = useId()

  return (
    <div
      className={cn(
        "relative aspect-[400/260] w-full overflow-hidden bg-muted/60",
        className
      )}
    >
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle, var(--foreground) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-linear-to-b from-background/60 from-5% via-transparent to-background/60 to-95%"
        aria-hidden
      />

      <svg
        className="pointer-events-none absolute inset-0 size-full"
        viewBox={`0 0 ${W} ${H}`}
        fill="none"
        aria-hidden
      >
        {items.slice(0, SLOTS.length).map((item, i) => (
          <Wire
            key={item.title}
            d={SLOTS[i].path}
            id={`${id}-${i}`}
            delay={i * 0.6}
          />
        ))}
      </svg>

      <div className="absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-background p-1.5 shadow-md">
        <div className="flex size-11 items-center justify-center rounded-lg border border-line">
          {center}
        </div>
        <motion.div
          className="absolute inset-0 rounded-xl border-2 border-foreground/10"
          animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 3, repeat: Infinity }}
          aria-hidden
        />
      </div>

      <ul className="contents">
        {items.slice(0, SLOTS.length).map(({ title, Icon }, i) => (
          <motion.li
            key={title}
            className="absolute z-10 flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-lg border border-border bg-background text-foreground shadow-xs"
            style={{
              left: `${(SLOTS[i].x / W) * 100}%`,
              top: `${(SLOTS[i].y / H) * 100}%`,
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            title={title}
          >
            <Icon className="size-5" />
            <span className="sr-only">{title}</span>
          </motion.li>
        ))}
      </ul>
    </div>
  )
}
