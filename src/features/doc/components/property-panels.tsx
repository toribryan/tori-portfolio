"use client"

import { useState, type ReactNode } from "react"
import {
  ArrowRightIcon,
  CheckIcon,
  DiamondIcon,
  RefreshCwIcon,
  SearchIcon,
  SquareDashedIcon,
  ToggleLeftIcon,
  TypeIcon,
  type LucideIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/fibo/badge"
import { Button } from "@/components/fibo/button"
import { Input } from "@/components/fibo/input"

import { Plate } from "./fibo-blocks"

/*
 * Figma's component properties list, recreated for the Design System
 * Overhaul: the same three components under the old library's properties and
 * under the shared vocabulary that replaced them. Each list is copied from
 * the components in Figma, in the order Figma shows them.
 */

type PropertyType = "variant" | "text" | "boolean" | "swap" | "slot"

type Property = {
  type: PropertyType
  name: string
  /** A variant's options, or the default of any other property. */
  value: string
  /** Means something another component calls by a different name. */
  clash?: boolean
}

type Definition = {
  /** The component's name in Figma. */
  name: string
  properties: Property[]
}

type Part = {
  preview: ReactNode
  before: Definition
  after: Definition
}

const v = (name: string, value: string, clash?: boolean): Property => ({
  type: "variant",
  name,
  value,
  clash,
})
const t = (name: string, value: string, clash?: boolean): Property => ({
  type: "text",
  name,
  value,
  clash,
})
const b = (name: string, on: boolean, clash?: boolean): Property => ({
  type: "boolean",
  name,
  value: on ? "True" : "False",
  clash,
})
const s = (name: string, value: string): Property => ({
  type: "swap",
  name,
  value,
})
const slot = (name: string): Property => ({ type: "slot", name, value: "Slot" })

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
      properties: [
        v(
          "Type",
          "Primary, Secondary, Outline, Text Link, Danger, Danger Outline, Success, Warning",
          true
        ),
        v("Size", "XXS, Small, Med, Large, XL", true),
        v("Icon Position", "Left, Right"),
        v("Edge", "Sharp, Soft, Round", true),
        t("Text", "Submit", true),
        b("Icon?", true, true),
        b("Disabled", false, true),
        t("Tooltip Text", "Submit the form"),
        b("Tooltip", false),
      ],
    },
    after: {
      name: "Button",
      properties: [
        v("kind", "filled, outlined, tonal, text"),
        v("status", "default, success, warning, danger, info"),
        v("size", "sm, md, lg"),
        v("state", "default, hover, disabled"),
        v("shape", "square, rounded, pill"),
        t("label", "Submit"),
        b("prefix", true),
        s("prefixIcon", "circle-check"),
        b("suffix", false),
        s("suffixIcon", "arrow-right"),
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
      properties: [
        v("Style", "Outlined, Filled", true),
        v("Sz", "S, M, L", true),
        v("Status", "Normal, Error, Valid, Warn", true),
        v("Show Label", "Yes, No"),
        t("Value", "ana@example.com"),
        b("Leading Icon", true, true),
        b("isDisabled", false, true),
      ],
    },
    after: {
      name: "Input",
      properties: [
        v("size", "sm, md, lg"),
        v("state", "default, focus, disabled"),
        v("status", "none, success, warning, danger, info"),
        t("label", "Email"),
        t("value", "ana@example.com"),
        b("prefix", true),
        s("prefixIcon", "search"),
        b("suffix", false),
        s("suffixIcon", "x"),
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
      properties: [
        v("Kind", "Report, Inbox, Admin", true),
        v("Size", "Compact, Regular", true),
        v("Accent", "None, Red, Green, Blue", true),
        t("Title", "Flagged sessions", true),
        b("hasIcon", false, true),
        b("hasBadge", false),
        b("hasFooter", false),
      ],
    },
    after: {
      name: "Card",
      properties: [
        v("size", "sm, md"),
        v("status", "none, success, warning, danger, info"),
        slot("header"),
        slot("content"),
        slot("footer"),
      ],
    },
  },
]

// The icons Figma puts beside each kind of property.
const ICONS: Record<PropertyType, LucideIcon> = {
  variant: DiamondIcon,
  text: TypeIcon,
  boolean: ToggleLeftIcon,
  swap: RefreshCwIcon,
  slot: SquareDashedIcon,
}

/** One component's property list, with a scrap of canvas above it. */
function DefinitionCard({
  preview,
  definition,
}: {
  preview: ReactNode
  definition: Definition
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
      <div className="flex flex-col gap-2.5 p-3">
        <p className="truncate text-sm font-medium text-foreground">
          {definition.name}
        </p>
        <p className="text-[11px] font-medium text-muted-foreground">
          Properties
        </p>
        <ul className="m-0 flex list-none flex-col gap-1 p-0">
          {definition.properties.map((property) => {
            const Icon = ICONS[property.type]
            return (
              <li
                key={property.name}
                title={`${property.name} · ${property.value}`}
                className="flex h-7 min-w-0 items-center gap-2 rounded-md bg-muted px-2 text-xs"
              >
                <Icon
                  aria-hidden
                  className="size-3.5 shrink-0 text-muted-foreground"
                />
                <span
                  className={cn(
                    "shrink-0",
                    property.clash
                      ? "text-warning underline decoration-dotted underline-offset-2"
                      : "text-foreground"
                  )}
                >
                  {property.name}
                </span>
                <span aria-hidden className="text-muted-foreground">
                  ·
                </span>
                <span className="truncate text-muted-foreground">
                  {property.value}
                </span>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

/**
 * Button, Input and Card as Figma lists their properties, before and after
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
          <DefinitionCard
            key={part.after.name}
            preview={part.preview}
            definition={after ? part.after : part.before}
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
