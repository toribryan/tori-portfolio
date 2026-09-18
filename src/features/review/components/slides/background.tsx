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
    <HairlineGrid columns="minmax(0, 24rem) 1fr" className="items-center">
      <div className="grid grid-cols-2 gap-2 p-2">
        {BIO_PHOTOS.map((photo) => (
          <Frame key={photo.src}>
            <Image
              className="aspect-square w-full rounded-xl object-cover"
              src={photo.src}
              alt={photo.alt}
              width={900}
              height={900}
              unoptimized
            />
          </Frame>
        ))}
      </div>
      <div className="flex flex-col gap-8 px-6 py-4">
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
    <HairlineGrid columns={3}>
      {PILLARS.map((pillar) => (
        <MediaCard
          key={pillar.src}
          title={pillar.title}
          media={
            pillar.src.endsWith(".mp4") ? (
              <video
                className="aspect-[4/5] w-full rounded-xl bg-black object-cover"
                src={pillar.src}
                autoPlay
                loop
                muted
                playsInline
                aria-label={pillar.alt}
              />
            ) : (
              <Image
                className="aspect-[4/5] w-full rounded-xl object-cover"
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
 * The first three slides share this view. The name fades in once and
 * stays; the bio and then the pillars take turns underneath it.
 */
function Intro({ slide }: { slide: SlideType }) {
  const step = slide.slug
  const open = step !== "cover"

  return (
    <Slide className="flex-1 justify-center">
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: EASE, opacity: { duration: 1.2 } }}
        >
          Tori Bryan
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

export const BACKGROUND_CONTENT: Record<
  string,
  ComponentType<{ slide: SlideType }>
> = {
  cover: Intro,
  bio: Intro,
  pillars: Intro,
}
