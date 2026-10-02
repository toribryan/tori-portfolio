"use client"

import { useState, type ReactNode } from "react"
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/fibo/button"
import { ChapterScrubber } from "@/components/fibo/chapter-scrubber"

import { AnatomyMap, type Callout } from "../components/anatomy-map"
import { ARGS, ESSAY, Held, numbered, TALK } from "./chapter-scrubber-data"

function Frame({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-80 items-center justify-start p-2 sm:min-w-[34rem] sm:justify-center sm:p-10">
      {children}
    </div>
  )
}

/*
 * A grid cell or a do/don't. Held rails sit near the start so the preview
 * that opens beside the crest stays inside the frame.
 */
function Cell({
  children,
  center = false,
}: {
  children: ReactNode
  center?: boolean
}) {
  return (
    <div
      className={cn(
        "flex min-h-56 w-full items-center px-2",
        center ? "justify-center" : "justify-start"
      )}
    >
      {children}
    </div>
  )
}

export function Default() {
  return (
    <Frame>
      <ChapterScrubber {...ARGS} />
    </Frame>
  )
}

const PREVIEW_HOOK = "chapter-scrubber-anatomy"
const ANATOMY_CREST = 9

const markAt = (root: HTMLElement, index: number) =>
  root.querySelectorAll("[data-slot=chapter-scrubber-item]")[index]
    ?.firstElementChild
const previewOf = (root: HTMLElement) =>
  root.ownerDocument.querySelector(`.${PREVIEW_HOOK}`)

const PARTS: Callout[] = [
  {
    label: "Rail",
    side: "left",
    find: (root) => root.querySelector("[role=listbox]"),
    outline: true,
  },
  { label: "Mark", side: "left", find: (root) => markAt(root, 0) },
  {
    label: "Current chapter",
    side: "left",
    find: (root) => root.querySelector("[data-current]"),
  },
  { label: "Crest", side: "left", find: (root) => markAt(root, ANATOMY_CREST) },
  {
    label: "Preview card",
    side: "right",
    find: previewOf,
    outline: true,
    // Its top corner, clear of the meta and description markers below.
    point: (r) => ({ x: r.right + 4, y: r.top + 10 }),
  },
  {
    label: "Meta",
    side: "right",
    find: (root) => previewOf(root)?.querySelector("span"),
  },
  {
    label: "Description",
    side: "right",
    find: (root) => previewOf(root)?.querySelector("p"),
  },
]

/** Held mid-scrub, so the wave, the crest and the preview are all on screen. */
export function Anatomy() {
  const [settled, setSettled] = useState(0)
  return (
    <AnatomyMap callouts={PARTS} measureKey={settled}>
      <div className="flex justify-center py-10">
        {/* Spans the rail and the room its preview opens into, so the
        markers on the right clear the card. */}
        <div data-anatomy-subject className="flex">
          <Held
            {...ARGS}
            size="lg"
            at={ANATOMY_CREST}
            previewClassName={PREVIEW_HOOK}
            onHeld={() => setSettled((n) => n + 1)}
          />
          <span className="w-[264px] shrink-0" />
        </div>
      </div>
    </AnatomyMap>
  )
}

export function AtRest() {
  return (
    <Cell center>
      <ChapterScrubber {...ARGS} />
    </Cell>
  )
}

export function ScrubbingCard() {
  return (
    <Cell>
      <Held {...ARGS} at={6} />
    </Cell>
  )
}

export function ScrubbingLabel() {
  return (
    <Cell>
      <Held {...ARGS} at={6} preview="label" />
    </Cell>
  )
}

export function ScrubbingNone() {
  return (
    <Cell center>
      <Held {...ARGS} at={6} preview="none" />
    </Cell>
  )
}

export function HorizontalTicks() {
  return (
    <Cell center>
      <Held {...ARGS} at={7} orientation="horizontal" preview="label" />
    </Cell>
  )
}

export function HorizontalDots() {
  return (
    <Cell center>
      <Held
        {...ARGS}
        at={7}
        orientation="horizontal"
        variant="dot"
        preview="label"
      />
    </Cell>
  )
}

export function Dots() {
  return (
    <Cell>
      <Held {...ARGS} at={6} variant="dot" preview="label" />
    </Cell>
  )
}

export function Centered() {
  return (
    <Cell>
      <Held {...ARGS} at={6} align="center" preview="label" />
    </Cell>
  )
}

export function Sizes() {
  return (
    <Frame>
      <div className="flex flex-wrap items-end gap-8 sm:gap-24">
        {(["sm", "default", "lg"] as const).map((size) => (
          <div key={size} className="flex flex-col items-start gap-4">
            <Held {...ARGS} at={6} size={size} preview="none" />
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
  const chapter = TALK[current]!
  return (
    <Frame>
      <div className="flex items-center gap-4 sm:gap-10">
        <ChapterScrubber
          {...ARGS}
          currentIndex={current}
          onCurrentIndexChange={setCurrent}
        />
        <div className="flex min-w-0 flex-col gap-3 sm:w-64">
          <span className="font-mono text-xs text-muted-foreground tabular-nums">
            {chapter.meta} · {current + 1} of {TALK.length}
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
              disabled={current === TALK.length - 1}
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

export function OnAPlayer() {
  const [current, setCurrent] = useState(0)
  const chapter = TALK[current]!
  return (
    <div className="flex w-[392px] max-w-full flex-col gap-2 py-6">
      <div className="flex aspect-video items-end rounded-lg border border-border bg-muted p-4">
        <span className="flex items-baseline gap-2 text-sm">
          <span className="font-mono text-xs text-muted-foreground tabular-nums">
            {chapter.meta}
          </span>
          <span className="font-medium text-foreground">{chapter.title}</span>
        </span>
      </div>
      <ChapterScrubber
        chapters={TALK}
        orientation="horizontal"
        side="top"
        rowSize={28}
        currentIndex={current}
        onCurrentIndexChange={setCurrent}
        label="Talk chapters"
      />
    </div>
  )
}

export function InAnArticle() {
  const [current, setCurrent] = useState(0)
  return (
    <div className="flex gap-6 p-2 sm:gap-10 sm:p-10">
      <div className="sticky top-10 self-start">
        <ChapterScrubber
          chapters={ESSAY}
          size="lg"
          preview="label"
          currentIndex={current}
          onCurrentIndexChange={setCurrent}
          label="Sections"
        />
      </div>
      <article className="flex max-w-prose flex-col gap-3">
        <span className="font-mono text-xs text-muted-foreground">
          {ESSAY[current]!.meta} / 07
        </span>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          {ESSAY[current]!.title}
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

/*
 * Best practices, drawn with the real rail held mid-scrub: each pair is the
 * same part used the right way and the wrong way.
 */

function Rule({ children }: { children: ReactNode }) {
  return <div className="flex justify-start">{children}</div>
}

export function DoEnough() {
  return (
    <Rule>
      <Held
        chapters={numbered(14)}
        at={7}
        size="sm"
        preview="none"
        defaultCurrentIndex={2}
      />
    </Rule>
  )
}

export function DontFew() {
  return (
    <Rule>
      <Held
        chapters={numbered(3)}
        at={1}
        size="sm"
        preview="none"
        defaultCurrentIndex={0}
      />
    </Rule>
  )
}

export function DoShortTitles() {
  return (
    <Rule>
      <Held
        chapters={numbered(12).map((chapter, i) => ({
          ...chapter,
          title: ["Intro", "Tokens", "Semantic roles", "Contrast"][i % 4]!,
        }))}
        at={6}
        size="sm"
        preview="label"
      />
    </Rule>
  )
}

export function DontLongTitles() {
  return (
    <Rule>
      <Held
        chapters={numbered(12).map((chapter) => ({
          ...chapter,
          title:
            "In which we finally discuss how semantic roles came to be named",
        }))}
        at={6}
        size="sm"
        preview="label"
      />
    </Rule>
  )
}

export function DoCard() {
  return (
    <Rule>
      <Held chapters={TALK} at={6} size="sm" />
    </Rule>
  )
}

export function DontCard() {
  return (
    <Rule>
      <Held chapters={numbered(14)} at={6} size="sm" />
    </Rule>
  )
}
