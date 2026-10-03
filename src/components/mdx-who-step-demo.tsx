import { RealWeddingSubmissionsCover } from "@/features/doc/components/real-wedding-submissions-cover"

/**
 * The real wedding submission wizard's first step, looping in the reading
 * column: a vendor is chosen, the role question opens inside the card, and
 * the category search picks Flowers.
 */
export function WhoStepDemo({ caption }: { caption?: React.ReactNode }) {
  return (
    <figure className="not-prose my-8">
      <div
        className="relative aspect-1200/630 overflow-hidden rounded-xl inset-ring-1 inset-ring-black/15 dark:inset-ring-white/15"
        aria-hidden
        inert
      >
        <RealWeddingSubmissionsCover loop />
      </div>

      {caption && (
        <figcaption className="mt-3 text-sm text-pretty text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
