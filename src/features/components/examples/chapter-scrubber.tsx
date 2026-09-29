"use client"

import { useState, type ReactNode } from "react"
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react"

import { Button } from "@/components/fibo/button"
import {
  ChapterScrubber,
  type Chapter,
  type ChapterScrubberProps,
} from "@/components/fibo/chapter-scrubber"

const talk: Chapter[] = [
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

const essay: Chapter[] = [
  { id: "problem", meta: "01", title: "The problem" },
  { id: "research", meta: "02", title: "Research" },
  { id: "principles", meta: "03", title: "Principles" },
  { id: "tokens", meta: "04", title: "Tokens" },
  { id: "components", meta: "05", title: "Components" },
  { id: "rollout", meta: "06", title: "Rollout" },
  { id: "outcome", meta: "07", title: "Outcome" },
]

const args: ChapterScrubberProps = {
  chapters: talk,
  orientation: "vertical",
  variant: "tick",
  size: "default",
  align: "edge",
  preview: "card",
  radius: 4,
  defaultCurrentIndex: 3,
}

function Frame({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-80 items-center justify-start p-2 sm:min-w-[34rem] sm:justify-center sm:p-10">
      {children}
    </div>
  )
}

export function Default() {
  return (
    <Frame>
      <ChapterScrubber {...args} />
    </Frame>
  )
}

export function Horizontal() {
  return (
    <Frame>
      <ChapterScrubber
        {...args}
        orientation="horizontal"
        preview="label"
        side="top"
      />
    </Frame>
  )
}

export function Dots() {
  return (
    <Frame>
      <ChapterScrubber {...args} variant="dot" />
    </Frame>
  )
}

export function Centered() {
  return (
    <Frame>
      <ChapterScrubber {...args} align="center" preview="label" />
    </Frame>
  )
}

export function Sizes() {
  return (
    <Frame>
      <div className="flex flex-wrap items-end gap-8 sm:gap-24">
        {(["sm", "default", "lg"] as const).map((size) => (
          <div key={size} className="flex flex-col items-start gap-4">
            <ChapterScrubber {...args} size={size} preview="none" />
            <span className="font-mono text-xs text-muted-foreground">
              {size}
            </span>
          </div>
        ))}
      </div>
    </Frame>
  )
}

export function Controlled() {
  const [current, setCurrent] = useState(3)
  const chapter = talk[current]!
  return (
    <Frame>
      <div className="flex items-center gap-4 sm:gap-10">
        <ChapterScrubber
          {...args}
          currentIndex={current}
          onCurrentIndexChange={setCurrent}
        />
        <div className="flex min-w-0 flex-col gap-3 sm:w-64">
          <span className="font-mono text-xs text-muted-foreground tabular-nums">
            {chapter.meta} · {current + 1} of {talk.length}
          </span>
          <span className="text-lg font-semibold tracking-tight text-foreground">
            {chapter.title}
          </span>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={current === 0}
              onClick={() => setCurrent(current - 1)}
            >
              <ChevronUpIcon data-icon="inline-start" />
              Previous
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={current === talk.length - 1}
              onClick={() => setCurrent(current + 1)}
            >
              Next
              <ChevronDownIcon data-icon="inline-end" />
            </Button>
          </div>
        </div>
      </div>
    </Frame>
  )
}

export function InAnArticle() {
  const [current, setCurrent] = useState(0)
  return (
    <div className="flex gap-6 p-2 sm:gap-10 sm:p-10">
      <div className="sticky top-10 self-start">
        <ChapterScrubber
          {...args}
          chapters={essay}
          size="lg"
          preview="label"
          currentIndex={current}
          onCurrentIndexChange={setCurrent}
          label="Sections"
        />
      </div>
      <article className="flex max-w-prose flex-col gap-3">
        <span className="font-mono text-xs text-muted-foreground">
          {essay[current]!.meta} / 07
        </span>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          {essay[current]!.title}
        </h2>
        <p className="text-base leading-7 text-muted-foreground">
          A long read sits to the right of a quiet rail. At rest it is a column
          of hairlines; under the pointer the marks swell and name the section,
          so the reader sees the whole shape of the piece and can jump without a
          table of contents taking up the margin.
        </p>
      </article>
    </div>
  )
}
