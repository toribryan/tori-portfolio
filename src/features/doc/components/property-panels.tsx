"use client"

import { useState, type ReactNode } from "react"
import {
  ArrowRightIcon,
  CheckIcon,
  ChevronDownIcon,
  DiamondIcon,
  SearchIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/fibo/badge"
import { Button } from "@/components/fibo/button"
import { Input } from "@/components/fibo/input"

import { Plate } from "./fibo-blocks"

/*
 * Figma's properties panel for a selected instance, recreated for the
 * Design System Overhaul: the same three components under the old library's
 * names and under the shared vocabulary that replaced them.
 */

type Row =
  | { kind: "variant"; name: string; value: string; clash?: boolean }
  | { kind: "boolean"; name: string; on: boolean; clash?: boolean }
  | { kind: "text"; name: string; value: string; clash?: boolean }
  | { kind: "swap"; name: string; value: string }
  | { kind: "slot"; name: string }

type Selection = {
  /** The component's name in the layers panel. */
  name: string
  rows: Row[]
}

type Part = {
  preview: ReactNode
  before: Selection
  after: Selection
}

const PARTS: Part[] = [
  {
    preview: (
      <Button size="sm">
        <CheckIcon data-icon="inline-start" />
        Submit
      </Button>
    ),
    before: {
      name: "btn_primary_LG v2",
      rows: [
        { kind: "variant", name: "Type", value: "Primary", clash: true },
        { kind: "variant", name: "Size", value: "Large", clash: true },
        { kind: "variant", name: "Edge", value: "Round", clash: true },
        { kind: "boolean", name: "Disabled", on: false, clash: true },
        { kind: "boolean", name: "Icon?", on: true, clash: true },
        { kind: "variant", name: "Icon Position", value: "Left" },
        { kind: "text", name: "Text", value: "Submit", clash: true },
        { kind: "boolean", name: "Tooltip", on: false },
        { kind: "text", name: "Tooltip Text", value: "Submit the form" },
      ],
    },
    after: {
      name: "Button",
      rows: [
        { kind: "variant", name: "kind", value: "filled" },
        { kind: "variant", name: "shape", value: "pill" },
        { kind: "variant", name: "size", value: "md" },
        { kind: "variant", name: "state", value: "default" },
        { kind: "variant", name: "status", value: "default" },
        { kind: "boolean", name: "prefix", on: true },
        { kind: "swap", name: "prefixIcon", value: "check" },
        { kind: "boolean", name: "suffix", on: false },
        { kind: "swap", name: "suffixIcon", value: "arrow-right" },
        { kind: "text", name: "label", value: "Submit" },
      ],
    },
  },
  {
    preview: (
      <div className="relative w-44">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          size="sm"
          aria-label="Email"
          aria-invalid
          defaultValue="ana@"
          readOnly
          tabIndex={-1}
          className="pl-8"
        />
      </div>
    ),
    before: {
      name: "Input Field / Outlined",
      rows: [
        { kind: "variant", name: "Style", value: "Outlined", clash: true },
        { kind: "variant", name: "Sz", value: "M", clash: true },
        { kind: "variant", name: "Status", value: "Error", clash: true },
        { kind: "boolean", name: "isDisabled", on: false, clash: true },
        { kind: "variant", name: "Show Label", value: "Yes" },
        { kind: "boolean", name: "Leading Icon", on: true, clash: true },
        { kind: "text", name: "Value", value: "ana@" },
      ],
    },
    after: {
      name: "Input",
      rows: [
        { kind: "variant", name: "size", value: "md" },
        { kind: "variant", name: "state", value: "default" },
        { kind: "variant", name: "status", value: "danger" },
        { kind: "boolean", name: "prefix", on: true },
        { kind: "swap", name: "prefixIcon", value: "search" },
        { kind: "boolean", name: "suffix", on: false },
        { kind: "swap", name: "suffixIcon", value: "x" },
        { kind: "text", name: "label", value: "Email" },
      ],
    },
  },
  {
    preview: (
      <div className="w-44 overflow-hidden rounded-lg border border-line bg-card text-left">
        <div className="h-1 bg-destructive" />
        <div className="flex flex-col gap-1 p-2.5">
          <span className="text-xs font-medium text-foreground">
            Flagged sessions
          </span>
          <span className="text-[11px] leading-4 text-muted-foreground">
            3 need review before Friday.
          </span>
        </div>
      </div>
    ),
    before: {
      name: "Card - Report",
      rows: [
        { kind: "variant", name: "Kind", value: "Report", clash: true },
        { kind: "variant", name: "Size", value: "Compact", clash: true },
        { kind: "variant", name: "Accent", value: "Red", clash: true },
        { kind: "boolean", name: "hasIcon", on: false, clash: true },
        { kind: "boolean", name: "hasBadge", on: false },
        { kind: "boolean", name: "hasFooter", on: false },
        { kind: "text", name: "Title", value: "Flagged sessions", clash: true },
      ],
    },
    after: {
      name: "Card",
      rows: [
        { kind: "variant", name: "size", value: "md" },
        { kind: "variant", name: "status", value: "danger" },
        { kind: "slot", name: "header" },
        { kind: "slot", name: "content" },
        { kind: "slot", name: "footer" },
      ],
    },
  },
]

function Toggle({ on }: { on: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "relative h-3.5 w-6 shrink-0 rounded-full border",
        on ? "border-foreground bg-foreground" : "border-border bg-muted"
      )}
    >
      <span
        className={cn(
          "absolute top-1/2 left-0.5 size-2 -translate-y-1/2 rounded-full",
          on ? "translate-x-2.5 bg-background" : "bg-muted-foreground"
        )}
      />
    </span>
  )
}

function Field({ children }: { children: ReactNode }) {
  return (
    <span className="flex h-6 min-w-0 flex-1 items-center gap-1.5 rounded-md border border-line bg-background px-2 text-foreground">
      {children}
    </span>
  )
}

function Control({ row }: { row: Row }) {
  switch (row.kind) {
    case "variant":
      return (
        <Field>
          <span className="truncate">{row.value}</span>
          <ChevronDownIcon className="ml-auto size-3 shrink-0 text-muted-foreground" />
        </Field>
      )
    case "boolean":
      return (
        <span className="flex h-6 flex-1 items-center">
          <Toggle on={row.on} />
        </span>
      )
    case "text":
      return (
        <Field>
          <span className="truncate">{row.value}</span>
        </Field>
      )
    case "swap":
      return (
        <Field>
          <DiamondIcon className="size-3 shrink-0 text-muted-foreground" />
          <span className="truncate">{row.value}</span>
          <ChevronDownIcon className="ml-auto size-3 shrink-0 text-muted-foreground" />
        </Field>
      )
    case "slot":
      return (
        <span className="flex h-6 min-w-0 flex-1 items-center rounded-md border border-dashed border-border px-2 text-muted-foreground">
          Slot
        </span>
      )
  }
}

/** One selected instance: a scrap of canvas, then its properties. */
function SelectionCard({
  preview,
  selection,
}: {
  preview: ReactNode
  selection: Selection
}) {
  return (
    <div className="flex min-w-0 flex-col overflow-hidden rounded-lg border border-line bg-background">
      <div
        aria-hidden
        inert
        className="flex h-28 items-center justify-center border-b border-line bg-[radial-gradient(var(--color-border)_1px,transparent_1px)] [background-size:12px_12px] px-3"
      >
        {preview}
      </div>
      <div className="flex flex-col gap-2 p-3 text-[11px]">
        <p className="flex items-center gap-1.5 font-mono text-xs font-medium text-foreground">
          <DiamondIcon aria-hidden className="size-3.5 shrink-0" />
          <span className="truncate">{selection.name}</span>
        </p>
        <dl className="m-0 flex flex-col gap-1.5">
          {selection.rows.map((row) => {
            const clash = "clash" in row && row.clash
            return (
              <div key={row.name} className="flex items-center gap-2">
                <dt
                  className={cn(
                    "w-[42%] shrink-0 truncate",
                    clash
                      ? "text-warning underline decoration-dotted underline-offset-2"
                      : "text-muted-foreground"
                  )}
                >
                  {row.name}
                </dt>
                <dd className="m-0 flex min-w-0 flex-1">
                  <Control row={row} />
                </dd>
              </div>
            )
          })}
        </dl>
      </div>
    </div>
  )
}

/**
 * Button, Input and Card as Figma shows them when selected, before and after
 * the shared names. The components look the same both ways; only the words
 * people use to set them change.
 */
export function PropertyPanels() {
  const [after, setAfter] = useState(false)
  const choices = [
    { label: "Before", value: false },
    { label: "After", value: true },
  ]

  return (
    <Plate
      background="none"
      meta={
        <span
          role="group"
          aria-label="Library version"
          className="flex rounded-md border border-line p-0.5 font-sans"
        >
          {choices.map(({ label, value }) => (
            <button
              key={label}
              type="button"
              aria-pressed={after === value}
              onClick={() => setAfter(value)}
              className={cn(
                "rounded-[5px] px-2.5 py-0.5 text-xs transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring-subtle",
                after === value
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {label}
            </button>
          ))}
        </span>
      }
      caption={
        after ? (
          "After: one vocabulary. size, state and status mean the same thing on every component, and Button's kind says how it's drawn, apart from what it means."
        ) : (
          <>
            Before: each component named by whoever built it. The{" "}
            <span className="text-warning underline decoration-dotted underline-offset-2">
              dotted
            </span>{" "}
            properties mean something another component calls by a different
            name.
          </>
        )
      }
    >
      <div className="grid gap-3 sm:grid-cols-3">
        {PARTS.map((part) => (
          <SelectionCard
            key={part.after.name}
            preview={part.preview}
            selection={after ? part.after : part.before}
          />
        ))}
      </div>
    </Plate>
  )
}

const STATUSES: {
  role: string
  variant: "success" | "warning" | "destructive" | "info"
  old: string[]
}[] = [
  {
    role: "success",
    variant: "success",
    old: ["Green", "Valid", "Success", "OK"],
  },
  { role: "warning", variant: "warning", old: ["Yellow", "Warn", "Caution"] },
  {
    role: "danger",
    variant: "destructive",
    old: ["Red", "Error", "Danger", "Negative"],
  },
  { role: "info", variant: "info", old: ["Blue", "Info", "Note"] },
]

/** Every name the old library used for a status, folded into its role. */
export function StatusNames() {
  const total = STATUSES.reduce((sum, s) => sum + s.old.length, 0)
  return (
    <Plate
      background="none"
      caption={`${total} names for four meanings became four roles, each backed by its own status tokens.`}
    >
      {/* Columns sized to their content and shared by every row, so the
          arrows line up and the roles sit right beside the names they replace. */}
      <ul className="m-0 grid list-none grid-cols-[minmax(0,max-content)_auto_auto] items-center justify-center gap-x-4 gap-y-3 p-0">
        {STATUSES.map(({ role, variant, old }) => (
          <li
            key={role}
            className="col-span-3 grid grid-cols-subgrid items-center"
          >
            <span className="flex flex-wrap gap-1.5">
              {old.map((name) => (
                <span
                  key={name}
                  className="rounded-md border border-line px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground line-through"
                >
                  {name}
                </span>
              ))}
            </span>
            <ArrowRightIcon
              aria-hidden
              className="size-3.5 text-muted-foreground"
            />
            <Badge variant={variant} className="justify-self-start font-mono">
              {role}
            </Badge>
          </li>
        ))}
      </ul>
    </Plate>
  )
}
