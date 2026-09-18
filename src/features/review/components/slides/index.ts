import type { ComponentType } from "react"
import { createElement } from "react"

import type { Slide } from "@/features/review/types"

import { AUTHOR_PROOF_CONTENT } from "./author-proof"
import { BACKGROUND_CONTENT } from "./background"
import { DESIGN_SYSTEM_CONTENT } from "./design-system"
import { OBSERVATIONS_CONTENT } from "./observations"

const CONTENT: Record<
  Slide["section"],
  Record<string, ComponentType<{ slide: Slide }>>
> = {
  background: BACKGROUND_CONTENT,
  product: AUTHOR_PROOF_CONTENT,
  "design-system": DESIGN_SYSTEM_CONTENT,
  observations: OBSERVATIONS_CONTENT,
}

/** The body for a slide. Throws if a data entry has no component, which a build surfaces. */
export function renderSlide(slide: Slide) {
  const Content = CONTENT[slide.section][slide.slug]
  if (!Content) {
    throw new Error(`No slide content for ${slide.section}/${slide.slug}`)
  }
  return createElement(Content, { slide })
}
