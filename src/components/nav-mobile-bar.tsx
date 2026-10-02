"use client"

import type { Route } from "next"
import { usePathname, useRouter } from "next/navigation"

import type { NavItem } from "@/types/nav"
import { MOBILE_NAV } from "@/config/site"
import { FloatingNav } from "@/components/fibo/floating-nav"
import { haptic } from "@/registry/lib/haptic"

// The item for the page you're on: Home only on the home page itself, the
// others for their route and anything under it. Fragment links, such as
// Projects, never match a pathname, so they light up only while tapped.
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
 * Floating nav, pinned to the bottom of the screen where a thumb reaches.
 * It steps aside while the page scrolls down and comes back on the way up.
 * It reads `MOBILE_NAV` itself: the items carry icon components, which a
 * server layout can't pass to a client component.
 */
export function NavMobileBar() {
  const pathname = usePathname()
  const router = useRouter()
  const items = MOBILE_NAV

  return (
    <FloatingNav
      aria-label="Site"
      className="sm:hidden"
      size="sm"
      hideOnScroll
      items={items.map(({ title, href, icon: Icon }) => ({
        value: href,
        label: title,
        href,
        icon: Icon ? <Icon /> : null,
      }))}
      value={currentHref(pathname, items)}
      onValueChange={(href, event) => {
        haptic()
        if (event.metaKey || event.ctrlKey) return
        event.preventDefault()
        router.push(href as Route)
      }}
    />
  )
}
