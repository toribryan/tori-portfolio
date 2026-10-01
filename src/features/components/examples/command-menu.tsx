"use client"

import { useEffect, useEffectEvent, useState, type ReactNode } from "react"
import { ArchiveIcon, FilePlusIcon, MoonIcon, PaletteIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/fibo/button"
import {
  CommandMenu,
  type CommandMenuGroup,
  type CommandMenuProps,
} from "@/components/fibo/command-menu"
import { ScaledStage } from "@/features/portfolio/components/components/covers"

import { AnatomyMap, slot, type Callout } from "../components/anatomy-map"
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
 * the way a person would: opening a page, typing, pointing at a row.
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
  /** Which row to highlight, counting from 0 at the top. */
  down?: number
  /** Widens the dialog enough for its preview pane. */
  wide?: boolean
  /** Drawn over the stage once the menu has reached its state. */
  overlay?: (stage: HTMLDivElement) => ReactNode
  /** Called with the stage once the menu has reached its state. */
  onReady?: (stage: HTMLDivElement) => void
  /** The stage's layout width, for a stage with room around the dialog. */
  stageWidth?: number
  /** The frame's aspect ratio class, to match `stageWidth`. */
  aspect?: string
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

function Frozen({
  page,
  query,
  down = 0,
  wide = false,
  overlay,
  onReady,
  stageWidth,
  aspect,
  groups = GROUPS,
  ...props
}: FrozenProps) {
  const [stage, setStage] = useState<HTMLDivElement | null>(null)
  const [layer, setLayer] = useState<HTMLDivElement | null>(null)
  const [ready, setReady] = useState(false)
  const reached = useEffectEvent((node: HTMLDivElement) => {
    setReady(true)
    onReady?.(node)
  })

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
      if (down) {
        await wait(30)
        // Hovered rather than arrowed to: Base UI scrolls a row highlighted by
        // keyboard into view, which scrolls the whole page to this exhibit.
        const row = stage.querySelectorAll<HTMLElement>(
          "[data-slot=command-menu-item]"
        )[down]
        row?.dispatchEvent(
          new PointerEvent("pointermove", {
            bubbles: true,
            pointerType: "mouse",
          })
        )
        row?.dispatchEvent(new MouseEvent("mousemove", { bubbles: true }))
      }
      // Let a page's slide settle before anything measures the menu.
      await wait(300)
      if (!cancelled) reached(stage)
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
        aspect ?? (wide ? "aspect-[18/11]" : "aspect-[16/11]")
      )}
    >
      <ScaledStage width={stageWidth ?? (wide ? 720 : 640)}>
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

const popup = slot("command-menu")

/** A frozen menu under an anatomy map, measured once it reaches its state. */
function MenuMap({
  callouts,
  ...frozen
}: FrozenProps & { callouts: Callout[] }) {
  const [stage, setStage] = useState<HTMLDivElement | null>(null)
  return (
    <AnatomyMap callouts={callouts} subject={popup} measureKey={stage}>
      <Frozen {...frozen} onReady={setStage} />
    </AnatomyMap>
  )
}

const rowAt = (stage: HTMLElement, index: number) =>
  stage.querySelectorAll("[data-slot=command-menu-item]")[index]

const DIALOG_PARTS: Callout[] = [
  {
    label: "Search field",
    side: "left",
    find: slot("command-menu-search"),
    outline: true,
  },
  {
    label: "Group label",
    side: "left",
    find: slot("command-menu-group-label"),
  },
  {
    label: "Item",
    side: "left",
    find: slot("command-menu-item"),
  },
  {
    label: "Keyboard hints",
    side: "left",
    find: slot("command-menu-hints"),
    outline: true,
  },
  {
    label: "Backdrop",
    side: "right",
    find: slot("command-menu-backdrop"),
    // The backdrop is everything around the dialog, so point into that.
    point: (_, dialog) => ({ x: dialog.right + 12, y: dialog.top + 24 }),
  },
  {
    label: "Preview pane",
    side: "right",
    find: slot("command-menu-preview"),
    outline: true,
  },
]

/** The whole dialog, mid-search, with every region labelled. */
export function AnatomyDialog() {
  return (
    <MenuMap
      callouts={DIALOG_PARTS}
      wide
      groups={FILES}
      query="r"
      placeholder="Search files, people and actions…"
      stageWidth={1120}
      aspect="aspect-[56/22]"
      popupClassName="top-10 h-[360px] w-[580px] max-w-none data-preview:max-w-none"
    />
  )
}

const ROW_PARTS: Callout[] = [
  {
    label: "Group label",
    side: "left",
    find: slot("command-menu-group-label"),
  },
  {
    label: "Highlighted row",
    side: "left",
    find: (stage) => rowAt(stage, 0),
  },
  {
    label: "Icon",
    side: "left",
    find: (stage) => rowAt(stage, 1)?.querySelector("span"),
  },
  {
    label: "Disabled row",
    side: "left",
    find: (stage) => rowAt(stage, 3),
  },
  {
    label: "Context",
    side: "right",
    find: slot("command-menu-context"),
  },
  {
    label: "Shortcut",
    side: "right",
    find: slot("command-menu-shortcut"),
  },
  {
    label: "Page",
    side: "right",
    find: (stage) =>
      [...(rowAt(stage, 2)?.querySelectorAll("svg") ?? [])].at(-1),
  },
]

/** One of each kind of row, labelled. */
export function AnatomyRow() {
  return (
    <MenuMap
      callouts={ROW_PARTS}
      groups={ROWS}
      defaultRecent={["theme-dark"]}
      hints={false}
      stageWidth={1000}
      aspect="aspect-[100/38]"
      popupClassName="top-10 h-[300px] w-[460px] max-w-none"
    />
  )
}
