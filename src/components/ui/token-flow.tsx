"use client"

import { useEffect, useRef, useState, useSyncExternalStore } from "react"
import { motion, useInView, useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"
import { Chip as BaseChip } from "@/components/ui/chip"

function Chip(props: React.ComponentProps<typeof BaseChip>) {
  return (
    <BaseChip
      size="sm"
      variant="tertiary"
      {...props}
      className={cn("bg-white dark:bg-card", props.className)}
    />
  )
}

export type TokenRow = {
  /** The raw value, as written in CSS. */
  base: string
  /** The primitive it is named as, e.g. a palette step. */
  primitive: string
  /** The semantic role that points at the primitive. */
  semantic: string
  /** What the role is for, shown under the semantic chip when `showUse` is set. */
  use?: string
  /** The value and primitive the role resolves to under the dark theme, when they differ. */
  dark?: {
    base: string
    primitive: string
  }
}

const TIERS = ["Base", "Primitive", "Semantic"] as const

const SCRAMBLE_CHARS = "_!X$0-+*#"

function randomChar() {
  return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
}

function subscribeToTheme(onChange: () => void) {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  })
  return () => observer.disconnect()
}

/**
 * Whether the `dark` class is on the document, the way next-themes and 21st
 * set it. `null` until the client has looked, so the first real value is
 * taken as a baseline rather than a change.
 */
function useIsDark() {
  return useSyncExternalStore<boolean | null>(
    subscribeToTheme,
    () => document.documentElement.classList.contains("dark"),
    () => null
  )
}

const NARROW = "(max-width: 639px)"

function subscribeToNarrow(onChange: () => void) {
  const query = window.matchMedia(NARROW)
  query.addEventListener("change", onChange)
  return () => query.removeEventListener("change", onChange)
}

/** Whether the rows are stacked, so one wire per gap runs in the right direction. */
function useIsNarrow() {
  return useSyncExternalStore(
    subscribeToNarrow,
    () => window.matchMedia(NARROW).matches,
    () => false
  )
}

/**
 * Text that holds still until it changes, then spends a moment as noise
 * before settling on the new value, resolving left to right. Until `live`
 * is set the text is only a placeholder, so no change is played.
 */
function ScrambleText({
  text,
  live,
  duration = 1000,
}: {
  text: string
  /** Whether `text` is the real value rather than a server-side guess. */
  live: boolean
  /** Milliseconds the noise runs for after a change. */
  duration?: number
}) {
  const reduceMotion = useReducedMotion()
  const settled = useRef<string | null>(null)
  const [noise, setNoise] = useState<string | null>(null)

  useEffect(() => {
    if (!live) return
    const previous = settled.current
    settled.current = text
    if (previous === null || previous === text || reduceMotion) return

    const startedAt = performance.now()
    let frame = 0
    let lastStep = -1
    const loop = (now: number) => {
      const progress = Math.min((now - startedAt) / duration, 1)
      const step = Math.floor(progress * (duration / 40))
      if (step !== lastStep) {
        lastStep = step
        const revealed = Math.floor(progress * text.length)
        let next = text.slice(0, revealed)
        for (let i = revealed; i < text.length; i++) {
          next += text[i] === " " ? " " : randomChar()
        }
        setNoise(next)
      }
      if (progress < 1) {
        frame = window.requestAnimationFrame(loop)
      } else {
        setNoise(null)
      }
    }
    frame = window.requestAnimationFrame(loop)
    return () => window.cancelAnimationFrame(frame)
  }, [text, live, duration, reduceMotion])

  return (
    <span className="relative inline-block whitespace-pre">
      <span className="invisible" aria-hidden>
        {text}
      </span>
      <span className="absolute inset-0" aria-hidden>
        {noise ?? text}
      </span>
      <span className="sr-only">{text}</span>
    </span>
  )
}

/**
 * A hairline with a pulse travelling along it. Fills whatever cell it is
 * in; `vertical` runs it top to bottom for the stacked layout. The pulse
 * only runs while the plate is on screen and stays still under reduced
 * motion.
 */
function Wire({
  delay,
  vertical,
  active,
}: {
  delay: number
  vertical: boolean
  /** Whether the pulse should be running. */
  active: boolean
}) {
  const end = vertical ? { x2: 4, y2: 100 } : { x2: 100, y2: 4 }
  const start = vertical ? { x1: 4, y1: 0 } : { x1: 0, y1: 4 }
  return (
    <svg
      className={vertical ? "h-6 w-2" : "h-2 w-full"}
      viewBox={vertical ? "0 0 8 100" : "0 0 100 8"}
      preserveAspectRatio="none"
      aria-hidden
    >
      <line
        {...start}
        {...end}
        className="text-border"
        stroke="currentColor"
        vectorEffect="non-scaling-stroke"
      />
      {active && (
        <motion.line
          {...start}
          {...end}
          className="text-foreground/60"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          pathLength={1}
          strokeDasharray="0.25 1"
          initial={{ strokeDashoffset: 1.25 }}
          animate={{ strokeDashoffset: -1.25 }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "linear",
            delay,
          }}
        />
      )}
    </svg>
  )
}

function Swatch({ color }: { color: string }) {
  return (
    <span
      className="ml-1 size-2.5 shrink-0 rounded-full ring-1 ring-border/60 transition-colors duration-1000"
      style={{ background: color }}
      aria-hidden
    />
  )
}

/**
 * How a color travels through the token tiers: a raw value, the primitive
 * that names it, and the semantic role that uses it. One row per color,
 * wired left to right across a dotted plate, with a pulse travelling along
 * each wire. Rows that carry a `dark` value swap to it when the theme
 * changes, scrambling for a moment on the way. The theme follows the
 * document's `dark` class unless `theme` pins it.
 */
export function TokenFlow({
  rows,
  showUse = false,
  theme,
  className,
}: {
  rows: TokenRow[]
  /** Print each row's `use` under its semantic chip. */
  showUse?: boolean
  /** Force a theme instead of following the document's `dark` class. */
  theme?: "light" | "dark"
  className?: string
}) {
  const documentDark = useIsDark()
  const isDark = theme ? theme === "dark" : documentDark === true
  const live = theme !== undefined || documentDark !== null
  const narrow = useIsNarrow()
  const reduceMotion = useReducedMotion()
  const plate = useRef<HTMLDivElement>(null)
  const inView = useInView(plate)
  const pulse = inView && !reduceMotion

  return (
    <div
      ref={plate}
      className={cn(
        "relative overflow-hidden rounded-xl border border-border/60 bg-muted/60 px-6 py-4",
        className
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle, var(--foreground) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
        aria-hidden
      />

      <div className="relative grid grid-cols-1 items-center gap-y-6 sm:grid-cols-[auto_minmax(2rem,1fr)_auto_minmax(2rem,1fr)_auto] sm:gap-x-3 sm:gap-y-3">
        <div className="contents" aria-hidden>
          {TIERS.map((tier, i) => (
            <div key={tier} className="contents">
              {i > 0 && <div className="hidden sm:block" />}
              <p className="hidden text-center font-mono text-[10px] tracking-wide text-muted-foreground uppercase sm:block">
                {tier}
              </p>
            </div>
          ))}
        </div>

        {rows.map((row, i) => {
          const value = isDark && row.dark ? row.dark : row
          return (
            <div
              key={`${row.semantic}-${i}`}
              className="flex flex-col items-center gap-1.5 sm:col-span-5 sm:grid sm:grid-cols-subgrid sm:gap-0"
            >
              <Chip
                startContent={<Swatch color={value.base} />}
                className="justify-self-center font-mono"
              >
                <span className="sr-only">{TIERS[0]} </span>
                <ScrambleText text={value.base} live={live} />
              </Chip>
              <Wire delay={i * 0.5} vertical={narrow} active={pulse} />
              <Chip
                startContent={<Swatch color={value.base} />}
                className="justify-self-center font-mono"
              >
                <span className="sr-only">{TIERS[1]} </span>
                <ScrambleText text={value.primitive} live={live} />
              </Chip>
              <Wire delay={i * 0.5 + 0.8} vertical={narrow} active={pulse} />
              <div className="flex flex-col items-center gap-1 justify-self-center">
                <Chip
                  startContent={<Swatch color={value.base} />}
                  className="font-mono"
                >
                  <span className="sr-only">{TIERS[2]} </span>
                  {row.semantic}
                </Chip>
                {showUse && row.use && (
                  <span className="font-mono text-[9px] whitespace-nowrap text-muted-foreground">
                    {row.use}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
