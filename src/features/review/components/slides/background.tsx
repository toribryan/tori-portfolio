"use client"

import type { ComponentType } from "react"
import Image from "next/image"
import { AnimatePresence, motion } from "motion/react"

import { Testimonial } from "@/components/ui/testimonial"
import type { Slide as SlideType } from "@/features/review/types"

import {
  EASE,
  Frame,
  HairlineGrid,
  MediaCard,
  Slide,
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

const QUOTES = [
  { quote: "question artist", author: "My dad would tell you I am a" },
  {
    quote: "she goes far beyond simply completing the task",
    author: "My colleagues would say",
  },
  { quote: "curious design engineer", author: "I call myself a" },
]

/**
 * How the step underneath the name comes and goes. Named variants rather
 * than plain targets so the `Reveal` cards inside hear "show" and stagger in.
 */
const swap = {
  variants: {
    hidden: { opacity: 0, y: 16, filter: "blur(4px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.5, ease: EASE, staggerChildren: 0.05 },
    },
    exit: {
      opacity: 0,
      y: -12,
      filter: "blur(4px)",
      transition: { duration: 0.22, ease: "easeIn" as const },
    },
  },
  initial: "hidden",
  animate: "show",
  exit: "exit",
}

function Bio() {
  return (
    <HairlineGrid columns="4fr 5fr" className="flex-1">
      {/* Photos start on the title's line and grow to the stage's floor,
          cropping as they go; the quotes span the photos' height so the
          first sits on their top edge and the last on their bottom. */}
      <div className="grid grid-cols-2 grid-rows-2 gap-2 py-2 pr-2 md:pl-6">
        {BIO_PHOTOS.map((photo) => (
          <Frame key={photo.src} className="min-h-0">
            <Image
              className="size-full min-h-48 rounded-xl object-cover"
              src={photo.src}
              alt={photo.alt}
              width={900}
              height={900}
              unoptimized
            />
          </Frame>
        ))}
      </div>
      <div className="flex flex-col justify-between gap-8 px-6 py-2">
        {QUOTES.map((item) => (
          <Testimonial
            key={item.quote}
            quote={item.quote}
            authorName={item.author}
            lead
          />
        ))}
      </div>
    </HairlineGrid>
  )
}

function Pillars() {
  return (
    <HairlineGrid columns={3} className="flex-1">
      {PILLARS.map((pillar) => (
        <MediaCard
          key={pillar.src}
          title={pillar.title}
          media={
            pillar.src.endsWith(".mp4") ? (
              <video
                className="size-full min-h-64 rounded-xl bg-black object-cover"
                src={pillar.src}
                autoPlay
                loop
                muted
                playsInline
                aria-label={pillar.alt}
              />
            ) : (
              <Image
                className="size-full min-h-64 rounded-xl object-cover"
                src={pillar.src}
                alt={pillar.alt}
                width={1200}
                height={1445}
                unoptimized
              />
            )
          }
        />
      ))}
    </HairlineGrid>
  )
}

const STEP_KICKER: Record<string, string> = {
  bio: "Background / bio",
  pillars: "Background / my pillars of inspiration",
}

/**
 * The bio and the pillars share this view: the name stays put while the
 * step underneath it swaps, and the kicker flips to name the step.
 */
function Intro({ slide }: { slide: SlideType }) {
  const step = slide.slug

  return (
    <Slide className="flex-1">
      <div className="flex flex-col gap-3">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={step}
            className="text-xs tracking-wide text-muted-foreground uppercase"
            {...swap}
          >
            {STEP_KICKER[step]}
          </motion.p>
        </AnimatePresence>
        <h2 className="font-heading text-3xl/tight font-medium tracking-normal md:text-4xl/tight">
          Tori Bryan
        </h2>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {step === "bio" && (
          <motion.div
            key="bio"
            className="flex min-h-0 flex-1 flex-col"
            {...swap}
          >
            <Bio />
          </motion.div>
        )}
        {step === "pillars" && (
          <motion.div
            key="pillars"
            className="flex min-h-0 flex-1 flex-col"
            {...swap}
          >
            <Pillars />
          </motion.div>
        )}
      </AnimatePresence>
    </Slide>
  )
}

export const BACKGROUND_CONTENT: Record<
  string,
  ComponentType<{ slide: SlideType }>
> = {
  bio: Intro,
  pillars: Intro,
}
