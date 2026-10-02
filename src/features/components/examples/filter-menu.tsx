"use client"

import { useEffect, useEffectEvent, useRef, useState } from "react"
import { CircleDotIcon, ListFilterIcon } from "lucide-react"

import { Button } from "@/components/fibo/button"
import {
  FilterMenu,
  type FilterField,
  type FilterMenuProps,
  type FilterValue,
} from "@/components/fibo/filter-menu"
import { ScaledStage } from "@/features/portfolio/components/components/covers"

import { AnatomyMap, slot, type Callout } from "../components/anatomy-map"
import { Chips, FIELDS } from "./filter-menu-data"

function Story(props: Partial<FilterMenuProps>) {
  return (
    <div className="min-h-96">
      <FilterMenu fields={FIELDS} {...props} />
    </div>
  )
}

export function AppliedAsChips() {
  const [value, setValue] = useState<FilterValue>({
    status: ["todo", "in-progress"],
    priority: ["urgent"],
  })
  return (
    <div className="min-h-96">
      <div className="flex flex-wrap items-center gap-2">
        <FilterMenu fields={FIELDS} value={value} onValueChange={setValue} />
        <Chips
          value={value}
          onRemove={(fieldId) => {
            const rest = { ...value }
            delete rest[fieldId]
            setValue(rest)
          }}
        />
      </div>
    </div>
  )
}

export function Default() {
  return <Story />
}

export function InlineSearch() {
  return <Story search="inline" />
}

const DOT_TRIGGER = (
  <>
    Filter
    <CircleDotIcon aria-hidden="true" className="size-3 text-info" />
  </>
)

export function WithSelections() {
  return (
    <Story
      defaultValue={{ status: ["todo", "done"], label: ["bug"] }}
      triggerLabel={DOT_TRIGGER}
    />
  )
}

export function IconTrigger() {
  return (
    <Story
      trigger={
        <Button variant="outline" size="icon-sm" aria-label="Filter">
          <ListFilterIcon />
        </Button>
      }
    />
  )
}

/*
 * The exhibits below hold the real menu open in one view, inside a scaled
 * stage, so the doc can show every view side by side. The popup renders in
 * the stage rather than at the end of the page, and the stage is inert, so
 * these pictures never take focus from the page. Each one gets to its view
 * the way a person would: opening a field, typing, arrowing down.
 */

function typeInto(input: HTMLInputElement, text: string) {
  Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    "value"
  )?.set?.call(input, text)
  input.dispatchEvent(new Event("input", { bubbles: true }))
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const key = (target: Element | null | undefined, name: string) =>
  target?.dispatchEvent(
    new KeyboardEvent("keydown", { key: name, bubbles: true })
  )

// Inert swallows the clicks and key presses sent to the menu, so it's
// lifted for just the moment they're dispatched.
function acting(root: HTMLElement, act: () => void) {
  root.inert = false
  act()
  root.inert = true
}

const popupOf = (stage: HTMLElement) =>
  stage.querySelector<HTMLElement>("[data-slot=filter-menu]")
const inputOf = (stage: HTMLElement) =>
  popupOf(stage)?.querySelector<HTMLInputElement>("input")
const listOf = (stage: HTMLElement) =>
  popupOf(stage)?.querySelector<HTMLElement>(
    "[data-slot=filter-menu-search] + div"
  )
const fieldRow = (stage: HTMLElement, label: string) =>
  [
    ...stage.querySelectorAll<HTMLElement>("[data-slot=filter-menu-field]"),
  ].find((el) => el.textContent?.startsWith(label))
const backButton = (stage: HTMLElement) =>
  stage.querySelector<HTMLElement>("[data-slot=filter-menu-search] button")

type FrozenProps = Partial<FilterMenuProps> & {
  /** Opens the field with this label first. */
  field?: string
  /** Starts a search with this text, within the open field if there is one. */
  query?: string
  /** Presses the Search filters button, for the search with nothing typed. */
  searching?: boolean
  /** How many times to press the down arrow. */
  down?: number
  /** Called with the stage once the menu has reached its view. */
  onReady?: (stage: HTMLDivElement) => void
  /** Runs once the menu is open, in place of the steps above. */
  script?: (stage: HTMLDivElement, root: HTMLDivElement) => () => void
  /** The stage's layout size. */
  stage?: { width: number; height: number }
  /** Space left of the trigger, to center the popup in a wide stage. */
  inset?: number
}

function Frozen({
  field,
  query,
  searching = false,
  down = 0,
  onReady,
  script,
  stage: size = { width: 340, height: 360 },
  inset = 20,
  fields = FIELDS,
  search = "button",
  ...props
}: FrozenProps) {
  const root = useRef<HTMLDivElement>(null)
  const [stage, setStage] = useState<HTMLDivElement | null>(null)
  const [layer, setLayer] = useState<HTMLDivElement | null>(null)
  const reached = useEffectEvent((node: HTMLDivElement) => onReady?.(node))
  const run = useEffectEvent((node: HTMLDivElement, frame: HTMLDivElement) =>
    script?.(node, frame)
  )

  useEffect(() => {
    const frame = root.current
    if (!stage || !layer || !frame) return
    let canceled = false
    let stop: (() => void) | undefined
    const act = (fn: () => void) => acting(frame, fn)
    const drive = async () => {
      for (let i = 0; i < 60 && !popupOf(stage); i++) await wait(16)
      if (canceled || !popupOf(stage)) return
      stop = run(stage, frame)
      if (stop) return
      if (field) {
        act(() => fieldRow(stage, field)?.click())
        await wait(60)
      }
      if (searching) {
        act(() =>
          stage
            .querySelector<HTMLElement>("[data-slot=filter-menu-search-button]")
            ?.click()
        )
        await wait(60)
      }
      if (query) {
        // With the button style, a letter typed on the list starts the search.
        if (search === "button" && !searching) {
          act(() => key(listOf(stage), query[0]!))
          await wait(60)
        }
        act(() => {
          const box = inputOf(stage)
          if (box) typeInto(box, query)
        })
      }
      for (let i = 0; i < down; i++) {
        await wait(30)
        act(() => key(inputOf(stage) ?? listOf(stage), "ArrowDown"))
      }
      // Let the slide and the height settle before anything measures.
      await wait(350)
      if (!canceled) reached(stage)
    }
    drive()
    return () => {
      canceled = true
      stop?.()
    }
  }, [stage, layer, field, query, searching, down, search])

  return (
    <div
      ref={root}
      inert
      className="relative w-full overflow-hidden rounded-lg bg-muted/40"
      style={{ aspectRatio: `${size.width} / ${size.height}` }}
    >
      <ScaledStage width={size.width}>
        <div ref={setStage} className="relative h-full">
          <div className="pt-5" style={{ paddingLeft: inset }}>
            {layer && (
              <FilterMenu
                fields={fields}
                search={search}
                open
                container={layer}
                {...props}
              />
            )}
          </div>
          <div ref={setLayer} className="absolute inset-0" />
        </div>
      </ScaledStage>
    </div>
  )
}

const SELECTED: FilterValue = { status: ["todo", "done"], label: ["bug"] }

export function FieldMenu() {
  return <Frozen stage={{ width: 340, height: 260 }} />
}

export function FieldMenuSelected() {
  return (
    <Frozen
      stage={{ width: 340, height: 260 }}
      defaultValue={SELECTED}
      triggerLabel={DOT_TRIGGER}
    />
  )
}

export function Values() {
  return (
    <Frozen
      stage={{ width: 340, height: 300 }}
      field="Status"
      defaultValue={SELECTED}
    />
  )
}

// A shorter list than the menu's own, so the view fits beside the others
// and still shows that it scrolls.
export function SearchState() {
  return (
    <Frozen
      stage={{ width: 340, height: 300 }}
      searching
      popupClassName="[&_[data-slot=filter-menu-search]+div]:max-h-48"
    />
  )
}

export function SearchResults() {
  return <Frozen stage={{ width: 340, height: 260 }} query="ur" />
}

export function NoMatches() {
  return <Frozen stage={{ width: 340, height: 260 }} query="zzz" />
}

export function InlineResting() {
  return <Frozen stage={{ width: 340, height: 260 }} search="inline" />
}

export function InlineTyping() {
  return (
    <Frozen stage={{ width: 340, height: 260 }} search="inline" query="ur" />
  )
}

/*
 * Walks the menu through its views on a loop, so the slides and the height
 * following the content can be seen: into a field, a search within it, back
 * out, then a search across every field. It only runs while on screen.
 */
function tour(stage: HTMLDivElement, root: HTMLDivElement) {
  const act = (fn: () => void) => acting(root, fn)
  const type = (text: string) =>
    act(() => {
      const box = inputOf(stage)
      if (box) typeInto(box, text)
    })
  const steps: [number, () => void][] = [
    [900, () => act(() => fieldRow(stage, "Status")?.click())],
    [1400, () => act(() => key(listOf(stage), "d"))],
    [300, () => type("do")],
    [1400, () => act(() => backButton(stage)?.click())],
    [900, () => act(() => backButton(stage)?.click())],
    [
      900,
      () =>
        act(() =>
          stage
            .querySelector<HTMLElement>("[data-slot=filter-menu-search-button]")
            ?.click()
        ),
    ],
    [1100, () => type("u")],
    [250, () => type("ur")],
    [1600, () => act(() => backButton(stage)?.click())],
  ]
  let timer = 0
  let index = 0
  let visible = false
  const next = () => {
    const [delay, step] = steps[index]!
    timer = window.setTimeout(() => {
      step()
      index = (index + 1) % steps.length
      if (visible) next()
    }, delay)
  }
  const observer = new IntersectionObserver(([entry]) => {
    const was = visible
    visible = Boolean(entry?.isIntersecting)
    if (visible && !was) next()
    if (!visible) window.clearTimeout(timer)
  })
  observer.observe(root)
  return () => {
    observer.disconnect()
    window.clearTimeout(timer)
  }
}

export function Tour() {
  return (
    <Frozen
      stage={{ width: 720, height: 380 }}
      inset={(720 - 256) / 2}
      defaultValue={{ status: ["todo"] }}
      script={tour}
    />
  )
}

/*
 * Best practices, drawn with the real menu: each pair shows the same menu
 * built the right way and the wrong way.
 */

const SHUFFLED: FilterField[] = [
  {
    id: "status",
    label: "Issue status filter options",
    icon: FIELDS[0]!.icon,
    options: [
      { value: "done", label: "Done" },
      { value: "backlog", label: "Backlog" },
      { value: "in-progress", label: "In progress" },
      { value: "todo", label: "Todo" },
    ],
  },
]

export function DoFieldNames() {
  return <Frozen stage={{ width: 320, height: 250 }} field="Status" />
}

export function DontFieldNames() {
  return (
    <Frozen
      stage={{ width: 320, height: 250 }}
      fields={SHUFFLED}
      field="Issue status"
    />
  )
}

const APPLIED: FilterValue = { status: ["todo"], priority: ["urgent"] }

function IssueCount() {
  return <p className="text-sm text-muted-foreground">Showing 3 of 48 issues</p>
}

export function DoChips() {
  return (
    <div className="flex flex-col items-start gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <FilterMenu fields={FIELDS} defaultValue={APPLIED} />
        <Chips value={APPLIED} />
      </div>
      <IssueCount />
    </div>
  )
}

export function DontChips() {
  return (
    <div className="flex flex-col items-start gap-3">
      <FilterMenu fields={FIELDS} defaultValue={APPLIED} />
      <IssueCount />
    </div>
  )
}

const popup = slot("filter-menu")

/** A frozen menu under an anatomy map, measured once it reaches its view. */
function MenuMap({
  callouts,
  ...frozen
}: FrozenProps & { callouts: Callout[] }) {
  const [stage, setStage] = useState<HTMLDivElement | null>(null)
  const [settled, setSettled] = useState(0)

  // The popup is placed beside its trigger after it opens, and placed again
  // whenever the stage rescales, so the map measures once it stops moving.
  useEffect(() => {
    if (!stage) return
    let timer = 0
    const settle = () => {
      window.clearTimeout(timer)
      timer = window.setTimeout(() => setSettled((n) => n + 1), 120)
    }
    const moves = new MutationObserver(settle)
    moves.observe(stage, {
      subtree: true,
      attributes: true,
      attributeFilter: ["style"],
    })
    const sizes = new ResizeObserver(settle)
    sizes.observe(stage)
    return () => {
      moves.disconnect()
      sizes.disconnect()
      window.clearTimeout(timer)
    }
  }, [stage])

  return (
    <AnatomyMap
      callouts={callouts}
      subject={popup}
      measureKey={stage ? settled : -1}
    >
      <Frozen {...frozen} onReady={setStage} />
    </AnatomyMap>
  )
}

const rowAt = (stage: HTMLElement, name: string, index: number) =>
  stage.querySelectorAll(`[data-slot=${name}]`)[index]

const FIELD_PARTS: Callout[] = [
  { label: "Trigger", side: "left", find: slot("filter-menu-trigger") },
  {
    label: "Search filters button",
    side: "left",
    find: slot("filter-menu-search-button"),
    outline: true,
  },
  {
    label: "Highlighted field",
    side: "left",
    find: (stage) => rowAt(stage, "filter-menu-field", 0),
  },
  {
    label: "Icon",
    side: "left",
    find: (stage) => rowAt(stage, "filter-menu-field", 2)?.querySelector("svg"),
  },
  {
    label: "Count",
    side: "right",
    find: (stage) =>
      rowAt(stage, "filter-menu-field", 0)?.querySelector(".font-mono"),
    // Just above the number, clear of the chevron beside it.
    point: (part) => ({ x: part.left + part.width / 2, y: part.top - 2 }),
  },
  {
    label: "Opens its values",
    side: "right",
    find: (stage) =>
      [
        ...(rowAt(stage, "filter-menu-field", 1)?.querySelectorAll("svg") ??
          []),
      ].at(-1),
  },
  {
    label: "Popup",
    side: "right",
    find: popup,
    point: (part) => ({ x: part.right + 4, y: part.bottom - 20 }),
  },
]

const MAP_STAGE = { width: 760, height: 250 }
const MAP_INSET = (MAP_STAGE.width - 256) / 2

export function AnatomyFields() {
  return (
    <MenuMap
      callouts={FIELD_PARTS}
      stage={MAP_STAGE}
      inset={MAP_INSET}
      defaultValue={SELECTED}
    />
  )
}

const VALUE_PARTS: Callout[] = [
  {
    label: "Back",
    side: "left",
    find: (stage) => backButton(stage),
  },
  {
    label: "Checkbox",
    side: "left",
    find: (stage) =>
      rowAt(stage, "filter-menu-option", 1)?.querySelector("span"),
  },
  {
    label: "Value",
    side: "left",
    find: (stage) => rowAt(stage, "filter-menu-option", 2),
  },
  {
    label: "Field name",
    side: "right",
    find: (stage) =>
      stage.querySelector("[data-slot=filter-menu-search] .truncate"),
  },
  {
    label: "Highlighted value",
    side: "right",
    find: (stage) => rowAt(stage, "filter-menu-option", 1),
  },
]

export function AnatomyValues() {
  return (
    <MenuMap
      callouts={VALUE_PARTS}
      stage={MAP_STAGE}
      inset={MAP_INSET}
      field="Status"
      down={1}
      defaultValue={SELECTED}
    />
  )
}

const SEARCH_PARTS: Callout[] = [
  {
    label: "Back",
    side: "left",
    find: (stage) => backButton(stage),
  },
  {
    label: "Group label",
    side: "left",
    find: slot("filter-menu-group-label"),
  },
  {
    label: "Result",
    side: "left",
    find: (stage) => rowAt(stage, "filter-menu-option", 1),
  },
  {
    label: "Search box",
    side: "right",
    find: (stage) => inputOf(stage),
  },
  {
    label: "Matched letters",
    side: "right",
    find: (stage) => stage.querySelector("[data-slot=filter-menu] mark"),
    // Just above the letters, so the line doesn't strike through the label.
    point: (part) => ({ x: part.left + part.width / 2, y: part.top - 3 }),
  },
]

export function AnatomySearch() {
  return (
    <MenuMap
      callouts={SEARCH_PARTS}
      stage={MAP_STAGE}
      inset={MAP_INSET}
      query="ur"
    />
  )
}
