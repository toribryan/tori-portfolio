"use client"

import { useEffect, useState } from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/fibo/button"
import { TokenFlow, type TokenRow } from "@/components/fibo/token-flow"

import { AnatomyMap, slot, type Callout } from "../components/anatomy-map"
import { BORDER, DESTRUCTIVE, PRIMARY, RAMP, ROWS } from "./token-flow-data"

export function Default() {
  return <TokenFlow rows={ROWS} showUse={false} />
}

export function WithUse() {
  return <TokenFlow rows={ROWS} showUse />
}

export function SingleRow() {
  return <TokenFlow rows={[PRIMARY]} showUse />
}

/*
 * A pinned theme only moves the values. The wrapper's class moves the
 * surfaces with them, since the plate and chips read the page's tokens.
 */
function Themed({
  dark,
  className,
  children,
}: {
  dark: boolean
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={cn(dark ? "dark" : "light", "text-foreground", className)}>
      {children}
    </div>
  )
}

export function PinnedDark() {
  return (
    <Themed dark>
      <TokenFlow rows={ROWS} theme="dark" />
    </Themed>
  )
}

/** Flips on its own so the scramble plays without touching the site theme. */
export function ThemeChange() {
  const [dark, setDark] = useState(false)
  useEffect(() => {
    const id = window.setInterval(() => setDark((d) => !d), 3200)
    return () => window.clearInterval(id)
  }, [])
  return (
    <div className="flex flex-col items-center gap-3">
      <Themed dark={dark}>
        <TokenFlow rows={ROWS} theme={dark ? "dark" : "light"} />
      </Themed>
      <p className="font-mono text-xs text-muted-foreground">
        Theme: {dark ? "dark" : "light"}
      </p>
    </div>
  )
}

/** A preview frame that owns its theme, with the plate pinned to it. */
export function InPreview() {
  const [dark, setDark] = useState(false)
  return (
    <div className="flex w-full flex-col gap-3">
      <div
        role="group"
        aria-label="Preview theme"
        className="flex gap-1 self-end"
      >
        {(["light", "dark"] as const).map((t) => (
          <Button
            key={t}
            size="xs"
            variant={(t === "dark") === dark ? "secondary" : "ghost"}
            aria-pressed={(t === "dark") === dark}
            onClick={() => setDark(t === "dark")}
          >
            {t === "dark" ? "Dark" : "Light"}
          </Button>
        ))}
      </div>
      <Themed
        dark={dark}
        className="flex flex-col items-center gap-4 rounded-xl border border-border bg-background p-4"
      >
        <TokenFlow
          rows={[PRIMARY, DESTRUCTIVE]}
          theme={dark ? "dark" : "light"}
          className="w-full"
        />
        <div className="flex gap-2">
          <Button size="sm">Save changes</Button>
          <Button size="sm" variant="destructive">
            Delete
          </Button>
        </div>
      </Themed>
    </div>
  )
}

/*
 * Anatomy. Markers sit beside the plate, so each map gives the plate a fixed
 * width and leaves room on the sides that carry markers. The wires stretch to
 * any width, so an unsized plate would fill the frame.
 */

const chipAt = (root: HTMLElement, index: number) =>
  root.querySelectorAll("[data-slot=token-flow-chip]")[index]

const PLATE_PARTS: Callout[] = [
  { label: "Plate", side: "left", find: slot("token-flow"), outline: true },
  {
    label: "Tiers",
    side: "left",
    find: (root) => root.querySelector("[data-slot=token-flow] p"),
  },
  {
    label: "Row",
    side: "left",
    find: (root) => chipAt(root, 3)?.parentElement,
    outline: true,
  },
]

export function AnatomyPlate() {
  return (
    <AnatomyMap callouts={PLATE_PARTS}>
      <div className="flex justify-center py-6 pl-24">
        <TokenFlow
          data-anatomy-subject
          rows={[PRIMARY, BORDER]}
          className="w-[550px] shrink-0"
        />
      </div>
    </AnatomyMap>
  )
}

const ROW_PARTS: Callout[] = [
  { label: "Value", side: "left", find: (root) => chipAt(root, 0) },
  { label: "Primitive", side: "left", find: (root) => chipAt(root, 1) },
  {
    label: "Swatch",
    side: "left",
    find: (root) => chipAt(root, 2)?.firstElementChild,
  },
  {
    label: "Wire",
    side: "right",
    find: (root) => chipAt(root, 0)?.parentElement?.querySelector("svg"),
  },
  { label: "Role", side: "right", find: (root) => chipAt(root, 2) },
  {
    label: "Use",
    side: "right",
    find: (root) => chipAt(root, 2)?.nextElementSibling,
  },
]

export function AnatomyRow() {
  return (
    <AnatomyMap callouts={ROW_PARTS}>
      <div className="flex justify-center px-36 py-6">
        <TokenFlow
          data-anatomy-subject
          rows={[PRIMARY]}
          showUse
          orientation="vertical"
          className="w-60"
        />
      </div>
    </AnatomyMap>
  )
}

/*
 * Best practices, drawn with the real part. The pairs sit half width, too
 * narrow for the tiers side by side, so they stack as they would on a phone.
 */

function Stacked({ rows }: { rows: TokenRow[] }) {
  return (
    <TokenFlow rows={rows} orientation="vertical" className="mx-auto w-60" />
  )
}

export function DoRoleName() {
  return <Stacked rows={[{ ...PRIMARY, use: undefined }]} />
}

export function DontColorName() {
  return (
    <Stacked rows={[{ ...PRIMARY, use: undefined, semantic: "dark gray" }]} />
  )
}

export function DoRoles() {
  return (
    <Stacked
      rows={[PRIMARY, DESTRUCTIVE].map((r) => ({ ...r, use: undefined }))}
    />
  )
}

export function DontRamp() {
  return <Stacked rows={RAMP} />
}
