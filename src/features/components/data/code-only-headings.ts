import type { TOCItemType } from "fumadocs-core/toc"

/**
 * The TOC urls of the headings a doc wraps in `<ForCode>`. The TOC lists the
 * source's headings in order, skipping fenced code, so walking the source the
 * same way pairs each heading with its item. If the counts ever disagree,
 * nothing is marked and the design view keeps every heading.
 */
export function codeOnlyHeadings(content: string, items: TOCItemType[]) {
  const flags: boolean[] = []
  let fenced = false
  let depth = 0
  for (const line of content.split("\n")) {
    if (/^\s*(```|~~~)/.test(line)) {
      fenced = !fenced
      continue
    }
    if (fenced) continue
    depth += (line.match(/<ForCode>/g) ?? []).length
    depth -= (line.match(/<\/ForCode>/g) ?? []).length
    if (/^#{1,6}\s/.test(line)) flags.push(depth > 0)
  }
  if (flags.length !== items.length) return []
  return items.filter((_, i) => flags[i]).map((item) => item.url)
}
