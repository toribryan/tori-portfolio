"use client"

import { useEffect, useState, type ReactNode } from "react"
import { ArchiveIcon, FilePlusIcon, MoonIcon, PaletteIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/fibo/button"
import {
  CommandMenu,
  type CommandMenuGroup,
  type CommandMenuProps,
} from "@/components/fibo/command-menu"
import { ScaledStage } from "@/features/portfolio/components/components/covers"

import { FILES, GROUPS } from "./command-menu-data"

// Only the lead example listens for Cmd+K: every menu on the page would open
// on the same key otherwise.
function Story(props: Partial<CommandMenuProps>) {
  return <CommandMenu groups={GROUPS} hotkey={null} {...props} />
}

export function Default() {
  return <Story hotkey="k" />
}

export function CustomTrigger() {
  return (
    <Story
      trigger={
        <Button variant="ghost" size="sm">
          Commands
        </Button>
      }
    />
  )
}

export function Controlled() {
  const [open, setOpen] = useState(false)
  const [last, setLast] = useState<ReactNode>(null)
  return (
    <div className="flex flex-col items-start gap-3 text-sm">
      <Button variant="outline" onClick={() => setOpen(true)}>
        Open commands
      </Button>
      <p>
        Last command: <span className="font-medium">{last ?? "none"}</span>
      </p>
      <Story
        trigger={null}
        open={open}
        onOpenChange={setOpen}
        onSelect={(item) => setLast(item.label)}
      />
    </div>
  )
}

/*
 * The exhibits below hold the real menu open in one state, inside a scaled
 * stage, so a doc can show every view side by side. Each opens the menu in
 * place without moving focus or locking the page, then gets it to its state
 * the way a person would: opening a page, typing, arrowing down.
 */

function typeInto(input: HTMLInputElement, text: string) {
  Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    "value"
  )?.set?.call(input, text)
  input.dispatchEvent(new Event("input", { bubbles: true }))
}

type FrozenProps = Partial<CommandMenuProps> & {
  /** Opens the page of the item with this label first. */
  page?: string
  /** Typed into the search box once the menu is open. */
  query?: string
  /** How many times to press the down arrow. */
  down?: number
  /** Widens the dialog enough for its preview pane. */
  wide?: boolean
  /** Drawn over the stage once the menu has reached its state. */
  overlay?: (stage: HTMLDivElement) => ReactNode
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

function Frozen({
  page,
  query,
  down = 0,
  wide = false,
  overlay,
  groups = GROUPS,
  ...props
}: FrozenProps) {
  const [stage, setStage] = useState<HTMLDivElement | null>(null)
  const [layer, setLayer] = useState<HTMLDivElement | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!stage || !layer) return
    let cancelled = false
    const drive = async () => {
      let input: HTMLInputElement | null = null
      for (let i = 0; i < 60 && !input; i++) {
        await wait(16)
        input = stage.querySelector("[data-slot=command-menu] input")
      }
      if (!input || cancelled) return
      if (page) {
        const item = [
          ...stage.querySelectorAll<HTMLElement>(
            "[data-slot=command-menu-item]"
          ),
        ].find((el) => el.textContent?.startsWith(page))
        item?.click()
        await wait(60)
      }
      const box = stage.querySelector<HTMLInputElement>(
        "[data-slot=command-menu] input"
      )
      if (box && query) typeInto(box, query)
      for (let i = 0; i < down; i++) {
        await wait(30)
        box?.dispatchEvent(
          new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true })
        )
      }
      // Let a page's slide settle before anything measures the menu.
      await wait(300)
      if (!cancelled) setReady(true)
    }
    drive()
    return () => {
      cancelled = true
    }
  }, [stage, layer, page, query, down])

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-lg bg-muted/40",
        wide ? "aspect-[18/11]" : "aspect-[16/11]"
      )}
    >
      <ScaledStage width={wide ? 720 : 640}>
        <div ref={setStage} className="relative h-full">
          <div ref={setLayer} className="absolute inset-0" />
          {layer && (
            <CommandMenu
              groups={groups}
              open
              modal={false}
              hotkey={null}
              trigger={null}
              container={layer}
              popupClassName={cn(
                "top-10 h-[360px] max-w-none data-preview:max-w-none",
                wide ? "w-[640px]" : "w-[560px]"
              )}
              {...props}
            />
          )}
          {ready && stage && overlay?.(stage)}
        </div>
      </ScaledStage>
    </div>
  )
}

export function Home() {
  return <Frozen defaultRecent={["theme-dark", "calendar"]} />
}

export function Results() {
  return <Frozen query="pr" />
}

export function PageOpen() {
  return <Frozen page="Change theme" down={1} />
}

export function Preview() {
  return (
    <Frozen
      wide
      groups={FILES}
      down={1}
      placeholder="Search files, people and actions…"
    />
  )
}

export function Empty() {
  return <Frozen query="zzz" />
}

export function NoHints() {
  return <Frozen hints={false} />
}

const ROWS: CommandMenuGroup[] = [
  {
    label: "Rows",
    items: [
      {
        value: "new-file",
        label: "New file",
        icon: <FilePlusIcon />,
        shortcut: ["⌘", "N"],
      },
      {
        value: "theme",
        label: "Change theme",
        icon: <PaletteIcon />,
        items: [{ value: "theme-dark", label: "Dark", icon: <MoonIcon /> }],
      },
      {
        value: "archive",
        label: "Archive",
        icon: <ArchiveIcon />,
        disabled: true,
      },
    ],
  },
]

/** Every kind of row at once: highlighted, with context, shortcut, page, disabled. */
export function Rows() {
  return <Frozen groups={ROWS} defaultRecent={["theme-dark"]} />
}

type Part = {
  label: string
  slot: string
  /** Which side of the part the marker sits on. */
  side: "left" | "right" | "top"
}

const PARTS: Part[] = [
  { label: "Search field", slot: "command-menu-search", side: "left" },
  { label: "Group label", slot: "command-menu-group-label", side: "left" },
  { label: "Highlighted item", slot: "command-menu-item", side: "left" },
  { label: "Context", slot: "command-menu-context", side: "top" },
  { label: "Preview pane", slot: "command-menu-preview", side: "right" },
  { label: "Keyboard hints", slot: "command-menu-hints", side: "left" },
  { label: "Backdrop", slot: "command-menu-backdrop", side: "left" },
]

const STAGE_WIDTH = 720

function Markers({ stage }: { stage: HTMLDivElement }) {
  const [spots, setSpots] = useState<{ x: number; y: number }[]>([])

  useEffect(() => {
    const measure = () => {
      const box = stage.getBoundingClientRect()
      const scale = box.width / STAGE_WIDTH
      setSpots(
        PARTS.map(({ slot, side }) => {
          const el = stage.querySelector(`[data-slot=${slot}]`)
          if (!el) return { x: -100, y: -100 }
          const r = el.getBoundingClientRect()
          const left = (r.left - box.left) / scale
          const right = (r.right - box.left) / scale
          const top = (r.top - box.top) / scale
          const middle = (r.top + r.height / 2 - box.top) / scale
          if (slot === "command-menu-backdrop") return { x: 18, y: 18 }
          if (side === "right") return { x: right + 18, y: top + 28 }
          if (side === "top") return { x: (left + right) / 2, y: top - 12 }
          return { x: left - 18, y: middle }
        })
      )
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(stage)
    return () => observer.disconnect()
  }, [stage])

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-60"
    >
      {spots.map((spot, i) => (
        <span
          key={PARTS[i]!.slot}
          style={{ left: spot.x, top: spot.y }}
          className="absolute flex size-6 -translate-1/2 items-center justify-center rounded-full bg-foreground font-mono text-xs font-medium text-background ring-2 ring-background"
        >
          {i + 1}
        </span>
      ))}
    </div>
  )
}

/** The menu in its busiest state, with a numbered marker on each part. */
export function Anatomy() {
  return (
    <div className="flex w-full flex-col gap-4">
      <Frozen
        wide
        groups={FILES}
        query="r"
        placeholder="Search files, people and actions…"
        overlay={(stage) => <Markers stage={stage} />}
      />
      <ol className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-3">
        {PARTS.map((part, i) => (
          <li key={part.slot} className="flex items-center gap-2">
            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-foreground font-mono text-[11px] font-medium text-background">
              {i + 1}
            </span>
            {part.label}
          </li>
        ))}
      </ol>
    </div>
  )
}

/** The menu where it usually lives: a search field in an app's header. */
export function InHeader() {
  return (
    <div className="w-full overflow-hidden rounded-lg border border-border bg-background">
      <div className="flex h-12 items-center gap-4 border-b border-border px-4 text-sm">
        <span className="font-medium">Acme</span>
        <span className="text-muted-foreground">Projects</span>
        <span className="text-muted-foreground">Docs</span>
        <div className="ml-auto">
          <Story groups={FILES} className="w-52" />
        </div>
      </div>
      <div className="grid h-28 grid-cols-3 gap-3 p-4">
        <span className="rounded-md bg-muted" />
        <span className="rounded-md bg-muted" />
        <span className="rounded-md bg-muted" />
      </div>
    </div>
  )
}

/*
 * Best practices, drawn with the real menu: each pair shows the same menu
 * built the right way and the wrong way.
 */

const icon = (Icon: typeof FilePlusIcon) => <Icon />

export function DoNested() {
  return (
    <Frozen
      hints={false}
      groups={[
        {
          label: "Actions",
          items: [
            { value: "new", label: "New file", icon: icon(FilePlusIcon) },
            {
              value: "theme",
              label: "Change theme",
              icon: icon(PaletteIcon),
              items: [{ value: "dark", label: "Dark" }],
            },
          ],
        },
      ]}
    />
  )
}

export function DontFlat() {
  return (
    <Frozen
      hints={false}
      groups={[
        {
          label: "Actions",
          items: [
            { value: "new", label: "New file", icon: icon(FilePlusIcon) },
            {
              value: "l",
              label: "Switch to light theme",
              icon: icon(PaletteIcon),
            },
            {
              value: "d",
              label: "Switch to dark theme",
              icon: icon(PaletteIcon),
            },
            {
              value: "s",
              label: "Switch to system theme",
              icon: icon(PaletteIcon),
            },
          ],
        },
      ]}
    />
  )
}

export function DoLabels() {
  return (
    <Frozen
      hints={false}
      groups={[
        {
          label: "Suggestions",
          items: [
            { value: "new", label: "New file", icon: icon(FilePlusIcon) },
            { value: "theme", label: "Change theme", icon: icon(PaletteIcon) },
            { value: "inbox", label: "Inbox", icon: icon(ArchiveIcon) },
          ],
        },
      ]}
    />
  )
}

export function DontLabels() {
  return (
    <Frozen
      hints={false}
      groups={[
        {
          label: "Suggestions",
          items: [
            {
              value: "new",
              label: "Click here to make a new file",
              icon: icon(FilePlusIcon),
            },
            { value: "theme", label: "Theme", icon: icon(PaletteIcon) },
            {
              value: "inbox",
              label: "Go to the inbox page",
              icon: icon(ArchiveIcon),
            },
          ],
        },
      ]}
    />
  )
}

export function DoPreview() {
  return <Frozen wide hints={false} groups={FILES.slice(0, 1)} />
}

export function DontPreview() {
  return (
    <Frozen
      wide
      hints={false}
      groups={[
        {
          label: "Actions",
          items: [
            { value: "sign-out", label: "Sign out", icon: icon(MoonIcon) },
            {
              value: "archive",
              label: "Archive",
              icon: icon(ArchiveIcon),
              preview: <p>Moves the file to the archive.</p>,
            },
          ],
        },
      ]}
    />
  )
}
