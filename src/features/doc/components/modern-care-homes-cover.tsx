"use client"

import { useRef } from "react"
import { DM_Sans } from "next/font/google"
import Image from "next/image"
import {
  ChevronsUpDownIcon,
  FileTextIcon,
  HomeIcon,
  InfoIcon,
  PanelLeftIcon,
  PencilIcon,
  PlusIcon,
  SearchIcon,
  SettingsIcon,
  XIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { ScaledStage } from "@/features/portfolio/components/components/covers"

import { useCoverSteps } from "./use-cover-steps"

/*
 * The cover draws the product, not the site, so it keeps the agent
 * platform's own blue and white surfaces in both of the site's themes.
 */
const BRAND = "#2347d9"

/** Modern Care Homes' own typeface, on both the desktop and phone screens. */
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})
const PLATE = "#0b2a9a"
const INK = "#1b1d21"
const MUTED = "#5d626b"
const LINE = "#e3e5e8"

/** Rest, a room opened, the Photos tab, Preview gallery pressed, the gallery. */
const STEP_AT = [0, 500, 1400, 2300, 2550]

/** The phone is drawn at its real width in points, then scaled to fit. */
const PHONE_POINTS = 390
const PHONE_WIDTH = 140

const PHOTOS = [1, 2, 3, 4].map(
  (n) => `/case-studies/cover-loving-heart-${n}-mch.webp`
)

/** The listing's sections, as the desktop sidebar lists them. */
const SECTIONS = [
  ["Photos", "10 photos"],
  ["About", "Established in 2023, this luxurious"],
  ["Amenities", "6 amenities"],
  ["Care services", "8 services"],
] as const

const TABS = ["Availability", "Photos", "About", "Amenities"]

/** The marketplace's logo mark: a roofline with a red heart under it. */
function HouseHeart() {
  return (
    <svg viewBox="0 0 16 14" className="w-3" aria-hidden>
      <path d="M8 1 1 7h2v6h10V7h2L8 1Z" fill="#1b2a4a" />
      <path
        d="M8 11.2 5.3 8.6a1.6 1.6 0 0 1 2.7-1.9 1.6 1.6 0 0 1 2.7 1.9L8 11.2Z"
        fill="#e5383b"
      />
    </svg>
  )
}

function Photo({ src, className }: { src: string; className?: string }) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Image
        className="object-cover"
        src={src}
        alt=""
        fill
        sizes="160px"
        unoptimized
      />
    </div>
  )
}

/**
 * The agent platform on two screens: the desktop sidebar that lists the
 * listing section by section, and the same dashboard on a phone. While the
 * card is hovered or focused, or on a loop with `loop` or on a touch screen,
 * the agent opens a room, moves on to Photos and previews the gallery
 * families will see, and the sidebar follows along.
 */
export function ModernCareHomesCover({ loop = false }: { loop?: boolean }) {
  const frame = useRef<HTMLDivElement>(null)
  const shown = useCoverSteps(frame, STEP_AT, { loop })
  const open = shown >= 1
  const tab = shown >= 2 ? "Photos" : "Availability"
  const pressed = shown === 3
  const previewing = shown >= 4

  return (
    <div
      ref={frame}
      className={cn("absolute inset-0", dmSans.className)}
      style={{ background: PLATE, color: INK }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-15"
        style={{
          backgroundImage:
            "radial-gradient(circle, #ffffff 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
        aria-hidden
      />
      <ScaledStage width={440}>
        <div className="relative h-full">
          {/* Desktop: the icon rail and the listing, section by section. */}
          <div className="absolute top-1/2 left-9 flex w-[184px] -translate-y-1/2 overflow-hidden rounded-xl bg-[#f7f8f8] shadow-[0_8px_24px_rgb(0_0_0/0.25)]">
            <div className="flex w-7 shrink-0 flex-col items-center gap-1.5 border-r border-[#e6e8ea] py-2">
              <span className="flex size-5 items-center justify-center rounded-md bg-white shadow-[0_1px_2px_rgb(0_0_0/0.12)]">
                <HouseHeart />
              </span>
              <span className="flex size-5 items-center justify-center rounded-md bg-[#eceeef]">
                <FileTextIcon className="size-2.5" strokeWidth={1.75} />
              </span>
              <SettingsIcon className="size-2.5" strokeWidth={1.75} />
            </div>
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex items-center gap-1.5 border-b border-[#e6e8ea] px-2 py-2">
                <span
                  className="flex size-[18px] shrink-0 items-center justify-center rounded-[5px] text-white"
                  style={{ background: BRAND }}
                >
                  <HomeIcon className="size-2.5" strokeWidth={2} />
                </span>
                <span className="flex min-w-0 flex-1 flex-col leading-[1.2]">
                  <span className="truncate text-[8.5px]">
                    A Loving Heart Assisted Living
                  </span>
                  <span className="text-[7px]" style={{ color: MUTED }}>
                    Care home
                  </span>
                </span>
                <ChevronsUpDownIcon className="size-2.5 shrink-0" />
              </div>
              {[
                [
                  "Availability",
                  open ? "Accepting residents · 1 of 1 rooms" : "Unavailable",
                ] as const,
                ...SECTIONS,
              ].map(([title, detail]) => (
                <div
                  key={title}
                  className={cn(
                    "flex flex-col border-b border-[#e6e8ea] px-2 py-[5px] leading-[1.25] transition-colors duration-300 last:border-b-0",
                    tab === title ? "bg-[#eef0f0]" : "bg-transparent"
                  )}
                >
                  <span className="text-[8.5px]">{title}</span>
                  <span
                    className="truncate text-[7px]"
                    style={{ color: MUTED }}
                  >
                    {detail}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile: the same dashboard, tab by tab. It runs off the bottom
              of the cover, as a phone held up to the camera would. */}
          <div
            className="absolute top-5 right-10 h-[260px] rounded-[22px] bg-[#101114] p-[3px] shadow-[0_12px_32px_rgb(0_0_0/0.35)]"
            style={{ width: PHONE_WIDTH }}
          >
            <div className="relative size-full overflow-hidden rounded-[19px] bg-white">
              <div
                className="absolute top-0 left-0 origin-top-left"
                style={{
                  width: PHONE_POINTS,
                  transform: `scale(${(PHONE_WIDTH - 6) / PHONE_POINTS})`,
                }}
              >
                <div className="flex h-[54px] items-end justify-between px-9 pb-1.5 text-[17px] font-semibold">
                  <span>1:35</span>
                  <span className="flex items-center gap-1.5">
                    <span className="flex items-end gap-[2px]">
                      {[5, 8, 11, 14].map((h) => (
                        <span
                          key={h}
                          className="w-[3px] rounded-[1px] bg-current"
                          style={{ height: h }}
                        />
                      ))}
                    </span>
                    <span className="h-[12px] w-[24px] rounded-[4px] border-[1.5px] border-current p-[1.5px]">
                      <span className="block h-full w-3/4 rounded-[2px] bg-current" />
                    </span>
                  </span>
                </div>
                <div className="flex h-[64px] items-center gap-5 px-5">
                  <PanelLeftIcon className="size-[22px]" strokeWidth={1.5} />
                  <span className="text-[21px]">Home Details</span>
                  <SearchIcon
                    className="ml-auto size-[22px]"
                    strokeWidth={1.5}
                  />
                </div>
                <div className="mt-3 flex gap-2.5 px-5">
                  {TABS.map((name) => (
                    <span
                      key={name}
                      className={cn(
                        "shrink-0 rounded-full border px-5 py-2 text-[19px] transition-colors duration-300",
                        tab === name
                          ? "border-transparent text-white"
                          : "text-[#3e4249]"
                      )}
                      style={{
                        background: tab === name ? INK : "white",
                        borderColor: tab === name ? INK : LINE,
                      }}
                    >
                      {name}
                    </span>
                  ))}
                </div>

                <div className="mt-6 overflow-hidden">
                  <div
                    className="flex transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
                    style={{
                      width: PHONE_POINTS * 2,
                      transform: `translateX(${tab === "Photos" ? -PHONE_POINTS : 0}px)`,
                    }}
                  >
                    {/* Availability */}
                    <div
                      className="shrink-0 px-5"
                      style={{ width: PHONE_POINTS }}
                    >
                      <div
                        className="rounded-[22px] border px-5 py-8"
                        style={{ borderColor: LINE }}
                      >
                        <p className="text-[30px] leading-tight font-bold tracking-tight">
                          Add your first room
                        </p>
                        <p
                          className="mt-3 text-[18px] leading-snug"
                          style={{ color: MUTED }}
                        >
                          Families filter by room type, bathroom, and
                          furnishing. Rooms you add show here, and you can open
                          or close each one.
                        </p>
                        <div className="mt-6 rounded-[14px] border-[1.5px] border-dashed border-[#c8ccd1] p-5">
                          <div className="flex items-center justify-between">
                            <span className="text-[21px] text-[#3e4249]">
                              Garden Room
                            </span>
                            <span
                              className="relative h-[30px] w-[50px] rounded-full transition-colors duration-300"
                              style={{
                                background: open ? "#5b73e0" : "#c9cdd3",
                              }}
                            >
                              <span
                                className={cn(
                                  "absolute top-[3px] left-[3px] size-[24px] rounded-full bg-white shadow-sm transition-transform duration-300",
                                  open && "translate-x-5"
                                )}
                              />
                            </span>
                          </div>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {[
                              "Private room",
                              "Private bathroom",
                              "Furnished",
                            ].map((chip) => (
                              <span
                                key={chip}
                                className="rounded-full border px-3.5 py-1 text-[17px] text-[#3e4249]"
                                style={{ borderColor: LINE }}
                              >
                                {chip}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div
                          className="mt-6 flex h-[44px] items-center justify-center gap-2 rounded-full text-[19px] text-white"
                          style={{ background: BRAND }}
                        >
                          <PlusIcon className="size-5" strokeWidth={2} />
                          Add
                        </div>
                      </div>
                      <div className="mt-6 flex gap-3 rounded-[14px] bg-[#f1f2f3] p-4 text-[18px] leading-snug text-[#3e4249]">
                        <InfoIcon className="mt-0.5 size-5 shrink-0" />
                        Until you add rooms, the home will be set to
                        unavailable.
                      </div>
                    </div>

                    {/* Photos */}
                    <div
                      className="shrink-0 px-5"
                      style={{ width: PHONE_POINTS }}
                    >
                      <div
                        className="rounded-[22px] border px-5 py-7"
                        style={{ borderColor: LINE }}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-[30px] leading-tight font-bold tracking-tight">
                              Gallery
                            </p>
                            <p
                              className="mt-1 text-[18px] leading-snug"
                              style={{ color: MUTED }}
                            >
                              Show off your care home with photos.
                            </p>
                          </div>
                          <span
                            className="flex size-[46px] shrink-0 items-center justify-center rounded-[12px] border"
                            style={{ borderColor: "#c8ccd1" }}
                          >
                            <PencilIcon className="size-5" strokeWidth={1.5} />
                          </span>
                        </div>
                        <div className="mt-6 grid grid-cols-2 gap-2.5">
                          {PHOTOS.map((src, index) => (
                            <div key={src} className="relative">
                              <Photo
                                src={src}
                                className="aspect-[16/9] rounded-[10px]"
                              />
                              {index === 3 && (
                                <span className="absolute inset-0 flex items-center justify-center rounded-[10px] bg-black/45 text-[30px] font-medium text-white">
                                  +6
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                        <div className="mt-5 flex justify-end">
                          <span
                            className={cn(
                              "rounded-full px-5 py-2 text-[19px] text-[#3f5170] transition-[background-color,scale] duration-200",
                              pressed
                                ? "scale-95 bg-[#c9d8f6]"
                                : "scale-100 bg-[#e3ecfb]"
                            )}
                          >
                            Preview gallery
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview gallery: the page families will see. */}
              <div
                className={cn(
                  "absolute inset-x-0 top-[19px] bottom-0 bg-white transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
                  previewing ? "translate-y-0" : "translate-y-full"
                )}
              >
                <div
                  className="origin-top-left"
                  style={{
                    width: PHONE_POINTS,
                    transform: `scale(${(PHONE_WIDTH - 6) / PHONE_POINTS})`,
                  }}
                >
                  <div
                    className="relative flex h-[64px] items-center justify-center border-b text-[21px] font-medium"
                    style={{ borderColor: LINE }}
                  >
                    <XIcon
                      className="absolute left-5 size-6"
                      strokeWidth={1.5}
                    />
                    Gallery
                  </div>
                  <div className="px-4">
                    <p className="mt-6 mb-5 text-[25px] leading-tight font-bold tracking-tight">
                      A Loving Heart Assisted Living
                    </p>
                    <Photo
                      src={PHOTOS[0]}
                      className="aspect-[842/560] rounded-[12px]"
                    />
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <Photo
                        src={PHOTOS[1]}
                        className="aspect-[410/306] rounded-[12px]"
                      />
                      <Photo
                        src={PHOTOS[2]}
                        className="aspect-[410/306] rounded-[12px]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScaledStage>
    </div>
  )
}
