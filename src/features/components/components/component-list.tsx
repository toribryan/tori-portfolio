"use client"

import type { Route } from "next"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { IconTile } from "@/components/ui/icon-tile"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/base/ui/tooltip"
import type { ComponentEntry } from "@/features/components/data/registry"
import {
  COMPONENTS,
  UPCOMING_COMPONENTS,
} from "@/features/components/data/registry"

export type ComponentListItem = {
  slug: string
  name: string
  isNew?: boolean
}

const CELL =
  "flex h-full items-center gap-4 px-4 py-5 text-lg font-medium select-none"

function Mark({
  icon: Icon,
  isNew,
  muted = false,
}: {
  icon: ComponentEntry["icon"]
  isNew?: boolean
  muted?: boolean
}) {
  return (
    <span className="relative shrink-0">
      <IconTile
        className={cn(
          "size-10 rounded-lg [&_svg]:size-5",
          muted && "opacity-60"
        )}
      >
        <Icon aria-hidden />
      </IconTile>
      {isNew && (
        <span className="absolute -top-1 -right-1 size-2.5 rounded-full bg-info ring-2 ring-background">
          <span className="sr-only">New</span>
        </span>
      )}
    </span>
  )
}

/**
 * The components as a three-across grid of marks and names, hairlines
 * between, like the registry sites. Published ones link to their page;
 * upcoming ones sit muted with a note on hover. Names come from the caller
 * and marks from the registry, since icons cannot cross from a server parent.
 */
export function ComponentList({
  items,
  className,
}: {
  items: ComponentListItem[]
  className?: string
}) {
  const upcoming = UPCOMING_COMPONENTS
  return (
    <ul
      className={cn(
        "grid gap-px bg-line sm:grid-cols-2 md:grid-cols-3",
        className
      )}
    >
      {items.map((item) => (
        <li key={item.slug} className="bg-background">
          <Link
            href={`/components/${item.slug}` as Route}
            className={cn(
              CELL,
              "transition-[background-color] ease-out hover:bg-accent-muted"
            )}
          >
            <Mark icon={COMPONENTS[item.slug].icon} isNew={item.isNew} />
            {item.name}
          </Link>
        </li>
      ))}

      {upcoming.map((entry) => (
        <li key={entry.name} className="bg-background">
          <Tooltip>
            <TooltipTrigger
              render={
                <div
                  className={cn(
                    CELL,
                    "cursor-not-allowed text-muted-foreground"
                  )}
                  aria-disabled
                />
              }
            >
              <Mark icon={entry.icon} muted />
              {entry.name}
            </TooltipTrigger>
            <TooltipContent>Coming soon</TooltipContent>
          </Tooltip>
        </li>
      ))}
    </ul>
  )
}
