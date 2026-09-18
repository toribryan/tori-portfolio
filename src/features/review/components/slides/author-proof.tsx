"use client"

import type { ComponentType } from "react"
import Image from "next/image"
import { motion } from "motion/react"

import { TextReveal } from "@/components/ui/text-reveal"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/base/ui/tabs"
import { AuthorProofRadar } from "@/features/review/components/author-proof-radar"
import { PinnedFlow } from "@/features/review/components/pinned-flow"
import { ProctorioLogo } from "@/features/review/components/proctorio-logo"
import { SuiteReel } from "@/features/review/components/suite-reel"
import {
  BRIEFED_JOURNEYS,
  BRIEFED_STEPS,
  CONSTRAINT_STATS,
  PITCHED_STEPS,
  SUITES,
} from "@/features/review/data/author-proof"
import { REVIEW_LINKS } from "@/features/review/data/links"
import type { SlideData, Slide as SlideType } from "@/features/review/types"

import {
  Card,
  EASE,
  Frame,
  HairlineGrid,
  Kicker,
  Lede,
  LinkOut,
  LinkRow,
  Reveal,
  Shot,
  Slide,
  Stack,
  Stat,
  StatRow,
  Steps,
  Title,
} from "../slide-primitives"

function Suite() {
  return (
    <Slide>
      <Kicker>01 · Product / where it sits</Kicker>
      <Title>Defining product design language through one design system.</Title>
      <Lede>
        At Proctorio I led cross-product design across three suites, for
        institutions and for proctoring agencies, and led the implementation of
        the refactored design system underneath all three. The product I chose
        to walk through today comes from the Origin suite: AuthorProof.
      </Lede>
      <Reveal>
        <SuiteReel items={SUITES} />
      </Reveal>
    </Slide>
  )
}

function Cover() {
  return (
    <Slide className="flex-1 justify-center">
      <div className="grid items-center gap-8 md:grid-cols-[3fr_2fr]">
        <Stack>
          <Kicker>01 · Product</Kicker>
          <Reveal>
            <ProctorioLogo className="h-7 w-auto text-foreground" />
          </Reveal>
          <Title size="xl">AuthorProof</Title>
          <Lede>
            Plagiarism checkers read the document. This one asks the student
            about the paper they turned in.
          </Lede>
          <LinkRow>
            <LinkOut href={REVIEW_LINKS.authorProof.product}>
              Product page
            </LinkOut>
            <LinkOut href={REVIEW_LINKS.authorProof.caseStudy}>
              Full case study
            </LinkOut>
          </LinkRow>
        </Stack>
        <Reveal>
          <Frame>
            <video
              className="aspect-square w-full rounded-xl bg-surface object-cover"
              src="/images/review/authorproof-cover.webm"
              autoPlay
              loop
              muted
              playsInline
              aria-label="AuthorProof in motion"
            />
          </Frame>
        </Reveal>
      </div>
    </Slide>
  )
}

function Task() {
  return (
    <Slide>
      <Kicker>AuthorProof / task</Kicker>
      <Stack className="gap-2">
        <Title>
          The task that landed on my desk: prove the work is theirs.
        </Title>
        <Lede>
          A new product in the Origin suite: verify authorship of written work,
          inside the instructor’s existing Canvas workflow.
        </Lede>
      </Stack>
      <HairlineGrid columns="1fr 1.4fr">
        <Reveal className="flex flex-col justify-center gap-2 px-6 py-4">
          <p className="text-xs tracking-wide text-muted-foreground uppercase">
            The gap
          </p>
          <p className="font-heading text-2xl/tight font-medium text-balance md:text-3xl/tight">
            Every existing tool answers “is this original?”
          </p>
          <p className="text-base/relaxed text-pretty text-muted-foreground md:text-lg/relaxed">
            None of them answer the question instructors actually have: did you
            write this?
          </p>
        </Reveal>
        <Reveal className="p-2">
          <AuthorProofRadar className="aspect-[4/3] w-full" />
        </Reveal>
      </HairlineGrid>
      <Steps
        items={[
          {
            title: "No binary pass or fail.",
            body: "A score ships with a confidence level. The instructor decides what to do with it.",
          },
          {
            title: "Transparency into what was evaluated.",
            body: "Every generated question sits beside the student’s own words that prompted it and beside the assessment of the answer, so a score traces back to something a person can read.",
          },
        ]}
      />
    </Slide>
  )
}

const THESIS =
  "If a student submits an essay, they should be able to answer questions about what they wrote."

/** When the thesis starts arriving, and how long the words take to land. */
const THESIS_DELAY = 0.6
const THESIS_DURATION = 2.4

function Thesis() {
  const settled = THESIS_DELAY + THESIS_DURATION + 0.4

  return (
    <Slide className="flex-1 justify-center gap-6">
      <Kicker>AuthorProof / statement</Kicker>
      <HairlineGrid columns="3fr 2fr">
        <div className="flex flex-col justify-center gap-6 px-6 py-4">
          <Reveal>
            <p className="text-sm text-muted-foreground">thesis:</p>
          </Reveal>
          <h2 className="font-heading text-3xl/tight font-medium tracking-normal text-balance md:text-4xl/tight">
            <TextReveal
              text={THESIS}
              startOnView={false}
              delay={THESIS_DELAY}
              stagger={0.09}
              maxDuration={THESIS_DURATION}
            />
          </h2>
          <motion.p
            className="font-heading text-3xl text-muted-foreground md:text-4xl"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: settled, ease: EASE }}
          >
            …right?
          </motion.p>
        </div>
        <motion.div
          className="flex items-center justify-center p-6"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: settled + 0.2, ease: EASE }}
        >
          <Image
            className="w-full max-w-72"
            src="/images/review/thesis-visual.svg"
            alt="A pixel-art pug with a lit bulb over its head, beside a small crab"
            width={400}
            height={329}
            unoptimized
          />
        </motion.div>
      </HairlineGrid>
    </Slide>
  )
}

function Brief() {
  return (
    <Slide>
      <Kicker>AuthorProof / the brief as it arrived</Kicker>
      <Title>The architecture I was handed for the first concept.</Title>
      <Stack className="gap-3">
        {BRIEFED_JOURNEYS.map((journey) => (
          <Reveal key={journey.label}>
            <PinnedFlow label={journey.label} steps={journey.steps} />
          </Reveal>
        ))}
      </Stack>
    </Slide>
  )
}

function Constraints() {
  return (
    <Slide>
      <Kicker>AuthorProof / four constraints</Kicker>
      <Title>Sounded great, but I identified a few problems…</Title>
      <HairlineGrid>
        <Card label="01 · Tooling" title="Quiz tooling is one-to-many">
          A quiz is authored once and assigned to a class. A fresh quiz per
          submission fights that at every step and gets fragile when a whole
          class submits at once.
        </Card>
        <Card
          label="02 · Timing"
          title="Ten minutes is the whole attack window"
        >
          Fetch, generate, create, assign, notify. The gap is exactly the time a
          student needs to pull the essay back up, so the architecture worked
          against the one thing the product had to prove.
        </Card>
        <Card label="03 · Notifications" title="Students turn them off">
          Inboxes go unchecked, and email timing varies by institution. The
          fallback would have been “instructors remind students,” which lands
          the burden on the person we were trying to help.
        </Card>
        <Card label="04 · Grading" title="Two disconnected things to grade">
          A separate quiz item means the submission and the quiz live in
          different places, with no unified view for the instructor.
        </Card>
      </HairlineGrid>
      <StatRow>
        {CONSTRAINT_STATS.map((stat) => (
          <Stat key={stat.value} value={stat.value} label={stat.label} />
        ))}
      </StatRow>
    </Slide>
  )
}

function Pivot() {
  return (
    <Slide>
      <Kicker>AuthorProof / the pivot</Kicker>
      <Title>
        A revised solution: a smaller, tighter flow that kept the promise.
      </Title>
      <Reveal>
        <Tabs defaultValue="pitched">
          <TabsList>
            <TabsTrigger value="briefed">As briefed</TabsTrigger>
            <TabsTrigger value="pitched">As pitched</TabsTrigger>
          </TabsList>
          <TabsContent value="briefed">
            <PinnedFlow steps={BRIEFED_STEPS} />
          </TabsContent>
          <TabsContent value="pitched">
            <PinnedFlow steps={PITCHED_STEPS} />
          </TabsContent>
        </Tabs>
      </Reveal>
      <HairlineGrid>
        <Shot
          src="/images/review/pivot-config-before.png"
          alt="Quiz configuration as briefed: a Plagiarism Detection dropdown set to AuthorProof, with quiz type, number of questions, time limit, and proctored environment stacked underneath in the assignment form"
          width={1336}
          height={798}
          label="As briefed: settings inline in the assignment form"
        />
        <Shot
          src="/images/review/pivot-config-after.png"
          alt="Proposed quiz configuration: an AuthorProof dialog with basic controls, each explained, and advanced toggles for multiple attempts and written answers"
          width={1336}
          height={798}
          label="Proposed: one AuthorProof dialog, each control explained"
        />
        <Shot
          src="/images/review/pivot-notify-before.png"
          alt="An email in the student’s inbox: Your comprehension quiz is ready, with a deadline and an Open Quiz in Canvas button"
          width={1334}
          height={750}
          label="As briefed: the student is told by email, later"
        />
        <Shot
          src="/images/review/pivot-notify-after.png"
          alt="The assignment page in Canvas with an Upload Documents panel embedded directly under the brief"
          width={1252}
          height={751}
          label="Proposed: the quiz appears inside the assignment, immediately"
        />
      </HairlineGrid>
      <HairlineGrid>
        <Card label="What the pivot bought">
          It collapsed the timing gap, removed the notification dependency, and
          stepped out of the quiz tooling entirely, which left the instructor
          one thing to read.
        </Card>
        <Card label="What it cost, said out loud">
          Short pieces written directly in the LMS editor were excluded, and how
          proctoring coexists with the embedded flow stayed an open question. I
          flagged the hole rather than let engineering find it.
        </Card>
      </HairlineGrid>
    </Slide>
  )
}

function Shipped() {
  return (
    <Slide>
      <Kicker>AuthorProof / shipped</Kicker>
      <div className="grid items-center gap-8 md:grid-cols-[3fr_2fr]">
        <Stack>
          <Title>The prototype was the spec.</Title>
          <Lede>
            Concept to production-ready MVP in four to six weeks. I designed the
            settings model for quiz configuration and built its interface,
            designed the report card, the quiz results, and the emails students
            receive, and built the front end for all of it in HTML, CSS, and
            vanilla JavaScript on our design system. Engineering got working
            prototypes rather than a document about them.
          </Lede>
        </Stack>
        <Reveal>
          <Frame>
            <video
              className="aspect-square w-full rounded-xl bg-surface object-cover"
              src="/images/review/authorproof-shipped.webm"
              autoPlay
              loop
              muted
              playsInline
              aria-label="AuthorProof, as shipped"
            />
          </Frame>
        </Reveal>
      </div>
      <HairlineGrid>
        <Card label="Proof of concept" title="The briefed idea shipped first">
          The Canvas quiz architecture from the brief became the proof of
          concept: the fastest way to put a working product in front of pilot
          instructors.
        </Card>
        <Card label="Long-term vision" title="The pivot became the roadmap">
          The embedded flow I proposed was adopted as the official long-term
          vision for the product, with the quiz appearing inside the assignment
          seconds after upload.
        </Card>
      </HairlineGrid>
      <Shot
        src="/images/review/authorproof-artifacts.webp"
        alt="Two AuthorProof screens side by side: the instructor’s report card, with an overview of the student’s score, confidence level, and time used beside a question-by-question breakdown of answers and assessments, and the student’s email saying their comprehension quiz is ready, with its deadline and course"
        width={1600}
        height={871}
        label="The report card instructors read, and the email students receive"
        className="p-0"
      />
      <StatRow>
        <Stat
          value="95%"
          label="Quiz completion rate among pilot test takers"
        />
        <Stat value="<5%" label="False-positive rate in the pilot" />
        <Stat
          value="0"
          label="Steps added to the instructor’s grading workflow"
        />
        <Stat value="4 to 6 wks" label="Concept to production-ready MVP" />
      </StatRow>
      <Reveal>
        <p className="max-w-2xl font-heading text-xl/tight font-medium text-balance md:text-2xl/tight">
          Sweeping positive feedback from customers on the new product concept.
        </p>
      </Reveal>
      <LinkRow>
        <LinkOut href={REVIEW_LINKS.authorProof.product} variant="default">
          Product page
        </LinkOut>
        <LinkOut href={REVIEW_LINKS.authorProof.caseStudy}>
          Full case study
        </LinkOut>
      </LinkRow>
    </Slide>
  )
}

export const AUTHOR_PROOF_CONTENT: Record<
  string,
  ComponentType<{ slide: SlideType; data: SlideData }>
> = {
  suite: Suite,
  cover: Cover,
  task: Task,
  thesis: Thesis,
  brief: Brief,
  constraints: Constraints,
  pivot: Pivot,
  shipped: Shipped,
}
