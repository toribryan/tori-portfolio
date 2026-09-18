"use client"

import { TokenFlow } from "@/components/ui/token-flow"
import { TOKEN_ROWS } from "@/features/portfolio/data/token-flow"

import { Card, HairlineGrid, Reveal } from "./slide-primitives"

/**
 * The color tokens as they flow from base to primitive to semantic, and
 * the three tiers named underneath.
 */
export function TokenTiers() {
  return (
    <>
      <Reveal>
        <TokenFlow rows={TOKEN_ROWS} />
      </Reveal>
      <HairlineGrid columns={3}>
        <Card label="Primitive" title="Named for what it is">
          zinc-950, green-500, zinc-200: the raw palette. Nothing on a page asks
          for one of these directly.
        </Card>
        <Card label="Semantic" title="Named for the job">
          bg-primary, text-success, border-border. A component only ever asks
          for one of these, so a theme change is a change to values, and no
          component gets touched.
        </Card>
        <Card label="Figma" title="The same names, one to one">
          Every CSS custom property has a Figma variable with the same name.
          What I pick in a mockup is what the component reads in code.
        </Card>
      </HairlineGrid>
    </>
  )
}
