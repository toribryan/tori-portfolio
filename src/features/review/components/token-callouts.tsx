"use client"

import Image from "next/image"

import { cn } from "@/lib/utils"

import { Frame, Reveal } from "./slide-primitives"

type Callout = {
  /** What the marker points at. */
  part: string
  /** The tokens that part reads, as the stylesheet names them. */
  tokens: string[]
  /** Where the marker sits on the card, as percentages of its box. */
  x: number
  y: number
}

/**
 * The still has the card floating in empty margins; this is the card's box
 * inside it, as fractions of the image, so the frame can crop to the card
 * and markers can be placed against the card rather than the margins.
 */
const CARD = { left: 0.136, top: 0.127, width: 0.73, height: 0.733 }
const IMAGE = { width: 978, height: 786 }

/**
 * The tokens the home card reads, marker by marker, read off the
 * marketplace's own stylesheet.
 */
const CALLOUTS: Callout[] = [
  {
    part: "Availability badge",
    tokens: ["bg-alert-success", "text-inverse", "radius-full"],
    x: 12,
    y: 5,
  },
  {
    part: "Save control",
    tokens: ["bg-card", "text-brand", "size-12 target"],
    x: 94.5,
    y: 7,
  },
  {
    part: "Photo corner",
    tokens: ["radius-xl", "shadow-sm"],
    x: 100,
    y: 77,
  },
  {
    part: "Carousel",
    tokens: ["bg-neutral-bold/60", "radius-full"],
    x: 62,
    y: 74,
  },
  {
    part: "Home name",
    tokens: ["text-md · 18px", "text-primary", "font-bold"],
    x: -3,
    y: 84.5,
  },
  {
    part: "Address",
    tokens: ["text-sm", "text-secondary"],
    x: -3,
    y: 90.5,
  },
  {
    part: "Price",
    tokens: ["text-md · 18px", "text-tertiary"],
    x: -3,
    y: 96.5,
  },
]

/**
 * An organism with its tokens pointed out: the home card still, numbered
 * markers on the parts that read a token, and the legend beside it saying
 * which token each part reads.
 */
export function TokenCallouts({ className }: { className?: string }) {
  return (
    <Reveal
      className={cn(
        "screen-line-top screen-line-bottom grid gap-6 py-4 md:grid-cols-[3fr_2fr] md:gap-8",
        className
      )}
    >
      <Frame className="self-start rounded-xl bg-[#f6f7f8] p-6">
        <div
          className="relative"
          style={{
            aspectRatio: `${CARD.width * IMAGE.width} / ${CARD.height * IMAGE.height}`,
          }}
        >
          <Image
            className="absolute max-w-none"
            style={{
              width: `${100 / CARD.width}%`,
              height: "auto",
              left: `${(-CARD.left / CARD.width) * 100}%`,
              top: `${(-CARD.top / CARD.height) * 100}%`,
            }}
            src="/case-studies/new-homecard-mch.png"
            alt="The home card: an Available Now badge, a save control, photo carousel dots, then name, address, and price"
            width={IMAGE.width}
            height={IMAGE.height}
            unoptimized
          />
          {CALLOUTS.map((callout, i) => (
            <span
              key={callout.part}
              className="absolute flex size-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-foreground text-xs font-medium text-background tabular-nums ring-2 ring-background"
              style={{ left: `${callout.x}%`, top: `${callout.y}%` }}
              aria-hidden
            >
              {i + 1}
            </span>
          ))}
        </div>
      </Frame>
      <ol className="flex flex-col divide-y divide-line">
        {CALLOUTS.map((callout, i) => (
          <li
            key={callout.part}
            className="grid grid-cols-[1.5rem_1fr] gap-3 py-2.5"
          >
            <span className="inline-flex size-6 items-center justify-center rounded-full bg-foreground text-xs font-medium text-background tabular-nums">
              {i + 1}
            </span>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium">{callout.part}</p>
              <p className="flex flex-wrap gap-1.5">
                {callout.tokens.map((token) => (
                  <code
                    key={token}
                    className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground"
                  >
                    {token}
                  </code>
                ))}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </Reveal>
  )
}
