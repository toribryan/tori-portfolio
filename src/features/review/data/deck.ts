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
    slug: "cover",
    section: "background",
    stage: "background-intro",
    title: "cover",
    notes: [
      "Thank them for the second round. Say what the next 30 minutes are: a short bit about me, one product project, one design systems project, then what I took from both.",
      "Set expectations: this is a walkthrough, not a read-along. Every slide links out to the case study, the live product, or the Storybook, so they can go deeper afterwards.",
    ],
  },
  {
    slug: "bio",
    section: "background",
    stage: "background-intro",
    title: "bio",
    notes: [
      "Three people's words for me, mine last. The through-line is the same: I ask why before I build.",
      "'Question artist' is the one to land. It is also the first thing I do on every project: interrogate the brief.",
      "Keep this under a minute. The photos do the warmth; the quotes do the framing.",
    ],
  },
  {
    slug: "pillars",
    section: "background",
    stage: "background-intro",
    title: "my pillars of inspiration",
    notes: [
      "Creative technologist: I prototype in code, I ship the front end. That is why a design system is where I want to spend my time.",
      "Bonzo: the human moment. Thirty seconds, then move on.",
      "Chronic learner: every project starts with a teardown. Mobbin for marketplaces, Airbnb for listing creation. This sets up the research beats in both projects.",
    ],
  },
  {
    slug: "today",
    section: "background",
    title: "today",
    notes: [
      "Say the argument out loud: product shows how I decide, the system shows how I make a decision hold.",
      "Why these two: AuthorProof is the clearest example of changing a brief with evidence. Modern Care Homes is the system I own end to end, in public, with a Storybook they can open.",
      "Offer the links now so they know they exist, then move on.",
    ],
  },
  {
    slug: "cover",
    section: "product",
    title: "AuthorProof",
    notes: [
      "One line on the product: it generates a short comprehension quiz from the student's own writing, so someone who wrote the paper can answer and someone who didn't, can't.",
      "One line on my role: end to end, from an assigned brief to a shippable MVP, in Canvas.",
    ],
  },
  {
    slug: "task",
    section: "product",
    title: "task",
    notes: [
      "Context: Proctorio's integrity suite is three products. Integrity proctors the exam, Vault protects the exam content, Origin (AuthorProof) proves authorship.",
      "My task was Origin. Everything on the right is what the suite has to cover; authorship is the vector nobody else's tool touched.",
      "Land the reframe: existing tools ask 'is this original?'. Instructors ask 'did you write this?'.",
    ],
  },
  {
    slug: "thesis",
    section: "product",
    title: "statement",
    notes: [
      "Read the thesis. Pause on 'right?'. The whole project is about testing that assumption against what the platform could actually do.",
      "This is the question-artist habit from the bio, applied.",
    ],
  },
  {
    slug: "brief",
    section: "product",
    title: "the brief",
    notes: [
      "The brief came with an architecture: use Canvas's own quiz tooling, one quiz per submission, notify the student.",
      "What I did before anyone built anything: mapped every step against platform capability and timed it.",
      "Six steps, roughly ten minutes. Ten minutes is exactly the time a student needs to reopen the essay. The architecture was working against the product's promise.",
    ],
  },
  {
    slug: "constraints",
    section: "product",
    title: "four constraints",
    notes: [
      "Walk them clockwise. Timing is the killer; the other three make the briefed flow fragile even if timing were fine.",
      "Say why I call them design problems: each one changes where the product should live, not how a screen looks.",
      "This is the slide that shows how I push back: with a map of the platform, not an opinion.",
    ],
  },
  {
    slug: "pivot",
    section: "product",
    title: "the pivot",
    notes: [
      "Rather than report blockers, I pitched an alternative and split it into an MVP and a longer vision.",
      "MVP: embed AuthorProof in the assignment itself. Student starts the assignment, uploads, the quiz appears seconds later, the result writes back beside the submission.",
      "Be explicit about cost: LMS-editor short pieces excluded, the proctoring question left open. I would rather name the hole than have engineering find it. Longer-vision pieces went on the roadmap, not in the bin.",
    ],
  },
  {
    slug: "model",
    section: "product",
    title: "model",
    notes: [
      "Left: the instructor's side. Proctoring level, completion window, one button. Nothing new to learn in Canvas.",
      "Right: the student's side. Their essay beside questions generated from it, in the submission's own language.",
      "If they want the full session view, the case study has the badge-to-detail pathway.",
    ],
  },
  {
    slug: "principles",
    section: "product",
    title: "principles",
    notes: [
      "This is where product design meets design systems thinking: rules that outlive the screen.",
      "'Never colour alone' came from a real constraint: the host platform maps badge colour the opposite way from our score. So the meaning lives in text.",
      "Confidence, not verdict, is the sentence to leave them with.",
    ],
  },
  {
    slug: "shipped",
    section: "product",
    title: "shipped",
    notes: [
      "Prototype as spec: HTML, CSS, vanilla JS. Engineering built from something that already worked.",
      "Read the strip. The zero matters most to me: nothing added to the instructor's grading workflow.",
      "What I'd do next: prototype the embedded flow alongside a proctored session earlier; let instructors review generated questions before they reach a student.",
      "Offer the product page link, then transition: 'That's how I make a decision. The next project is about making decisions hold.'",
    ],
  },
  {
    slug: "cover",
    section: "design-system",
    title: "Senior Living Marketplace",
    notes: [
      "One line: a senior living marketplace for the Phoenix metro, plus the agent platform that runs it. I own everything a family or agent sees.",
      "Two jobs, and the slide shows both. One: build the system. Storybook, shadcn conventions, Tailwind tokens, Base UI primitives. Two: use it in context, across the marketplace and the agent platform, on Vercel and Next.js, designed in Figma, with Mapbox for search.",
      "Why the split matters: a change to a button is a change in two products. The system is what makes a decision hold.",
      "Offer the live site and the Storybook now; they can click while I talk.",
    ],
  },
  {
    slug: "storybook",
    section: "design-system",
    title: "Storybook",
    notes: [
      "This is the live library, not a screenshot. Click into a component and walk its states: hover, focus, disabled, empty, loading, error.",
      "The two-product test: a component is ready when it reads correctly outside both the marketplace and the agent platform. Storybook is how I look at it outside either one.",
      "If it loads slowly, open it full screen in a new tab and keep talking. The Integrity Console Storybook is the second, complete example: 40 components, 149 stories.",
    ],
  },
  {
    slug: "foundations",
    section: "design-system",
    title: "foundations",
    notes: [
      "Read the strip: 18px base, 48 by 48 targets, AA minimum, tokens one to one between Figma variables and CSS custom properties.",
      "'Design from a floor instead of toward one' is the line. Because it is in the component, page eleven cannot undo it.",
      "If asked about token structure: shadcn conventions, CSS variables as the single source, Figma variables named to match.",
    ],
  },
  {
    slug: "home-card",
    section: "design-system",
    title: "the home card",
    notes: [
      "Research paid for this: marketplaces that already solved search and comparison. Families rule homes out, so the card leads with what differs.",
      "Before: the widest line went to copy that read the same on every listing. After: availability badge, save, photo carousel, then name, address, price.",
      "The design-system angle: decided once, holds on every listing, search result and saved comparison.",
    ],
  },
  {
    slug: "dashboard",
    section: "design-system",
    title: "the agent dashboard",
    notes: [
      "The agent side. Old shell: two nav items and a blank canvas. New shell: the sidebar is the listing, every section carries its state.",
      "Came straight from the Airbnb listing-creation teardown: show the state of every stage.",
      "Same rail, shell and section components ship on the marketplace, which is the twice point again.",
    ],
  },
  {
    slug: "shipping",
    section: "design-system",
    title: "shipping",
    notes: [
      "The pipeline: research, Figma, Storybook, PR, Vercel preview on a real phone, shipped.",
      "The handoff exists for data-layer work. Everything else ships as code from me, and what I learn shipping goes back into the system.",
      "Credit Spencer: he owns data and infrastructure.",
    ],
  },
  {
    slug: "next",
    section: "design-system",
    title: "where it is",
    notes: [
      "Live, two products, AA holding. What's next: publishing the library, better comparison.",
      "Transition: 'Two projects. Here is what they have in common, and what it means for a design systems role.'",
    ],
  },
  {
    slug: "threads",
    section: "observations",
    title: "across both",
    notes: [
      "Three threads. Say each in one breath and tie it to a moment they just saw.",
      "The middle one is the design-systems thesis: the rule lives in the component, so it holds without anyone remembering.",
    ],
  },
  {
    slug: "role",
    section: "observations",
    title: "for this role",
    notes: [
      "This is the receipts slide. Figures are from the Proctorio design system overhaul: 587 card variants to 32, 37 components in 60 days, three suites on one language.",
      "Tie each card to what their team is doing. If they mentioned tokens, Code Connect, governance or contribution models in round one, speak to that card first.",
      "If there is time, the overhaul case study has the variant math and token architecture as live Storybook embeds.",
    ],
  },
  {
    slug: "thanks",
    section: "observations",
    title: "thank you",
    notes: [
      "Leave this up during questions. Every link they might want is here.",
      "Close with the ask: what does the first ninety days of this role look like from their side?",
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
