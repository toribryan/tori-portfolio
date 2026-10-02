"use client"

import { useState } from "react"
import type { Route } from "next"
import { usePathname, useRouter } from "next/navigation"
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react"

import type { NavItem } from "@/types/nav"
import { MOBILE_MENU, MOBILE_NAV } from "@/config/site"
import { FloatingNav } from "@/components/fibo/floating-nav"
import { NavMobile } from "@/components/nav-mobile"
import { haptic } from "@/registry/lib/haptic"

// Past this distance from the top, scrolling down hides the bar. Small moves
// are ignored so momentum scrolling doesn't make it flicker.
const HIDE_AFTER = 64
const SCROLL_THRESHOLD = 8

// The item for the page you're on: Home only on the home page itself, the
// others for their route and anything under it.
function currentHref(pathname: string, items: NavItem<Route>[]) {
  return (
    items.find((item) =>
      item.href === "/"
        ? pathname === "/"
        : pathname === item.href || pathname.startsWith(`${item.href}/`)
    )?.href ?? ""
  )
}

/**
 * The site's nav below `sm`, where the header carries no links: fibo's
 * Floating nav with the main pages written out, and a menu button beside it
 * for every page. The two step aside together while the page scrolls down
 * and come back on the way up.
 */
export function NavMobileBar() {
  const pathname = usePathname()
  const router = useRouter()
  const reduceMotion = useReducedMotion()
  const { scrollY } = useScroll()
  const [hidden, setHidden] = useState(false)

  useMotionValueEvent(scrollY, "change", (y) => {
    const delta = y - (scrollY.getPrevious() ?? 0)
    if (Math.abs(delta) < SCROLL_THRESHOLD) return
    setHidden(delta > 0 && y > HIDE_AFTER)
  })

  return (
    <motion.div
      initial={false}
      animate={
        hidden ? { y: "calc(100% + 2rem)", opacity: 0 } : { y: 0, opacity: 1 }
      }
      transition={
        reduceMotion
          ? { duration: 0 }
          : { type: "spring", stiffness: 520, damping: 40, mass: 0.8 }
      }
      // Tabbing into a hidden bar brings it back.
      onFocus={() => setHidden(false)}
      className="pointer-events-none fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+1rem)] z-50 flex items-center justify-center gap-2 px-4 sm:hidden"
    >
      <FloatingNav
        aria-label="Site"
        position="static"
        size="sm"
        items={MOBILE_NAV.map(({ title, href }) => ({
          value: href,
          label: title,
          href,
        }))}
        value={currentHref(pathname, MOBILE_NAV)}
        onValueChange={(href, event) => {
          haptic()
          if (event.metaKey || event.ctrlKey) return
          event.preventDefault()
          router.push(href as Route)
        }}
      />
      <div className="pointer-events-auto rounded-full border border-border bg-popover-overlay p-1 shadow-lg backdrop-blur-md">
        <NavMobile items={MOBILE_MENU} />
      </div>
    </motion.div>
  )
}
