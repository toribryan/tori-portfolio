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
}

/** A slide's URL path under `/review`, e.g. `product/thesis`. */
export function slidePath(slide: Pick<Slide, "section" | "slug">) {
  return `${slide.section}/${slide.slug}`
}
