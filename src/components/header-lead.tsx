"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

import { HOME_BANNER_ID } from "@/features/portfolio/components/home-banner"

/**
 * The header's leading slot. While the home banner is on screen the header
 * sits right under it, so it captions the strip with "Fig. 1."; once the
 * banner scrolls away and the header sticks, the brand mark comes back.
 */
export function HeaderLead({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [bannerInView, setBannerInView] = useState(true)

  useEffect(() => {
    const banner = document.getElementById(HOME_BANNER_ID)
    if (!banner) return
    const observer = new IntersectionObserver(([entry]) =>
      setBannerInView(entry.isIntersecting)
    )
    observer.observe(banner)
    return () => observer.disconnect()
  }, [pathname])

  if (pathname !== "/" || !bannerInView) return children

  return (
    <span
      className="font-mono text-xs text-muted-foreground select-none"
      aria-hidden
    >
      Fig. 1.
    </span>
  )
}
