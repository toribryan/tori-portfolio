import type { ComponentType } from "react"

import * as chapterScrubber from "./chapter-scrubber"
import * as filterMenu from "./filter-menu"
import * as integrationVisual from "./integration-visual"
import * as pixelSnail from "./pixel-snail"
import * as reactions from "./reactions"
import * as tokenFlow from "./token-flow"

/**
 * Each doc's live examples, ported from its fibo stories and keyed by the
 * story's export name, so `<Example of="reactions.Default" />` in the MDX
 * matches `Default` in fibo's reactions.stories.tsx.
 */
export const EXAMPLES: Record<string, Record<string, ComponentType>> = {
  "chapter-scrubber": chapterScrubber,
  "filter-menu": filterMenu,
  "integration-visual": integrationVisual,
  "pixel-snail": pixelSnail,
  reactions,
  "token-flow": tokenFlow,
}
