import { BRAND_LINKS } from "@/lib/brand-links"
import { cn } from "@/lib/utils"

/**
 * A small linked brand mark, dropped next to a heading or an inline tool
 * name in MDX — e.g. `## Framer <BrandLink brand="framer" />`.
 *
 * When used inside a heading, `Heading` (see `heading.tsx`) pulls this out
 * of the section-anchor link so it stays its own, separately clickable link
 * to the brand's site rather than nesting inside it. Both that usage and
 * `ToolLabel` place this inside a `flex items-center` row rather than
 * relying on inline `vertical-align` — text/icon vertical-align tuning
 * doesn't hold up across arbitrary icon art.
 */
export function BrandLink({
  brand,
  className,
}: {
  brand: keyof typeof BRAND_LINKS
  className?: string
}) {
  const entry = BRAND_LINKS[brand]

  if (!entry) return null

  return (
    <a
      href={entry.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${entry.label} website`}
      className={cn(
        "not-prose inline-flex shrink-0 items-center text-muted-foreground/80 transition-colors hover:text-foreground",
        "[&_img]:size-4 [&_svg]:size-4",
        className
      )}
    >
      {entry.icon}
    </a>
  )
}
