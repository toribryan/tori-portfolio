import { USER } from "@/features/portfolio/data/user"

import { HeroDither } from "./hero-dither"
import { SocialLinks } from "./social-links"
import { VerifiedIcon } from "./verified-icon"

/**
 * Name, role, and the dither strip that opens the page. "Fig. 1." sits under
 * the strip as its caption, in the gap beside the avatar.
 */
export function ProfileHeader() {
  return (
    <div className="relative border-x border-line">
      {/* The screen-wide bottom line. Elsewhere two panels' lines overlap at
          each seam, so it's layered twice to match. */}
      <div className="pointer-events-none absolute bottom-0 left-[-100vw] z-11 h-px w-[200vw] bg-line bg-[linear-gradient(var(--color-line),var(--color-line))]" />

      <HeroDither className="relative h-52" />

      {/* On phones the avatar cell lines up with the name block and centres
          the avatar in it; from sm up the avatar is the taller of the two and
          its cell reaches up beside "Fig. 1." too. */}
      <div className="grid grid-cols-[auto_1fr] grid-rows-[1fr_auto]">
        <div className="relative z-10 row-start-2 flex items-center border-t border-r border-line bg-background sm:row-span-2 sm:row-start-1 sm:items-start">
          <div className="mx-0.5 my-0.75 flex">
            {/* An animated image can't be paused, so reduced motion gets the
                still instead of the flicker. */}
            <picture>
              <source
                media="(prefers-reduced-motion: reduce)"
                srcSet={USER.headshotStill}
              />
              <img
                className="size-25 rounded-full object-cover select-none min-[22.5rem]:size-30 min-[23.4375rem]:size-34 sm:size-40"
                src={USER.headshot}
                alt={USER.displayName}
                width={800}
                height={800}
                fetchPriority="high"
              />
            </picture>
          </div>
        </div>

        <span className="pointer-events-none relative z-10 col-start-2 row-start-1 mt-auto mr-3 mb-2 self-end justify-self-end font-mono text-xs text-muted-foreground select-none sm:mr-4">
          Fig. 1.
        </span>

        <div className="relative z-10 col-start-2 row-start-2 border-t border-line bg-background">
          <div className="flex items-center gap-2 py-1.5 pl-4">
            <h1 className="translate-y-0.5 font-heading text-[1.625rem]/8 font-medium tracking-normal">
              {USER.displayName}
            </h1>
            <VerifiedIcon className="size-4.5 select-none" aria-hidden />
          </div>

          <div className="border-t border-line py-1.5 pl-4 font-mono text-sm text-balance text-muted-foreground max-[22.5rem]:text-[0.8125rem]">
            {USER.headerLines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>

          <SocialLinks className="border-t border-line py-2 pl-4" />
        </div>
      </div>
    </div>
  )
}
