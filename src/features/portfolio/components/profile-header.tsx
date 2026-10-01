import Image from "next/image"

import { USER } from "@/features/portfolio/data/user"

import { SocialLinks } from "./social-links"
import { VerifiedIcon } from "./verified-icon"

/** Avatar, name, and role: the first block under the site header. */
export function ProfileHeader() {
  return (
    <div className="relative border-x border-line">
      {/* The screen-wide bottom line. Elsewhere two panels' lines overlap at
          each seam, so it's layered twice to match. */}
      <div className="pointer-events-none absolute bottom-0 left-[-100vw] z-11 h-px w-[200vw] bg-line bg-[linear-gradient(var(--color-line),var(--color-line))]" />

      <div className="grid grid-cols-[auto_1fr]">
        <div className="flex items-center border-r border-line">
          <div className="mx-0.5 my-0.75 flex">
            <Image
              className="size-25 rounded-full object-cover select-none min-[22.5rem]:size-30 min-[23.4375rem]:size-34 sm:size-35"
              src={USER.headshot}
              alt={USER.displayName}
              width={400}
              height={400}
              priority
              unoptimized
            />
          </div>
        </div>

        <div>
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
