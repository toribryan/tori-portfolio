import type { LucideIcon } from "lucide-react"

export type NavItem<T extends string = string> = {
  title: string
  href: T
  /** Shown in the phone nav, where items are icons until current. */
  icon?: LucideIcon
}
