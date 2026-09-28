"use client"

import { useState } from "react"

import { Reactions, type Reaction } from "@/components/fibo/reactions"

const seeded: Reaction[] = [
  { emoji: "👍", label: "Thumbs up", count: 5 },
  { emoji: "❤️", label: "Heart", count: 3, active: true },
  { emoji: "😂", label: "Laughing", count: 1 },
]

const base = {
  variant: "inline",
  defaultReactions: seeded,
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
  return (
    <Reactions
      {...base}
      defaultReactions={[
        { emoji: "👍", label: "Thumbs up", count: 12_847 },
        { emoji: "❤️", label: "Heart", count: 3_420, active: true },
        { emoji: "😂", label: "Laughing", count: 961 },
        { emoji: "🎉", label: "Celebrate", count: 1_205 },
      ]}
    />
  )
}

export function WithoutCounts() {
  return <Reactions {...base} showCounts={false} />
}

// The floating bar is fixed to the viewport. A transformed wrapper becomes
// its containing block, so the bar pins to this example's frame instead of
// the page.
export function Floating() {
  return (
    <div className="relative w-full [transform:translateZ(0)]">
      <div className="min-h-[28rem] p-8">
        <p className="max-w-prose text-base text-muted-foreground">
          The floating variant is fixed to a corner of the viewport and stays
          put as the page scrolls. It sits on the same translucent bar the site
          nav uses, clears the safe area on a notched phone, and counts every
          reaction on the item beside its trigger. Particles rise from the bar
          itself rather than from the emoji that was picked.
        </p>
        <Reactions {...base} variant="floating" />
      </div>
    </div>
  )
}

export function InMessage() {
  return (
    <div className="max-w-lg rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-2.5">
        <span className="grid size-8 place-content-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
          TB
        </span>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-card-foreground">
            Tori Bryan
          </span>
          <span className="text-xs font-medium text-muted-foreground">
            12:45 PM
          </span>
        </div>
      </div>
      <p className="mt-3 mb-3 text-sm text-card-foreground">
        Just shipped the reactions component. Picking one turns a click into a
        small celebration, which is the whole point.
      </p>
      <Reactions {...base} />
    </div>
  )
}

export function Controlled() {
  const [reactions, setReactions] = useState<Reaction[]>(seeded)
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
