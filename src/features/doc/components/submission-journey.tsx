import { Fragment } from "react"

type Step = { label: string; changed?: boolean }

/*
 * The step orders from WEDDING_STEP_ORDERS in iron-diamond-next, between the
 * shared first step and the shared review. A step that differs from the
 * vendor's order is marked as changed.
 */
const LANES: { name: string; steps: number; path: Step[] }[] = [
  {
    name: "Vendor",
    steps: 9,
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
    path: [
      { label: "You and your partner", changed: true },
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

/** The case study's pink marks what differs from the vendor's order. */
const PINK = "#e9939e"

/**
 * The step order each answer to "Who is submitting" gets, between that first
 * question and the shared review. Only the steps that differ from the
 * vendor's order are marked.
 */
export function SubmissionJourney({ caption }: { caption?: string }) {
  return (
    <figure className="not-prose my-8">
      <div className="flex flex-col divide-y divide-line rounded-xl bg-surface-warm/60 px-5">
        {LANES.map((lane) => (
          <div
            key={lane.name}
            className="flex flex-col gap-2 py-4 md:flex-row md:items-baseline md:gap-4"
          >
            <p className="flex shrink-0 items-baseline gap-1.5 text-sm md:w-28 md:flex-col md:gap-0">
              <span className="font-medium">{lane.name}</span>
              <span className="text-xs text-muted-foreground">
                {lane.steps} steps
              </span>
            </p>
            <p className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm text-muted-foreground">
              {lane.path.map((step, index) => (
                <Fragment key={step.label}>
                  {index > 0 && (
                    <span className="text-line" aria-hidden>
                      /
                    </span>
                  )}
                  {step.changed ? (
                    <span
                      className="rounded px-1.5 py-0.5 font-medium text-foreground"
                      style={{
                        background: `color-mix(in oklab, ${PINK} 30%, var(--background))`,
                      }}
                    >
                      {step.label}
                    </span>
                  ) : (
                    <span>{step.label}</span>
                  )}
                </Fragment>
              ))}
            </p>
          </div>
        ))}
      </div>

      {caption && (
        <figcaption className="mt-3 text-sm text-pretty text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
