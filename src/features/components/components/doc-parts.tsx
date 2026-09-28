import {
  DatabaseIcon,
  GitBranchIcon,
  MailIcon,
  MessageSquareIcon,
} from "lucide-react"

import { ChapterScrubber } from "@/components/fibo/chapter-scrubber"
import { FilterMenu } from "@/components/fibo/filter-menu"
import { IntegrationVisual } from "@/components/fibo/integration-visual"
import { PixelSnail, PixelSnailSprite } from "@/components/fibo/pixel-snail"
import { Reactions } from "@/components/fibo/reactions"
import { TokenFlow } from "@/components/fibo/token-flow"

import { PixelGrid } from "./pixel-grid"

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
  MailIcon,
  MessageSquareIcon,
  PixelGrid,
  PixelSnail,
  PixelSnailSprite,
  Reactions,
  TokenFlow,
}
