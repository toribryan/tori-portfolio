"use client"

import { useSyncExternalStore, type ReactNode } from "react"
import type { TOCItemType } from "fumadocs-core/toc"

import { cn } from "@/lib/utils"
import { TOCInline } from "@/components/toc-inline"

export type DocView = "design" | "code"

const KEY = "component-doc-view"
const EVENT = "component-doc-view-change"

function read(): DocView {
  try {
    return window.localStorage.getItem(KEY) === "code" ? "code" : "design"
  } catch {
    return "design"
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange)
  window.addEventListener("storage", onChange)
  return () => {
    window.removeEventListener(EVENT, onChange)
    window.removeEventListener("storage", onChange)
  }
}

/**
 * Which audience the component docs are written for right now. Designers are
 * the default; the choice is remembered in this browser and shared by every
 * doc, and the server renders the design view.
 */
export function useDocView() {
  return useSyncExternalStore(subscribe, read, () => "design" as const)
}

function setDocView(view: DocView) {
  try {
    window.localStorage.setItem(KEY, view)
  } catch {
    // Storage can be blocked; the switch then only lasts until the event.
  }
  window.dispatchEvent(new Event(EVENT))
}

const OPTIONS: { value: DocView; label: string }[] = [
  { value: "design", label: "Design" },
  { value: "code", label: "Code" },
]

/** Switches every doc between the design view and the code view. */
export function DocViewToggle({ className }: { className?: string }) {
  const view = useDocView()
  return (
    <div
      role="group"
      aria-label="Show the doc for"
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full bg-muted p-0.5 inset-ring-1 inset-ring-border",
        className
      )}
    >
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={view === option.value}
          onClick={() => setDocView(option.value)}
          className="h-7 rounded-full px-3 text-sm font-medium text-muted-foreground transition-[background-color,color] outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 aria-pressed:bg-background aria-pressed:text-foreground aria-pressed:shadow-xs aria-pressed:inset-ring-1 aria-pressed:inset-ring-border"
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

/** Content only developers need, such as installation and the props table. */
export function ForCode({ children }: { children: ReactNode }) {
  return useDocView() === "code" ? <>{children}</> : null
}

/**
 * The inline table of contents without the headings that sit inside
 * `<ForCode>`, while the design view hides them.
 */
export function DocTOC({
  items,
  codeOnly,
}: {
  items: TOCItemType[]
  /** The `url` of each heading that only the code view shows. */
  codeOnly: string[]
}) {
  const view = useDocView()
  return (
    <TOCInline
      items={
        view === "code"
          ? items
          : items.filter((item) => !codeOnly.includes(item.url))
      }
    />
  )
}

/**
 * The lead preview: just the live component for designers, and the Preview
 * and Code tabs for developers.
 */
export function PreviewSwitch({
  preview,
  tabs,
}: {
  preview: ReactNode
  tabs: ReactNode
}) {
  return useDocView() === "code" ? tabs : preview
}
