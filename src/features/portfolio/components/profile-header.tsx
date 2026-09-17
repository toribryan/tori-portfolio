import Image from "next/image"

import { USER } from "@/features/portfolio/data/user"

import { Banner } from "./banner"
import { FlipSentences } from "./flip-sentences"
import { VerifiedIcon } from "./verified-icon"

/**
 * Name, role, and the two images that open the page.
 *
 * The grid is two columns: the avatar sits left and spans both rows, the banner
 * fills the top-right, and the name block sits under the banner. Below `sm` the
 * banner goes full width above the avatar.
 */
export function ProfileHeader() {
  return (
    <div className="screen-line-bottom grid grid-cols-[auto_1fr] grid-rows-[1fr_auto] overflow-y-clip border-x border-line">
      {/* The template author's interactive isometric logo sat here. It's part
          of his brand, so this is a dithering shader instead — the palette runs
          #1A1423 → #FFF5EB and it ripples under the pointer. */}
      <figure className="relative col-span-2 aspect-[2/1] overflow-hidden bg-[#1A1423] sm:col-span-1 sm:col-start-2 sm:aspect-auto">
        <Banner className="absolute inset-0" />

        <figcaption className="pointer-events-none absolute right-2 bottom-2 text-sm leading-none tracking-wide text-white/70 tabular-nums select-none sm:right-4 sm:bottom-4">
          Fig. 1.
        </figcaption>
      </figure>

      <div className="flex flex-col sm:row-span-2 sm:row-start-1">
        <div className="screen-line-top mt-auto shrink-0 border-r border-line">
          <div className="mx-0.5 my-0.75 flex">
            <Image
              className="size-30 rounded-full select-none min-[24rem]:size-32 sm:size-40"
              src="/images/header/avatar.webp"
              alt={`${USER.displayName}'s avatar`}
              width={495}
              height={495}
              priority
              unoptimized
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="z-1 mt-auto border-t border-line">
          <div className="flex items-center gap-2 pt-1 pl-4">
            <h1 className="-translate-y-px font-heading text-[1.625rem]/8 font-medium tracking-normal">
              {USER.displayName}
            </h1>

            <VerifiedIcon className="size-4.5 select-none" aria-hidden />
          </div>

          <FlipSentences className="h-12.5 border-t border-line py-1 pl-4 sm:h-9">
            {USER.flipSentences}
          </FlipSentences>
        </div>
      </div>
    </div>
  )
}
