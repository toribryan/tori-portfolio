"use client"

import type { ComponentType } from "react"

import { REVIEW_LINKS } from "@/features/review/data/links"

import {
  Card,
  CardGrid,
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

function Cover() {
  return (
    <Slide>
      <Split ratio="copy">
        <Stack>
          <Kicker>01 · Product</Kicker>
          <Title size="xl">AuthorProof</Title>
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

const INTEGRITY_VECTORS = [
  "Prevent content theft",
  "Block AI assistance",
  "Track leaked content",
  "Prevent impersonation",
  "Detect AI use",
  "Monitor behaviour",
]

function Task() {
  return (
    <Slide>
      <Kicker>AuthorProof / task</Kicker>
      <Title>Three products protecting the integrity of online learning.</Title>
      <Split ratio="copy">
        <CardGrid className="sm:grid-cols-1">
          <Card
            label="Origin · my task"
            title="Prove the work is theirs"
            emphasis
          >
            A new product. Verify authorship of written work, inside the
            instructor’s existing Canvas workflow.
          </Card>
          <Card label="Integrity" title="Proctor an exam securely" />
          <Card label="Vault" title="Protect your exam" />
        </CardGrid>
        <Stack>
          <Reveal>
            <p className="font-mono text-xs tracking-wide text-muted-foreground uppercase">
              What the suite has to cover
            </p>
          </Reveal>
          <ul className="grid grid-cols-2 gap-x-6 divide-y divide-line border-y border-line">
            {INTEGRITY_VECTORS.map((vector) => (
              <Reveal key={vector}>
                <li className="py-3 text-sm md:text-base">{vector}</li>
              </Reveal>
            ))}
          </ul>
          <Lede className="text-base md:text-lg">
            Every existing tool answers “is this original?”. None of them answer
            the question instructors actually have.
          </Lede>
        </Stack>
      </Split>
    </Slide>
  )
}

function Thesis() {
  return (
    <Slide className="gap-6">
      <Kicker>AuthorProof / statement</Kicker>
      <Reveal>
        <p className="font-mono text-sm text-muted-foreground">thesis:</p>
      </Reveal>
      <Title size="xl">
        If a student submits an essay, they should be able to answer questions
        about what they wrote.
      </Title>
      <Reveal>
        <p className="font-serif text-3xl text-muted-foreground italic md:text-4xl">
          right?
        </p>
      </Reveal>
    </Slide>
  )
}

function Brief() {
  return (
    <Slide>
      <Kicker>AuthorProof / the brief as it arrived</Kicker>
      <Title>The architecture was already chosen.</Title>
      <Lede>
        Submit through the LMS as normal, generate questions, create a quiz in
        the LMS’s own quiz tooling, assign it to that one student, notify them.
        Before engineering committed time, I mapped every step against what the
        platform could do.
      </Lede>
      <Shot
        src="/case-studies/author-proof-flow.webp"
        alt="The six-step flow as briefed: submit, extract, create and assign a Canvas quiz, notify, student completes, report card"
        width={1468}
        height={186}
        imageClassName="bg-[#f7f6f2] p-2 dark:bg-[#f7f6f2]"
      />
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

export const AUTHOR_PROOF_CONTENT: Record<string, ComponentType> = {
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
