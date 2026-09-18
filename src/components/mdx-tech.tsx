import { getTech, type TechKey } from "@/lib/tech"

import { TechBadge } from "./tech-badge"

/**
 * A tool badge for MDX, identical to the ones in the home page Stack panel,
 * e.g. `<Tech name="nextjs" />` inside a table cell or a paragraph.
 *
 * `name` is a plain string on purpose: expression attributes don't survive the
 * MDX pipeline, so a key has to arrive as an attribute value. See the note in
 * `mdx-story-embed.tsx`. An unknown key renders nothing rather than throwing,
 * so a typo costs a badge and not the page.
 *
 * Sets its own `--badge-height` because it isn't inside the Stack panel's grid,
 * and opts out of prose so a link inside a table cell doesn't pick up the
 * underline and color the typography styles give body links.
 */
export function Tech({ name }: { name: TechKey }) {
  const entry = getTech(name)

  if (!entry) return null

  return (
    <TechBadge
      href={entry.href}
      icon={entry.icon}
      title={entry.title}
      className="not-prose inline-flex w-fit no-underline [--badge-height:--spacing(6)]"
    />
  )
}
