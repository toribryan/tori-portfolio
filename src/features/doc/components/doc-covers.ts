import type { ComponentType } from "react"

import { DesignSystemOverhaulCover } from "./design-system-overhaul-cover"

/**
 * Live covers that stand in for a doc's cover image on its card, keyed by
 * slug. The image still serves as the doc's social preview.
 */
export const DOC_COVERS: Record<string, ComponentType<{ loop?: boolean }>> = {
  "design-system-overhaul": DesignSystemOverhaulCover,
}
