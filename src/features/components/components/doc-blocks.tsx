import type { ReactNode } from "react"
import type { Route } from "next"
import Link from "next/link"
import {
  ArrowUpRightIcon,
  CheckIcon,
  InfoIcon,
  LightbulbIcon,
  TriangleAlertIcon,
  XIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { CopyButton } from "@/components/copy-button"
import { NICHE_PARTS } from "@/features/portfolio/data/fibo-niche"

/*
 * The blocks fibo's Storybook docs are written with, ported so those docs
 * can be copied across nearly as they are. The originals live in fibo's
 * apps/storybook/src/blocks.
 */

type Part = {
  name: string
  slot?: string
  note?: ReactNode
  children?: Part[]
}

type AnatomyRow = {
  part: Part
  /** For each ancestor level, whether that ancestor has siblings below it. */
  rails: boolean[]
  last: boolean
}

function flatten(parts: Part[], rails: boolean[] = []): AnatomyRow[] {
  return parts.flatMap((part, index) => {
    const last = index === parts.length - 1
    return [
      { part, rails, last },
      ...flatten(part.children ?? [], [...rails, !last]),
    ]
  })
}

const INSET = 20
const STEP = 20
const guideLeft = (level: number) => INSET + level * STEP + 7

/**
 * The guide lines are borders rather than box-drawing glyphs, so they join
 * across rows whatever the row height.
 */
function Guides({ rails, last }: { rails: boolean[]; last: boolean }) {
  const own = guideLeft(rails.length)
  return (
    <>
      {rails.map((rail, level) =>
        rail ? (
          <span
            key={level}
            aria-hidden="true"
            className="absolute inset-y-0 border-l border-muted-foreground"
            style={{ left: guideLeft(level) }}
          />
        ) : null
      )}
      <span
        aria-hidden="true"
        className={
          last
            ? "absolute top-0 h-[1.125rem] w-2.5 rounded-bl-sm border-b border-l border-muted-foreground"
            : "absolute inset-y-0 border-l border-muted-foreground"
        }
        style={{ left: own }}
      />
      {last ? null : (
        <span
          aria-hidden="true"
          className="absolute top-[1.125rem] w-2.5 border-t border-muted-foreground"
          style={{ left: own }}
        />
      )}
    </>
  )
}

/**
 * The rendered parts of a component as a tree, each with the `data-slot` it
 * carries and what it is for.
 */
export function Anatomy({ root }: { root: Part }) {
  const rows = flatten(root.children ?? [])
  const mono = "font-mono text-[0.8125rem] whitespace-nowrap"
  return (
    <div className="not-prose my-6 overflow-x-auto rounded-xl border border-line bg-card">
      <table className="w-full min-w-xl border-collapse text-left">
        <thead>
          <tr className="border-b border-line text-xs text-muted-foreground">
            <th className="px-5 py-2.5 font-medium">Part</th>
            <th className="px-5 py-2.5 font-medium">data-slot</th>
            <th className="px-5 py-2.5 font-medium">Notes</th>
          </tr>
        </thead>
        <tbody className="text-sm leading-6">
          <tr className="align-top">
            <td
              className={cn(
                "px-5 pt-3 pb-1.5 font-medium text-foreground",
                mono
              )}
            >
              {root.name}
            </td>
            <td className={cn("px-5 pt-3 pb-1.5 text-muted-foreground", mono)}>
              {root.slot}
            </td>
            <td className="px-5 pt-3 pb-1.5 text-muted-foreground">
              {root.note}
            </td>
          </tr>
          {rows.map(({ part, rails, last }, index) => (
            <tr key={index} className="align-top">
              <td
                className={cn("relative py-1.5 pr-5 text-foreground", mono)}
                style={{ paddingLeft: guideLeft(rails.length) + 16 }}
              >
                <Guides rails={rails} last={last} />
                {part.name}
              </td>
              <td className={cn("px-5 py-1.5 text-muted-foreground", mono)}>
                {part.slot}
              </td>
              <td className="px-5 py-1.5 text-muted-foreground">{part.note}</td>
            </tr>
          ))}
          <tr aria-hidden="true">
            <td colSpan={3} className="h-1.5 p-0" />
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export function UsageGuidelines({ guidelines }: { guidelines: ReactNode[] }) {
  return (
    <ul className="not-prose my-6 flex flex-col border-y border-line">
      {guidelines.map((guideline, index) => (
        <li
          key={index}
          className="flex gap-4 border-b border-line py-3.5 leading-7 last:border-b-0"
        >
          <span className="w-6 shrink-0 pt-px font-mono text-xs leading-7 text-muted-foreground tabular-nums">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="text-foreground [&_code]:rounded-md [&_code]:bg-muted [&_code]:px-1 [&_code]:font-mono [&_code]:text-[0.875em]">
            {guideline}
          </span>
        </li>
      ))}
    </ul>
  )
}

type Rule = {
  component: ReactNode
  description: ReactNode
}

function RuleCard({ rule, tone }: { rule: Rule; tone: "do" | "dont" }) {
  const isDo = tone === "do"
  return (
    <figure className="m-0 flex min-w-0 flex-col gap-3">
      <div
        className={cn(
          "relative flex min-h-48 items-center justify-center overflow-hidden rounded-xl border border-line bg-muted p-8",
          "after:absolute after:inset-x-0 after:bottom-0 after:h-0.5",
          isDo ? "after:bg-success" : "after:bg-destructive"
        )}
      >
        {rule.component}
      </div>
      <figcaption className="flex flex-col gap-1">
        <span
          className={cn(
            "inline-flex items-center gap-2 text-sm font-semibold",
            isDo ? "text-success" : "text-destructive"
          )}
        >
          <span
            className={cn(
              "flex size-5 items-center justify-center rounded-md text-white",
              isDo ? "bg-success" : "bg-destructive"
            )}
          >
            {isDo ? (
              <CheckIcon className="size-3.5" strokeWidth={3} />
            ) : (
              <XIcon className="size-3.5" strokeWidth={3} />
            )}
          </span>
          {isDo ? "Do" : "Don't"}
        </span>
        <span className="text-sm leading-6 text-muted-foreground">
          {rule.description}
        </span>
      </figcaption>
    </figure>
  )
}

export function ComponentRules({
  rules,
}: {
  rules: { positive: Rule; negative: Rule }[]
}) {
  return (
    <div className="not-prose my-8 flex flex-col gap-14">
      {rules.map((rule, index) => (
        <div key={index} className="grid gap-6 sm:grid-cols-2">
          <RuleCard rule={rule.positive} tone="do" />
          <RuleCard rule={rule.negative} tone="dont" />
        </div>
      ))}
    </div>
  )
}

const TIP_TONES = {
  tip: { icon: LightbulbIcon, title: "Tip", className: "bg-muted" },
  info: { icon: InfoIcon, title: "Note", className: "bg-info/10" },
  warning: {
    icon: TriangleAlertIcon,
    title: "Heads up",
    className: "bg-destructive/10",
  },
}

export function Tip({
  tone = "tip",
  title,
  children,
}: {
  tone?: keyof typeof TIP_TONES
  title?: string
  children: ReactNode
}) {
  const { icon: Icon, title: fallback, className } = TIP_TONES[tone]
  return (
    <aside
      className={cn(
        "not-prose my-6 flex gap-3 rounded-xl border border-line px-4 py-3.5",
        className
      )}
    >
      <Icon className="mt-1 size-4 shrink-0" />
      <div className="flex flex-col gap-1 text-sm leading-6">
        <strong className="font-semibold">{title ?? fallback}</strong>
        <div className="text-foreground [&_code]:rounded-md [&_code]:bg-background [&_code]:px-1 [&_code]:font-mono [&_p]:m-0">
          {children}
        </div>
      </div>
    </aside>
  )
}

type DataAttribute = {
  attribute: string
  element: ReactNode
  when: ReactNode
}

/**
 * The attributes a part sets on its own markup, so consumers can style it by
 * slot or state without reaching into its class names.
 */
export function DataAttributes({ rows }: { rows: DataAttribute[] }) {
  return (
    <div className="not-prose my-6 overflow-x-auto">
      <table className="w-full min-w-lg border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-line text-foreground">
            <th className="py-2.5 pr-4 font-medium">Attribute</th>
            <th className="py-2.5 pr-4 font-medium">Element</th>
            <th className="py-2.5 font-medium">Present when</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.attribute}
              className="border-b border-line align-top last:border-b-0"
            >
              <td className="py-3 pr-4">
                <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[0.8125rem] whitespace-nowrap text-foreground">
                  {row.attribute}
                </code>
              </td>
              <td className="py-3 pr-4 leading-6 text-muted-foreground">
                {row.element}
              </td>
              <td className="py-3 leading-6 text-muted-foreground">
                {row.when}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function CommandLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-4 py-2 pr-2 pl-4">
      <span className="w-14 shrink-0 text-xs font-medium text-muted-foreground">
        {label}
      </span>
      <code className="min-w-0 flex-1 overflow-x-auto font-mono text-[0.8125rem] whitespace-pre text-foreground">
        {value}
      </code>
      <CopyButton
        className="size-7 shrink-0 border-none text-muted-foreground"
        variant="ghost"
        size="icon-xs"
        text={value}
        aria-label={`Copy ${label.toLowerCase()} line`}
      />
    </div>
  )
}

/**
 * The two lines a consumer needs: the registry install and the import it
 * produces. The install names fibo's registry by URL, so it works without
 * adding fibo to `components.json` first.
 */
export function Install({
  name,
  exports,
}: {
  name: string
  exports: string[]
}) {
  return (
    <div className="not-prose my-6 divide-y divide-line overflow-hidden rounded-xl border border-line bg-card">
      <CommandLine
        label="Install"
        value={`npx shadcn@latest add https://fibo.toribryan.com/r/${name}.json`}
      />
      <CommandLine
        label="Import"
        value={`import { ${exports.join(", ")} } from "@/components/ui/${name}"`}
      />
    </div>
  )
}

function slugOf(name: string) {
  return name.toLowerCase().replace(/\s+/g, "-")
}

/**
 * Cards for the parts a doc points to next. Special components open their
 * page here; fibo's standard ones open its Storybook.
 */
export function RelatedComponents({ names }: { names: string[] }) {
  return (
    <ul className="not-prose my-6 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
      {names.map((name) => {
        const slug = slugOf(name)
        const part = NICHE_PARTS.find((p) => p.name === slug)
        const className =
          "flex h-full flex-col gap-1 bg-background p-4 transition-[background-color] ease-out hover:bg-accent-muted"
        const body = (
          <>
            <span className="flex items-center gap-1 font-medium">
              {name}
              {part ? null : (
                <ArrowUpRightIcon className="size-3.5 text-muted-foreground" />
              )}
            </span>
            {part ? (
              <span className="text-sm text-pretty text-muted-foreground">
                {part.description}
              </span>
            ) : (
              <span className="text-sm text-muted-foreground">
                In fibo&apos;s Storybook
              </span>
            )}
          </>
        )
        return (
          <li key={name}>
            {part ? (
              <Link href={`/components/${slug}` as Route} className={className}>
                {body}
              </Link>
            ) : (
              <a
                href={`https://fibo.toribryan.com/?path=/docs/components-${slug}--docs`}
                target="_blank"
                rel="noopener noreferrer"
                className={className}
              >
                {body}
              </a>
            )}
          </li>
        )
      })}
    </ul>
  )
}
