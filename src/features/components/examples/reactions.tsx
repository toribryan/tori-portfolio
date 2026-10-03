"use client"

import { useState } from "react"

import { Reactions, type Reaction } from "@/components/fibo/reactions"

import { AnatomyMap, slot, type Callout } from "../components/anatomy-map"
import {
  BUSY,
  HEART,
  LAUGH,
  Message,
  PickerHeldOpen,
  SEEDED,
  THUMBS,
  WALL,
} from "./reactions-data"

const base = {
  type: "inline",
  defaultReactions: SEEDED,
  showCounts: true,
  particles: 7,
} as const

export function Default() {
  return <Reactions {...base} />
}

export function Empty() {
  return <Reactions {...base} defaultReactions={[]} />
}

export function BusyPost() {
  return <Reactions {...base} defaultReactions={BUSY} />
}

export function WithoutCounts() {
  return <Reactions {...base} showCounts={false} />
}

export function PickerOpen() {
  return <PickerHeldOpen reactions={[SEEDED[1]!]} />
}

// The floating bar is fixed to the viewport. A transformed wrapper becomes
// its containing block, so the bar pins to this example's frame instead of
// the page.
export function Floating() {
  return (
    <div className="relative w-full [transform:translateZ(0)]">
      <div className="min-h-[20rem] p-6">
        <article className="flex max-w-prose flex-col gap-2">
          <p className="text-base font-medium">Designing for one tap</p>
          <p className="text-sm text-muted-foreground">
            A reaction should cost less than a reply. One tap, a small burst of
            joy, and back to reading. The bar keeps to its corner as the page
            scrolls, ready whenever the reader is.
          </p>
        </article>
        <Reactions {...base} type="floating" />
      </div>
    </div>
  )
}

export function InMessage() {
  return (
    <Message>
      <Reactions {...base} />
    </Message>
  )
}

export function Controlled() {
  const [reactions, setReactions] = useState<Reaction[]>(SEEDED)
  const total = reactions.reduce((sum, item) => sum + (item.count ?? 0), 0)

  return (
    <div className="flex flex-col gap-4">
      <Reactions
        {...base}
        reactions={reactions}
        onReactionsChange={setReactions}
      />
      <p className="text-xs font-medium text-muted-foreground tabular-nums">
        {total} {total === 1 ? "reaction" : "reactions"} across{" "}
        {reactions.length} {reactions.length === 1 ? "kind" : "kinds"}
      </p>
    </div>
  )
}

export function DoUnder() {
  return (
    <Message>
      <Reactions {...base} particles={0} />
    </Message>
  )
}

export function DontAbove() {
  return (
    <Message above>
      <Reactions {...base} particles={0} />
    </Message>
  )
}

export function DoFew() {
  return <Reactions {...base} particles={0} />
}

export function DontWall() {
  return (
    <div className="max-w-64">
      <Reactions {...base} particles={0} defaultReactions={WALL} />
    </div>
  )
}

const pill = (emoji: string) => (root: HTMLElement) =>
  root.querySelector(`[data-slot=reactions-pill][data-emoji="${emoji}"]`)

const below = (part: DOMRect) => ({
  x: part.left + part.width / 2,
  y: part.bottom + 4,
})

const above = (part: DOMRect) => ({
  x: part.left + part.width / 2,
  y: part.top - 4,
})

const ROW_PARTS: Callout[] = [
  { label: "Pill", side: "left", find: pill(THUMBS) },
  {
    label: "Emoji",
    side: "left",
    find: (root) => pill(THUMBS)(root)?.querySelector("span"),
    point: below,
  },
  { label: "Your reaction", side: "right", find: pill(HEART), point: above },
  { label: "Add button", side: "right", find: slot("reactions-trigger") },
  {
    label: "Count",
    side: "right",
    find: (root) =>
      pill(LAUGH)(root)?.querySelector("[data-slot=reactions-pill-count]"),
    point: below,
  },
]

/** The row of pills, with each part labeled. */
export function AnatomyRow() {
  return (
    <AnatomyMap callouts={ROW_PARTS}>
      <div className="flex justify-center px-10 py-16">
        <div data-anatomy-subject>
          <Reactions defaultReactions={SEEDED} particles={0} />
        </div>
      </div>
    </AnatomyMap>
  )
}

const choice = (index: number) => (root: HTMLElement) =>
  root.querySelectorAll("[data-slot=reactions-choice]")[index]

const PICKER_PARTS: Callout[] = [
  { label: "Choice", side: "left", find: choice(0) },
  {
    label: "Already yours",
    side: "right",
    find: (root) =>
      root.querySelector("[data-slot=reactions-choice][data-active]"),
    point: above,
  },
  {
    label: "Picker",
    side: "right",
    find: slot("reactions-panel"),
    outline: true,
  },
  { label: "Open add button", side: "right", find: slot("reactions-trigger") },
]

/** The picker held open over its row, with each part labeled. */
export function AnatomyPicker() {
  const [ready, setReady] = useState(false)
  return (
    <AnatomyMap callouts={PICKER_PARTS} measureKey={ready}>
      <div className="flex justify-center px-10 py-10">
        <PickerHeldOpen onReady={() => setReady(true)} />
      </div>
    </AnatomyMap>
  )
}
