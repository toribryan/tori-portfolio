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
    title: "Projects",
    href: "/projects",
  },
  {
    title: "Blog",
    href: "/latest",
  },
  {
    title: "Components",
    href: "/components",
  },
]

/** The floating nav's destinations on phones, written out. */
export const MOBILE_NAV: NavItem<Route>[] = [
  { title: "Home", href: "/" },
  { title: "Components", href: "/components" },
  { title: "Blog", href: "/latest" },
]

/** Every page, in the menu beside the floating nav. */
export const MOBILE_MENU: NavItem<Route>[] = [
  { title: "Home", href: "/" },
  { title: "Projects", href: "/projects" },
  { title: "Components", href: "/components" },
  { title: "Lore", href: "/fibo" },
  { title: "Blog", href: "/latest" },
]

export const UTM_PARAMS = {
  utm_source: "toribryan.com",
}
