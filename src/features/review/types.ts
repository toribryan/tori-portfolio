import type { Tweet } from "react-tweet/api"

export type SectionSlug =
  "background" | "product" | "design-system" | "observations"

export type Section = {
  slug: SectionSlug
  /** Rail and breadcrumb label. */
  title: string
}

export type Slide = {
  slug: string
  section: SectionSlug
  /** Breadcrumb tail and document title. */
  title: string
  /**
   * Notes for whoever is reading the deck: what they are looking at, what to
   * click, what to ask about. Shown in the notes drawer (press N).
   */
  notes: string[]
  /**
   * Slides that share a stage render in one mounted view: moving between
   * them swaps content inside the view instead of turning the page. The
   * component reads the slide to know which step to show.
   */
  stage?: string
}

/** What keeps a slide's view mounted: its stage, or the slide itself. */
export function stageKey(slide: Slide) {
  return slide.stage ?? `${slide.section}/${slide.slug}`
}

/** A slide's URL path under `/review`, e.g. `product/thesis`. */
export function slidePath(slide: Pick<Slide, "section" | "slug">) {
  return `${slide.section}/${slide.slug}`
}

/** Content fetched on the server that a slide body needs. */
export type SlideData = {
  /** The post quoted on the observations slide, or null if X did not answer. */
  tweet: Tweet | null
}
