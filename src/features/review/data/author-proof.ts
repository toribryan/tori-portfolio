import type { SuiteItem } from "@/features/review/components/suite-reel"

/** The three Proctorio suites, with the one this project sits in featured. */
export const SUITES: SuiteItem[] = [
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

/** What the briefed architecture added up to, before any of it was built. */
export const CONSTRAINT_STATS = [
  { value: "6", label: "Steps between submission and quiz" },
  { value: "~10 min", label: "Latency those steps add up to" },
  {
    value: "Per student",
    label: "A fresh quiz each, in tooling built for one per class",
  },
]

/** The three journeys the first concept was built on, as they were handed over. */
export const BRIEFED_JOURNEYS = [
  {
    label: "01 · Instructor configures",
    steps: [
      { title: "Opens the assignment in the assignment editor" },
      { title: "Enables AuthorProof and configures the quiz" },
      { title: "Publishes the assignment" },
    ],
  },
  {
    label: "02 · Student submits and answers",
    steps: [
      { title: "Navigates to the assignment" },
      { title: "Submits the completed written assignment" },
      {
        title:
          "AuthorProof generates questions from the submission and the instructor’s quiz settings",
      },
      { title: "Takes a quiz on their own writing" },
    ],
  },
  {
    label: "03 · Instructor grades",
    steps: [
      { title: "Continues the usual grading workflow inside the LMS" },
      { title: "Opens SpeedGrader" },
      {
        title:
          "Reviews the AuthorProof result, the plagiarism check, and the original submission in one place",
      },
    ],
  },
]

/** The student's path as it was briefed, and as it was pitched instead. */
export const BRIEFED_STEPS = [
  { title: "Student submits the assignment" },
  { title: "Content is extracted to generate questions" },
  { title: "A quiz is created and assigned through the Canvas Quiz API" },
  { title: "Student is notified by Canvas inbox and email" },
  { title: "Student finds the quiz, about ten minutes later" },
  { title: "AuthorProof generates a report card of the results" },
]

export const PITCHED_STEPS = [
  { title: "Student starts the assignment" },
  { title: "Uploads the essay into the AuthorProof LTI" },
  { title: "The quiz appears, seconds later" },
  { title: "The assignment shows as completed once the quiz is done" },
]
