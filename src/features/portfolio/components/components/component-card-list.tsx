"use client"

import {
  createContext,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react"
import type { Route } from "next"
import Link from "next/link"
import { PauseIcon, PlayIcon } from "lucide-react"
import { useInView, useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"
import { usePageVisible } from "@/hooks/use-page-visible"
import { Button } from "@/components/base/ui/button"
import {
  NICHE_PARTS,
  type NichePart,
} from "@/features/portfolio/data/fibo-niche"

import { COVERS } from "./covers"

// Parts whose cover is a one-off gesture rather than a loop, so it waits for
// the pointer instead of repeating on its own.
const PLAYS_ON_HOVER = new Set(["reactions"])

const CoversPaused = createContext<{
  paused: boolean
  setPaused: (paused: boolean) => void
}>({ paused: false, setPaused: () => {} })

/** Shares one pause between the covers below it and `CoversPauseToggle`. */
export function CoversPauseProvider({ children }: { children: ReactNode }) {
  const [paused, setPaused] = useState(false)
  return (
    <CoversPaused.Provider value={{ paused, setPaused }}>
      {children}
    </CoversPaused.Provider>
  )
}

/**
 * Stops every looping cover, since they otherwise loop for as long as
 * they're on screen. Under reduced motion nothing loops, so it hides.
 */
export function CoversPauseToggle({ className }: { className?: string }) {
  const { paused, setPaused } = useContext(CoversPaused)
  return (
    <Button
      size="icon-sm"
      variant="ghost"
      className={cn("text-muted-foreground motion-reduce:hidden", className)}
      aria-label="Pause animations"
      aria-pressed={paused}
      onClick={() => setPaused(!paused)}
    >
      {paused ? <PlayIcon /> : <PauseIcon />}
    </Button>
  )
}

/**
 * fibo's parts as cover cards, two across on phones and three from md up,
 * with the live part standing in for the cover image.
 */
export function ComponentCardList({
  home = false,
}: {
  /** Only the parts the home page features, rather than every part. */
  home?: boolean
}) {
  const parts = NICHE_PARTS.filter((part) => !home || part.home !== false)
  // Blank cells finish the last row, so the grid's line color doesn't show
  // through as a block where cards run out: two across, three from md up.
  const fillers = (columns: number) =>
    (columns - (parts.length % columns)) % columns
  const blanks = Math.max(fillers(2), fillers(3))
  return (
    <ul className="grid grid-cols-2 gap-px bg-line md:grid-cols-3">
      {parts.map((part) => (
        <li key={part.name} className="bg-background">
          <ComponentCard part={part} />
        </li>
      ))}
      {Array.from({ length: blanks }, (_, index) => (
        <li
          key={`blank-${index}`}
          aria-hidden
          className={cn(
            "bg-background",
            index >= fillers(2) && "max-md:hidden",
            index >= fillers(3) && "md:hidden"
          )}
        />
      ))}
    </ul>
  )
}

/**
 * Loops the cover while the card is on screen. A hover-only cover plays while
 * the pointer is over the card or its link has focus, and while the card is
 * on screen where nothing can hover. Nothing plays under reduced motion,
 * while paused or while the tab is hidden.
 */
function ComponentCard({ part }: { part: NichePart }) {
  const card = useRef<HTMLDivElement>(null)
  const noHover = useMediaQuery("(hover: none)")
  const reduceMotion = useReducedMotion()
  const { paused } = useContext(CoversPaused)
  const visible = usePageVisible()
  const inView = useInView(card, { amount: 0.4 })
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const onHover = PLAYS_ON_HOVER.has(part.name) && !noHover
  const active =
    !reduceMotion &&
    !paused &&
    visible &&
    (onHover ? hovered || focused : inView)
  const Cover = COVERS[part.name]

  return (
    <div
      ref={card}
      className="relative flex h-full flex-col gap-2 p-2 transition-[background-color] ease-out hover:bg-accent-muted"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <div
        className="relative aspect-4/3 overflow-hidden rounded-xl bg-cover-plate select-none"
        aria-hidden
        inert
      >
        {Cover && <Cover active={active} />}
        <div className="pointer-events-none absolute inset-0 rounded-xl inset-ring-1 inset-ring-black/15 dark:inset-ring-white/15" />
      </div>

      <div className="flex flex-col gap-1 p-1 sm:p-2">
        <h3 className="text-base leading-snug font-medium text-balance sm:text-lg">
          <Link
            href={`/components/${part.name}` as Route}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          >
            <span className="absolute inset-0" aria-hidden />
            {part.title}
          </Link>
        </h3>
      </div>
    </div>
  )
}
