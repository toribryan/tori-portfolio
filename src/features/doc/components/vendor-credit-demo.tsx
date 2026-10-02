"use client"

import { useRef } from "react"
import { Playfair, Urbanist } from "next/font/google"
import { PlusIcon, XIcon } from "lucide-react"

import { cn } from "@/lib/utils"

import { useCoverSteps } from "./use-cover-steps"

/* The wizard's own palette, kept in both of the site's themes. */
const INK = "#191717"
const MUTED = "#6b6b6b"
const INPUT = "#d9d9d9"
const SECONDARY = "#f4f4f4"

const playfair = Playfair({ subsets: ["latin"], weight: ["400"] })
const urbanist = Urbanist({ subsets: ["latin"], weight: ["400", "500"] })

/** The wizard's credit tempo: 480ms on its own ease-out curve. */
const CREDIT = "duration-[480ms] ease-[cubic-bezier(0.22,1,0.36,1)]"

/** Rest, typed, the listing highlighted, then the credit in. */
const STEP_AT = [0, 700, 1500, 2300]

function SectionHeader({ label, added }: { label: string; added?: string }) {
  return (
    <p
      className="flex gap-2 text-xs font-medium tracking-[0.1em] uppercase"
      style={{ color: MUTED }}
    >
      {label}
      {added && <span className="opacity-70">{added}</span>}
    </p>
  )
}

/**
 * The vendor credits step, one category at a time: the submitter types into
 * the venue search, picks the listed venue, and the credit lands in the
 * section on the wizard's credit tempo, with the search giving way to "Add
 * another venue". Loops while in view; holds the last state with reduced
 * motion.
 */
export function VendorCreditDemo({ caption }: { caption?: React.ReactNode }) {
  const frame = useRef<HTMLDivElement>(null)
  const shown = useCoverSteps(frame, STEP_AT, { loop: true })
  const typed = shown >= 1
  const highlighted = shown === 2
  const added = shown >= 3

  return (
    <figure className="not-prose my-8">
      <div
        ref={frame}
        className={cn(
          "flex justify-center rounded-xl bg-[#e9939e] px-4 py-10 inset-ring-1 inset-ring-black/15 sm:px-10 dark:inset-ring-white/15",
          urbanist.className
        )}
        style={{ color: INK }}
        aria-hidden
      >
        <div className="flex w-full max-w-[480px] flex-col gap-8 rounded-[20px] bg-white p-6 shadow-[0_20px_48px_rgb(74_15_31/0.14)] sm:p-8">
          <p className={cn("text-3xl leading-10", playfair.className)}>
            Vendor credits
          </p>

          <div className="flex flex-col gap-3">
            <SectionHeader
              label="Venue"
              added={added ? "1 added" : undefined}
            />

            <div className="relative grid">
              {/* The search, until a credit takes its place. */}
              <div
                className={cn(
                  "col-start-1 row-start-1 transition-opacity duration-150",
                  added ? "pointer-events-none opacity-0" : "opacity-100"
                )}
              >
                <div
                  className="flex h-10 items-center border px-4 text-base tracking-[0.025em]"
                  style={{
                    borderColor: typed ? INK : INPUT,
                    color: typed ? INK : MUTED,
                  }}
                >
                  {typed ? "Sag" : "Search or add a venue"}
                </div>
                <div
                  className={cn(
                    "absolute inset-x-0 top-11 z-10 border bg-white py-1 shadow-[0_4px_12px_rgb(0_0_0/0.08)] transition-opacity duration-150",
                    typed && !added ? "opacity-100" : "opacity-0"
                  )}
                  style={{ borderColor: INPUT }}
                >
                  <div
                    className="flex items-center justify-between px-3 py-2 transition-colors duration-150"
                    style={{
                      background: highlighted ? SECONDARY : "transparent",
                    }}
                  >
                    <span className="tracking-[0.025em]">The Saguaro Room</span>
                    <span
                      className="text-xs tracking-[0.05em]"
                      style={{ color: MUTED }}
                    >
                      Scottsdale, AZ
                    </span>
                  </div>
                  <div
                    className="h-px"
                    style={{ background: "rgb(0 0 0 / 0.1)" }}
                  />
                  <div className="flex items-center gap-2 px-3 py-2 tracking-[0.025em]">
                    <PlusIcon className="size-4" />
                    Add a venue by hand
                  </div>
                </div>
              </div>

              {/* The credit, landing on the credit tempo. */}
              <div
                className={cn(
                  "col-start-1 row-start-1 flex flex-col gap-3 transition-[opacity,translate,filter]",
                  CREDIT,
                  added
                    ? "translate-y-0 opacity-100 blur-none"
                    : "-translate-y-2 opacity-0 blur-[3px]"
                )}
              >
                <div
                  className="flex items-center gap-3 border py-3 pr-2 pl-4"
                  style={{ borderColor: INPUT }}
                >
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="font-medium tracking-[0.025em]">
                      The Saguaro Room
                    </span>
                    <span className="truncate text-sm" style={{ color: MUTED }}>
                      Scottsdale, AZ <span style={{ color: INPUT }}>|</span>{" "}
                      @saguaroroom
                    </span>
                  </div>
                  <span
                    className="px-2 py-0.5 text-xs font-medium"
                    style={{ background: SECONDARY }}
                  >
                    Listed
                  </span>
                  <span className="flex size-8 items-center justify-center">
                    <XIcon className="size-4" />
                  </span>
                </div>
                <span
                  className="flex h-10 w-fit items-center border px-4 text-base font-medium tracking-[0.025em]"
                  style={{ borderColor: INPUT }}
                >
                  + Add another venue
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <SectionHeader label="Planner" />
            <div
              className="flex h-10 items-center border px-4 text-base tracking-[0.025em]"
              style={{ borderColor: INPUT, color: MUTED }}
            >
              Search or add a planner
            </div>
          </div>
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
