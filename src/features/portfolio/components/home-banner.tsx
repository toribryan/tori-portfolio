"use client"

import { usePathname } from "next/navigation"

import { HeroDither } from "./hero-dither"

export const HOME_BANNER_ID = "home-banner"

/**
 * The home page's full-width dither, rendered by the app layout above the
 * site header so the header scrolls up under it and only sticks once the
 * strip has left the screen.
 */
export function HomeBanner() {
  const pathname = usePathname()
  if (pathname !== "/") return null

  return <HeroDither id={HOME_BANNER_ID} className="relative h-64" />
}
