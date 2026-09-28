import type { LucideIcon } from "lucide-react"
import {
  AlignLeftIcon,
  ArrowUpRightIcon,
  SmilePlusIcon,
  SwatchBookIcon,
  WaypointsIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { IconTile } from "@/components/ui/icon-tile"

import { Panel, PanelHeader, PanelTitle, PanelTitleSup } from "./panel"
import { PanelTitleCopy } from "./panel-title-copy"

const ID = "niche"

type NichePart = {
  /** The part's file name in fibo; its docs page is keyed on it. */
  name: string
  title: string
  description: string
  icon: LucideIcon
}

// The niche shelf in fibo's components.meta.json, less the pixel snail,
// who already stars in the hero above.
const PARTS: NichePart[] = [
  {
    name: "chapter-scrubber",
    title: "Chapter scrubber",
    description:
      "A rail of marks that swell under the pointer like the Dock, previewing the chapter at the crest.",
    icon: AlignLeftIcon,
  },
  {
    name: "integration-visual",
    title: "Integration visual",
    description:
      "A hub and the tools wired into it, with pulses along the routes.",
    icon: WaypointsIcon,
  },
  {
    name: "reactions",
    title: "Reactions",
    description: "Lets people respond to content with an emoji in one tap.",
    icon: SmilePlusIcon,
  },
  {
    name: "token-flow",
    title: "Token flow",
    description:
      "Walks a colour token from raw value to primitive to semantic role.",
    icon: SwatchBookIcon,
  },
]

function docsUrl(name: string) {
  return `https://fibo.toribryan.com/?path=/docs/niche-${name}--docs`
}

/**
 * fibo's niche shelf, branching off the hero: one card per part, each
 * opening its docs in fibo's Storybook.
 */
export function FiboNiche() {
  return (
    <Panel id={ID}>
      <PanelHeader>
        <PanelTitle>
          <a href={`#${ID}`}>Niche components</a>
          <PanelTitleSup>({PARTS.length})</PanelTitleSup>
          <PanelTitleCopy id={ID} />
        </PanelTitle>
      </PanelHeader>

      <ul className="grid gap-px bg-line sm:grid-cols-2 sm:[&>li:last-child:nth-child(odd)]:col-span-2">
        {PARTS.map(({ name, title, description, icon: Icon }) => (
          <li key={name} className="bg-background">
            <a
              href={docsUrl(name)}
              target="_blank"
              rel="noreferrer"
              className={cn(
                "group/niche flex h-full items-start gap-4 p-4",
                "transition-[background-color] ease-out hover:bg-accent-muted"
              )}
            >
              <IconTile className="size-10 rounded-lg [&_svg]:size-5">
                <Icon aria-hidden />
              </IconTile>
              <span className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="flex items-center gap-1 text-lg leading-snug font-medium">
                  {title}
                  <ArrowUpRightIcon
                    aria-hidden
                    className="size-4 text-muted-foreground transition-transform ease-out group-hover/niche:translate-x-0.5 group-hover/niche:-translate-y-0.5"
                  />
                </span>
                <span className="text-sm text-pretty text-muted-foreground">
                  {description}
                </span>
                <span className="sr-only">(opens fibo&apos;s docs)</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </Panel>
  )
}
