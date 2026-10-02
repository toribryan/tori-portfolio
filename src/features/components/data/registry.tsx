import type { ComponentType } from "react"

import { EXAMPLES } from "@/features/components/examples"
import {
  NICHE_PARTS,
  nicheFigmaUrl,
  nicheStorybookUrl,
} from "@/features/portfolio/data/fibo-niche"

export type ComponentEntry = {
  slug: string
  /** The live component, rendered in the preview block. */
  Preview: ComponentType
  /** The installed source under `src/components/fibo/`, shown on the Code tab. */
  source: string
  links: {
    /** The part's docs in fibo's Storybook. */
    storybook: string
    /** The part's page in fibo's Figma library, when it has one. */
    figma?: string
    /** Where else it is published, such as 21st.dev. */
    registry?: { label: string; url: string }
    /** The post announcing it, shown at the top of the doc. */
    post?: { id: string; url: string }
  }
}

// Which example leads each doc: the one fibo's own docs open with.
const LEAD: Record<string, string> = {
  "data-table": "Default",
  "filter-menu": "AppliedAsChips",
  "chapter-scrubber": "Default",
  "command-menu": "Default",
  reactions: "InMessage",
  "pixel-snail": "Default",
  "integration-visual": "Default",
  "token-flow": "WithUse",
  "floating-nav": "Default",
  "sticker-avatar": "Default",
  "map-pin": "Default",
  "typing-indicator": "InAConversation",
}

// The parts also published on 21st.dev, under the same names.
const ON_21ST = new Set([
  "filter-menu",
  "reactions",
  "pixel-snail",
  "integration-visual",
  "token-flow",
])

// Token flow was announced on X before fibo.
const EXTRA_LINKS: Record<string, Partial<ComponentEntry["links"]>> = {
  "token-flow": {
    post: {
      id: "2100753096825786556",
      url: "https://x.com/iamtoribryan/status/2100753096825786556",
    },
  },
}

/**
 * What a doc's MDX under `content/` cannot say about its component: the
 * preview it leads with, the installed source, and where else it lives. The
 * words live in the MDX; the parts are fibo's, listed in fibo-niche.ts.
 */
export const COMPONENTS: Record<string, ComponentEntry | undefined> =
  Object.fromEntries(
    NICHE_PARTS.map(({ name }) => [
      name,
      {
        slug: name,
        Preview: EXAMPLES[name]![LEAD[name]!]!,
        source: `${name}.tsx`,
        links: {
          storybook: nicheStorybookUrl(name),
          figma: nicheFigmaUrl(name),
          ...(ON_21ST.has(name) && {
            registry: {
              label: "Open on 21st.dev",
              url: `https://21st.dev/@iamtoribryan/components/${name}`,
            },
          }),
          ...EXTRA_LINKS[name],
        },
      },
    ])
  )
