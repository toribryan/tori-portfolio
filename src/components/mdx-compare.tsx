import { ArrowUpRightIcon } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * A before/after pair of screenshots, labelled and stacked so each one keeps
 * the full reading width. Wide UI shots lose their detail the moment they're
 * put in two columns, so `layout="columns"` is opt-in and meant for narrow,
 * roughly square art like a single card.
 *
 * Both images sit on a fixed light plate rather than the page background.
 * Product screenshots are usually exported with transparency around them, and
 * dark UI text on a dark page is invisible. The plate keeps a shot readable
 * in both themes without asking the author to re-export.
 *
 * Every prop is a string: expression attributes don't survive the MDX
 * pipeline, see the note in `mdx-inbox-regions.tsx`.
 */
export function Compare({
  before,
  after,
  beforeAlt,
  afterAlt,
  beforeLabel = "Before",
  afterLabel = "After",
  caption,
  layout,
  className,
}: {
  before: string
  after: string
  beforeAlt: string
  afterAlt: string
  beforeLabel?: string
  afterLabel?: string
  caption?: React.ReactNode
  /** `columns` puts the pair side by side from `sm` up. Default is stacked. */
  layout?: "stacked" | "columns"
  className?: string
}) {
  return (
    <figure className={cn("not-prose my-8", className)}>
      <div
        className={cn(
          "grid gap-3",
          layout === "columns" ? "sm:grid-cols-2" : "grid-cols-1"
        )}
      >
        <Shot src={before} alt={beforeAlt} label={beforeLabel} />
        <Shot src={after} alt={afterAlt} label={afterLabel} />
      </div>

      {caption && (
        <figcaption className="mt-3 text-sm text-pretty text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

/** One labelled shot on its plate, linking to the image at full size. */
function Shot({
  src,
  alt,
  label,
}: {
  src: string
  alt: string
  label: string
}) {
  return (
    <a
      className="group/shot relative block overflow-hidden rounded-xl bg-white inset-ring-1 inset-ring-black/15 dark:inset-ring-white/15"
      href={src}
      target="_blank"
      rel="noopener noreferrer"
    >
      <img className="w-full" src={src} alt={alt} loading="lazy" />

      {/* Geist Sans rather than the mono used by the site's other chips: this
          one sits on a product screenshot rather than in the page's own
          furniture, and reads as a caption on the image instead of UI.

          Bottom center, not a corner: these are product screenshots and the
          corners are where the chrome lives: a side nav, a close button, a
          badge on a card. The middle of the bottom edge is the one place a
          label reliably sits over empty canvas. */}
      <span className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-md bg-zinc-900/80 px-2 py-1 font-sans text-xs font-medium text-white backdrop-blur-sm">
        {label}
      </span>

      {/* Hover/focus affordance only. The whole shot is already the target,
          and on touch there is no hover to reveal it. */}
      <span
        className={cn(
          "pointer-events-none absolute top-2 right-2 inline-flex items-center gap-1 rounded-md px-2 py-1",
          "bg-background/85 font-mono text-xs tracking-wide text-foreground opacity-0 backdrop-blur-sm transition-opacity",
          "group-focus-within/shot:opacity-100 group-hover/shot:opacity-100"
        )}
        aria-hidden
      >
        Full size
        <ArrowUpRightIcon className="size-3.5" />
      </span>
    </a>
  )
}
