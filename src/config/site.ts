import type { Route } from "next"

import type { NavItem } from "@/types/nav"
import { USER } from "@/features/portfolio/data/user"

export const SITE_INFO = {
  name: USER.displayName,
  url: process.env.NEXT_PUBLIC_APP_URL || "https://www.toribryan.com",
  ogImage: USER.ogImage,
  description: USER.bio,
  keywords: USER.keywords,
}

export const META_THEME_COLORS = {
  light: "#fdfcfb",
  dark: "#0f0f0f",
}

export const MAIN_NAV: NavItem<Route>[] = [
  {
    title: "Blog",
    href: "/latest",
  },
]

export const MOBILE_NAV: NavItem<Route>[] = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "Projects",
    // A section of the home page rather than a route of its own: there is no
    // /work index, so the cards are only reachable from here. Cast because
    // typed routes describe pathnames, not fragments.
    href: "/#projects" as Route,
  },
  ...MAIN_NAV,
]

export const UTM_PARAMS = {
  utm_source: "toribryan.com",
}
