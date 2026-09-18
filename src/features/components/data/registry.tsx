import type { ComponentType } from "react"
import type { LucideIcon } from "lucide-react"
import { SmilePlusIcon, StickyNoteIcon, WaypointsIcon } from "lucide-react"

import { TokenFlow } from "@/components/ui/token-flow"
import { TOKEN_ROWS } from "@/features/portfolio/data/token-flow"

export type ComponentProp = {
  name: string
  type: string
  default?: string
  description: string
}

export type ComponentEntry = {
  slug: string
  name: string
  /** One line for the row on the home page and the page description. */
  description: string
  /** A paragraph for the page: what it is for and what it does. */
  summary: string
  icon: LucideIcon
  /** The live component, rendered on the home page row and the page. */
  Preview: ComponentType
  /** How a reader adds it to their own project. */
  install: string
  props: ComponentProp[]
  links: {
    registry: string
    /** The post announcing it, embedded on the page and the home section. */
    post?: { id: string; url: string }
  }
  createdAt: string
  new?: boolean
}

/**
 * Components published on their own, outside the case studies. Each gets a
 * page at `/components/<slug>` and a row on the home page.
 */
export const COMPONENTS: ComponentEntry[] = [
  {
    slug: "token-flow",
    name: "Token Flow",
    description:
      "A colour token walking from raw value to primitive to semantic utility, theme aware.",
    summary:
      "Design system case studies keep explaining the same thing: a semantic token points at a primitive, and the primitive holds the value. This draws it. One row per colour, wired across a dotted plate with a pulse travelling along each wire. Rows that carry a dark value swap to it when the theme changes and scramble for a moment on the way, which is the whole argument for semantic tokens in one motion.",
    icon: WaypointsIcon,
    Preview: () => <TokenFlow rows={TOKEN_ROWS} showUse />,
    install: "npx @21st-dev/cli add @iamtoribryan/token-flow",
    props: [
      {
        name: "rows",
        type: "TokenRow[]",
        description:
          "One entry per colour: base, primitive, semantic, an optional use caption, and an optional dark base and primitive.",
      },
      {
        name: "showUse",
        type: "boolean",
        default: "false",
        description: "Print each row's use under its semantic chip.",
      },
      {
        name: "theme",
        type: '"light" | "dark"',
        description:
          "Pin the theme instead of following the document's dark class.",
      },
      {
        name: "className",
        type: "string",
        description: "Classes for the outer plate.",
      },
    ],
    links: {
      registry: "https://21st.dev/@iamtoribryan/components/token-flow",
      post: {
        id: "2100753096825786556",
        url: "https://x.com/iamtoribryan/status/2100753096825786556",
      },
    },
    createdAt: "2026-09-18",
    new: true,
  },
]

/** Components in progress: a name and a mark on the home page, nothing to open yet. */
export const UPCOMING_COMPONENTS: { name: string; icon: LucideIcon }[] = [
  { name: "Reactions", icon: SmilePlusIcon },
  { name: "Note Node", icon: StickyNoteIcon },
]

export function getComponent(slug: string) {
  return COMPONENTS.find((entry) => entry.slug === slug)
}
