import type { Section, Slide } from "@/features/review/types"
import { slidePath } from "@/features/review/types"

export const REVIEW_BASE_PATH = "/review"

export const SECTIONS: Section[] = [
  { slug: "background", title: "Background" },
  { slug: "product", title: "Product" },
  { slug: "design-system", title: "Design System" },
  { slug: "observations", title: "Observations" },
]

/**
 * Every slide in presentation order, sections in the order of `SECTIONS`.
 * Only data lives here so the route can read it on the server; the slide
 * bodies are client components, looked up by path in `components/slides`.
 */
export const SLIDES: Slide[] = [
  {
    slug: "bio",
    section: "background",
    stage: "background-intro",
    title: "bio",
    notes: [
      "Three descriptions of me: my dad’s, my colleagues’, and my own. The one to keep is “question artist.” Interrogating the brief is the first thing I do on every project, and both projects in this deck start there.",
      "The photos are the people and places behind the work. Nothing here needs clicking.",
    ],
  },
  {
    slug: "pillars",
    section: "background",
    stage: "background-intro",
    title: "my pillars of inspiration",
    notes: [
      "Creative technologist: I prototype in code and ship the front end, which is why a design system is where I want to spend my time.",
      "Bonzo is the pug. Chronic learner is why every project opens with a teardown of whoever already solved the problem: Mobbin for marketplaces, Airbnb for listing creation. Both research beats come up later.",
    ],
  },
  {
    slug: "suite",
    section: "product",
    title: "where it sits",
    notes: [
      "At Proctorio I led cross-product design across three suites, for institutions and for proctoring agencies, and led the implementation of the refactored design system underneath all three.",
      "Integrity proctors the exam, Vault protects the exam content, and Origin proves authorship. Hover a tile to see it move. This walkthrough is Origin’s product: AuthorProof.",
    ],
  },
  {
    slug: "cover",
    section: "product",
    title: "AuthorProof",
    notes: [
      "AuthorProof generates a short comprehension quiz from the student’s own writing, so someone who wrote the paper can answer it and someone who did not cannot.",
      "My role was end to end: from an assigned brief to a shippable MVP inside Canvas. The product page and the full case study are linked on the slide.",
    ],
  },
  {
    slug: "task",
    section: "product",
    title: "task",
    notes: [
      "The suite has to cover every integrity vector on the right; authorship was the one no existing tool touched.",
      "The reframe on the left is the whole product: existing tools ask “is this original?” Instructors ask “did you write this?”",
      "The two rules underneath were set before any screen was drawn: no binary pass or fail, and every score traces back to something a person can read. The result is confidence, not a verdict.",
    ],
  },
  {
    slug: "thesis",
    section: "product",
    title: "statement",
    notes: [
      "This is the assumption the brief rested on. The rest of the product section is about testing it against what the platform could actually do.",
      "It is the question-artist habit from the bio, applied to a brief.",
    ],
  },
  {
    slug: "brief",
    section: "product",
    title: "the brief",
    notes: [
      "The first concept arrived with an architecture already chosen: three journeys built on Canvas’s own quiz tooling, one quiz per submission, with the student notified to go find it.",
      "Before anyone built anything, I mapped every step against what the platform could do and timed it. The next slide is what that turned up.",
    ],
  },
  {
    slug: "constraints",
    section: "product",
    title: "four constraints",
    notes: [
      "The strip first: six steps, roughly ten minutes, and a fresh quiz per student in tooling built for one quiz per class. Ten minutes is exactly the time a student needs to reopen the essay.",
      "Each of the four is a design problem, not an engineering one: it changes where the product should live, not how a screen looks.",
      "This is how I push back on a brief: with a map of the platform rather than a list of objections.",
    ],
  },
  {
    slug: "pivot",
    section: "product",
    title: "the pivot",
    notes: [
      "Rather than report blockers, I pitched an alternative and split it into an MVP and a longer vision: embed AuthorProof in the assignment itself, so the quiz appears seconds after upload and the result writes back beside the submission.",
      "The cost is stated out loud on the slide: short pieces written in the LMS editor were excluded, and proctoring alongside the embedded flow stayed an open question. I would rather name the hole than have engineering find it.",
      "The screenshots pair each briefed screen with the proposed one.",
    ],
  },
  {
    slug: "shipped",
    section: "product",
    title: "shipped",
    notes: [
      "Everything engineering built from was a working prototype in HTML, CSS, and vanilla JavaScript on the design system, not a document about one: the settings model and its interface, the student quiz flow, the results, the report card, and the student emails.",
      "The pivot direction became the official long-term vision for the product; the original briefed idea shipped as the proof of concept.",
      "Pilot results are on the strip. The zero matters most to me: nothing added to the instructor’s grading workflow.",
    ],
  },
  {
    slug: "cover",
    section: "design-system",
    title: "Senior Living Marketplace",
    notes: [
      "Modern Care Homes is a senior living marketplace for the Phoenix metro, plus the agent platform that runs it. I own everything a family or an agent sees.",
      "Two jobs on the slide. Hover the 01 to see the design system being built, and the 02 to see it in use across the live site.",
      "A change to a button is a change in two products. The system is what makes a decision hold. The live site and the Storybook are linked below.",
    ],
  },
  {
    slug: "foundations",
    section: "design-system",
    title: "foundations",
    notes: [
      "The strip: 18px base type, 48 by 48 targets, AA contrast, and tokens mapped one to one between Figma variables and CSS custom properties. Because the floor is in the component, page eleven cannot undo it.",
      "The tiers under the diagram: primitives are named for what they are, and nothing on a page uses them directly; semantics are named for the job, so a theme is a change of values. Flip the theme toggle in the panels to see that happen.",
      "Under the video, the home card is annotated with the tokens each part of it reads. The token diagram itself is published on 21st.dev if you want the code.",
    ],
  },
  {
    slug: "components",
    section: "design-system",
    title: "atomic design",
    notes: [
      "Top to bottom: atoms carry the floor, molecules are atoms that only make sense together, organisms are the home card and the agent platform’s sidebar, the template is the filter form, and the page is the live marketplace.",
      "Every frame except the home card is a live story: click into one to change its state, or use Open to see it in the Storybook. The home card is a still because its story needs a Clerk provider before the published Storybook can render it.",
      "Why atomic: it gives a contribution a home. A new piece has to say which level it lives at, which is most of the governance conversation.",
    ],
  },
  {
    slug: "coming",
    section: "design-system",
    title: "what is coming",
    notes: [
      "The library is moving up the atomic ladder: the complex components are in progress now, starting with the map.",
      "Two variants of it are being built: one for a home’s profile page and one for map search. The clip shows the map search in progress.",
    ],
  },
  {
    slug: "storybook",
    section: "design-system",
    title: "Storybook",
    notes: [
      "This is the live library, opened on the button. Click into any component and walk its states: hover, focus, disabled, empty, loading, error.",
      "A component is ready when it reads correctly outside both the marketplace and the agent platform; Storybook is how I look at it outside either one.",
      "If the frame is slow, open it full screen. The Integrity Console Storybook linked below is a second, complete example: 40 components, 149 stories.",
    ],
  },
  {
    slug: "home-card",
    section: "design-system",
    title: "the home card",
    notes: [
      "Research paid for this: marketplaces that had already solved search and comparison. Families are mostly trying to rule homes out, so the card leads with what differs.",
      "The lists under each card say exactly what was wrong before and what the reworked card fixes.",
      "The design-system angle: decided once, it holds on every listing, search result, and saved comparison.",
    ],
  },
  {
    slug: "dashboard",
    section: "design-system",
    title: "the agent dashboard",
    notes: [
      "The agent side. The old shell was two nav items and one long scroll. The new one makes the sidebar the listing, with every section carrying its own state.",
      "It came straight from the Airbnb and Zillow listing-creation teardown: show the state of every stage so nobody loses their place.",
      "The same rail, shell, and section components ship on the marketplace, which is the two-products point again.",
    ],
  },
  {
    slug: "shipping",
    section: "design-system",
    title: "shipping",
    notes: [
      "The pipeline: research, Figma, Storybook, pull request, Vercel preview on a real phone, shipped.",
      "The handoff exists for data-layer work. Everything else ships as code from me, and what I learn shipping goes back into the system. The PR thread underneath is what that looks like day to day.",
      "Spencer owns data and infrastructure. The live site, the Storybook, and the case study are linked at the top.",
    ],
  },
  {
    slug: "threads",
    section: "observations",
    title: "across both",
    notes: [
      "Three habits both projects share, each tied to a moment you just saw.",
      "The middle one is the design-systems thesis: the rule lives in the component, so it holds without anyone remembering it.",
    ],
  },
  {
    slug: "role",
    section: "observations",
    title: "for this role",
    notes: [
      "The figures are from the Proctorio design system overhaul: 587 card variants down to 32, 37 components in 60 days, three suites on one language. The case study linked below has the variant math and the token architecture as live Storybook embeds.",
      "The four cards underneath are what I bring to a design systems team: tokens and architecture, governance as mentorship, design to code, and shipping the front end.",
    ],
  },
  {
    slug: "thanks",
    section: "observations",
    title: "thank you",
    notes: [
      "Every link from the deck in one place.",
      "One question back: what does the first ninety days of this role look like from your side?",
    ],
  },
]

/** Index of the slide a `<section>/<slug>` path names, or -1. */
export function findSlideIndex(path: string | undefined) {
  if (!path) return 0
  return SLIDES.findIndex((slide) => slidePath(slide) === path)
}

export function slideHref(slide: Slide) {
  return `${REVIEW_BASE_PATH}/${slidePath(slide)}`
}

export function firstSlideOfSection(section: Section["slug"]) {
  return SLIDES.findIndex((slide) => slide.section === section)
}
