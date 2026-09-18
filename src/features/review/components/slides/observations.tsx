"use client"

import type { ComponentType } from "react"

import { TweetQuote } from "@/components/ui/tweet-card"
import { USER } from "@/features/portfolio/data/user"
import { REVIEW_LINKS } from "@/features/review/data/links"
import type { SlideData, Slide as SlideType } from "@/features/review/types"

import {
  Card,
  HairlineGrid,
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

/** What the post says, for when X does not answer. */
const TWEET_FALLBACK = {
  text: "Words don't do justice to the liberating feeling that comes with replacing the design-dev handoff with a PR review.",
  href: "https://x.com/iamtoribryan/status/2097051500044513414",
}

function Threads({ data }: { data: SlideData }) {
  return (
    <Slide>
      <Kicker>Observations / across both</Kicker>
      <Title>Three things both projects have in common.</Title>
      <HairlineGrid columns={3}>
        <Card label="01" title="Test the brief before building it.">
          AuthorProof’s architecture was mapped against the platform before
          engineering spent a day. Modern Care Homes started with a teardown of
          the marketplaces that had already solved search.
        </Card>
        <Card label="02" title="Put the rule in the component.">
          Confidence is carried as text because color cannot be trusted. The
          accessibility floor is 18px and 48 by 48 because the component
          enforces it.
        </Card>
        <Card label="03" title="Ship what you design.">
          Prototypes as the spec on AuthorProof. Storybook to pull request to
          preview to production on Modern Care Homes. Fewer handoffs mean fewer
          places for a decision to drift.
        </Card>
      </HairlineGrid>
      <Reveal className="max-w-2xl">
        {data.tweet ? (
          <TweetQuote tweet={data.tweet} avatar={USER.headerAvatar} />
        ) : (
          <figure className="flex flex-col gap-4 rounded-2xl border border-line bg-background p-6">
            <blockquote className="text-lg/relaxed">
              {TWEET_FALLBACK.text}
            </blockquote>
            <figcaption className="text-sm text-muted-foreground">
              <a
                className="link-underline"
                href={TWEET_FALLBACK.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {USER.displayName} on X
              </a>
            </figcaption>
          </figure>
        )}
      </Reveal>
    </Slide>
  )
}

function Role() {
  return (
    <Slide>
      <Kicker>Observations / for a design systems role</Kicker>
      <Title>Wins I’m proud of in my design system work.</Title>
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
      <Reveal className="-mt-4">
        <p className="text-xs tracking-wide text-muted-foreground">
          From the Proctorio design system overhaul.
        </p>
      </Reveal>
      <Reveal>
        <h3 className="font-heading text-2xl/tight font-medium tracking-normal md:text-3xl/tight">
          What I bring to design systems.
        </h3>
      </Reveal>
      <HairlineGrid>
        <Card label="Tokens and architecture">
          Semantic token layers built before any component, so a new theme is a
          change to token values with no component touched.
        </Card>
        <Card label="Governance as mentorship">
          Owning the answer to “does this belong in the system,” given in public
          to three suites at once, through coaching rather than a review gate.
        </Card>
        <Card label="Design to code">
          Code Connect, Figma MCP, and an agentic handoff pipeline that took
          spec production from days to under thirty minutes.
        </Card>
        <Card label="Shipping the front end">
          React, Tailwind, shadcn, Base UI, Storybook. I can build the component
          I documented.
        </Card>
      </HairlineGrid>
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
      <Lede>Everything from today in one place. Open whichever is useful.</Lede>
      <Reveal>
        <ul className="screen-line-top screen-line-bottom grid gap-x-8 divide-y divide-line sm:grid-cols-2">
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

export const OBSERVATIONS_CONTENT: Record<
  string,
  ComponentType<{ slide: SlideType; data: SlideData }>
> = {
  threads: Threads,
  role: Role,
  thanks: Thanks,
}
