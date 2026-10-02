"use client"

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type FocusEvent as ReactFocusEvent,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from "react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/fibo/badge"

/*
 * fibo's color-scale visualizer, ported from its Storybook Colors page, with
 * a before state added: the same card as the legacy system colored it,
 * through tokens named for their values.
 */

type Mode = "light" | "dark"
type System = "before" | "after"

type Step = {
  /** What the swatch is called under it. */
  label: string
  /** The primitive a token points at to use this step. */
  primitive: string
}

/*
 * Each system's gray ramp, light to dark, with white in front. The legacy
 * system used Tailwind's neutral grays, but gave every shade a name of its
 * own, so the scale had no order a new shade could slot into. The rebuild
 * adopted a slate with numbered steps, a little less blue than Tailwind's.
 */
const RAMPS: Record<System, Step[]> = {
  before: [
    { label: "white", primitive: "white" },
    { label: "snow", primitive: "neutral-50" },
    { label: "cloud", primitive: "neutral-100" },
    { label: "mist", primitive: "neutral-200" },
    { label: "silver", primitive: "neutral-300" },
    { label: "ash", primitive: "neutral-400" },
    { label: "pewter", primitive: "neutral-500" },
    { label: "stone", primitive: "neutral-600" },
    { label: "iron", primitive: "neutral-700" },
    {
      label: "charcoal",

      primitive: "neutral-800",
    },
    {
      label: "graphite",

      primitive: "neutral-900",
    },
    { label: "onyx", primitive: "neutral-950" },
  ],
  after: [
    { label: "white", primitive: "white" },
    { label: "50", primitive: "slate-50" },
    { label: "100", primitive: "slate-100" },
    { label: "200", primitive: "slate-200" },
    { label: "300", primitive: "slate-300" },
    { label: "400", primitive: "slate-400" },
    { label: "500", primitive: "slate-500" },
    { label: "600", primitive: "slate-600" },
    { label: "700", primitive: "slate-700" },
    { label: "800", primitive: "slate-800" },
    { label: "900", primitive: "slate-900" },
    { label: "950", primitive: "slate-950" },
  ],
}

const STEPS = 12

// Every color the exhibit draws, written out because this site's build only
// emits the color variables its own classes reference. Neutral is
// Tailwind 4's. Slate keeps Tailwind's lightness and hue at each step with
// its chroma cut to 55%, so it reads as a cool gray rather than a blue.
const COLOR: Record<string, string> = {
  white: "oklch(1 0 0)",
  "neutral-50": "oklch(0.985 0 0)",
  "neutral-100": "oklch(0.97 0 0)",
  "neutral-200": "oklch(0.922 0 0)",
  "neutral-300": "oklch(0.87 0 0)",
  "neutral-400": "oklch(0.708 0 0)",
  "neutral-500": "oklch(0.556 0 0)",
  "neutral-600": "oklch(0.439 0 0)",
  "neutral-700": "oklch(0.371 0 0)",
  "neutral-800": "oklch(0.269 0 0)",
  "neutral-900": "oklch(0.205 0 0)",
  "neutral-950": "oklch(0.145 0 0)",
  "slate-50": "oklch(0.984 0.0017 247.858)",
  "slate-100": "oklch(0.968 0.0039 247.896)",
  "slate-200": "oklch(0.929 0.0072 255.508)",
  "slate-300": "oklch(0.869 0.0121 252.894)",
  "slate-400": "oklch(0.704 0.022 256.788)",
  "slate-500": "oklch(0.554 0.0253 257.417)",
  "slate-600": "oklch(0.446 0.0237 257.281)",
  "slate-700": "oklch(0.372 0.0242 257.287)",
  "slate-800": "oklch(0.279 0.0226 260.031)",
  "slate-900": "oklch(0.208 0.0231 265.755)",
  "slate-950": "oklch(0.129 0.0231 264.695)",
  "green-400": "oklch(0.792 0.209 151.711)",
  "green-700": "oklch(0.527 0.154 150.069)",
}

// The semantic tokens, by the primitive each points at per mode.
const PRIMITIVES: Record<Mode, Record<string, string>> = {
  light: {
    background: "white",
    foreground: "slate-950",
    card: "white",
    primary: "slate-900",
    "primary-foreground": "slate-50",
    muted: "slate-100",
    "muted-foreground": "slate-500",
    success: "green-700",
    border: "slate-200",
    ring: "slate-400",
    "ring-subtle": "slate-400 at 50%",
  },
  dark: {
    background: "slate-950",
    foreground: "slate-50",
    card: "slate-900",
    primary: "slate-50",
    "primary-foreground": "slate-900",
    muted: "slate-800",
    "muted-foreground": "slate-400",
    success: "green-400",
    border: "white at 10%",
    ring: "slate-500",
    "ring-subtle": "slate-500 at 50%",
  },
}

/*
 * What the legacy system called each part: the name of a shade, not a job.
 * Parts that shared a shade shared a name, so changing the button's fill
 * meant changing the headline too.
 */
const LEGACY: Record<string, string> = {
  background: "white",
  card: "white",
  foreground: "grey/graphite",
  primary: "grey/graphite",
  "primary-foreground": "white",
  muted: "grey/cloud",
  "muted-foreground": "grey/pewter",
  border: "grey/mist",
  ring: "grey/ash",
  success: "green/apple",
}

// The primitive behind each legacy name: one name, one color.
const LEGACY_PRIMITIVE: Record<string, string> = {
  white: "white",
  "grey/cloud": "neutral-100",
  "grey/mist": "neutral-200",
  "grey/ash": "neutral-400",
  "grey/pewter": "neutral-500",
  "grey/graphite": "neutral-900",
  "green/apple": "green-700",
}

function primitivesFor(system: System, mode: Mode) {
  if (system === "after") return PRIMITIVES[mode]
  return {
    ...Object.fromEntries(
      Object.entries(LEGACY).map(([token, name]) => [
        token,
        LEGACY_PRIMITIVE[name],
      ])
    ),
    "ring-subtle": "neutral-400 at 50%",
  }
}

function cssValue(primitive: string) {
  const alpha = / at (\d+)%$/.exec(primitive)
  if (!alpha) return COLOR[primitive]
  const base = primitive.replace(/ at \d+%$/, "")
  return `color-mix(in oklch, ${COLOR[base]} ${alpha[1]}%, transparent)`
}

function modeVars(primitives: Record<string, string>) {
  return Object.fromEntries(
    Object.entries(primitives).map(([token, primitive]) => [
      `--${token}`,
      cssValue(primitive),
    ])
  ) as CSSProperties
}

/*
 * Step 1 is always the page. Light mode reads the ramp from white and dark
 * mode from 950, so most tokens keep their step number in both.
 */
function stepOf(index: number, mode: Mode) {
  return mode === "light" ? index + 1 : STEPS - index
}

// Before, nothing said which shade was for what, so one band covers them all.
const BANDS: Record<System, { label: string; from: number; to: number }[]> = {
  before: [{ label: "No defined defaults or semantics", from: 1, to: 12 }],
  after: [
    { label: "Surfaces", from: 1, to: 2 },
    { label: "Fills and borders", from: 3, to: 4 },
    { label: "Focus and quiet text", from: 5, to: 10 },
    { label: "Solids and text", from: 11, to: 12 },
  ],
}

function rampIndex(
  ramp: Step[],
  primitives: Record<string, string>,
  token: string
) {
  const base = primitives[token]?.replace(/ at \d+%$/, "")
  return ramp.findIndex((step) => step.primitive === base)
}

const NOISE = "_!X$0-+*#"
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)"

function subscribeToReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION)
  query.addEventListener("change", onChange)
  return () => query.removeEventListener("change", onChange)
}

/*
 * Text that runs as noise for a moment when it changes, resolving left to
 * right onto the new value. The first value is shown as is.
 */
function Scramble({
  text,
  duration = 500,
}: {
  text: string
  duration?: number
}) {
  const reduced = useSyncExternalStore(
    subscribeToReducedMotion,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false
  )
  const settled = useRef<string | null>(null)
  const [noise, setNoise] = useState<string | null>(null)

  useEffect(() => {
    const previous = settled.current
    settled.current = text
    if (previous === null || previous === text || reduced) return
    const started = performance.now()
    let frame = 0
    let tick = -1
    const loop = (now: number) => {
      const progress = Math.min((now - started) / duration, 1)
      const next = Math.floor(progress * (duration / 40))
      if (progress >= 1) return setNoise(null)
      if (next !== tick) {
        tick = next
        const revealed = Math.floor(progress * text.length)
        setNoise(
          text.slice(0, revealed) +
            Array.from(
              { length: text.length - revealed },
              () => NOISE[Math.floor(Math.random() * NOISE.length)]
            ).join("")
        )
      }
      frame = window.requestAnimationFrame(loop)
    }
    frame = window.requestAnimationFrame(loop)
    return () => window.cancelAnimationFrame(frame)
  }, [text, duration, reduced])

  return <span aria-hidden="true">{noise ?? text}</span>
}

/*
 * Each callout sits on the side of the card nearest its part, in the same
 * order top to bottom, so no two lines cross. The button's fill and its
 * label each get a line, since they're two tokens.
 */
type Callout = { token: string; side: "left" | "right" }

const CALLOUTS: Callout[] = [
  { token: "foreground", side: "left" },
  { token: "muted-foreground", side: "left" },
  { token: "border", side: "left" },
  { token: "muted", side: "left" },
  { token: "card", side: "left" },
  { token: "background", side: "right" },
  { token: "success", side: "right" },
  { token: "ring", side: "right" },
  { token: "primary", side: "right" },
  { token: "primary-foreground", side: "right" },
]

// Where down its part a line lands, as a share of the part's height. The two
// surfaces are met near a corner, clear of the content.
const LANDING: Record<string, number> = { background: 0.08, card: 0.96 }

// A label inside a button, met from underneath rather than through the fill.
const FROM_BELOW = new Set(["primary-foreground"])

const CALLOUT_GAP = 2

type Line = { token: string; d: string; x: number; y: number }
type Annotations = { tops: Record<string, number>; lines: Line[] }

/*
 * Sets each callout level with the part it names, so its line runs straight
 * across. Where two parts sit closer than their callouts are tall, the lower
 * callout steps down and its line bends in just short of the part.
 */
function useAnnotations(
  frame: RefObject<HTMLDivElement | null>,
  columns: RefObject<Map<string, HTMLElement>>,
  callouts: RefObject<Map<string, HTMLElement>>,
  parts: RefObject<Map<string, HTMLElement>>
) {
  const [annotations, setAnnotations] = useState<Annotations | null>(null)
  useLayoutEffect(() => {
    const node = frame.current
    if (!node) return
    const observer = new ResizeObserver(() => {
      const box = node.getBoundingClientRect()
      const tops: Record<string, number> = {}
      const lines: Line[] = []
      for (const side of ["left", "right"] as const) {
        const column = columns.current.get(side)?.getBoundingClientRect()
        // The columns are hidden on narrow screens, and measure as zero.
        if (!column || column.width === 0) continue
        const left = side === "left"
        const x1 = (left ? column.right : column.left) - box.left
        const offset = column.top - box.top
        let floor = -Infinity
        for (const { token } of CALLOUTS.filter((c) => c.side === side)) {
          const to = parts.current.get(token)?.getBoundingClientRect()
          const height = callouts.current.get(token)?.offsetHeight ?? 0
          if (!to) continue
          const below = FROM_BELOW.has(token)
          const y = below
            ? to.bottom + 3 - box.top
            : to.top + to.height * (LANDING[token] ?? 0.5) - box.top
          const aim = below ? y + 16 : y
          const top = Math.max(aim - offset - height / 2, floor)
          floor = top + height + CALLOUT_GAP
          tops[token] = top
          const from = top + offset + height / 2
          if (below) {
            const x2 = to.left + to.width / 2 - box.left
            lines.push({ token, d: `M${x1} ${from}H${x2}V${y}`, x: x2, y })
            continue
          }
          const x2 = (left ? to.left - 6 : to.right + 6) - box.left
          const bend = left ? x2 - 16 : x2 + 16
          lines.push({
            token,
            d:
              Math.abs(from - y) < 1
                ? `M${x1} ${y}H${x2}`
                : `M${x1} ${from}H${bend}L${x2} ${y}`,
            x: x2,
            y,
          })
        }
      }
      setAnnotations({ tops, lines })
    })
    observer.observe(node)
    return () => observer.disconnect()
  }, [frame, columns, callouts, parts])
  return annotations
}

type Active = { token: string } | { step: number } | null

function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
  disabled = [],
}: {
  label: string
  options: readonly T[]
  value: T
  onChange: (value: T) => void
  disabled?: T[]
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className="inline-flex rounded-lg border border-border p-0.5"
    >
      {options.map((option) => (
        <button
          key={option}
          type="button"
          aria-pressed={value === option}
          disabled={disabled.includes(option)}
          onClick={() => onChange(option)}
          className="rounded-md px-3 py-1 text-sm text-muted-foreground capitalize outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring-subtle disabled:pointer-events-none disabled:opacity-40 aria-pressed:bg-muted aria-pressed:text-foreground"
        >
          {option}
        </button>
      ))}
    </div>
  )
}

/**
 * fibo's neutrals as a twelve-step scale above a card whose parts are
 * labeled with the tokens that color them. After shows the semantic roles
 * and both modes; before shows the legacy names, where one name colored
 * unrelated parts and there was no dark mode to switch to.
 */
export function TokenVisualizer() {
  const [system, setSystem] = useState<System>("after")
  const [chosenMode, setMode] = useState<Mode>("light")
  const mode: Mode = system === "before" ? "light" : chosenMode
  const primitives = primitivesFor(system, mode)
  const ramp = RAMPS[system]
  const [active, setActive] = useState<Active>(null)

  const frame = useRef<HTMLDivElement>(null)
  const columnNodes = useRef(new Map<string, HTMLElement>())
  const calloutNodes = useRef(new Map<string, HTMLElement>())
  const partNodes = useRef(new Map<string, HTMLElement>())
  const annotations = useAnnotations(
    frame,
    columnNodes,
    calloutNodes,
    partNodes
  )
  const lines = annotations?.lines ?? []

  const nameOf = (token: string) =>
    system === "before" ? LEGACY[token] : `--${token}`
  const stepFor = (token: string) => {
    const index = rampIndex(ramp, primitives, token)
    return index < 0 ? null : stepOf(index, mode)
  }
  // Before, a part is picked along with every part that shares its name.
  const isActive = (token: string) =>
    active !== null &&
    ("token" in active
      ? system === "before"
        ? LEGACY[active.token] === LEGACY[token]
        : active.token === token
      : stepFor(token) === active.step)
  const activeStep =
    active === null
      ? null
      : "step" in active
        ? active.step
        : stepFor(active.token)

  const names = ramp.map((step) => step.primitive)
  const ordered = mode === "light" ? names : [...names].reverse()

  // A mouse picks by hovering; a tap picks and a second tap lets go.
  const same = (a: Active, b: NonNullable<Active>) =>
    JSON.stringify(a) === JSON.stringify(b)
  const pointAt = (next: NonNullable<Active>) => ({
    onPointerEnter: (event: ReactPointerEvent) => {
      if (event.pointerType === "mouse") setActive(next)
    },
    onPointerLeave: (event: ReactPointerEvent) => {
      if (event.pointerType === "mouse") setActive(null)
    },
    onClick: (event: ReactMouseEvent) => {
      const { pointerType } = event.nativeEvent as PointerEvent
      if (pointerType !== "touch" && pointerType !== "pen") return
      setActive((current) => (same(current, next) ? null : next))
    },
    onFocus: (event: ReactFocusEvent<HTMLElement>) => {
      if (event.currentTarget.matches(":focus-visible")) setActive(next)
    },
    onBlur: () => setActive(null),
  })

  // A run of steps under their headers. A header that spans the run's edge is
  // cut to it, so a band split across two rows is labeled in both.
  const scale = (first: number, last: number) => {
    const count = last - first + 1
    return (
      <div
        className="grid gap-x-1.5 gap-y-3"
        style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}
      >
        {BANDS[system]
          .filter(({ from, to }) => to >= first && from <= last)
          .map(({ label, from, to }) => (
            <div
              key={label}
              className="flex flex-col items-center justify-end gap-2"
              style={{
                gridColumn: `${Math.max(from, first) - first + 1} / ${Math.min(to, last) - first + 2}`,
              }}
            >
              <span
                className={cn(
                  "text-center leading-tight text-balance",
                  system === "before"
                    ? "text-sm font-medium text-foreground sm:text-base"
                    : "text-[11px] text-muted-foreground sm:text-xs"
                )}
              >
                {label}
              </span>
              <span className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />
            </div>
          ))}
        {Array.from({ length: count }, (_, i) => {
          const slot = first - 1 + i
          const { label: step, primitive } =
            ramp[mode === "light" ? slot : STEPS - 1 - slot]
          const picked = activeStep === slot + 1
          return (
            <button
              key={slot}
              type="button"
              aria-label={`Step ${slot + 1}`}
              aria-pressed={picked}
              {...pointAt({ step: slot + 1 })}
              className="flex flex-col gap-1.5 rounded-md outline-none focus-visible:ring-[3px] focus-visible:ring-ring-subtle"
            >
              <span
                className={cn(
                  "text-center font-mono text-xs",
                  picked ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {slot + 1}
              </span>
              <span
                className={cn(
                  "h-10 rounded-md border border-border sm:h-12",
                  picked &&
                    "ring-2 ring-foreground ring-offset-2 ring-offset-card"
                )}
                style={{ background: COLOR[primitive] }}
              />
              <span className="text-center font-mono text-[10px] text-muted-foreground">
                <Scramble text={step} />
              </span>
            </button>
          )
        })}
      </div>
    )
  }

  const part = (token: string) => ({
    ref: (node: HTMLElement | null) => {
      if (node) partNodes.current.set(token, node)
      else partNodes.current.delete(token)
    },
    "data-picked": isActive(token) || undefined,
  })

  const callout = ({ token, side }: Callout) => (
    <button
      key={token}
      type="button"
      ref={(node) => {
        if (node) calloutNodes.current.set(token, node)
        else calloutNodes.current.delete(token)
      }}
      {...pointAt({ token })}
      style={{ top: annotations?.tops[token] ?? 0 }}
      className={cn(
        "absolute inset-x-0 flex flex-col gap-1 rounded-md px-2 py-0.5 transition-opacity duration-200 outline-none focus-visible:ring-[3px] focus-visible:ring-ring-subtle",
        side === "left" ? "items-end text-right" : "items-start text-left",
        annotations?.tops[token] === undefined && "invisible",
        active && !isActive(token) && "opacity-40"
      )}
    >
      <span className="font-mono text-xs whitespace-nowrap text-foreground">
        <Scramble text={nameOf(token)} />
      </span>
    </button>
  )

  return (
    // The exhibit takes the chosen mode's tokens, whatever the page is in,
    // and every color in it eases across when the mode changes.
    <figure
      style={modeVars(primitives)}
      className="not-prose my-8 flex flex-col gap-8 rounded-xl border border-border bg-card p-4 text-foreground transition-colors duration-500 motion-reduce:transition-none sm:p-6 [&_*]:transition-[color,background-color,border-color,outline-color,fill,stroke,opacity,box-shadow] [&_*]:duration-500 motion-reduce:[&_*]:transition-none"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <figcaption className="flex max-w-md flex-col items-start gap-2">
          <Badge variant="outline">
            {system === "before"
              ? "Neutral gray, a name per shade"
              : "Slate, semantic tokens"}
          </Badge>
          <span className="text-sm text-muted-foreground">
            {system === "before"
              ? "Every shade had its own name, and nothing said which to use where. Point at grey/graphite: it colors the headline and the button, and there is no dark mode."
              : "Named for their jobs. Pick a token or a step to trace it, and switch modes to watch the ramp turn over."}
          </span>
        </figcaption>
        <div className="flex flex-wrap gap-2">
          <Segmented
            label="System"
            options={["before", "after"] as const}
            value={system}
            onChange={(next) => {
              setActive(null)
              setSystem(next)
            }}
          />
          <Segmented
            label="Mode"
            options={["light", "dark"] as const}
            value={mode}
            onChange={setMode}
            disabled={system === "before" ? ["dark"] : []}
          />
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <span className="sr-only">
          In {mode} mode, steps 1 to 12 are {ordered.join(", ")}.
        </span>
        <div className="flex flex-col gap-6 sm:hidden">
          {scale(1, 6)}
          {scale(7, 12)}
        </div>
        <div className="hidden sm:block">{scale(1, 12)}</div>
      </div>

      <div
        ref={frame}
        className="relative flex flex-col items-center gap-6 md:flex-row md:justify-center md:gap-10"
      >
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden size-full overflow-visible md:block"
        >
          {lines.map(({ token, d, x, y }) => (
            <g
              key={token}
              className={cn(
                "transition-opacity duration-200",
                active && !isActive(token) ? "opacity-25" : "opacity-100",
                isActive(token)
                  ? "fill-foreground stroke-foreground"
                  : "fill-muted-foreground stroke-border"
              )}
            >
              <path d={d} fill="none" strokeWidth={1} />
              <circle cx={x} cy={y} r={2.5} className="stroke-none" />
            </g>
          ))}
        </svg>

        <div
          ref={(node) => {
            if (node) columnNodes.current.set("left", node)
            else columnNodes.current.delete("left")
          }}
          className="relative hidden w-44 shrink-0 self-stretch md:block"
        >
          {CALLOUTS.filter((c) => c.side === "left").map((c) => callout(c))}
        </div>

        <Specimen part={part} />

        <div
          ref={(node) => {
            if (node) columnNodes.current.set("right", node)
            else columnNodes.current.delete("right")
          }}
          className="relative hidden w-44 shrink-0 self-stretch md:block"
        >
          {CALLOUTS.filter((c) => c.side === "right").map((c) => callout(c))}
        </div>

        {/* On narrow screens the callouts list under the card instead. */}
        <div className="flex w-full flex-wrap justify-center gap-1.5 md:hidden">
          {CALLOUTS.map(({ token }) => (
            <button
              key={token}
              type="button"
              aria-pressed={isActive(token)}
              {...pointAt({ token })}
              className="rounded-full border border-border px-2.5 py-1 font-mono text-xs whitespace-nowrap text-muted-foreground outline-none focus-visible:ring-[3px] focus-visible:ring-ring-subtle aria-pressed:border-foreground aria-pressed:text-foreground"
            >
              {nameOf(token)}
            </button>
          ))}
        </div>
      </div>
    </figure>
  )
}

type PartProps = (token: string) => {
  ref: (node: HTMLElement | null) => void
  "data-picked"?: true
}

const PICKED =
  "data-picked:outline-2 data-picked:outline-offset-2 data-picked:outline-foreground data-picked:outline-dashed"

// A small settings card on its own page, drawn with the tokens it's labeled
// with.
function Specimen({ part }: { part: PartProps }) {
  return (
    <div
      aria-hidden="true"
      {...part("background")}
      className={cn(
        "w-full max-w-72 shrink-0 rounded-xl border border-dashed border-border bg-background p-5 transition-colors duration-500 motion-reduce:transition-none",
        PICKED
      )}
    >
      <div
        {...part("card")}
        className={cn(
          "flex flex-col gap-4 rounded-lg border border-border bg-card p-4 transition-colors duration-500 motion-reduce:transition-none",
          PICKED
        )}
      >
        <div className="flex items-start gap-3">
          <div className="flex flex-1 flex-col gap-1.5">
            <span
              {...part("foreground")}
              className={cn(
                "w-fit text-sm font-medium text-foreground",
                PICKED
              )}
            >
              Weekly sync
            </span>
            <span
              {...part("muted-foreground")}
              className={cn("w-fit text-xs text-muted-foreground", PICKED)}
            >
              Last run 2 minutes ago
            </span>
          </div>
          <span
            {...part("success")}
            className={cn(
              "flex items-center gap-1 text-xs text-success",
              PICKED
            )}
          >
            <span className="size-1.5 rounded-full bg-success" />
            Synced
          </span>
        </div>
        <span {...part("border")} className={cn("h-px bg-border", PICKED)} />
        <span
          {...part("ring")}
          className={cn(
            "flex h-8 items-center rounded-md border border-ring px-2 text-xs text-foreground ring-[3px] ring-ring-subtle",
            PICKED
          )}
        >
          Design review
        </span>
        <div className="flex items-center gap-2">
          <span
            {...part("muted")}
            className={cn(
              "rounded-full bg-muted px-2 py-0.5 text-xs text-foreground",
              PICKED
            )}
          >
            Design
          </span>
          <span
            {...part("primary")}
            className={cn(
              "ml-auto flex rounded-md bg-primary px-3 py-1.5 text-xs font-medium",
              PICKED
            )}
          >
            <span
              {...part("primary-foreground")}
              // Outlined in its own color, the one that shows against the
              // button's fill.
              className={cn(
                "text-primary-foreground",
                PICKED,
                "data-picked:outline-primary-foreground"
              )}
            >
              Save
            </span>
          </span>
        </div>
      </div>
    </div>
  )
}
