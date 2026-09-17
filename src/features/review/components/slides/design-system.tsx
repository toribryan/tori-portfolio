"use client"

import type { ComponentType } from "react"
import Image from "next/image"

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
import type { IntegrationItem } from "@/features/review/components/integration-visual"
import { IntegrationVisual } from "@/features/review/components/integration-visual"
import type { TokenRow } from "@/features/review/components/token-flow"
import { TokenFlow } from "@/features/review/components/token-flow"
import { REVIEW_LINKS } from "@/features/review/data/links"
import type { Slide as SlideType } from "@/features/review/types"

import {
  Card,
  CardGrid,
  Clip,
  Flow,
  Kicker,
  Lede,
  LinkOut,
  LinkRow,
  Reveal,
  Shot,
  Slide,
  Split,
  Stat,
  StatRow,
  Tags,
  Title,
} from "../slide-primitives"

function StorybookLink({
  variant = "outline",
}: {
  variant?: "outline" | "default"
}) {
  return (
    <LinkOut href={REVIEW_LINKS.modernCareHomes.storybook} variant={variant}>
      Open Storybook
    </LinkOut>
  )
}

function Cover() {
  return (
    <Slide>
      <Kicker>02 · Design system</Kicker>
      <Reveal>
        <Image
          className="h-7 w-auto"
          src="/images/review/modern-care-homes-logo.png"
          alt="Modern Care Homes"
          width={148}
          height={40}
          unoptimized
        />
      </Reveal>
      <Title size="xl">Senior Living Marketplace</Title>
      <Tags
        items={[
          "Design Engineer",
          "2024 to now",
          "Next.js",
          "Tailwind",
          "shadcn",
          "Storybook",
          "Figma",
        ]}
      />
      <CardGrid>
        <Job number="01" title="Building the design system" items={BUILD_STACK}>
          Tokens, foundations and components, each built and argued with in
          isolation before it lands on a page. The accessibility floor is built
          into each component.
        </Job>
        <Job number="02" title="Using it in context" items={USE_STACK}>
          The marketplace families search and the platform agents run it from,
          shipped on the same library: search and map, listing creation, and the
          pages in between.
        </Job>
      </CardGrid>
      <LinkRow>
        <LinkOut href={REVIEW_LINKS.modernCareHomes.live}>
          Visit Modern Care Homes
        </LinkOut>
        <StorybookLink />
      </LinkRow>
    </Slide>
  )
}

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

function Job({
  number,
  title,
  items,
  children,
}: {
  number: string
  title: string
  items: IntegrationItem[]
  children: React.ReactNode
}) {
  return (
    <Reveal className="flex flex-col bg-background">
      <IntegrationVisual
        items={items}
        center={
          <span className="font-heading text-base font-medium tabular-nums">
            {number}
          </span>
        }
      />
      <div className="flex flex-col gap-2 p-4">
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

const TOKEN_ROWS: TokenRow[] = [
  {
    base: "oklch(0.141 0.005 285.823)",
    primitive: "zinc-950",
    semantic: "--primary",
    use: "Primary actions, headings",
  },
  {
    base: "oklch(0.723 0.219 149.579)",
    primitive: "green-500",
    semantic: "--success",
    use: "Resolved, healthy, within threshold",
  },
  {
    base: "oklch(0.92 0.004 286.32)",
    primitive: "zinc-200",
    semantic: "--border",
    use: "Hairlines and inputs",
  },
]

function Foundations() {
  return (
    <Slide>
      <Kicker>Design system / foundations</Kicker>
      <Title>The accessibility floor is built into the components.</Title>
      <StatRow>
        <Stat value="18px" label="Base type size, everywhere" />
        <Stat value="48×48" label="Minimum target, every control" />
        <Stat value="AA" label="Contrast floor on every surface" />
        <Stat value="1:1" label="Figma variables to CSS custom properties" />
      </StatRow>
      <Reveal>
        <TokenFlow rows={TOKEN_ROWS} />
      </Reveal>
      <Clip
        className="[&_video]:max-h-[18vh] [&_video]:object-cover"
        src="/case-studies/foundations-mch.mp4"
        label="The foundations: tokens, type, spacing and radius, as they live in the system"
      />
    </Slide>
  )
}

function Components() {
  return (
    <Slide>
      <Kicker>Design system / components</Kicker>
      <Title>Atomic Design Inspired Components</Title>
    </Slide>
  )
}

function Storybook() {
  return (
    <Slide>
      <Kicker>Design system / Storybook</Kicker>
      <Title>The library, live.</Title>
      <Reveal className="flex flex-col gap-2">
        <div className="overflow-hidden rounded-xl border border-line bg-background">
          <div className="flex h-9 items-center justify-between border-b border-line px-3">
            <p className="font-mono text-xs text-muted-foreground">
              design.moderncarehomes.com
            </p>
            <a
              className="text-xs text-muted-foreground link-underline"
              href={REVIEW_LINKS.modernCareHomes.storybook}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open full screen
            </a>
          </div>
          <iframe
            className="block h-[62vh] w-full bg-white"
            src={REVIEW_LINKS.modernCareHomes.storybook}
            title="Modern Care Homes Storybook"
            loading="lazy"
            allow="fullscreen"
          />
        </div>
      </Reveal>
      <LinkRow>
        <LinkOut href={REVIEW_LINKS.integrityConsole.storybook}>
          Also: Integrity Console Storybook, 40 components
        </LinkOut>
      </LinkRow>
    </Slide>
  )
}

function HomeCard() {
  return (
    <Slide>
      <Kicker>Design system / a component in practice</Kicker>
      <Title>The home card should spend its space on what differs.</Title>
      <Split>
        <Shot
          src="/case-studies/old-homecard-mch.png"
          alt="The old home card: photo, price above the name in grey, address, and a paragraph of generic marketing copy"
          width={978}
          height={786}
          fit="viewport"
          label="Before: the widest line went to copy that read the same on every listing"
        />
        <Shot
          src="/case-studies/new-homecard-mch.png"
          alt="The reworked home card: an Available Now badge, a save control, photo carousel dots, then name, address and price"
          width={978}
          height={786}
          fit="viewport"
          label="After: availability, more than one photo, and a way to keep it for later"
        />
      </Split>
      <Lede className="text-base md:text-lg">
        A family is mostly trying to rule homes out. Once the card is a system
        component, that decision is made once and holds on every listing, search
        result and saved comparison.
      </Lede>
    </Slide>
  )
}

function Dashboard() {
  return (
    <Slide>
      <Kicker>Design system / the other product</Kicker>
      <Title>The agent dashboard should be the listing.</Title>
      <Split>
        <Shot
          src="/case-studies/old-dashboard-mch.png"
          alt="The old agent dashboard shell: a wide sidebar holding only Home Details and Settings, next to an empty content area"
          width={1241}
          height={1241}
          fit="viewport"
          label="Before: two nav items and a blank canvas"
        />
        <Shot
          src="/case-studies/new-dashboard-mch.png"
          alt="The reworked shell: an icon rail, then a column listing Availability, Photos, About, Amenities, Care services and Contact, each with its current state underneath"
          width={1241}
          height={1241}
          fit="viewport"
          label="After: every section carries its own state, so what is thin is visible before you open anything"
        />
      </Split>
      <Lede className="text-base md:text-lg">
        Straight out of the Airbnb listing-creation teardown: show the state of
        every stage. The same shell, rail and section components ship on the
        marketplace side.
      </Lede>
    </Slide>
  )
}

function Shipping() {
  return (
    <Slide>
      <Kicker>Design system / shipping</Kicker>
      <Title>I build what I design.</Title>
      <Flow
        stages={[
          { label: "Pattern research", detail: "marketplaces, in Mobbin" },
          { label: "Figma", detail: "foundations, tokens, components" },
          { label: "Storybook", detail: "every state, in isolation" },
          { label: "Pull request", detail: "reviewed, typed, tested" },
          { label: "Vercel preview", detail: "on a real phone" },
          { label: "Shipped", detail: "both products" },
        ]}
      />
      <CardGrid>
        <Card label="What the handoff is for">
          The handoff between design and engineering exists for complex
          contributions that touch the data layer. Components, layout,
          responsive behaviour and motion ship as code from me.
        </Card>
        <Card label="What that removes">
          Nothing gets defended in a handoff meeting. If something needs to
          change, I change it. Whatever I learn shipping goes back into the
          system, so the next screen starts further along.
        </Card>
      </CardGrid>
      <Reveal>
        <p className="text-sm text-muted-foreground">
          Built with Spencer Grzincich, Software Engineer, who owns the data
          layer and infrastructure.
        </p>
      </Reveal>
    </Slide>
  )
}

function Next() {
  return (
    <Slide>
      <Kicker>Design system / where it is</Kicker>
      <Title>Live, and still going.</Title>
      <StatRow>
        <Stat value="Live" label="Shipping in the Phoenix metro" />
        <Stat value="2" label="Products running on one design system" />
        <Stat value="AA" label="Floor on every surface, holding" />
      </StatRow>
      <CardGrid>
        <Card label="Next" title="Publish the component library">
          Foundations are locked; components are landing as they are done.
        </Card>
        <Card label="Next" title="Better comparison">
          Cost and care level side by side is the decision families make, and it
          is not solved yet.
        </Card>
      </CardGrid>
      <LinkRow>
        <LinkOut href={REVIEW_LINKS.modernCareHomes.live} variant="default">
          Visit Modern Care Homes
        </LinkOut>
        <StorybookLink />
        <LinkOut href={REVIEW_LINKS.modernCareHomes.caseStudy}>
          Full case study
        </LinkOut>
      </LinkRow>
    </Slide>
  )
}

export const DESIGN_SYSTEM_CONTENT: Record<
  string,
  ComponentType<{ slide: SlideType }>
> = {
  cover: Cover,
  foundations: Foundations,
  components: Components,
  storybook: Storybook,
  "home-card": HomeCard,
  dashboard: Dashboard,
  shipping: Shipping,
  next: Next,
}
