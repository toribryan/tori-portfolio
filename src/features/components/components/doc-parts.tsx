import type { ComponentProps } from "react"
import {
  DatabaseIcon,
  GitBranchIcon,
  MailIcon,
  MessageSquareIcon,
} from "lucide-react"

import { ChapterScrubber } from "@/components/fibo/chapter-scrubber"
import { FilterMenu } from "@/components/fibo/filter-menu"
import { IntegrationVisual } from "@/components/fibo/integration-visual"
import { Kbd as FiboKbd, KbdGroup as FiboKbdGroup } from "@/components/fibo/kbd"
import { PixelSnail, PixelSnailSprite } from "@/components/fibo/pixel-snail"
import { Reactions } from "@/components/fibo/reactions"
import { TokenFlow } from "@/components/fibo/token-flow"

// Prose styles every kbd, including a group's outer one; these opt out so
// fibo's keys look the same in a doc as in the part.
function Kbd(props: ComponentProps<typeof FiboKbd>) {
  return (
    <span className="not-prose">
      <FiboKbd {...props} />
    </span>
  )
}

function KbdGroup(props: ComponentProps<typeof FiboKbdGroup>) {
  return (
    <span className="not-prose">
      <FiboKbdGroup {...props} />
    </span>
  )
}

/**
 * The fibo parts and icons the docs render inline, in their do's and
 * don'ts and diagrams, by the names the MDX uses.
 */
export const DOC_PARTS = {
  ChapterScrubber,
  DatabaseIcon,
  FilterMenu,
  GitBranchIcon,
  IntegrationVisual,
  Kbd,
  KbdGroup,
  MailIcon,
  MessageSquareIcon,
  PixelSnail,
  PixelSnailSprite,
  Reactions,
  TokenFlow,
}
