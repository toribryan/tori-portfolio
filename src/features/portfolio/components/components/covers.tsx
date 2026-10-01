"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import type { ComponentType } from "react"
import {
  CalendarIcon,
  CircleDashedIcon,
  DatabaseIcon,
  GitBranchIcon,
  MessageSquareIcon,
  SignalHighIcon,
  TagIcon,
} from "lucide-react"
import { useTheme } from "next-themes"

import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"
import {
  ChapterScrubber,
  type Chapter,
} from "@/components/fibo/chapter-scrubber"
import { CommandMenu } from "@/components/fibo/command-menu"
import {
  FilterMenu,
  type FilterField,
  type FilterValue,
} from "@/components/fibo/filter-menu"
import {
  IntegrationVisual,
  type IntegrationItem,
} from "@/components/fibo/integration-visual"
import { PixelSnailSprite } from "@/components/fibo/pixel-snail"
import { Reactions, type Reaction } from "@/components/fibo/reactions"
import { TokenFlow, type TokenRow } from "@/components/fibo/token-flow"
import { GROUPS } from "@/features/components/examples/command-menu-data"

type CoverProps = { active: boolean }

/*
 * Each cover holds still at rest and loops a short demo of its part while
 * `active`, using only the part's own props and the events a person would
 * send it. Sample data is from fibo's stories.
 */

/** Steps through `0..count-1` every `ms` while `active`, starting over at 0. */
function useCycle(count: number, ms: number, active: boolean) {
  const [step, setStep] = useState(0)
  useEffect(() => {
    if (!active) return
    const id = window.setInterval(() => setStep((s) => (s + 1) % count), ms)
    return () => {
      window.clearInterval(id)
      setStep(0)
    }
  }, [count, ms, active])
  return step
}

/*
 * Runs `act` with the cover's inert lifted, since inert swallows the clicks
 * and key presses the demos send.
 */
function uninerted(node: Element | null, act: () => void) {
  const cover = node?.closest<HTMLElement>("[inert]")
  if (cover) cover.inert = false
  act()
  if (cover) cover.inert = true
}

const TOKEN_ROWS: TokenRow[] = [
  {
    base: "oklch(0.205 0 0)",
    primitive: "neutral-900",
    semantic: "bg-primary",
    dark: { base: "oklch(0.985 0 0)", primitive: "neutral-50" },
  },
  {
    base: "oklch(0.505 0.213 27.518)",
    primitive: "red-700",
    semantic: "text-destructive",
    dark: { base: "oklch(0.704 0.191 22.216)", primitive: "red-400" },
  },
  {
    base: "oklch(0.922 0 0)",
    primitive: "neutral-200",
    semantic: "border-border",
    dark: { base: "oklch(1 0 0 / 10%)", primitive: "white / 10%" },
  },
]

/**
 * Flips the rows to the other theme's values and back every few seconds, so
 * they scramble each way. The part stacks its rows below `sm` by the
 * viewport, so a phone gets one row rather than a column too tall for the
 * cover.
 */
function TokenFlowCover({ active }: CoverProps) {
  const { resolvedTheme } = useTheme()
  const narrow = useMediaQuery("(max-width: 639px)")
  const flipped = useCycle(2, 3000, active) === 1
  const other = resolvedTheme === "dark" ? "light" : "dark"

  return (
    <ScaledStage width={narrow ? 320 : 600}>
      <TokenFlow
        rows={narrow ? TOKEN_ROWS.slice(0, 1) : TOKEN_ROWS}
        theme={flipped ? other : undefined}
        className="flex h-full flex-col justify-center rounded-none border-0 bg-transparent"
      />
    </ScaledStage>
  )
}

const TOOLS: IntegrationItem[] = [
  { title: "Database", icon: <DatabaseIcon /> },
  { title: "Repository", icon: <GitBranchIcon /> },
  { title: "Chat", icon: <MessageSquareIcon /> },
  { title: "Calendar", icon: <CalendarIcon /> },
]

/** Pulses run in along the routes, with the halo breathing, while active. */
function IntegrationVisualCover({ active }: CoverProps) {
  return (
    <ScaledStage width={400}>
      <IntegrationVisual
        items={TOOLS}
        pulse={active ? "inward" : "none"}
        halo={active}
        className="h-full bg-transparent"
      />
    </ScaledStage>
  )
}

const CHAPTERS: Chapter[] = Array.from({ length: 19 }, (_, i) => ({
  id: `chapter-${i}`,
  title: `Chapter ${i + 1}`,
}))

/**
 * Sweeps a pointer along the rail and back, over and over, the way a person
 * would scrub it, so the marks swell and settle under the crest.
 */
function ChapterScrubberCover({ active }: CoverProps) {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const rail = root.current?.querySelector<HTMLElement>('[role="listbox"]')
    if (!active || !rail) return

    const sweepMs = 2400
    const startedAt = performance.now()
    let frame = 0
    const loop = (now: number) => {
      const phase = ((now - startedAt) % sweepMs) / sweepMs
      const t = 0.5 - 0.5 * Math.cos(phase * 2 * Math.PI)
      const rect = rail.getBoundingClientRect()
      rail.dispatchEvent(
        new PointerEvent("pointermove", {
          bubbles: true,
          clientX: rect.left + t * rect.width,
          clientY: rect.top + rect.height / 2,
        })
      )
      frame = window.requestAnimationFrame(loop)
    }
    frame = window.requestAnimationFrame(loop)

    return () => {
      window.cancelAnimationFrame(frame)
      rail.dispatchEvent(new PointerEvent("pointerout", { bubbles: true }))
    }
  }, [active])

  return (
    <div ref={root} className="flex size-full items-center justify-center">
      <ChapterScrubber
        chapters={CHAPTERS}
        orientation="horizontal"
        preview="none"
        defaultCurrentIndex={4}
      />
    </div>
  )
}

const SEEDED: Reaction[] = [
  { emoji: "👍", label: "Thumbs up", count: 5 },
  { emoji: "❤️", label: "Heart", count: 3, active: true },
  { emoji: "😂", label: "Laughing", count: 1 },
]

/**
 * Taps the first pill when the card goes active, so the count ticks up and
 * the emoji burst plays, and taps it again on the way out.
 */
function ReactionsCover({ active }: CoverProps) {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!active) return
    const tap = () => {
      const pill = root.current?.querySelector<HTMLButtonElement>(
        "button[aria-pressed]"
      )
      uninerted(pill ?? null, () => pill?.click())
    }
    tap()
    return tap
  }, [active])

  return (
    // Two cards across a phone leave too little room for the pills on one
    // row, so they're zoomed down there rather than wrapping against the edge.
    <div
      ref={root}
      className="flex size-full items-center justify-center p-2 max-sm:[zoom:0.8]"
    >
      <Reactions defaultReactions={SEEDED} />
    </div>
  )
}

/**
 * Dances while active and looks on, still, otherwise. The sprite's origin is
 * under the middle of its foot, so the view box is the art's box shifted by
 * that.
 */
function PixelSnailCover({ active }: CoverProps) {
  return (
    <div className="flex size-full items-center justify-center text-foreground">
      <svg
        // fibo's stories frame the dancing sprite with this box.
        viewBox="-13 -16 27 18"
        className="aspect-27/18 h-2/5 w-auto overflow-visible"
        shapeRendering="crispEdges"
        fill="currentColor"
        aria-hidden
      >
        <PixelSnailSprite mode="dance" look={active ? null : { x: 1, y: 0 }} />
      </svg>
    </div>
  )
}

const FIELDS: FilterField[] = [
  {
    id: "status",
    label: "Status",
    icon: <CircleDashedIcon />,
    options: [
      { value: "todo", label: "Todo" },
      { value: "in-progress", label: "In progress" },
    ],
  },
  {
    id: "priority",
    label: "Priority",
    icon: <SignalHighIcon />,
    options: [
      { value: "urgent", label: "Urgent" },
      { value: "high", label: "High" },
      { value: "low", label: "Low" },
    ],
  },
  {
    id: "label",
    label: "Label",
    icon: <TagIcon />,
    options: [{ value: "bug", label: "Bug" }],
  },
]

function typeInto(input: HTMLInputElement, text: string) {
  Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    "value"
  )?.set?.call(input, text)
  input.dispatchEvent(new Event("input", { bubbles: true }))
}

/**
 * The menu with its Search filters button, run the way a person would: it
 * opens, slides over to search, "urg" is typed, Enter picks Urgent and a chip
 * appears beside the trigger. Then it closes, clears and starts again. The
 * popup renders inside the cover rather than at the end of the page.
 */
function FilterMenuCover({ active }: CoverProps) {
  const [stage, setStage] = useState<HTMLDivElement | null>(null)
  // The popup's own layer over the row, so its portal never takes a place
  // in the row and nudges the chips.
  const [layer, setLayer] = useState<HTMLDivElement | null>(null)
  const [value, setValue] = useState<FilterValue>({})
  const labelOf = (fieldId: string, optionValue: string) =>
    FIELDS.find((f) => f.id === fieldId)?.options.find(
      (o) => o.value === optionValue
    )?.label ?? optionValue

  useEffect(() => {
    if (!active || !stage) return
    const trigger = () =>
      stage.querySelector<HTMLElement>("[data-slot=filter-menu-trigger]")
    const input = () => stage.querySelector<HTMLInputElement>("input")
    const timers: number[] = []
    const at = (ms: number, act: () => void) =>
      timers.push(window.setTimeout(() => uninerted(stage, act), ms))

    const run = () => {
      at(700, () => trigger()?.click())
      at(1600, () =>
        stage
          .querySelector<HTMLElement>("[data-slot=filter-menu-search-button]")
          ?.click()
      )
      ;["u", "ur", "urg"].forEach((text, i) =>
        at(2100 + i * 220, () => {
          const box = input()
          if (box) typeInto(box, text)
        })
      )
      at(3200, () =>
        input()?.dispatchEvent(
          new KeyboardEvent("keydown", { key: "Enter", bubbles: true })
        )
      )
      at(4200, () => trigger()?.click())
      at(6000, () => setValue({}))
      timers.push(window.setTimeout(run, 6600))
    }
    run()

    return () => {
      timers.forEach((id) => window.clearTimeout(id))
      if (stage.querySelector("[data-slot=filter-menu]"))
        uninerted(stage, () => trigger()?.click())
      setValue({})
    }
  }, [active, stage])

  return (
    <ScaledStage width={340}>
      <div ref={setStage} className="relative h-full">
        <div className="flex flex-wrap content-start items-center gap-2 p-5">
          <FilterMenu
            fields={FIELDS}
            value={value}
            onValueChange={setValue}
            search="button"
            container={layer}
          />
          {Object.entries(value).map(([fieldId, values]) => (
            <span
              key={fieldId}
              className="inline-flex h-8 animate-in items-center gap-1.5 rounded-full border border-border bg-card px-3 text-sm fade-in-0 zoom-in-95"
            >
              <span className="text-muted-foreground">
                {FIELDS.find((f) => f.id === fieldId)?.label}
              </span>
              {values.map((v) => labelOf(fieldId, v)).join(", ")}
            </span>
          ))}
        </div>
        <div ref={setLayer} className="absolute inset-0" />
      </div>
    </ScaledStage>
  )
}

/**
 * The palette in its default view, then the step that brings in the preview:
 * the highlight moves down to Assign to and it's clicked, so its page of
 * people opens, the dialog widens and the preview pane comes in. The
 * highlight steps through two people so the pane follows, then Backspace
 * steps back out and the pane leaves. It never takes focus or locks the
 * page's scroll.
 */
function CommandMenuCover({ active }: CoverProps) {
  const [stage, setStage] = useState<HTMLDivElement | null>(null)
  const [layer, setLayer] = useState<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!active || !stage) return
    const input = () =>
      stage.querySelector<HTMLInputElement>("[data-slot=command-menu] input")
    const press = (key: string) =>
      input()?.dispatchEvent(
        new KeyboardEvent("keydown", { key, bubbles: true })
      )
    const timers: number[] = []
    const at = (ms: number, act: () => void) =>
      timers.push(window.setTimeout(() => uninerted(stage, act), ms))

    const run = () => {
      // New file is highlighted to start; four steps down is Assign to.
      ;[0, 1, 2, 3].forEach((i) => at(1000 + i * 420, () => press("ArrowDown")))
      at(3000, () =>
        [
          ...stage.querySelectorAll<HTMLElement>(
            "[data-slot=command-menu-item]"
          ),
        ]
          .find((item) => item.textContent?.startsWith("Assign to"))
          ?.click()
      )
      at(4800, () => press("ArrowDown"))
      at(6000, () => press("ArrowDown"))
      at(7600, () => press("Backspace"))
      timers.push(window.setTimeout(run, 8800))
    }
    run()

    return () => {
      timers.forEach((id) => window.clearTimeout(id))
      // Back to the default view if it stopped on a page.
      if (stage.querySelector("[data-slot=command-menu-back]"))
        uninerted(stage, () => press("Backspace"))
    }
  }, [active, stage])

  return (
    <ScaledStage width={640}>
      <div ref={setStage} className="relative h-full">
        {/* The trigger sits on the page; the dialog opens into the layer. */}
        <div className="p-6">
          {layer && (
            <CommandMenu
              groups={GROUPS}
              open
              modal={false}
              hotkey={null}
              container={layer}
              // The dialog grows to make room for the pane, which shows once
              // the dialog is wide enough for it and then fades in from the
              // side it opens on.
              popupClassName="top-14 h-[340px] w-[440px] max-w-none transition-[width] duration-300 ease-out data-preview:w-[600px] data-preview:max-w-none [&_[data-slot=command-menu-preview]]:animate-in [&_[data-slot=command-menu-preview]]:duration-300 [&_[data-slot=command-menu-preview]]:fade-in-0 [&_[data-slot=command-menu-preview]]:slide-in-from-right-2"
            />
          )}
        </div>
        <div ref={setLayer} className="absolute inset-0" />
      </div>
    </ScaledStage>
  )
}

export const COVERS: Record<string, ComponentType<CoverProps>> = {
  "filter-menu": FilterMenuCover,
  "chapter-scrubber": ChapterScrubberCover,
  "integration-visual": IntegrationVisualCover,
  reactions: ReactionsCover,
  "token-flow": TokenFlowCover,
  "command-menu": CommandMenuCover,
  "pixel-snail": PixelSnailCover,
}

/**
 * Lays its child out at `width` and scales it to fill the cover's width, so
 * a part draws its full layout rather than its narrow one. Hidden until the
 * cover has been measured.
 */
export function ScaledStage({
  width,
  zoom = false,
  children,
}: {
  width: number
  /**
   * Scale with CSS zoom rather than a transform. A transformed stage is
   * rasterized again at slightly different sub-pixel offsets whenever
   * something inside it animates, so small icons shimmer; a zoomed one lays
   * out at the final size and holds still. Popups that measure the page
   * expect a transform, so the fibo part covers keep it.
   */
  zoom?: boolean
  children: ReactNode
}) {
  const frame = useRef<HTMLDivElement>(null)
  const [coverWidth, setCoverWidth] = useState<number | null>(null)
  const scale = coverWidth === null ? null : coverWidth / width

  useEffect(() => {
    const element = frame.current
    if (!element) return
    const observer = new ResizeObserver(([entry]) => {
      setCoverWidth(entry.contentRect.width)
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={frame} className="absolute inset-0">
      <div
        className={cn(
          "origin-top-left transition-opacity duration-300",
          scale === null && "opacity-0"
        )}
        style={{
          width,
          // Zoom scales the layout box itself, so the stage needs only the
          // cover's height; a transform scales after layout and needs more.
          ...(zoom
            ? { height: "100%", zoom: scale ?? 1 }
            : {
                height: scale ? `${100 / scale}%` : "100%",
                transform: `scale(${scale ?? 1})`,
              }),
        }}
      >
        {children}
      </div>
    </div>
  )
}
