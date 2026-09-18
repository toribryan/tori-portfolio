"use client"

import type { ComponentType } from "react"
import Image from "next/image"

import { AtomicDesign } from "@/features/review/components/atomic-design"
import { FoundationLayers } from "@/features/review/components/foundation-layers"
import { PrThread } from "@/features/review/components/pr-thread"
import { ShippingPipeline } from "@/features/review/components/shipping-pipeline"
import { TokenCallouts } from "@/features/review/components/token-callouts"
import { TokenTiers } from "@/features/review/components/token-tiers"
import { TwoJobs } from "@/features/review/components/two-jobs"
import { REVIEW_LINKS } from "@/features/review/data/links"
import type { SlideData, Slide as SlideType } from "@/features/review/types"

import {
  Card,
  Clip,
  HairlineGrid,
  Kicker,
  Lede,
  LinkOut,
  LinkRow,
  Points,
  Reveal,
  Shot,
  Slide,
  Stack,
  Stat,
  StatRow,
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
      <TwoJobs />
      <LinkRow>
        <LinkOut href={REVIEW_LINKS.modernCareHomes.live}>
          Visit Modern Care Homes
        </LinkOut>
        <StorybookLink />
      </LinkRow>
    </Slide>
  )
}

function Foundations() {
  return (
    <Slide>
      <div className="flex items-center justify-between gap-4">
        <Kicker>Design system / foundations</Kicker>
        <LinkRow>
          <LinkOut href={REVIEW_LINKS.tokenFlow} className="h-7 text-xs">
            Token diagram on 21st.dev
          </LinkOut>
        </LinkRow>
      </div>
      <Title>Laying the foundation for a scalable design system.</Title>
      <TokenTiers />
      <FoundationLayers />
      <StatRow>
        <Stat value="18px" label="Base type size, everywhere" />
        <Stat value="48×48" label="Minimum target, every control" />
        <Stat value="AA" label="Contrast floor on every surface" />
        <Stat value="1:1" label="Figma variables to CSS custom properties" />
      </StatRow>
      <Clip
        src="/case-studies/foundations-mch.mp4"
        label="The foundations: tokens, type, spacing, and radius, as they live in the system"
      />
      <TokenCallouts />
    </Slide>
  )
}

function Components() {
  return (
    <Slide>
      <Kicker>Design system / components</Kicker>
      <Title>I’ve always been inspired by the atomic design methodology.</Title>
      <Lede>
        The library is organized the atomic way, so a rule set at the bottom
        still holds at the top. Every frame below is a live story.
      </Lede>
      <AtomicDesign />
    </Slide>
  )
}

function Coming() {
  return (
    <Slide>
      <Kicker>Design system / what is coming</Kicker>
      <Title>What is coming…</Title>
      <Lede>
        The complex components are in progress now, starting with the map: one
        variant for home profiles and one for map search.
      </Lede>
      <Clip
        src="/images/review/coming-map.mp4"
        label="The map search variant, in progress"
      />
    </Slide>
  )
}

function Storybook() {
  return (
    <Slide>
      <Kicker>Design system / Storybook</Kicker>
      <Title>Check out the library for yourself.</Title>
      <Lede>
        Seven PRs are waiting to merge, carrying the foundations into more
        complex components like the map.
      </Lede>
      <Reveal className="flex flex-col gap-2">
        <div className="overflow-hidden rounded-xl border border-line bg-background">
          <div className="flex h-9 items-center justify-between border-b border-line px-3">
            <p className="text-xs text-muted-foreground">
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
            src={`${REVIEW_LINKS.modernCareHomes.storybook}/?path=/story/ui-button--default`}
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
      <Lede>
        A family is mostly trying to rule homes out. Once the card is a system
        component, that decision is made once and holds on every listing, search
        result, and saved comparison.
      </Lede>
      <HairlineGrid>
        <Stack className="gap-2">
          <Shot
            src="/case-studies/old-homecard-mch.png"
            alt="The old home card: photo, price above the name in gray, address, and a paragraph of generic marketing copy"
            width={978}
            height={786}
            fit="viewport"
            label="Before"
          />
          <Points
            items={[
              "A white background fill made the grid uneven as content lengths varied.",
              "No way to tell whether a home was available now.",
              "One image only, with no way to see more without clicking into the home.",
              "No way to save a home and come back to it later.",
            ]}
          />
        </Stack>
        <Stack className="gap-2">
          <Shot
            src="/case-studies/new-homecard-mch.png"
            alt="The reworked home card: an Available Now badge, a save control, photo carousel dots, then name, address, and price"
            width={978}
            height={786}
            fit="viewport"
            label="After"
          />
          <Points
            items={[
              "The white background is gone, so the grid flexes with its content.",
              "Price sits beneath the name for a clearer information hierarchy.",
              "An “Available Now” tag marks homes ready for new residents.",
              "A save button keeps a home for later.",
              "A carousel previews a home’s photos before clicking in.",
            ]}
          />
        </Stack>
      </HairlineGrid>
    </Slide>
  )
}

function Dashboard() {
  return (
    <Slide>
      <Kicker>Design system / the other product</Kicker>
      <Title>The agent dashboard should be the listing.</Title>
      <Lede>
        I went deep on how other real estate platforms, Airbnb and Zillow among
        them, get people listing a home to complete every detail. The patterns
        those leaders established are what get their hosts to finish, so they
        shaped this shell. The same shell, rail, and section components ship on
        the marketplace side.
      </Lede>
      <HairlineGrid>
        <Stack className="gap-2">
          <Shot
            src="/case-studies/old-dashboard-mch.png"
            alt="The old agent dashboard shell: a wide sidebar holding only Home Details and Settings, next to an empty content area"
            width={1241}
            height={1241}
            fit="viewport"
            label="Before"
          />
          <Points
            items={[
              "No hierarchy or visibility between the sections of a listing.",
              "Clearly designed by an engineer.",
              "One long scroll in the main content area, so people filling in a home struggled to finish.",
              "No top-level overview of the home’s sections or what had already been entered.",
            ]}
          />
        </Stack>
        <Stack className="gap-2">
          <Shot
            src="/case-studies/new-dashboard-mch.png"
            alt="The reworked shell: an icon rail, then a column listing Availability, Photos, About, Amenities, Care services, and Contact, each with its current state underneath"
            width={1241}
            height={1241}
            fit="viewport"
            label="After"
          />
          <Points
            items={[
              "The sidebar splits the listing into sections, each previewing how many items were added or the value that was entered.",
              "The home switcher is visually connected to the home’s information.",
              "An easy way to preview the home once its information is in.",
            ]}
          />
        </Stack>
      </HairlineGrid>
    </Slide>
  )
}

function Shipping() {
  return (
    <Slide>
      <Kicker>Design system / shipping</Kicker>
      <Title>I build what I design.</Title>
      <LinkRow>
        <LinkOut href={REVIEW_LINKS.modernCareHomes.live} variant="default">
          Visit Modern Care Homes
        </LinkOut>
        <LinkOut href={REVIEW_LINKS.modernCareHomes.storybook}>
          Open Storybook
        </LinkOut>
        <LinkOut href={REVIEW_LINKS.modernCareHomes.caseStudy}>
          Full case study
        </LinkOut>
      </LinkRow>
      <HairlineGrid columns="minmax(0, 1.15fr) minmax(0, 1fr)">
        <Reveal className="p-2">
          <ShippingPipeline />
        </Reveal>
        <div className="flex flex-col">
          <Card label="What the handoff is for">
            The handoff between design and engineering exists for complex
            contributions that touch the data layer. Components, layout,
            responsive behavior, and motion ship as code from me.
          </Card>
          <Card label="What that removes">
            Nothing gets defended in a handoff meeting. If something needs to
            change, I change it. Whatever I learn shipping goes back into the
            system, so the next screen starts further along.
          </Card>
        </div>
      </HairlineGrid>
      <Reveal>
        <PrThread
          comments={[
            {
              handle: "sgrzincich",
              when: "2 weeks ago",
              body: "don't commit images. We will add a brand-based config later. for now it can just be empty.",
            },
            {
              handle: "toribryan",
              when: "2 weeks ago",
              body: "ok captain",
              author: true,
            },
          ]}
        />
      </Reveal>
      <Reveal>
        <p className="text-sm text-muted-foreground">
          Built with Spencer Grzincich, Software Engineer, who owns the data
          layer and infrastructure.
        </p>
      </Reveal>
    </Slide>
  )
}

export const DESIGN_SYSTEM_CONTENT: Record<
  string,
  ComponentType<{ slide: SlideType; data: SlideData }>
> = {
  cover: Cover,
  foundations: Foundations,
  components: Components,
  coming: Coming,
  storybook: Storybook,
  "home-card": HomeCard,
  dashboard: Dashboard,
  shipping: Shipping,
}
