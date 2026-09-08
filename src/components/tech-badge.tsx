import { cn } from "@/lib/utils"

/**
 * The pill that names a tool: brand mark plus title, linked to the tool's
 * site.
 *
 * Shared on purpose. The home page Stack panel and the `<Tech>` MDX badge
 * both render through this, so a badge in a case study is the same object as
 * a badge on the home page rather than a copy of its styles.
 *
 * Height comes from `--badge-height` on an ancestor, which is how the Stack
 * panel sizes a whole grid of these at once. Callers outside that grid set it
 * on the badge itself.
 *
 * `icon` is optional. Not every tool worth naming ships a brand mark we have a
 * copy of, and a text-only badge reads better than an invented logo.
 *
 * Marks arrive two ways and both get sized and tinted here, so a badge never
 * shows a logo in its own brand color: an `<svg>` from `@/components/icons`
 * inherits the color through `currentColor`, and a `[data-mark]` element from
 * the `BrandMark` helper in `@/lib/tech` is an SVG file used as a CSS mask,
 * which paints in the same color.
 */
export function TechBadge({
  href,
  icon,
  title,
  className,
}: {
  href: string
  icon?: React.ReactNode
  title: string
  className?: string
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      className={cn(
        "flex h-(--badge-height) items-center justify-center gap-1.25 rounded-md bg-zinc-50/80 px-2 font-mono text-xs text-foreground inset-ring-1 inset-ring-border dark:bg-zinc-900/80",
        "[&_svg]:pointer-events-none [&_svg]:size-3.5 [&_svg]:shrink-0 [&_svg]:text-muted-foreground/80",
        "[&_[data-mark]]:pointer-events-none [&_[data-mark]]:size-3.5 [&_[data-mark]]:shrink-0 [&_[data-mark]]:text-muted-foreground/80",
        className
      )}
    >
      {icon}
      {title}
    </a>
  )
}
