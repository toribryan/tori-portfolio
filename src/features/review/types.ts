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
   * Talking points for the presenter. Shown in the notes drawer (press N) and
   * nowhere else, so they can be candid about what to say and when.
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
