import type { ComponentType } from "react"

import { TokenFlow } from "@/components/ui/token-flow"
import { TOKEN_ROWS } from "@/features/portfolio/data/token-flow"

export type ComponentEntry = {
  slug: string
  /** The live component, rendered in the preview block. */
  Preview: ComponentType
  /** The published file under `.21st/`, shown on the Code tab. */
  source: string
  /** The registry name to install from 21st.dev. */
  install: string
  links: {
    registry: string
    /** The post announcing it, shown at the top of the doc. */
    post?: { id: string; url: string }
  }
}

/**
 * What the MDX under `content/` cannot say about a component: its live
 * preview, where its published source is, and where it lives on 21st.dev.
 * The words live in the MDX; the mark lives in `marks.ts`; this is the wiring.
 */
export const COMPONENTS: Record<string, ComponentEntry | undefined> = {
  "token-flow": {
    slug: "token-flow",
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
