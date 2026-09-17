"use client"

import type { ComponentType } from "react"

import { REVIEW_LINKS } from "@/features/review/data/links"

import {
  Card,
  CardGrid,
  Kicker,
  Lede,
  LinkOut,
  LinkRow,
  Reveal,
  Slide,
  Stat,
  StatRow,
  Title,
} from "../slide-primitives"

function Threads() {
  return (
    <Slide>
      <Kicker>Observations / across both</Kicker>
      <Title>Three things both projects have in common.</Title>
      <CardGrid className="md:grid-cols-3">
        <Card label="01" title="Test the brief before building it.">
          AuthorProof’s architecture was mapped against the platform before
          engineering spent a day. Modern Care Homes started with a teardown of
          the marketplaces that had already solved search.
        </Card>
        <Card label="02" title="Put the rule in the component.">
          Confidence, not verdict, is carried as text because colour cannot be
          trusted. The accessibility floor is 18px and 48 by 48 because the
          component says so, not a checklist.
        </Card>
        <Card label="03" title="Ship what you design.">
          Prototypes as the spec on AuthorProof. Storybook to pull request to
          preview to production on Modern Care Homes. Fewer handoffs, fewer
          places for a decision to drift.
        </Card>
      </CardGrid>
    </Slide>
  )
}

function Role() {
  return (
    <Slide>
      <Kicker>Observations / for a design systems role</Kicker>
      <Title>What I’d bring on day one.</Title>
      <Lede>
        The system work I have done at scale, for context on the two projects
        above.
      </Lede>
      <StatRow>
        <Stat
          value="94%"
          label="Fewer card variants in a legacy system, 587 down to 32"
        />
        <Stat
          value="37"
          label="Components rebuilt on a new token architecture in 60 days"
        />
        <Stat
          value="3"
          label="Product suites converged on one design language"
        />
        <Stat value="8M" label="Test takers the platform serves" />
      </StatRow>
      <CardGrid>
        <Card label="Tokens and architecture">
          Semantic token layers built before any component. A theme is a data
          change, not a code change.
        </Card>
        <Card label="Governance as mentorship">
          Owning the answer to “does this belong in the system”, given in public
          to three suites at once, through coaching rather than a review gate.
        </Card>
        <Card label="Design to code">
          Code Connect, Figma MCP and an agentic handoff pipeline that took spec
          production from days to under thirty minutes.
        </Card>
        <Card label="Shipping the front end">
          React, Tailwind, shadcn, Base UI, Storybook. I can build the component
          I documented.
        </Card>
      </CardGrid>
      <LinkRow>
        <LinkOut href={REVIEW_LINKS.designSystemOverhaul}>
          Design System Overhaul
        </LinkOut>
        <LinkOut href={REVIEW_LINKS.agenticDesignSystem}>
          Agentic Design System
        </LinkOut>
      </LinkRow>
    </Slide>
  )
}

function Thanks() {
  return (
    <Slide className="gap-6">
      <Kicker>Observations / thank you</Kicker>
      <Title size="xl">Questions?</Title>
      <Lede>
        Everything from today, in one place. Open whichever one is useful.
      </Lede>
      <Reveal>
        <ul className="grid gap-x-8 divide-y divide-line border-y border-line sm:grid-cols-2">
          {[
            ["Portfolio", REVIEW_LINKS.portfolio],
            ["AuthorProof case study", REVIEW_LINKS.authorProof.caseStudy],
            ["AuthorProof product page", REVIEW_LINKS.authorProof.product],
            ["Modern Care Homes, live", REVIEW_LINKS.modernCareHomes.live],
            [
              "Modern Care Homes case study",
              REVIEW_LINKS.modernCareHomes.caseStudy,
            ],
            [
              "Modern Care Homes Storybook",
              REVIEW_LINKS.modernCareHomes.storybook,
            ],
            [
              "Integrity Console Storybook",
              REVIEW_LINKS.integrityConsole.storybook,
            ],
            ["Résumé", REVIEW_LINKS.resume],
          ].map(([label, href]) => (
            <li key={href} className="py-3">
              <a
                className="text-base link-underline md:text-lg"
                href={href}
                target={
                  /^https?:|^\/storybook|\.pdf$/.test(href)
                    ? "_blank"
                    : undefined
                }
                rel="noopener noreferrer"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </Reveal>
    </Slide>
  )
}

export const OBSERVATIONS_CONTENT: Record<string, ComponentType> = {
  threads: Threads,
  role: Role,
  thanks: Thanks,
}
