"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { HeartIcon, HomeIcon, MapPinIcon } from "lucide-react"
import { useInView, useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"
import { ScaledStage } from "@/features/portfolio/components/components/covers"

/*
 * The cover draws the product, not the site, so it keeps the marketplace's
 * own brand blue and white surfaces in both of the site's themes.
 */
const BRAND = "#1a4fe0"
const PLATE = "#0b2a9a"

/** Rest, availability switched on, the change travelling, the badge, the save. */
const LAST_STEP = 4
const STEP_AT = [0, 300, 950, 1450, 2150]
/** How long the finished state holds before a looping cover starts over. */
const LOOP_HOLD = 2600

const SECTIONS = [
  ["Photos", "10 photos"],
  ["About", "Established in 2023"],
  ["Care services", "8 services"],
] as const

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
          {/* Agent platform: the listing, section by section. */}
          <div className="flex w-[168px] flex-col overflow-hidden rounded-xl bg-[#f7f8f8] shadow-[0_8px_24px_rgb(0_0_0/0.25)]">
            <div className="flex items-center gap-2 border-b border-[#e3e5e8] px-2.5 py-2">
              <span
                className="flex size-5 shrink-0 items-center justify-center rounded-md text-white"
                style={{ background: BRAND }}
              >
                <HomeIcon className="size-3" />
              </span>
              <span className="flex min-w-0 flex-col leading-tight">
                <span className="truncate text-[9px] font-medium">
                  A Loving Heart
                </span>
                <span className="text-[7px] text-[#6b7079]">Care home</span>
              </span>
            </div>
            <div
              className={cn(
                "flex items-center justify-between gap-2 border-b border-[#e3e5e8] px-2.5 py-1.5 transition-colors duration-300",
                open ? "bg-[#eaf0fd]" : "bg-transparent"
              )}
            >
              <span className="flex min-w-0 flex-col leading-tight">
                <span className="text-[9px] font-medium">Availability</span>
                <span className="relative h-[10px] text-[7px] text-[#6b7079]">
                  <span
                    className={cn(
                      "absolute inset-0 whitespace-nowrap transition-opacity duration-300",
                      open && "opacity-0"
                    )}
                  >
                    Not accepting residents
                  </span>
                  <span
                    className={cn(
                      "absolute inset-0 whitespace-nowrap transition-opacity duration-300",
                      !open && "opacity-0"
                    )}
                  >
                    Accepting · 1 of 1 rooms
                  </span>
                </span>
              </span>
              <span
                className="relative h-3 w-5 shrink-0 rounded-full transition-colors duration-300"
                style={{ background: open ? BRAND : "#c9cdd3" }}
              >
                <span
                  className={cn(
                    "absolute top-0.5 left-0.5 size-2 rounded-full bg-white shadow-sm transition-transform duration-300",
                    open && "translate-x-2"
                  )}
                />
              </span>
            </div>
            {SECTIONS.map(([title, detail]) => (
              <div
                key={title}
                className="flex flex-col border-b border-[#e3e5e8] px-2.5 py-1.5 leading-tight last:border-b-0"
              >
                <span className="text-[9px] font-medium">{title}</span>
                <span className="text-[7px] text-[#6b7079]">{detail}</span>
              </div>
            ))}
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

          {/* Marketplace: the home card families see. */}
          <div className="flex w-[172px] flex-col gap-1.5 rounded-xl bg-white p-1.5 shadow-[0_8px_24px_rgb(0_0_0/0.25)]">
            <div className="relative aspect-[480/225] overflow-hidden rounded-lg">
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
                  "absolute top-1 left-1 rounded-full bg-[#22b24c] px-1.5 py-0.5 text-[7px] font-medium text-white transition-[opacity,scale] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
                  listed ? "scale-100 opacity-100" : "scale-50 opacity-0"
                )}
              >
                Available Now
              </span>
              <span className="absolute top-1 right-1 flex size-4 items-center justify-center rounded-full bg-white">
                <HeartIcon
                  className={cn(
                    "size-2.5 transition-[fill,scale] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
                    saved ? "scale-110" : "scale-100"
                  )}
                  style={{ color: BRAND, fill: saved ? BRAND : "transparent" }}
                />
              </span>
              <span className="absolute bottom-1 left-1/2 flex -translate-x-1/2 gap-0.5 rounded-full bg-black/35 px-1 py-0.5">
                <span className="h-0.5 w-1.5 rounded-full bg-white" />
                <span className="size-0.5 rounded-full bg-white/70" />
                <span className="size-0.5 rounded-full bg-white/70" />
              </span>
            </div>
            <div className="flex flex-col gap-px px-0.5 pb-0.5 leading-tight">
              <span className="text-[9px] font-semibold">
                A Loving Heart Assisted Living
              </span>
              <span className="flex items-center gap-0.5 text-[7px] text-[#6b7079]">
                <MapPinIcon className="size-2 shrink-0" />
                14302 West Becker Lane, Surprise, AZ
              </span>
              <span className="text-[8px] text-[#6b7079]">
                Starting at $7,000
              </span>
            </div>
          </div>
        </div>
      </ScaledStage>
    </div>
  )
}
