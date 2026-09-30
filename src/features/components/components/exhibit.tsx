"use client"

import {
  Children,
  isValidElement,
  useId,
  useState,
  type ReactElement,
  type ReactNode,
} from "react"
import { CodeIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { EXAMPLES } from "@/features/components/examples"

type ExhibitCodeProps = {
  /** Names the pane when an exhibit has more than one, such as Install. */
  label?: string
  children: ReactNode
}

/**
 * One pane of an exhibit's code: markdown, usually a fenced block or a
 * table, written as the exhibit's child in the MDX.
 */
export function ExhibitCode({ children }: ExhibitCodeProps) {
  return <>{children}</>
}

/**
 * A live example in a frame with a caption, designer first. Its children are
 * `<ExhibitCode>` panes, kept behind a Code button so the design leads and
 * the code is one click away.
 */
export function Exhibit({
  of,
  title,
  description,
  className,
  children,
}: {
  /** The example to render, as `<slug>.<Export>`. */
  of: string
  title?: string
  description?: ReactNode
  className?: string
  children?: ReactNode
}) {
  const [slug = "", name = ""] = of.split(".")
  const Demo = EXAMPLES[slug]?.[name]
  if (!Demo) throw new Error(`No example named "${of}"`)

  const panes = Children.toArray(children).filter(
    (child): child is ReactElement<ExhibitCodeProps> => isValidElement(child)
  )
  const [open, setOpen] = useState(false)
  const [pane, setPane] = useState(0)
  const id = useId()
  const current = panes[Math.min(pane, panes.length - 1)]

  return (
    <figure
      className={cn(
        "not-prose my-6 overflow-hidden rounded-xl border border-line bg-background",
        className
      )}
    >
      <div className="flex min-h-40 items-center justify-center overflow-x-auto p-4 sm:p-6">
        <Demo />
      </div>

      {title || description || panes.length ? (
        <figcaption className="flex items-start gap-3 border-t border-line px-4 py-3">
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            {title ? (
              <span className="text-sm font-medium">{title}</span>
            ) : null}
            {description ? (
              <span className="text-sm text-pretty text-muted-foreground">
                {description}
              </span>
            ) : null}
          </div>
          {panes.length ? (
            <button
              type="button"
              aria-expanded={open}
              aria-controls={id}
              onClick={() => setOpen((o) => !o)}
              className="inline-flex h-7 shrink-0 items-center gap-1.5 rounded-full px-2.5 text-sm font-medium text-muted-foreground inset-ring-1 inset-ring-border transition-[background-color,color] outline-none hover:bg-accent-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 aria-expanded:bg-muted aria-expanded:text-foreground"
            >
              <CodeIcon aria-hidden="true" className="size-3.5" />
              Code
            </button>
          ) : null}
        </figcaption>
      ) : null}

      {open && current ? (
        <div id={id} className="border-t border-line">
          {panes.length > 1 ? (
            <div
              role="group"
              aria-label="Code"
              className="flex gap-1 border-b border-line px-3 py-2"
            >
              {panes.map((p, i) => (
                <button
                  key={p.props.label ?? i}
                  type="button"
                  aria-pressed={p === current}
                  onClick={() => setPane(i)}
                  className="h-7 rounded-full px-2.5 text-sm font-medium text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 aria-pressed:bg-muted aria-pressed:text-foreground"
                >
                  {p.props.label ?? `Code ${i + 1}`}
                </button>
              ))}
            </div>
          ) : null}
          <div className="px-4 py-3 [&_figure]:my-0 [&_p]:mt-3 [&_p]:text-sm [&_p]:text-pretty [&_p]:text-muted-foreground [&_pre]:max-h-[28rem] [&>div]:my-0">
            {current}
          </div>
        </div>
      ) : null}
    </figure>
  )
}

/** An example on its own, with no frame, such as inside a do or a don't. */
export function Live({ of }: { of: string }) {
  const [slug = "", name = ""] = of.split(".")
  const Demo = EXAMPLES[slug]?.[name]
  if (!Demo) throw new Error(`No example named "${of}"`)
  return (
    <div className="w-full">
      <Demo />
    </div>
  )
}

/** Exhibits side by side, two across from sm up. */
export function ExhibitGrid({ children }: { children: ReactNode }) {
  return (
    <div className="not-prose my-6 grid gap-4 sm:grid-cols-2 [&>figure]:my-0">
      {children}
    </div>
  )
}
