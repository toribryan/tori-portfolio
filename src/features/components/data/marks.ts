import type { LucideIcon } from "lucide-react"
import { SmilePlusIcon, StickyNoteIcon, WaypointsIcon } from "lucide-react"

/**
 * The mark for each component, by slug. Kept apart from the registry so the
 * home page grid, a client component, does not pull the previews in.
 */
export const COMPONENT_MARKS: Record<string, LucideIcon> = {
  "token-flow": WaypointsIcon,
}

/** Components in progress: a name and a mark on the home page, nothing to open yet. */
export const UPCOMING_COMPONENTS: { name: string; icon: LucideIcon }[] = [
  { name: "Reactions", icon: SmilePlusIcon },
  { name: "Note Node", icon: StickyNoteIcon },
]
