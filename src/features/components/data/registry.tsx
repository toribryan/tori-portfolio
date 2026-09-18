import type { ComponentType } from "react"
import type { LucideIcon } from "lucide-react"
import { SmilePlusIcon, StickyNoteIcon, WaypointsIcon } from "lucide-react"

import { TokenFlow } from "@/components/ui/token-flow"
import { TOKEN_ROWS } from "@/features/portfolio/data/token-flow"

export type ComponentEntry = {
  slug: string
  icon: LucideIcon
  /** The live component, rendered in the preview block. */
  Preview: ComponentType
  /** The file under `src/components/ui`, shown on the Code tab. */
  source: string
  /** The registry name to install from 21st.dev. */
  install: string
  links: {
    registry: string
    /** The post announcing it, embedded under the doc. */
    post?: { id: string; url: string }
  }
}

/**
 * What the MDX under `content/` cannot say about a component: its mark, its
 * live preview, where its source is, and where it is published. The words
 * live in the MDX; this is the wiring.
 */
export const COMPONENTS: Record<string, ComponentEntry> = {
  "token-flow": {
    slug: "token-flow",
    icon: WaypointsIcon,
    Preview: () => <TokenFlow rows={TOKEN_ROWS} showUse />,
    source: "token-flow.tsx",
    install: "@iamtoribryan/token-flow",
    links: {
      registry: "https://21st.dev/@iamtoribryan/components/token-flow",
      post: {
        id: "2100753096825786556",
        url: "https://x.com/iamtoribryan/status/2100753096825786556",
      },
    },
  },
}

/** Components in progress: a name and a mark on the home page, nothing to open yet. */
export const UPCOMING_COMPONENTS: { name: string; icon: LucideIcon }[] = [
  { name: "Reactions", icon: SmilePlusIcon },
  { name: "Note Node", icon: StickyNoteIcon },
]
