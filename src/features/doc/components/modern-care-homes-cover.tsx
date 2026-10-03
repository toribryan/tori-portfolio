"use client"

import Image from "next/image"

import { cn } from "@/lib/utils"
import { ScaledStage } from "@/features/portfolio/components/components/covers"

import { CoverVideo } from "./cover-video"

const PLATE = "#0f172a"

/** The recordings are 440 by 960, drawn here at a phone's width on the stage. */
const SCREEN_WIDTH = 124
const SCREEN_HEIGHT = (SCREEN_WIDTH * 960) / 440

const PHONES = [
  {
    poster: "/case-studies/cover-mobile-filters-mch.webp",
    src: "/case-studies/mobile-filters-mch.mp4",
    className: "top-5 left-[78px]",
  },
  {
    poster: "/case-studies/cover-home-profile-mch.webp",
    src: "/case-studies/home-profile-mobile-mch.mp4",
    start: 3,
    className: "top-5 right-[78px]",
  },
]

/**
 * The marketplace on two phones: the filters sheet, and a home profile's room
 * gallery. Each shows its starting frame at rest and plays its recording
 * while the card is hovered or focused, or on a loop with `loop` or on a
 * touch screen.
 */
export function ModernCareHomesCover({ loop = false }: { loop?: boolean }) {
  return (
    <div className="absolute inset-0" style={{ background: PLATE }}>
      <ScaledStage width={440} zoom>
        <div className="relative h-full">
          {PHONES.map(({ poster, src, start, className }) => (
            <div
              key={src}
              className={cn(
                "absolute rounded-[22px] bg-[#101114] p-[3px] shadow-[0_12px_32px_rgb(0_0_0/0.5)] ring-1 ring-white/15",
                className
              )}
            >
              <div
                className="relative overflow-hidden rounded-[19px] bg-white"
                style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}
              >
                <Image
                  className="object-cover"
                  src={poster}
                  alt=""
                  fill
                  sizes="124px"
                  unoptimized
                />
                <CoverVideo
                  className="absolute inset-0 size-full object-cover"
                  src={src}
                  start={start}
                  autoplay={loop}
                />
              </div>
            </div>
          ))}
        </div>
      </ScaledStage>
    </div>
  )
}
