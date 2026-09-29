import { Children, isValidElement, type ReactNode } from "react"
import {
  ComponentIcon,
  LayersIcon,
  LayoutTemplateIcon,
  RocketIcon,
  ShieldIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"

/*
 * Case-study blocks drawn in fibo's language: hairlines instead of shadows,
 * zero-padded mono numbering, and colour only where it carries meaning. They
 * take children rather than arrays because expression attributes don't
 * survive the doc MDX pipeline (see `mdx-story-embed.tsx`).
 */

function pad(index: number) {
  return String(index + 1).padStart(2, "0")
}

function items(children: ReactNode) {
  return Children.toArray(children).filter(isValidElement)
}

/** The mono index every numbered block uses. */
function Index({ index }: { index: number }) {
  return (
    <span className="font-mono text-xs leading-7 text-muted-foreground tabular-nums">
      {pad(index)}
    </span>
  )
}

/**
 * A figure on fibo's dotted plate: a hairline frame with a mono label row,
 * the diagram, and a caption underneath.
 */
export function Plate({
  label,
  meta,
  caption,
  className,
  children,
}: {
  label: string
  meta?: ReactNode
  caption?: ReactNode
  className?: string
  children: ReactNode
}) {
  return (
    <figure className="not-prose my-8">
      <div className="overflow-hidden rounded-xl border border-line bg-card">
        <div className="flex items-baseline justify-between gap-4 border-b border-line px-4 py-2.5 font-mono text-xs text-muted-foreground">
          <span className="tracking-wide uppercase">{label}</span>
          {meta && <span className="tabular-nums">{meta}</span>}
        </div>
        <div className="relative">
          <div
            className="pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent,black_12%,black_85%,transparent)] opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(circle, var(--foreground) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
            aria-hidden
          />
          <div className={cn("relative p-4 sm:p-6", className)}>{children}</div>
        </div>
      </div>
      {caption && (
        <figcaption className="mt-3 text-sm text-pretty text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

/** A hairline-ruled list numbered 01, 02, 03, after fibo's usage guidelines. */
export function Numbered({ children }: { children: ReactNode }) {
  return (
    <ol className="not-prose my-6 flex flex-col border-y border-line">
      {items(children).map((child, index) => (
        <li
          key={index}
          className="flex gap-4 border-b border-line py-3.5 last:border-b-0"
        >
          <span className="w-6 shrink-0 pt-px">
            <Index index={index} />
          </span>
          <div className="min-w-0 leading-7">{child}</div>
        </li>
      ))}
    </ol>
  )
}

export function Item({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <div className="text-muted-foreground [&_p]:m-0 [&_p]:inline">
      <span className="font-medium text-foreground">{title}</span> {children}
    </div>
  )
}

/** Numbered rules on a hairline grid, after fibo's principles. */
export function Principles({ children }: { children: ReactNode }) {
  const rules = items(children)
  return (
    <div
      className={cn(
        "not-prose my-8 grid border-t border-line",
        rules.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"
      )}
    >
      {rules.map((rule, index) => (
        <div
          key={index}
          className="flex flex-col gap-2 border-b border-line py-6 sm:border-r sm:px-5 sm:first:pl-0 sm:last:border-r-0 sm:last:pr-0"
        >
          <Index index={index} />
          {rule}
        </div>
      ))}
    </div>
  )
}

export function Principle({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <>
      <p className="font-medium text-foreground">{title}</p>
      <div className="text-sm leading-6 text-pretty text-muted-foreground [&_p]:m-0">
        {children}
      </div>
    </>
  )
}

/** Two cases side by side in one hairline frame, e.g. a pitch per discipline. */
export function Sides({ children }: { children: ReactNode }) {
  return (
    <div className="not-prose my-8 grid divide-y divide-line overflow-hidden rounded-xl border border-line bg-card sm:grid-cols-2 sm:divide-x sm:divide-y-0">
      {children}
    </div>
  )
}

export function Side({
  label,
  title,
  children,
}: {
  label: string
  title: string
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-3 p-5">
      <p className="font-mono text-xs tracking-wide text-muted-foreground uppercase">
        {label}
      </p>
      <p className="font-medium text-foreground">{title}</p>
      <div className="text-sm leading-6 text-muted-foreground [&_li]:pl-1 [&_p]:m-0 [&_ul]:m-0 [&_ul]:flex [&_ul]:list-disc [&_ul]:flex-col [&_ul]:gap-1.5 [&_ul]:pl-4 [&_ul]:marker:text-border">
        {children}
      </div>
    </div>
  )
}

const PHASE_ICONS = {
  component: ComponentIcon,
  layers: LayersIcon,
  layout: LayoutTemplateIcon,
  rocket: RocketIcon,
  shield: ShieldIcon,
}

/** The build order as numbered cells on one hairline row. */
export function Phases({ children }: { children: ReactNode }) {
  const phases = items(children)
  return (
    <ol
      className={cn(
        "not-prose my-8 grid overflow-hidden rounded-xl border border-line bg-card",
        phases.length === 5 && "sm:grid-cols-5",
        phases.length === 4 && "sm:grid-cols-4",
        phases.length === 3 && "sm:grid-cols-3"
      )}
    >
      {phases.map((phase, index) => (
        <li
          key={index}
          className="group/phase flex items-center gap-4 border-line px-4 py-3 not-last:border-b sm:flex-col sm:items-start sm:gap-3 sm:border-b-0 sm:py-4 sm:not-last:border-r"
        >
          <Index index={index} />
          {phase}
        </li>
      ))}
    </ol>
  )
}

export function Phase({
  title,
  detail,
  icon,
}: {
  title: string
  detail?: string
  icon?: keyof typeof PHASE_ICONS
}) {
  const Icon = icon ? PHASE_ICONS[icon] : null
  return (
    <>
      {Icon && (
        <span className="flex size-10 items-center justify-center rounded-xl border border-line bg-background transition-transform duration-200 ease-out motion-safe:group-hover/phase:-rotate-6">
          <Icon className="size-4.5 text-foreground" aria-hidden />
        </span>
      )}
      <span className="flex flex-col gap-1">
        <span className="text-sm font-medium text-foreground">{title}</span>
        {detail && (
          <span className="text-xs leading-5 text-muted-foreground">
            {detail}
          </span>
        )}
      </span>
    </>
  )
}
