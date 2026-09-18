"use client"

import type { ComponentType } from "react"
import Image from "next/image"
import { motion } from "motion/react"

import { TextReveal } from "@/components/ui/text-reveal"
import { AuthorProofRadar } from "@/features/review/components/author-proof-radar"
import { PinnedFlow } from "@/features/review/components/pinned-flow"
import { ProctorioLogo } from "@/features/review/components/proctorio-logo"
import type { SuiteItem } from "@/features/review/components/suite-reel"
import { SuiteReel } from "@/features/review/components/suite-reel"
import { REVIEW_LINKS } from "@/features/review/data/links"
import type { Slide as SlideType } from "@/features/review/types"

import {
  Card,
  EASE,
  Flow,
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

const SUITES: SuiteItem[] = [
  {
    name: "Integrity",
    line: "Proctor an exam securely",
    src: "/images/review/suite-integrity.webm",
  },
  {
    name: "Vault",
    line: "Protect your exam",
    src: "/images/review/suite-vault.webm",
  },
  {
    name: "Origin",
    line: "Prove the work is theirs",
    src: "/images/review/suite-origin.webm",
    featured: true,
  },
]

function Suite() {
  return (
    <Slide>
      <Kicker>01 · Product / where it sits</Kicker>
      <Title>Three product suites, one design system.</Title>
      <Lede>
        At Proctorio I led cross-product design across three suites for
        institutions and proctoring agencies, and led the implementation of a
        refactored design system underneath all of them. The product I chose to
        walk through today comes from the Origin suite: AuthorProof.
      </Lede>
      <Reveal>
        <SuiteReel items={SUITES} />
      </Reveal>
    </Slide>
  )
}

function Cover() {
  return (
    <Slide>
      <Kicker>01 · Product</Kicker>
      <Reveal>
        <ProctorioLogo className="h-7 w-auto text-foreground" />
      </Reveal>
      <Title size="xl">AuthorProof</Title>
      <HairlineGrid>
        <Stack className="justify-center px-6 py-4">
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
        <Reveal className="p-2">
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
      </HairlineGrid>
    </Slide>
  )
}

function Task() {
  return (
    <Slide>
      <Kicker>AuthorProof / task</Kicker>
      <Title>Prove the work is theirs.</Title>
      <Lede>
        A new product in the Origin suite: verify authorship of written work,
        inside the instructor’s existing Canvas workflow.
      </Lede>
      <HairlineGrid columns="1fr 1.4fr">
        <Reveal className="flex flex-col justify-center gap-3 px-6 py-4">
          <p className="font-mono text-xs tracking-wide text-muted-foreground uppercase">
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
            <p className="font-mono text-sm text-muted-foreground">thesis:</p>
          </Reveal>
          <h2 className="font-heading text-4xl/tight font-medium tracking-normal text-balance md:text-5xl/tight">
            <TextReveal
              text={THESIS}
              startOnView={false}
              delay={THESIS_DELAY}
              stagger={0.09}
              maxDuration={THESIS_DURATION}
            />
          </h2>
          <motion.p
            className="font-serif text-3xl text-muted-foreground italic md:text-4xl"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: settled, ease: EASE }}
          >
            right?
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

const BRIEFED_FLOW = [
  { title: "Student submits the completed written assignment" },
  { title: "Assignment content is extracted to generate questions" },
  { title: "AuthorProof uses the Canvas Quiz API to create and assign a quiz" },
  { title: "Student is notified via Canvas inbox and AuthorProof email" },
  { title: "Student navigates to the quiz and completes it" },
  {
    title: "AuthorProof generates a report card of results and answer analysis",
  },
]

function Brief() {
  return (
    <Slide className="flex-1">
      <Kicker>AuthorProof / the brief as it arrived</Kicker>
      <Title>The architecture was already chosen.</Title>
      <Reveal className="flex min-h-0 flex-1 flex-col">
        <PinnedFlow className="md:flex-1" steps={BRIEFED_FLOW} />
      </Reveal>
    </Slide>
  )
}

function Latency() {
  return (
    <Slide>
      <Kicker>AuthorProof / what it added up to</Kicker>
      <Title>Six steps. About ten minutes. One quiz per student.</Title>
      <Lede>
        Timed against what the platform could actually do, the briefed flow
        handed the student exactly the gap they would need to reopen the essay.
      </Lede>
      <StatRow>
        <Stat value="6" label="Steps between submission and quiz" />
        <Stat value="~10 min" label="Latency the steps add up to" />
        <Stat
          value="Per student"
          label="A fresh quiz each, in tooling built for one per class"
        />
      </StatRow>
    </Slide>
  )
}

function Constraints() {
  return (
    <Slide>
      <Kicker>AuthorProof / four constraints</Kicker>
      <Title>Four constraints, each a design problem in disguise.</Title>
      <HairlineGrid>
        <Card
          label="01 · Timing"
          title="Ten minutes is the whole attack window"
        >
          Fetch, generate, create, assign, notify. The gap is exactly the time a
          student needs to pull the essay back up, so the architecture worked
          against the one thing the product had to prove.
        </Card>
        <Card label="02 · Tooling" title="Quiz tooling is one-to-many">
          A quiz is authored once and assigned to a class. A fresh quiz per
          submission fights that at every step and gets fragile when a whole
          class submits at once.
        </Card>
        <Card label="03 · Notifications" title="Students turn them off">
          Inboxes go unchecked and email timing varies by institution. The
          fallback would have been “instructors remind students”, which lands
          the burden on the person we were trying to help.
        </Card>
        <Card label="04 · Grading" title="Two disconnected things to grade">
          A separate quiz item means the submission and the quiz live in
          different places, with no unified view for the instructor.
        </Card>
      </HairlineGrid>
    </Slide>
  )
}

function Pivot() {
  return (
    <Slide>
      <Kicker>AuthorProof / the pivot</Kicker>
      <Title>A smaller flow that kept the promise.</Title>
      <Stack className="gap-3">
        <Reveal>
          <p className="font-mono text-xs tracking-wide text-muted-foreground uppercase">
            As briefed
          </p>
        </Reveal>
        <Flow
          tone="fade"
          stages={[
            { label: "Submit" },
            { label: "Generate" },
            { label: "Create quiz" },
            { label: "Assign" },
            { label: "Notify" },
            { label: "Student finds it", detail: "~10 min later" },
          ]}
        />
        <Reveal>
          <p className="mt-3 font-mono text-xs tracking-wide text-muted-foreground uppercase">
            As pitched
          </p>
        </Reveal>
        <Flow
          stages={[
            { label: "Start the assignment" },
            { label: "Upload the essay" },
            { label: "Quiz appears", detail: "seconds later" },
            { label: "Result beside the submission" },
          ]}
        />
      </Stack>
      <HairlineGrid>
        <Card label="What the pivot bought">
          Collapsed the timing gap, removed the notification dependency, and
          stepped out of the quiz tooling entirely. One thing for the instructor
          to read.
        </Card>
        <Card label="What it cost, said out loud">
          Short pieces written directly in the LMS editor were excluded, and how
          proctoring coexists with the embedded flow stayed open. I flagged the
          hole rather than let engineering find it.
        </Card>
      </HairlineGrid>
    </Slide>
  )
}

function Model() {
  return (
    <Slide>
      <Kicker>AuthorProof / model</Kicker>
      <Title>Instructor sets it up. Questions come from the essay.</Title>
      <HairlineGrid>
        <Shot
          src="/case-studies/author-proof-proctorio-quiz-settings.webp"
          alt="AuthorProof quiz settings inside the assignment editor: proctoring level, completion window, and an Engage AuthorProof button"
          width={1080}
          height={1080}
          fit="viewport"
          label="Quiz settings, inside the assignment editor"
        />
        <Shot
          src="/case-studies/author-proof-proctorio-generated-questions.webp"
          alt="A student's essay beside four comprehension questions generated from it"
          width={1080}
          height={1080}
          fit="viewport"
          label="The student’s quiz, generated from their own writing"
        />
      </HairlineGrid>
      <Reveal>
        <p className="text-xs text-muted-foreground">
          Product imagery © Proctorio, from the AuthorProof product page. Used
          with credit.
        </p>
      </Reveal>
    </Slide>
  )
}

function Principles() {
  return (
    <Slide>
      <Kicker>AuthorProof / principles</Kicker>
      <Title>Confidence, not verdict.</Title>
      <Lede>
        The result had to read as evidence for a human conversation, never as an
        automated judgment. Three rules followed.
      </Lede>
      <Steps
        items={[
          {
            title: "No binary pass or fail.",
            body: "A score ships with a confidence level. The instructor decides what to do with it.",
          },
          {
            title: "Transparency into what was evaluated.",
            body: "Every generated question sits beside the student's own words that prompted it, and beside the assessment of the answer, so a score traces back to something a person can read.",
          },
          {
            title: "Never colour alone.",
            body: "The host platform controls the badge colour and maps it the opposite way from the score. Score, label and confidence are always carried as text.",
          },
        ]}
      />
    </Slide>
  )
}

function Shipped() {
  return (
    <Slide>
      <Kicker>AuthorProof / shipped</Kicker>
      <Title>The prototype was the spec.</Title>
      <Lede>
        Concept to production-ready MVP in four to six weeks. Engineering got
        working prototypes in HTML, CSS and vanilla JS rather than a document
        about them: the settings panel, the student quiz flow, and the results
        pathway from badge to session detail.
      </Lede>
      <StatRow>
        <Stat
          value="Seconds"
          label="From submission to quiz, instead of about ten minutes"
        />
        <Stat
          value="One view"
          label="The score lands beside the submission being graded"
        />
        <Stat value="4 to 6 wks" label="Concept to production-ready MVP" />
        <Stat
          value="0"
          label="Steps added to the instructor's grading workflow"
        />
      </StatRow>
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
  ComponentType<{ slide: SlideType }>
> = {
  suite: Suite,
  cover: Cover,
  task: Task,
  thesis: Thesis,
  brief: Brief,
  latency: Latency,
  constraints: Constraints,
  pivot: Pivot,
  model: Model,
  principles: Principles,
  shipped: Shipped,
}
