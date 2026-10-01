"use client"

import { useEffect, useEffectEvent, useRef } from "react"

import {
  ChapterScrubber,
  type Chapter,
  type ChapterScrubberProps,
} from "@/components/fibo/chapter-scrubber"

export const TALK: Chapter[] = [
  {
    id: "intro",
    meta: "00:00",
    title: "Why a design system",
    description:
      "The problem: four products, four button styles, no shared names.",
  },
  {
    id: "audit",
    meta: "02:14",
    title: "The audit",
    description: "Every color in production, clustered and counted.",
  },
  {
    id: "tokens",
    meta: "05:40",
    title: "Primitive tokens",
    description: "Ramps first, named for what they are, not what they do.",
  },
  {
    id: "roles",
    meta: "08:02",
    title: "Semantic roles",
    description: "Primary, muted, destructive: names components can rely on.",
  },
  {
    id: "opacity",
    meta: "10:31",
    title: "No opacity modifiers",
    description: "Why every tint became a named role Figma can bind.",
  },
  {
    id: "contrast",
    meta: "12:48",
    title: "Measuring contrast",
    description: "Moving status tones to the 700 step to clear AA.",
  },
  {
    id: "figma",
    meta: "15:05",
    title: "One name on both sides",
    description: "Variables in Figma that match the CSS one to one.",
  },
  {
    id: "registry",
    meta: "17:36",
    title: "The registry",
    description:
      "Copying source into projects instead of depending on a package.",
  },
  {
    id: "docs",
    meta: "20:12",
    title: "Docs people read",
    description: "Usage rules and do's and don'ts beside every part.",
  },
  {
    id: "adoption",
    meta: "23:40",
    title: "Adoption",
    description: "What got teams to switch, and what did not.",
  },
  {
    id: "motion",
    meta: "26:05",
    title: "Motion",
    description: "Springs, reduced motion, and when to leave things still.",
  },
  {
    id: "niche",
    meta: "28:50",
    title: "Niche parts",
    description: "Room for the playful components next to the standard ones.",
  },
  {
    id: "next",
    meta: "31:22",
    title: "What is next",
    description: "Charts, forms, and a second theme.",
  },
  { id: "qa", meta: "33:10", title: "Questions" },
]

export const ESSAY: Chapter[] = [
  { id: "problem", meta: "01", title: "The problem" },
  { id: "research", meta: "02", title: "Research" },
  { id: "principles", meta: "03", title: "Principles" },
  { id: "tokens", meta: "04", title: "Tokens" },
  { id: "components", meta: "05", title: "Components" },
  { id: "rollout", meta: "06", title: "Rollout" },
  { id: "outcome", meta: "07", title: "Outcome" },
]

export const numbered = (count: number): Chapter[] =>
  Array.from({ length: count }, (_, i) => ({
    id: String(i),
    title: `Chapter ${i + 1}`,
  }))

export const ARGS: ChapterScrubberProps = {
  chapters: TALK,
  defaultCurrentIndex: 3,
}

// Long enough for the crest spring and the preview's fade to settle.
const SETTLE_MS = 700

/**
 * The real scrubber held mid-scrub: it sends the rail the pointer event a
 * person would, resting on chapter `at`. The part lets go of its preview when
 * the rail leaves the screen, and a real pointer leaving lets go too, so it
 * takes hold again whenever it comes back into view or the pointer moves off.
 */
export function Held({
  at,
  onHeld,
  ...props
}: ChapterScrubberProps & {
  /** The chapter under the held pointer. */
  at: number
  /** Called each time the wave has settled at `at`. */
  onHeld?: () => void
}) {
  const root = useRef<HTMLDivElement>(null)
  const settled = useEffectEvent(() => onHeld?.())
  const vertical = props.orientation !== "horizontal"

  useEffect(() => {
    const rail = root.current?.querySelector<HTMLElement>('[role="listbox"]')
    if (!rail) return
    let timer = 0
    const hold = () => {
      const rect = rail.getBoundingClientRect()
      const along = (at + 0.5) / rail.children.length
      rail.dispatchEvent(
        new PointerEvent("pointermove", {
          bubbles: true,
          clientX: vertical
            ? rect.left + rect.width / 2
            : rect.left + along * rect.width,
          clientY: vertical
            ? rect.top + along * rect.height
            : rect.top + rect.height / 2,
        })
      )
      window.clearTimeout(timer)
      timer = window.setTimeout(settled, SETTLE_MS)
    }
    const rehold = () => window.setTimeout(hold, 0)
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) hold()
    })
    observer.observe(rail)
    rail.addEventListener("pointerleave", rehold)
    return () => {
      observer.disconnect()
      rail.removeEventListener("pointerleave", rehold)
      window.clearTimeout(timer)
    }
  }, [at, vertical])

  return (
    <div ref={root} className="contents">
      <ChapterScrubber {...props} />
    </div>
  )
}
