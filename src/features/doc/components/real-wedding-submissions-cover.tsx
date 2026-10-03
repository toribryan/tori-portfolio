"use client"

import { useRef } from "react"
import { Playfair, Urbanist } from "next/font/google"
import { ChevronDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { ScaledStage } from "@/features/portfolio/components/components/covers"

import { useCoverSteps } from "./use-cover-steps"

/*
 * The cover draws the wizard, not the site, so it keeps Iron Diamond's own
 * ink, warm grays and blush in both of the site's themes.
 */
const INK = "#191717"
const MUTED = "#6b6b6b"
const PRIMARY = "#2c2c2c"
const INPUT = "#d9d9d9"
const PLATE = "#e9939e"
const DOTS = "#fbebf0"

/** The wizard's own pairing: Playfair headings over Urbanist. */
const playfair = Playfair({ subsets: ["latin"], weight: ["400"] })
const urbanist = Urbanist({ subsets: ["latin"], weight: ["400", "500", "600"] })

/** The choice cards' follow-up opens on the wizard's credit easing. */
const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]"

/** Rest, the vendor chosen, the category list open, filtered, then picked. */
const STEP_AT = [0, 500, 1100, 1700, 2300]

const OPTIONS = [
  {
    title: "The couple",
    description: "We’re the newlyweds submitting our own wedding.",
  },
  {
    title: "The vendor",
    description:
      "I worked on this wedding as a photographer, florist, venue or another vendor.",
  },
  {
    title: "Someone else",
    description: "I’m submitting on the couple’s behalf.",
  },
]

const CATEGORIES = ["Venues", "Wedding Planners", "Photographers", "Flowers"]

/** An SVG, so the stage's zoom can't round the ring into an oval. */
function Radio({ checked }: { checked: boolean }) {
  return (
    <svg viewBox="0 0 10 10" className="mt-px size-[10px] shrink-0" aria-hidden>
      <circle
        cx="5"
        cy="5"
        r="4.5"
        fill="none"
        strokeWidth="1"
        className="transition-[stroke] duration-150"
        style={{ stroke: checked ? PRIMARY : INPUT }}
      />
      <circle
        cx="5"
        cy="5"
        r="2.25"
        className={cn(
          "origin-center transition-transform duration-150 [transform-box:fill-box]",
          checked ? "scale-100" : "scale-0"
        )}
        style={{ fill: PRIMARY }}
      />
    </svg>
  )
}

/**
 * The first step of the submission wizard, "Who is submitting this wedding?".
 * While the card is hovered or focused, or on a loop with `loop` or on a
 * touch screen, the submitter chooses The vendor, the role question opens
 * inside that card, and they search the categories and pick Flowers.
 */
export function RealWeddingSubmissionsCover({
  loop = false,
}: {
  loop?: boolean
}) {
  const frame = useRef<HTMLDivElement>(null)
  const shown = useCoverSteps(frame, STEP_AT, { loop })
  const chosen = shown >= 1
  const listOpen = shown === 2 || shown === 3
  const filtered = shown >= 3
  const picked = shown >= 4
  const items = filtered
    ? CATEGORIES.filter((name) => name.startsWith("Flo"))
    : CATEGORIES

  return (
    <div
      ref={frame}
      className={cn("absolute inset-0", urbanist.className)}
      style={{ background: PLATE, color: INK }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage: `radial-gradient(circle, ${DOTS} 1px, transparent 1px)`,
          backgroundSize: "14px 14px",
        }}
        aria-hidden
      />
      <ScaledStage width={560} zoom>
        {/* The step runs off the bottom of the cover, under a fixed header. */}
        <div className="absolute top-3 -bottom-10 left-1/2 flex w-[300px] -translate-x-1/2 flex-col overflow-hidden rounded-xl bg-white shadow-[0_12px_32px_rgb(0_0_0/0.18)]">
          <div className="relative z-20 flex shrink-0 items-center justify-between bg-white px-4 py-2">
            <span className="text-[11px] font-bold tracking-tight">
              Arizona Bride
            </span>
            <span className="text-[7px]" style={{ color: MUTED }}>
              Cancel
            </span>
          </div>

          <div className="flex flex-col gap-2.5 px-6 pt-3 pb-10">
            <div className="flex flex-col gap-1">
              <p
                className={cn(
                  "text-[15px] leading-tight text-balance",
                  playfair.className
                )}
              >
                Who is submitting this wedding?
              </p>
              <p className="text-[7px] leading-snug" style={{ color: MUTED }}>
                So we know who to write to, and who to send the magazine to when
                it publishes.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              {OPTIONS.map((option, index) => {
                const checked = chosen && index === 1
                return (
                  <div
                    key={option.title}
                    className="relative border transition-colors duration-150"
                    style={{
                      borderColor: checked ? PRIMARY : INPUT,
                      background: checked ? "rgb(44 44 44 / 0.05)" : "white",
                    }}
                  >
                    <div className="flex items-center gap-2 px-2.5 py-2">
                      <span className="flex flex-1 flex-col gap-0.5 leading-snug">
                        <span className="text-[8px] font-medium">
                          {option.title}
                        </span>
                        <span className="text-[6.5px]" style={{ color: MUTED }}>
                          {option.description}
                        </span>
                      </span>
                      <Radio checked={checked} />
                    </div>

                    {index === 1 && (
                      <div
                        className={cn(
                          "grid transition-[grid-template-rows] duration-150",
                          EASE,
                          checked ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                        )}
                      >
                        <div className="min-h-0 overflow-hidden">
                          <div className="flex flex-col gap-1 px-2.5 pt-0.5 pb-2.5">
                            <span className="text-[7px] font-medium">
                              What was your role on this wedding? *
                            </span>
                            <span
                              className="flex h-[18px] items-center justify-between border bg-white px-2 text-[7px] transition-colors duration-150"
                              style={{
                                borderColor: listOpen ? PRIMARY : INPUT,
                              }}
                            >
                              <span
                                style={{
                                  color: picked || filtered ? INK : MUTED,
                                }}
                              >
                                {picked
                                  ? "Flowers"
                                  : filtered
                                    ? "Flo"
                                    : "Search your category..."}
                              </span>
                              <ChevronDownIcon
                                className="size-2.5"
                                style={{ color: MUTED }}
                              />
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {index === 1 && (
                      <div
                        className={cn(
                          "absolute inset-x-2.5 top-[calc(100%-8px)] z-10 origin-top border bg-white p-0.5 shadow-[0_8px_20px_rgb(0_0_0/0.14)] transition-[opacity,scale] duration-150",
                          EASE,
                          listOpen
                            ? "scale-100 opacity-100"
                            : "scale-95 opacity-0"
                        )}
                        style={{ borderColor: INPUT }}
                      >
                        {items.map((name) => (
                          <span
                            key={name}
                            className="flex h-[13px] items-center px-1.5 text-[7px]"
                            style={{
                              background:
                                filtered && name === "Flowers"
                                  ? "#f4f4f4"
                                  : "transparent",
                            }}
                          >
                            {name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </ScaledStage>
    </div>
  )
}
