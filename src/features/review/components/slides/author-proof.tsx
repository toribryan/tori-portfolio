"use client"

import type { ComponentType } from "react"
import { useState } from "react"
import { motion } from "motion/react"

import { cn } from "@/lib/utils"
import { Typewriter } from "@/components/ui/typewriter-text"
import { AuthorProofRadar } from "@/features/review/components/author-proof-radar"
import { PinnedFlow } from "@/features/review/components/pinned-flow"
import { ProctorioLogo } from "@/features/review/components/proctorio-logo"
import type { SuiteItem } from "@/features/review/components/suite-reel"
import { SuiteReel } from "@/features/review/components/suite-reel"
import { REVIEW_LINKS } from "@/features/review/data/links"
import type { Slide as SlideType } from "@/features/review/types"

import {
  Card,
  CardGrid,
  EASE,
  Flow,
  Kicker,
  Lede,
  LinkOut,
  LinkRow,
  Reveal,
  Shot,
  Slide,
  Split,
  Stack,
  Stat,
  StatRow,
  Steps,
  Tags,
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
      <Split className="items-start">
        <Stack>
          <Lede>
            Plagiarism checkers read the document. This one asks the student
            about the paper they turned in.
          </Lede>
          <Tags
            items={[
              "Proctorio",
              "Staff Product Designer, end to end",
              "Q2 2026",
              "Canvas LMS",
            ]}
          />
          <LinkRow>
            <LinkOut href={REVIEW_LINKS.authorProof.product}>
              Product page
            </LinkOut>
            <LinkOut href={REVIEW_LINKS.authorProof.caseStudy}>
              Full case study
            </LinkOut>
          </LinkRow>
        </Stack>
        <Shot
          src="/cover-authorproof.webp"
          alt="AuthorProof cover"
          width={2400}
          height={1260}
          priority
        />
      </Split>
    </Slide>
  )
}

const SUITE = [
  {
    name: "Origin",
    line: "Prove the work is theirs",
    mine: true,
  },
  {
    name: "Integrity",
    line: "Proctor an exam securely",
    mine: false,
  },
  {
    name: "Vault",
    line: "Protect your exam",
    mine: false,
  },
]

function Task() {
  return (
    <Slide>
      <Kicker>AuthorProof / task</Kicker>
      <Title>Three products protecting the integrity of online learning.</Title>
      <Split className="items-center">
        <Reveal>
          <AuthorProofRadar className="w-full text-foreground" />
        </Reveal>
        <Reveal className="flex flex-col gap-3">
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
      </Split>
      <Reveal>
        <ul className="grid gap-px border-y border-line bg-line sm:grid-cols-3">
          {SUITE.map((product) => (
            <li
              key={product.name}
              className="flex flex-col gap-2 bg-background p-4"
            >
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "size-3 shrink-0 rounded-sm border",
                    product.mine
                      ? "border-foreground bg-success/25"
                      : "border-dashed border-muted-foreground bg-surface-warm"
                  )}
                  aria-hidden
                />
                <p className="font-mono text-xs tracking-wide text-muted-foreground uppercase">
                  {product.name}
                </p>
                {product.mine && (
                  <span className="rounded-md bg-success/15 px-1.5 py-px font-mono text-[0.65rem] tracking-wide text-foreground uppercase">
                    My task
                  </span>
                )}
              </div>
              <p className="font-heading text-lg/tight font-medium md:text-xl/tight">
                {product.line}
              </p>
            </li>
          ))}
        </ul>
      </Reveal>
    </Slide>
  )
}

const THESIS =
  "If a student submits an essay, they should be able to answer questions about what they wrote."

function Thesis() {
  const [typed, setTyped] = useState(false)

  return (
    <Slide className="gap-6">
      <Kicker>AuthorProof / statement</Kicker>
      <Reveal>
        <p className="font-mono text-sm text-muted-foreground">thesis:</p>
      </Reveal>
      <Reveal>
        <h2 className="font-heading text-4xl/tight font-medium tracking-normal text-balance md:text-5xl/tight">
          <Typewriter
            text={THESIS}
            speed={38}
            delay={0.6}
            onComplete={() => setTyped(true)}
          />
        </h2>
      </Reveal>
      <motion.p
        className="font-serif text-3xl text-muted-foreground italic md:text-4xl"
        initial={{ opacity: 0, y: 8 }}
        animate={typed ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
        transition={{ duration: 0.5, delay: 0.5, ease: EASE }}
      >
        right?
      </motion.p>
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
    <Slide>
      <Kicker>AuthorProof / the brief as it arrived</Kicker>
      <Title>The architecture was already chosen.</Title>
      <Reveal>
        <PinnedFlow steps={BRIEFED_FLOW} />
      </Reveal>
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
      <CardGrid>
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
      </CardGrid>
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
      <CardGrid>
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
      </CardGrid>
    </Slide>
  )
}

function Model() {
  return (
    <Slide>
      <Kicker>AuthorProof / model</Kicker>
      <Title>Instructor sets it up. Questions come from the essay.</Title>
      <Split>
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
      </Split>
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
  constraints: Constraints,
  pivot: Pivot,
  model: Model,
  principles: Principles,
  shipped: Shipped,
}
