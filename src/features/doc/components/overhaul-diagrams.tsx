"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { useInView, useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/fibo/badge"
import { Button } from "@/components/fibo/button"
import { TokenFlow, type TokenRow } from "@/components/fibo/token-flow"

import { Plate } from "./fibo-blocks"

/*
 * The Design System Overhaul diagrams, built from fibo's parts so the page
 * argues in the language of a working system.
 */

function Wall({
  label,
  total,
  kept,
  columns,
  play,
}: {
  label: string
  total: number
  kept: number
  columns: number
  play: boolean
}) {
  return (
    <section className="flex flex-col gap-3">
      <header className="flex items-baseline justify-between gap-4">
        <h3 className="text-sm font-medium text-foreground">{label}</h3>
        <p className="font-mono text-xs text-muted-foreground tabular-nums">
          {total.toLocaleString()} → {kept}
        </p>
      </header>
      <div
        aria-hidden
        className="grid gap-[2px] sm:gap-[3px]"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={cn(
              "aspect-square rounded-[1px] transition-colors duration-500 ease-out",
              i < kept || !play ? "bg-foreground" : "bg-border"
            )}
            style={
              i < kept
                ? undefined
                : {
                    transitionDelay: `${(i % columns) * 12 + Math.floor(i / columns) * 30}ms`,
                  }
            }
          />
        ))}
      </div>
    </section>
  )
}

/**
 * One cell per variant in the old library. Every cell starts filled, then the
 * variants the rebuild removed fade out once the plate scrolls into view.
 */
export function VariantWall() {
  const frame = useRef<HTMLDivElement>(null)
  const inView = useInView(frame, { once: true, amount: 0.4 })
  const reduceMotion = useReducedMotion()
  const play = inView || Boolean(reduceMotion)

  return (
    <Plate
      background="none"
      meta={
        <span className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-[1px] bg-foreground" /> kept
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-[1px] bg-border" /> removed
          </span>
        </span>
      }
      caption="Each cell is one variant in the old library. The filled cells survived the rebuild."
    >
      <div ref={frame} className="flex flex-col gap-8">
        <Wall label="Card" total={587} kept={32} columns={46} play={play} />
        <Wall label="Button" total={1160} kept={480} columns={58} play={play} />
      </div>
    </Plate>
  )
}

const FLAGS = [
  "hasIcon",
  "hasBadge",
  "hasFooter",
  "isCompact",
  "isElevated",
  "isSelectable",
  "showsMeta",
  "reportVariant",
  "inboxVariant",
  "adminVariant",
]

/** The last three flags name a product, which is the rule they break. */
const PRODUCT_FLAGS = 3

/**
 * Ten on/off options switching on one at a time, with the number of possible
 * cards doubling beside them.
 */
export function SwitchSprawl() {
  const frame = useRef<HTMLDivElement>(null)
  const inView = useInView(frame, { once: true, amount: 0.5 })
  const reduceMotion = useReducedMotion()
  const [stepped, setStepped] = useState(0)
  const on = reduceMotion ? FLAGS.length : stepped

  useEffect(() => {
    if (!inView || reduceMotion || stepped >= FLAGS.length) return
    const timer = setTimeout(() => setStepped(stepped + 1), 220)
    return () => clearTimeout(timer)
  }, [inView, reduceMotion, stepped])

  return (
    <Plate
      background="grid"
      caption="Ten on/off options on one component. Nobody designed a thousand cards; the options did."
    >
      <div
        ref={frame}
        className="grid gap-6 sm:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] sm:items-center"
      >
        <ul className="flex flex-col font-mono text-xs">
          {FLAGS.map((flag, index) => {
            const lit = index < on
            return (
              <li key={flag} className="flex h-6 items-center gap-2.5">
                <span
                  aria-hidden
                  className={cn(
                    "relative h-3.5 w-6 shrink-0 rounded-full border transition-colors duration-200",
                    lit
                      ? "border-foreground bg-foreground"
                      : "border-border bg-muted"
                  )}
                >
                  <span
                    className={cn(
                      "absolute top-1/2 left-0.5 size-2 -translate-y-1/2 rounded-full transition-transform duration-200 ease-out",
                      lit
                        ? "translate-x-2.5 bg-background"
                        : "bg-muted-foreground"
                    )}
                  />
                </span>
                <span className="text-foreground">{flag}</span>
                <span className="hidden text-muted-foreground sm:inline">
                  : boolean
                </span>
                {index >= FLAGS.length - PRODUCT_FLAGS && (
                  <Badge
                    variant="destructive"
                    className="ml-auto py-0 font-sans leading-5"
                  >
                    product logic
                  </Badge>
                )}
              </li>
            )
          })}
        </ul>
        <div className="flex flex-col gap-1 border-t border-line pt-6 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-6">
          <p className="font-mono text-xs text-muted-foreground">
            2<sup>{on}</sup>
          </p>
          <p className="font-heading text-5xl leading-none font-medium text-foreground tabular-nums">
            {(2 ** on).toLocaleString()}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">possible cards</p>
        </div>
      </div>
    </Plate>
  )
}

const TOKEN_ROWS: TokenRow[] = [
  {
    base: "#218358",
    primitive: "green-700",
    semantic: "action-primary",
    use: "Primary buttons",
    dark: { base: "#3DD68C", primitive: "green-400" },
  },
  {
    base: "#FFFFFF",
    primitive: "neutral-0",
    semantic: "surface-card",
    use: "Card backgrounds",
    dark: { base: "#171717", primitive: "neutral-900" },
  },
  {
    base: "#B91C1C",
    primitive: "red-700",
    semantic: "status-danger",
    use: "Errors",
    dark: { base: "#F87171", primitive: "red-400" },
  },
]

/**
 * The three tiers as fibo's TokenFlow. It follows the site's theme, so
 * switching it shows the values change while the semantic names hold still.
 */
export function TokenRoles() {
  return (
    <Plate
      caption="The old system had values and primitives, and no roles. Switch the site's theme: the values change, the roles stay."
      className="p-0 sm:p-0"
    >
      <TokenFlow
        rows={TOKEN_ROWS}
        showUse
        className="rounded-none border-0 bg-transparent py-6 [&>div:first-child]:hidden"
      />
    </Plate>
  )
}

/** One slot of a card, outlined and labeled so the structure shows. */
function Slot({ name, children }: { name: string; children: ReactNode }) {
  return (
    <div className="relative rounded-lg border border-dashed border-border px-3 pt-3 pb-2.5">
      <span className="absolute -top-2 right-2 bg-card px-1 font-mono text-[10px] leading-4 tracking-wide text-muted-foreground uppercase">
        {name}
      </span>
      {children}
    </div>
  )
}

function SlotCard({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-line bg-card p-2.5 pt-3.5">
      {children}
    </div>
  )
}

function Heading({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <>
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="text-xs text-muted-foreground">{description}</p>
    </>
  )
}

/** Three jobs, one Card: each fills the same slots with different content. */
export function SlotComposition() {
  return (
    <Plate caption="Each card fills the same slots with different parts. No new variant, no new option, no product logic.">
      <div className="grid gap-4 sm:grid-cols-3">
        <SlotCard>
          <Slot name="Header">
            <Heading title="Escalated" description="Last 7 days" />
          </Slot>
          <Slot name="Content">
            <p className="font-mono text-3xl leading-none text-foreground tabular-nums">
              14
            </p>
          </Slot>
        </SlotCard>
        <SlotCard>
          <Slot name="Header">
            <Heading title="Room scan" description="Failures by cause" />
          </Slot>
          <Slot name="Content">
            <div className="flex flex-wrap gap-1.5">
              <Badge>Lighting</Badge>
              <Badge variant="secondary">Angle</Badge>
              <Badge variant="outline">Incomplete</Badge>
            </div>
          </Slot>
        </SlotCard>
        <SlotCard>
          <Slot name="Header">
            <Heading
              title="Integrity review"
              description="3 sessions flagged"
            />
          </Slot>
          <Slot name="Footer">
            <Button size="sm">Open queue</Button>
          </Slot>
        </SlotCard>
      </div>
    </Plate>
  )
}
