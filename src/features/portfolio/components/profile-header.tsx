import Image from "next/image"
import { addQueryParams } from "@/utils/url"
import { MapPinIcon } from "lucide-react"

import { UTM_PARAMS } from "@/config/site"
import { Button } from "@/components/base/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/base/ui/tooltip"
import { SOCIAL_ICONS } from "@/features/portfolio/components/social-link-icons"
import { SOCIAL_LINKS } from "@/features/portfolio/data/social-links"
import { USER } from "@/features/portfolio/data/user"

import { FlipSentences } from "./flip-sentences"
import { Greeting } from "./greeting"
import { HeroActions } from "./hero-actions"
import { NameReel } from "./name-reel"
import { VerifiedIcon } from "./verified-icon"

/**
 * The hero, in the order a visitor needs it: who, what, whether I'm available,
 * and how to reach me. The square portrait shares its background colour with
 * its cell, so it reads as a tile on the grid at any row height.
 */
export function ProfileHeader() {
  return (
    <div className="screen-line-bottom border-x border-line">
      <h1 className="flex h-20 items-center bg-[#1A1423] px-4 sm:h-28 sm:px-6">
        <span className="sr-only">{USER.displayName}</span>
        <NameReel name={USER.displayName} className="h-12 sm:h-16" />
      </h1>

      {/* Side by side from sm up; on a phone the portrait becomes a band
          above the text so the name and actions get the full width. */}
      <div className="screen-line-top grid sm:grid-cols-[auto_1fr]">
        <div className="group flex items-center justify-center border-line bg-[#EDDFD6] max-sm:border-b sm:border-r">
          <Image
            className="size-36 select-none group-hover:animate-pixel-hop motion-reduce:animate-none sm:size-48"
            src={USER.portrait}
            alt={`${USER.displayName}'s pixel portrait`}
            width={495}
            height={495}
            priority
            unoptimized
          />
        </div>

        <div className="flex min-w-0 flex-col justify-center gap-3 p-4 sm:gap-4 sm:px-6">
          <div className="flex flex-col gap-1">
            <Greeting className="font-mono text-sm text-muted-foreground" />
            <p className="font-heading text-2xl font-medium tracking-tight text-balance sm:text-3xl">
              {USER.discipline}
              <VerifiedIcon
                className="ml-2 inline-block size-5 -translate-y-0.5 align-middle select-none"
                aria-hidden
              />
            </p>
            <FlipSentences className="h-12 sm:h-6">
              {USER.flipSentences}
            </FlipSentences>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            {USER.availability && (
              <span className="inline-flex items-center gap-2 rounded-full border border-line px-2.5 py-1">
                <span
                  className="size-2 rounded-full bg-green-500"
                  aria-hidden
                />
                {USER.availability}
              </span>
            )}
            <a
              className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(USER.address)}`}
              target="_blank"
              rel="noopener"
            >
              <MapPinIcon className="size-4" aria-hidden />
              {USER.address}
            </a>
          </div>

          <HeroActions emailB64={USER.emailB64} />
        </div>
      </div>

      <div className="screen-line-top flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <span className="font-mono text-xs text-muted-foreground">
          Elsewhere
        </span>
        <ul className="flex gap-1.5" aria-label="Elsewhere">
          {SOCIAL_LINKS.map((item) => (
            <li key={item.name}>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      className="text-foreground/80 shadow-none [&_svg:not([class*='size-'])]:size-4.5"
                      variant="outline"
                      size="icon-sm"
                      nativeButton={false}
                      render={
                        <a
                          href={addQueryParams(item.href, UTM_PARAMS)}
                          target="_blank"
                          rel="noopener"
                        >
                          {SOCIAL_ICONS[item.name]}
                          <span className="sr-only">{item.title}</span>
                        </a>
                      }
                    />
                  }
                />
                <TooltipContent>
                  {item.title} ({item.handle})
                </TooltipContent>
              </Tooltip>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
