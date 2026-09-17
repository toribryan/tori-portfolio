import { ArrowUpRightIcon } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * A case-study screenshot that can be opened at full resolution.
 *
 * The reading column is ~734px and these are 2500–3600px screens, so anything
 * rendered inline is a composition, not something you can read — the same trap
 * the Author Proof flow diagram fell into. `src` is a display-sized copy, `full`
 * is the native-width one, and the whole image is the link to it.
 *
 * Every prop is a string on purpose: expression attributes don't survive the
 * MDX pipeline, so `width={1468}` would silently arrive as undefined while
 * `alt="…"` comes through intact. See the note in `mdx-story-embed.tsx`.
 */
export function Figure({
  src,
  full,
  alt,
  caption,
  className,
}: {
  /** Display-sized image, roughly 2x the rendered box. */
  src: string
  /** Native-resolution copy the figure links to. Defaults to `src`. */
  full?: string
  alt: string
  caption?: React.ReactNode
  className?: string
}) {
  return (
    <figure className={cn("not-prose group/figure my-8", className)}>
      <a
        className="relative block"
        href={full ?? src}
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          className="w-full rounded-xl inset-ring-1 inset-ring-black/15 dark:inset-ring-white/15"
          src={src}
          alt={alt}
          loading="lazy"
        />

        {/* Only a hover/focus affordance — the whole image is already the
            target, and on touch there is no hover to reveal it. */}
        <span
          className={cn(
            "pointer-events-none absolute right-2 bottom-2 inline-flex items-center gap-1 rounded-md px-2 py-1",
            "bg-background/85 font-mono text-xs tracking-wide text-foreground opacity-0 backdrop-blur-sm transition-opacity",
            "group-focus-within/figure:opacity-100 group-hover/figure:opacity-100"
          )}
          aria-hidden
        >
          Full size
          <ArrowUpRightIcon className="size-3.5" />
        </span>
      </a>

      {caption && (
        <figcaption className="mt-3 text-sm text-pretty text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
