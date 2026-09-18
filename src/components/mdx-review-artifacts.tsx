"use client"

import { cn } from "@/lib/utils"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/base/ui/tabs"
import { AtomicDesign as AtomicDesignRows } from "@/features/review/components/atomic-design"
import { AuthorProofRadar } from "@/features/review/components/author-proof-radar"
import { FoundationLayers as FoundationLayerPanels } from "@/features/review/components/foundation-layers"
import { PinnedFlow } from "@/features/review/components/pinned-flow"
import { Stat, StatRow } from "@/features/review/components/slide-primitives"
import { SuiteReel } from "@/features/review/components/suite-reel"
import { TokenCallouts as TokenCalloutCard } from "@/features/review/components/token-callouts"
import { TokenTiers as TokenTierCards } from "@/features/review/components/token-tiers"
import { TwoJobs as TwoJobsGrid } from "@/features/review/components/two-jobs"
import {
  BRIEFED_JOURNEYS,
  BRIEFED_STEPS,
  CONSTRAINT_STATS,
  PITCHED_STEPS,
  SUITES,
} from "@/features/review/data/author-proof"

/**
 * The review deck's artifacts, wrapped for a case study. Each one is
 * configured here in TSX and takes string props at most, because expression
 * attributes don't survive the MDX pipeline (see `mdx-inbox-regions.tsx`).
 * They step out of the prose so the deck's own type and rules apply.
 */
function Artifact({
  caption,
  className,
  children,
}: {
  caption?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <figure className={cn("not-prose my-8", className)}>
      {children}
      {caption && (
        <figcaption className="mt-3 text-sm text-pretty text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

/** The three Proctorio suites, with Origin featured. */
export function ProctorioSuites({ caption }: { caption?: string }) {
  return (
    <Artifact caption={caption}>
      <SuiteReel items={SUITES} />
    </Artifact>
  )
}

/** What the integrity suite has to cover, and where authorship sat in it. */
export function IntegrityRadar({ caption }: { caption?: string }) {
  return (
    <Artifact caption={caption}>
      <AuthorProofRadar className="mx-auto aspect-[4/3] w-full max-w-lg" />
    </Artifact>
  )
}

/** The three journeys the first concept was built on, as they were handed over. */
export function BriefedJourneys({ caption }: { caption?: string }) {
  return (
    <Artifact caption={caption}>
      <div className="flex flex-col gap-3">
        {BRIEFED_JOURNEYS.map((journey) => (
          <PinnedFlow
            key={journey.label}
            label={journey.label}
            steps={journey.steps}
          />
        ))}
      </div>
    </Artifact>
  )
}

/** What the briefed architecture added up to. */
export function ConstraintStats() {
  return (
    <Artifact>
      <StatRow>
        {CONSTRAINT_STATS.map((stat) => (
          <Stat key={stat.value} value={stat.value} label={stat.label} />
        ))}
      </StatRow>
    </Artifact>
  )
}

/** The student's path as briefed and as pitched, one tab each. */
export function PivotFlows({ caption }: { caption?: string }) {
  return (
    <Artifact caption={caption}>
      <Tabs defaultValue="pitched">
        <TabsList>
          <TabsTrigger value="briefed">As briefed</TabsTrigger>
          <TabsTrigger value="pitched">As pitched</TabsTrigger>
        </TabsList>
        <TabsContent value="briefed">
          <PinnedFlow steps={BRIEFED_STEPS} />
        </TabsContent>
        <TabsContent value="pitched">
          <PinnedFlow steps={PITCHED_STEPS} />
        </TabsContent>
      </Tabs>
    </Artifact>
  )
}

export function TwoJobs({ caption }: { caption?: string }) {
  return (
    <Artifact caption={caption}>
      <TwoJobsGrid />
    </Artifact>
  )
}

export function TokenTiers({ caption }: { caption?: string }) {
  return (
    <Artifact caption={caption} className="flex flex-col gap-6">
      <TokenTierCards />
    </Artifact>
  )
}

export function FoundationLayers({ caption }: { caption?: string }) {
  return (
    <Artifact caption={caption}>
      <FoundationLayerPanels />
    </Artifact>
  )
}

export function TokenCallouts({ caption }: { caption?: string }) {
  return (
    <Artifact caption={caption}>
      <TokenCalloutCard />
    </Artifact>
  )
}

export function AtomicDesign({ caption }: { caption?: string }) {
  return (
    <Artifact caption={caption}>
      <AtomicDesignRows />
    </Artifact>
  )
}
