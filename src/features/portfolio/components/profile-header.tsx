import Image from "next/image"

import { USER } from "@/features/portfolio/data/user"

import { FlipSentences } from "./flip-sentences"
import { HeroCanvas } from "./hero-canvas"
import { SocialLinks } from "./social-links"
import { VerifiedIcon } from "./verified-icon"

/**
 * Name, role, and the canvas that opens the page. The canvas fills the whole
 * header behind the avatar and name cells, which sit on top of it; the strip
 * above them and the gap beside the avatar are where it shows through.
 */
export function ProfileHeader() {
  return (
    <div className="relative border-x border-line">
      <HeroCanvas className="absolute inset-0" />
      {/* The screen-wide bottom line, drawn above the canvas. Elsewhere two
          panels' lines overlap at each seam, so it's layered twice to match. */}
      <div className="pointer-events-none absolute bottom-0 left-[-100vw] z-11 h-px w-[200vw] bg-line bg-[linear-gradient(var(--color-line),var(--color-line))]" />

      <div className="pointer-events-none h-32 sm:h-40" />

      <div className="grid grid-cols-[auto_1fr]">
        <div className="relative z-10 border-t border-r border-line bg-background">
          <div className="mx-0.5 my-0.75 flex">
            <Image
              className="size-30 rounded-full border border-line select-none min-[24rem]:size-32 sm:size-40"
              src={USER.headerAvatar}
              alt={`${USER.displayName}'s avatar`}
              width={495}
              height={495}
              priority
              unoptimized
            />
          </div>
        </div>

        <div className="pointer-events-none flex flex-col">
          <span className="relative z-10 mt-auto mr-3 mb-2 self-end font-mono text-xs text-muted-foreground select-none sm:mr-4">
            Fig. 1.
          </span>

          <div className="pointer-events-auto relative z-10 border-t border-line bg-background">
            <div className="flex items-center gap-2 py-1.5 pl-4">
              <h1 className="-translate-y-px font-heading text-[1.625rem]/8 font-medium tracking-normal">
                {USER.displayName}
              </h1>
              <VerifiedIcon className="size-4.5 select-none" aria-hidden />
            </div>

            <FlipSentences className="h-12.5 border-t border-line py-1 pl-4 sm:h-9">
              {USER.flipSentences}
            </FlipSentences>

            <SocialLinks className="border-t border-line py-2 pl-4" />
          </div>
        </div>
      </div>
    </div>
  )
}
