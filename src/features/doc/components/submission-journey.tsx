import { ArrowDownIcon, ArrowRightIcon } from "lucide-react"

import { cn } from "@/lib/utils"

type Step = { label: string; span?: number; changed?: boolean }

/*
 * The step orders from WEDDING_STEP_ORDERS in iron-diamond-next, between the
 * shared first step and the shared review. A step that differs from the
 * vendor's order is marked as changed.
 */
const LANES: { name: string; steps: number; note: string; path: Step[] }[] = [
  {
    name: "Vendor",
    steps: 9,
    note: "The default order",
    path: [
      { label: "You" },
      { label: "Couple" },
      { label: "Event" },
      { label: "Photographer" },
      { label: "Photos" },
      { label: "Story" },
      { label: "Vendors" },
    ],
  },
  {
    name: "Photographer",
    steps: 9,
    note: "Gives their own credit first",
    path: [
      { label: "Photographer", changed: true },
      { label: "You" },
      { label: "Couple" },
      { label: "Event" },
      { label: "Photos" },
      { label: "Story" },
      { label: "Vendors" },
    ],
  },
  {
    name: "Couple",
    steps: 8,
    note: "One step for both partners",
    path: [
      { label: "You and your partner", span: 2, changed: true },
      { label: "Event" },
      { label: "Photographer" },
      { label: "Photos" },
      { label: "Story" },
      { label: "Vendors" },
    ],
  },
  {
    name: "Someone else",
    steps: 9,
    note: "Adds their relationship to the couple",
    path: [
      { label: "You + relationship", changed: true },
      { label: "Couple" },
      { label: "Event" },
      { label: "Photographer" },
      { label: "Photos" },
      { label: "Story" },
      { label: "Vendors" },
    ],
  },
]

const ENTRY = [
  "Weddings menu or /submit-a-wedding",
  "Intro",
  "Start submission",
]

/** The case study's pink marks what differs from the vendor's order. */
const PINK = "#e9939e"
const PINK_FILL = `color-mix(in oklab, ${PINK} 22%, var(--background))`

function Pill({ step }: { step: Step }) {
  return (
    <span
      className={cn(
        "relative flex h-8 items-center justify-center rounded-md border px-2 text-center text-[11px] leading-tight tracking-tight md:px-1",
        step.changed
          ? "font-medium text-foreground"
          : "border-line bg-background text-muted-foreground"
      )}
      style={{
        ...(step.span ? { gridColumn: `span ${step.span}` } : {}),
        ...(step.changed ? { borderColor: PINK, background: PINK_FILL } : {}),
      }}
    >
      {step.label}
    </span>
  )
}

function Node({ title, detail }: { title: string; detail: string }) {
  return (
    <div
      className="relative flex w-full flex-col gap-1 rounded-md border bg-background p-2 text-[11px] leading-tight"
      style={{ borderColor: PINK }}
    >
      <span className="font-medium">{title}</span>
      <span className="text-muted-foreground">{detail}</span>
    </div>
  )
}

/**
 * The real wedding submission journey as it shipped: one way in, the "Who is
 * submitting" question splitting the flow into four step orders, and every
 * order meeting again at review. Lanes stack below md.
 */
export function SubmissionJourney({ caption }: { caption?: string }) {
  return (
    <figure className="not-prose my-8">
      <div className="relative overflow-hidden rounded-xl border border-line bg-surface-warm/60">
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              "linear-gradient(var(--line) 1px, transparent 1px)",
            backgroundSize: "100% 28px",
            backgroundPosition: "0 10px",
          }}
          aria-hidden
        />

        <div className="relative flex flex-col gap-4 p-5">
          {/* The way in. */}
          <ol className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            {ENTRY.map((label, index) => (
              <li key={label} className="flex items-center gap-2">
                <span className="rounded-md border border-line bg-background px-2 py-1">
                  {label}
                </span>
                {index < ENTRY.length - 1 && (
                  <ArrowRightIcon className="size-3.5" aria-hidden />
                )}
              </li>
            ))}
          </ol>
          <ArrowDownIcon
            className="ml-10 size-3.5 text-muted-foreground"
            aria-hidden
          />

          <div className="flex flex-col gap-2 md:grid md:grid-cols-[76px_1fr_72px] md:gap-x-4 md:gap-y-0">
            {/* The fork: one question decides the order. */}
            <div className="relative flex items-center md:row-span-4">
              <span
                className="absolute top-8 right-[-9px] bottom-8 hidden border-r border-dashed border-muted-foreground/50 md:block"
                aria-hidden
              />
              <Node
                title="1 · Who is submitting?"
                detail="The couple, the vendor, or someone else"
              />
            </div>

            {LANES.map((lane, row) => (
              <div
                key={lane.name}
                className="flex flex-col gap-1.5 py-2 md:col-start-2"
                style={{ gridRowStart: row + 1 }}
              >
                <p className="text-xs">
                  <span className="font-medium">{lane.name}</span>
                  <span className="text-muted-foreground">
                    {" "}
                    · {lane.steps} steps · {lane.note}
                  </span>
                </p>
                <div className="relative flex flex-wrap gap-1.5 md:grid md:grid-cols-7 md:gap-1">
                  <span
                    className="absolute inset-x-[-16px] top-1/2 hidden border-t border-dashed border-muted-foreground/50 md:block"
                    aria-hidden
                  />
                  {lane.path.map((step) => (
                    <Pill key={step.label} step={step} />
                  ))}
                </div>
              </div>
            ))}

            {/* Every order meets at review. */}
            <div className="relative flex items-center md:col-start-3 md:row-span-4 md:row-start-1">
              <span
                className="absolute top-8 bottom-8 left-[-9px] hidden border-l border-dashed border-muted-foreground/50 md:block"
                aria-hidden
              />
              <Node title="Review" detail="Submit this wedding" />
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            The vendor answer splits again on the role: Photographers takes the
            photographer order. After submit, the confirmation, saved and resume
            screens are designed but not built yet.
          </p>
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
