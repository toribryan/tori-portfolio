"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import {
  ChevronsUpDownIcon,
  FileTextIcon,
  HeartIcon,
  HomeIcon,
  MapPinIcon,
  SettingsIcon,
} from "lucide-react"
import { useInView, useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"
import { ScaledStage } from "@/features/portfolio/components/components/covers"

/*
 * The cover draws the product, not the site, so it keeps the marketplace's
 * own brand blue and white surfaces in both of the site's themes.
 */
const BRAND = "#1f5ce8"
const PLATE = "#0b2a9a"

/** Rest, availability switched on, the change travelling, the badge, the save. */
const LAST_STEP = 4
const STEP_AT = [0, 300, 950, 1450, 2150]
/** How long the finished state holds before a looping cover starts over. */
const LOOP_HOLD = 2600

/** The listing both products show, as the home card's own screenshot has it. */
const HOME = {
  name: "Agavia Assisted Living",
  address: "2427 West Desert Hills Estate Dr, Phoenix, AZ 85086",
  price: "$7000",
}

/** The dashboard's sections under Availability, with their states. */
const SECTIONS = [
  ["Photos", "10 photos"],
  ["About", "Established in 2023, this luxurious"],
  ["Amenities", "6 amenities"],
  ["Care services", "8 services"],
] as const

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

/**
 * One design system, two products: the agent platform's listing sidebar and
 * the marketplace's home card, side by side. While the card is hovered or
 * focused, or on a loop with `loop`, an agent opens a room and the change
 * travels to the card families see, which gains its Available Now badge and
 * is saved.
 */
export function ModernCareHomesCover({ loop = false }: { loop?: boolean }) {
  const frame = useRef<HTMLDivElement>(null)
  const [engaged, setEngaged] = useState(false)
  const [step, setStep] = useState(0)
  const inView = useInView(frame, { amount: 0.5 })
  const reduceMotion = useReducedMotion()
  const active = loop ? inView : engaged

  useEffect(() => {
    if (!active || reduceMotion) return
    const timers: number[] = []
    const play = () => {
      STEP_AT.forEach((at, index) => {
        timers.push(window.setTimeout(() => setStep(index), at))
      })
    }
    play()
    const id = loop
      ? window.setInterval(play, STEP_AT[LAST_STEP] + LOOP_HOLD)
      : undefined
    return () => {
      window.clearInterval(id)
      timers.forEach((timer) => window.clearTimeout(timer))
      setStep(0)
    }
  }, [active, loop, reduceMotion])

  // The cover is inert, so it listens on the card or hero around it.
  useEffect(() => {
    const card = frame.current?.closest("[data-cover-host]")
    if (!card || loop) return
    const on = () => setEngaged(true)
    const off = () => setEngaged(false)
    card.addEventListener("pointerenter", on)
    card.addEventListener("pointerleave", off)
    card.addEventListener("focusin", on)
    card.addEventListener("focusout", off)
    return () => {
      card.removeEventListener("pointerenter", on)
      card.removeEventListener("pointerleave", off)
      card.removeEventListener("focusin", on)
      card.removeEventListener("focusout", off)
    }
  }, [loop])

  // With reduced motion the cover shows where the story ends, still.
  const shown = !active ? 0 : reduceMotion ? LAST_STEP : step
  const open = shown >= 1
  const sending = shown === 2
  const listed = shown >= 3
  const saved = shown >= 4

  return (
    <div
      ref={frame}
      className="absolute inset-0 text-[#1b1d21]"
      style={{ background: PLATE }}
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
        <div className="relative flex h-full items-center justify-center gap-8">
          {/* Agent platform: the icon rail and the listing, section by
              section, as the dashboard draws them. */}
          <div className="flex w-[184px] overflow-hidden rounded-xl bg-[#f7f8f8] shadow-[0_8px_24px_rgb(0_0_0/0.25)]">
            <div className="flex w-7 shrink-0 flex-col items-center gap-1.5 border-r border-[#e6e8ea] py-2">
              <span className="flex size-5 items-center justify-center rounded-md bg-white shadow-[0_1px_2px_rgb(0_0_0/0.12)]">
                <HouseHeart />
              </span>
              <span className="flex size-5 items-center justify-center rounded-md bg-[#eceeef] text-[#1b1d21]">
                <FileTextIcon className="size-2.5" strokeWidth={1.75} />
              </span>
              <SettingsIcon
                className="size-2.5 text-[#1b1d21]"
                strokeWidth={1.75}
              />
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
                  <span className="truncate text-[8.5px]">{HOME.name}</span>
                  <span className="text-[7px] text-[#5d626b]">Care home</span>
                </span>
                <ChevronsUpDownIcon className="size-2.5 shrink-0 text-[#1b1d21]" />
              </div>
              <div
                className={cn(
                  "flex flex-col border-b border-[#e6e8ea] px-2 py-[5px] leading-[1.25] transition-colors duration-300",
                  open ? "bg-[#eef0f0]" : "bg-transparent"
                )}
              >
                <span className="text-[8.5px]">Availability</span>
                <span className="relative h-[9px] text-[7px] text-[#5d626b]">
                  <span
                    className={cn(
                      "absolute inset-0 truncate transition-opacity duration-300",
                      open && "opacity-0"
                    )}
                  >
                    Not accepting residents
                  </span>
                  <span
                    className={cn(
                      "absolute inset-0 truncate transition-opacity duration-300",
                      !open && "opacity-0"
                    )}
                  >
                    Accepting residents · 1 of 1 rooms
                  </span>
                </span>
              </div>
              {SECTIONS.map(([title, detail]) => (
                <div
                  key={title}
                  className="flex flex-col border-b border-[#e6e8ea] px-2 py-[5px] leading-[1.25] last:border-b-0"
                >
                  <span className="text-[8.5px]">{title}</span>
                  <span className="truncate text-[7px] text-[#5d626b]">
                    {detail}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* The change crossing from one product to the other. */}
          <span
            className="absolute top-1/2 left-1/2 h-px w-8 -translate-x-1/2 -translate-y-1/2 bg-white/30"
            aria-hidden
          >
            <span
              className={cn(
                "absolute top-1/2 -ml-1 size-2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_8px_#ffffff]",
                sending
                  ? "left-full opacity-100 transition-[left,opacity] duration-500 ease-out"
                  : "left-0 opacity-0"
              )}
            />
          </span>

          {/* Marketplace: the home card families see, on the white page it
              sits on in search results. */}
          <div className="flex w-[176px] flex-col gap-1 rounded-xl bg-white p-2 shadow-[0_8px_24px_rgb(0_0_0/0.25)]">
            <div className="relative aspect-[16/10] overflow-hidden rounded-[9px]">
              <Image
                className="size-full object-cover"
                src="/case-studies/cover-house-mch.webp"
                alt=""
                width={480}
                height={225}
                unoptimized
              />
              <span
                className={cn(
                  "absolute top-[3px] left-[3px] rounded-full bg-[#22b24c] px-[5px] py-px text-[7px] leading-[1.4] text-white transition-[opacity,scale] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
                  listed ? "scale-100 opacity-100" : "scale-50 opacity-0"
                )}
              >
                Available Now
              </span>
              <span className="absolute top-[3px] right-[3px] flex size-[15px] items-center justify-center rounded-full bg-[#f7f8fa]">
                <HeartIcon
                  className={cn(
                    "size-[9px] transition-[fill,scale] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
                    saved ? "scale-110" : "scale-100"
                  )}
                  strokeWidth={2}
                  style={{ color: BRAND, fill: saved ? BRAND : "transparent" }}
                />
              </span>
              <span className="absolute bottom-[5px] left-1/2 flex -translate-x-1/2 items-center gap-[3px] rounded-full bg-[#5a4a3e]/70 px-[5px] py-[3px]">
                <span className="h-[3px] w-2 rounded-full bg-white" />
                <span className="size-[3px] rounded-full bg-white/80" />
                <span className="size-[3px] rounded-full bg-white/80" />
                <span className="size-[3px] rounded-full bg-white/80" />
              </span>
            </div>
            <div className="flex flex-col gap-[2px] px-[3px] leading-[1.25]">
              <span className="text-[9px] font-bold text-[#1b1d21]">
                {HOME.name}
              </span>
              <span className="flex items-center gap-[3px] text-[8px] text-[#3e4249]">
                <MapPinIcon
                  className="size-[9px] shrink-0"
                  strokeWidth={1.75}
                />
                <span className="truncate">{HOME.address}</span>
              </span>
              <span className="text-[8px] text-[#6b7079]">
                Starting at {HOME.price}
              </span>
            </div>
          </div>
        </div>
      </ScaledStage>
    </div>
  )
}
