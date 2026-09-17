"use client"

import type { ComponentType } from "react"
import Image from "next/image"
import { AnimatePresence, motion } from "motion/react"

import { SpecialText } from "@/components/ui/special-text"
import { REVIEW_LINKS } from "@/features/review/data/links"
import type { Slide as SlideType } from "@/features/review/types"

import {
  Card,
  CardGrid,
  EASE,
  Kicker,
  Lede,
  LinkOut,
  LinkRow,
  Quote,
  Slide,
  Title,
} from "../slide-primitives"

const BIO_PHOTOS = [
  {
    src: "/images/review/mum.webp",
    alt: "Tori and her mum inside a gilt picture frame",
  },
  {
    src: "/images/review/run.webp",
    alt: "Tori biting a race medal beside a friend after a run",
  },
  {
    src: "/images/review/dad.webp",
    alt: "Tori and her dad at dinner, two desserts with candles",
  },
  {
    src: "/images/review/config.webp",
    alt: "Tori in front of the blue Figma Config sculpture",
  },
]

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

const swap = {
  initial: { opacity: 0, y: 16, filter: "blur(4px)" },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: EASE },
  },
  exit: {
    opacity: 0,
    y: -12,
    filter: "blur(4px)",
    transition: { duration: 0.22, ease: "easeIn" as const },
  },
}

function Bio() {
  return (
    <div className="grid items-center gap-8 md:grid-cols-[minmax(0,24rem)_1fr]">
      <div className="grid grid-cols-2 gap-2">
        {BIO_PHOTOS.map((photo) => (
          <Image
            key={photo.src}
            className="aspect-square w-full rounded-lg object-cover inset-ring-1 inset-ring-black/15 dark:inset-ring-white/15"
            src={photo.src}
            alt={photo.alt}
            width={900}
            height={900}
            unoptimized
          />
        ))}
      </div>
      <div className="flex flex-col gap-6">
        <Quote attribution="My dad would tell you I am a">
          “question artist”
        </Quote>
        <Quote attribution="My colleagues would say">
          “she goes far beyond simply completing the task”
        </Quote>
        <Quote attribution="I call myself a">curious design engineer</Quote>
      </div>
    </div>
  )
}

function Pillars() {
  return (
    <div className="grid gap-px border-y border-line bg-line md:grid-cols-3">
      {PILLARS.map((pillar) => (
        <div key={pillar.src} className="flex flex-col gap-3 bg-background p-4">
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
        </div>
      ))}
    </div>
  )
}

const STEP_KICKER: Record<string, string> = {
  bio: "Background / bio",
  pillars: "Background / my pillars of inspiration",
}

/**
 * The first three slides share this view. The name scrambles in once and
 * stays; the bio and then the pillars take turns underneath it.
 */
function Intro({ slide }: { slide: SlideType }) {
  const step = slide.slug
  const open = step !== "cover"

  return (
    <Slide className="min-h-full justify-center">
      <motion.div layout className="flex flex-col gap-3">
        <AnimatePresence initial={false}>
          {open && (
            <motion.p
              key="kicker"
              className="font-mono text-xs tracking-wide text-muted-foreground uppercase"
              {...swap}
            >
              {STEP_KICKER[step]}
            </motion.p>
          )}
        </AnimatePresence>
        <motion.h2
          layout="position"
          className={
            open
              ? "font-heading text-3xl/tight font-medium tracking-normal md:text-4xl/tight"
              : "font-heading text-5xl/none font-medium tracking-normal md:text-7xl/none"
          }
          transition={{ duration: 0.5, ease: EASE }}
        >
          <SpecialText delay={0.2} speed={24}>
            Tori Bryan
          </SpecialText>
        </motion.h2>
      </motion.div>

      <AnimatePresence mode="wait" initial={false}>
        {step === "bio" && (
          <motion.div key="bio" {...swap}>
            <Bio />
          </motion.div>
        )}
        {step === "pillars" && (
          <motion.div key="pillars" {...swap}>
            <Pillars />
          </motion.div>
        )}
      </AnimatePresence>
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

export const BACKGROUND_CONTENT: Record<
  string,
  ComponentType<{ slide: SlideType }>
> = {
  cover: Intro,
  bio: Intro,
  pillars: Intro,
  today: Agenda,
}
