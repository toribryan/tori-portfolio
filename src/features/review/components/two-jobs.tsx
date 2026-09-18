"use client"

import {
  BaseUiIcon,
  FigmaIcon,
  MapboxIcon,
  NextJsIcon,
  ShadcnIcon,
  StorybookIcon,
  TailwindCssIcon,
  VercelIcon,
} from "@/components/icons"

import type { IntegrationItem } from "./integration-visual"
import { IntegrationVisual } from "./integration-visual"
import { Frame, HairlineGrid, Reveal } from "./slide-primitives"

const BUILD_STACK: IntegrationItem[] = [
  { title: "Storybook", Icon: StorybookIcon },
  { title: "shadcn", Icon: ShadcnIcon },
  { title: "Tailwind", Icon: TailwindCssIcon },
  { title: "Base UI", Icon: BaseUiIcon },
]

const USE_STACK: IntegrationItem[] = [
  { title: "Vercel", Icon: VercelIcon },
  { title: "Next.js", Icon: NextJsIcon },
  { title: "Figma", Icon: FigmaIcon },
  { title: "Mapbox", Icon: MapboxIcon },
]

/** A silent, looping glimpse of a clip, sized for the hub's popover. */
function Peek({ src }: { src: string }) {
  return (
    <Frame>
      <video
        className="block aspect-video w-full rounded-lg bg-black object-cover"
        src={src}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
      />
    </Frame>
  )
}

function Job({
  number,
  title,
  items,
  preview,
  children,
}: {
  number: string
  title: string
  items: IntegrationItem[]
  preview?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <Reveal className="flex flex-col">
      <IntegrationVisual
        items={items}
        preview={preview}
        center={
          <span className="font-heading text-base font-medium tabular-nums">
            {number}
          </span>
        }
      />
      <div className="flex flex-col gap-2 px-6 py-4">
        <p className="font-heading text-lg/tight font-medium text-balance md:text-xl/tight">
          {title}
        </p>
        <p className="text-sm/relaxed text-pretty text-muted-foreground md:text-base/relaxed">
          {children}
        </p>
      </div>
    </Reveal>
  )
}

/**
 * The two jobs the design system does, side by side: building it, and using
 * it across both products. Hovering a hub plays a glimpse of each.
 */
export function TwoJobs({ className }: { className?: string }) {
  return (
    <HairlineGrid className={className}>
      <Job
        number="01"
        title="Building the design system"
        items={BUILD_STACK}
        preview={<Peek src="/case-studies/foundations-mch.mp4" />}
      >
        Tokens, foundations, and components, each built and argued with in
        isolation before it lands on a page. The accessibility floor is built
        into every component.
      </Job>
      <Job
        number="02"
        title="Using it in context"
        items={USE_STACK}
        preview={<Peek src="/case-studies/home-grid-mch.mp4" />}
      >
        The marketplace families search and the platform agents run it from,
        both shipped on the same library: search and map, listing creation, and
        the pages in between.
      </Job>
    </HairlineGrid>
  )
}
