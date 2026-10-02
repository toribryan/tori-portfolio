import type { ComponentType } from "react"

import { DesignSystemOverhaulCover } from "./design-system-overhaul-cover"
import { ModernCareHomesCover } from "./modern-care-homes-cover"
import { StorybookKitCover } from "./storybook-kit-cover"
import { VoiceMemoCover } from "./voice-memo-cover"
import { VoiceMemoHero } from "./voice-memo-object"

/**
 * Live covers that stand in for a doc's cover image on its card, keyed by
 * slug. The image still serves as the doc's social preview.
 */
export const DOC_COVERS: Record<string, ComponentType<{ loop?: boolean }>> = {
  "design-system-overhaul": DesignSystemOverhaulCover,
  "modern-care-homes": ModernCareHomesCover,
  "storybook-kit": StorybookKitCover,
  "voice-memo": VoiceMemoCover,
}

/**
 * Interactive pieces that take the place of the live cover at the top of a
 * doc's page, for a doc whose page is the thing itself rather than a write-up
 * about it. The live cover still shows on the doc's card.
 */
export const DOC_HEROES: Record<string, ComponentType> = {
  "voice-memo": VoiceMemoHero,
}
