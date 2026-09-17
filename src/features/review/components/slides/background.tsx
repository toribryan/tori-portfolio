"use client"

import type { ComponentType } from "react"
import Image from "next/image"

import { SpecialText } from "@/components/ui/special-text"
import { REVIEW_LINKS } from "@/features/review/data/links"

import {
  Card,
  CardGrid,
  Kicker,
  Lede,
  LinkOut,
  LinkRow,
  Quote,
  Reveal,
  Slide,
  Title,
} from "../slide-primitives"

function Cover() {
  return (
    <Slide>
      <Reveal>
        <h2 className="font-heading text-5xl/none font-medium tracking-normal md:text-7xl/none">
          <SpecialText delay={0.2} speed={24}>
            Tori Bryan
          </SpecialText>
        </h2>
      </Reveal>
    </Slide>
  )
}

const BIO_PHOTOS = [
  {
    src: "/images/review/mum.webp",
    alt: "Tori and her mum inside a gilt picture frame",
    className: "rotate-[-3deg]",
  },
  {
    src: "/images/review/run.webp",
    alt: "Tori biting a race medal beside a friend after a run",
    className: "rotate-[2deg] mt-5",
  },
  {
    src: "/images/review/dad.webp",
    alt: "Tori and her dad at dinner, two desserts with candles",
    className: "rotate-[1.5deg] -mt-2",
  },
  {
    src: "/images/review/config.webp",
    alt: "Tori in front of the blue Figma Config sculpture",
    className: "rotate-[-2deg] mt-3",
  },
]

function Bio() {
  return (
    <Slide>
      <Kicker>Background / bio</Kicker>
      <div className="grid items-center gap-10 md:grid-cols-[minmax(0,26rem)_1fr]">
        <div className="grid max-w-md grid-cols-2 gap-3">
          {BIO_PHOTOS.map((photo) => (
            <Reveal key={photo.src} className={photo.className}>
              <Image
                className="aspect-square w-full rounded-lg object-cover inset-ring-1 inset-ring-black/15 dark:inset-ring-white/15"
                src={photo.src}
                alt={photo.alt}
                width={900}
                height={900}
                unoptimized
              />
            </Reveal>
          ))}
        </div>
        <div className="flex flex-col gap-8">
          <Quote attribution="My dad would tell you I am a">
            “question artist”
          </Quote>
          <Quote attribution="My colleagues would say">
            “she goes far beyond simply completing the task”
          </Quote>
          <Quote attribution="I call myself a">curious design engineer</Quote>
        </div>
      </div>
    </Slide>
  )
}

const PILLARS = [
  {
    title: "Creative technologist",
    src: "/images/review/creative-technologist.mp4",
    alt: "Tori building with hardware and code",
  },
  {
    title: "Bonzo",
    src: "/images/review/bonzo-headphones.webp",
    alt: "Bonzo the pug lying on a green sofa wearing headphones, beside a Miffy figure",
  },
  {
    title: "Chronic learner",
    src: "/images/review/chronic-learner.mp4",
    alt: "Tori reading and taking notes",
  },
]

function Pillars() {
  return (
    <Slide className="min-h-full justify-center">
      <Kicker>Background / my pillars of inspiration</Kicker>
      <div className="grid gap-px border-y border-line bg-line md:grid-cols-3">
        {PILLARS.map((pillar) => (
          <Reveal
            key={pillar.src}
            className="flex flex-col gap-3 bg-background p-4"
          >
            {pillar.src.endsWith(".mp4") ? (
              <video
                className="aspect-[4/5] w-full rounded-xl bg-black object-cover inset-ring-1 inset-ring-black/15 dark:inset-ring-white/15"
                src={pillar.src}
                autoPlay
                loop
                muted
                playsInline
                aria-label={pillar.alt}
              />
            ) : (
              <Image
                className="aspect-[4/5] w-full rounded-xl object-cover inset-ring-1 inset-ring-black/15 dark:inset-ring-white/15"
                src={pillar.src}
                alt={pillar.alt}
                width={1200}
                height={1445}
                unoptimized
              />
            )}
            <p className="font-heading text-xl/tight font-medium">
              {pillar.title}
            </p>
          </Reveal>
        ))}
      </div>
    </Slide>
  )
}

function Agenda() {
  return (
    <Slide>
      <Kicker>Background / today</Kicker>
      <Title>Two projects, one argument.</Title>
      <Lede>
        A product project shows how I make a design decision. A design system
        project shows how I make that decision hold across every screen that
        comes after it.
      </Lede>
      <CardGrid>
        <Card label="01 · Product" title="AuthorProof">
          A new integrity product for Proctorio, taken from an assigned brief to
          a shippable MVP. The brief arrived with its architecture already
          chosen. I tested it before engineering spent time on it.
        </Card>
        <Card label="02 · Design system" title="Modern Care Homes">
          A senior living marketplace and the agent platform behind it, both
          running on one component library that I design, build in Storybook,
          and ship.
        </Card>
      </CardGrid>
      <LinkRow>
        <LinkOut href={REVIEW_LINKS.authorProof.caseStudy}>
          AuthorProof case study
        </LinkOut>
        <LinkOut href={REVIEW_LINKS.modernCareHomes.caseStudy}>
          Modern Care Homes case study
        </LinkOut>
      </LinkRow>
    </Slide>
  )
}

export const BACKGROUND_CONTENT: Record<string, ComponentType> = {
  cover: Cover,
  bio: Bio,
  pillars: Pillars,
  today: Agenda,
}
