"use client"

import { useRef, useState } from "react"
import type { Route } from "next"
import Link from "next/link"
import { useInView, useReducedMotion } from "motion/react"

import { useMediaQuery } from "@/hooks/use-media-query"
import {
  NICHE_PARTS,
  type NichePart,
} from "@/features/portfolio/data/fibo-niche"

import { COVERS } from "./covers"

// Parts whose cover is a one-off gesture rather than a loop, so it waits for
// the pointer instead of repeating on its own.
const PLAYS_ON_HOVER = new Set(["reactions"])

/**
 * fibo's special components as cover cards, three across, with the live
 * part standing in for the cover image.
 */
export function ComponentCardList() {
  return (
    <ul className="grid gap-px bg-line sm:grid-cols-2 md:grid-cols-3">
      {NICHE_PARTS.map((part) => (
        <li key={part.name} className="bg-background">
          <ComponentCard part={part} />
        </li>
      ))}
    </ul>
  )
}

/**
 * Loops the cover while the card is on screen. A hover-only cover plays while
 * the pointer is over the card or its link has focus, and while the card is
 * on screen where nothing can hover. Nothing plays under reduced motion.
 */
function ComponentCard({ part }: { part: NichePart }) {
  const card = useRef<HTMLDivElement>(null)
  const noHover = useMediaQuery("(hover: none)")
  const reduceMotion = useReducedMotion()
  const inView = useInView(card, { amount: 0.4 })
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const onHover = PLAYS_ON_HOVER.has(part.name) && !noHover
  const active = !reduceMotion && (onHover ? hovered || focused : inView)
  const Cover = COVERS[part.name]

  return (
    <div
      ref={card}
      className="relative flex h-full flex-col gap-2 p-2 transition-[background-color] ease-out hover:bg-accent-muted"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <div
        className="relative aspect-4/3 overflow-hidden rounded-xl bg-muted/60 select-none"
        aria-hidden
        inert
      >
        {Cover && <Cover active={active} />}
        <div className="pointer-events-none absolute inset-0 rounded-xl inset-ring-1 inset-ring-black/15 dark:inset-ring-white/15" />
      </div>

      <div className="flex flex-col gap-1 p-2">
        <h3 className="text-lg leading-snug font-medium text-balance">
          <Link
            href={`/components/${part.name}` as Route}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          >
            <span className="absolute inset-0" aria-hidden />
            {part.title}
          </Link>
        </h3>

        <p className="line-clamp-2 text-sm leading-snug text-pretty text-muted-foreground">
          {part.description}
        </p>
      </div>
    </div>
  )
}
