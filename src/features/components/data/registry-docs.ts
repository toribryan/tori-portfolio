import fs from "fs"
import path from "path"
import { cache } from "react"
import matter from "gray-matter"

export type RegistryDocMetadata = {
  title: string
  description: string
  createdAt: string
  updatedAt: string
  new?: boolean
}

export type RegistryDoc = {
  slug: string
  metadata: RegistryDocMetadata
  content: string
}

const CONTENT_DIR = path.join(process.cwd(), "src/features/components/content")

/** Every published component's doc under `content/`, newest first. */
export const getRegistryDocs = cache((): RegistryDoc[] =>
  fs
    .readdirSync(CONTENT_DIR)
    .filter((file) => path.extname(file) === ".mdx")
    .map((file) => {
      const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf-8")
      const parsed = matter(raw)
      return {
        slug: path.basename(file, ".mdx"),
        metadata: parsed.data as RegistryDocMetadata,
        content: parsed.content,
      }
    })
    .sort(
      (a, b) =>
        new Date(b.metadata.createdAt).getTime() -
        new Date(a.metadata.createdAt).getTime()
    )
)

export function getRegistryDoc(slug: string) {
  return getRegistryDocs().find((doc) => doc.slug === slug)
}

// Blocks that only make sense on the page: live demos and tables built from
// JSX props. They are left out of the Markdown.
const PAGE_ONLY = [
  "ComponentPreview",
  "Example",
  "Anatomy",
  "UsageGuidelines",
  "ComponentRules",
  "DataAttributes",
  "RelatedComponents",
]

/**
 * Drops each page-only block, from its opening tag to the line that closes
 * it. Blocks written on one line close on the same line.
 */
function stripPageOnly(content: string) {
  const out: string[] = []
  let inBlock = false
  for (const line of content.split("\n")) {
    if (inBlock) {
      if (/^\/>|^<\/[A-Z]/.test(line.trim())) inBlock = false
      continue
    }
    const opens = PAGE_ONLY.some((name) =>
      line.trimStart().startsWith(`<${name}`)
    )
    if (opens) {
      if (!/\/>\s*$/.test(line)) inBlock = true
      continue
    }
    out.push(line)
  }
  return out.join("\n").replace(/\n{3,}/g, "\n\n")
}

/**
 * The doc as plain Markdown: title, description and the body with the
 * page-only blocks left out and the rest replaced by what they stand for,
 * so a reader or a model gets the same information the page shows.
 */
export function toMarkdown(doc: RegistryDoc) {
  const body = stripPageOnly(doc.content)
    // An exhibit is a live example with its code: keep its title as a label
    // and its code panes, and drop the wrappers.
    .replace(
      /<ExhibitGrid>\n|<\/ExhibitGrid>\n|<\/Exhibit>\n|<\/ExhibitCode>\n/g,
      ""
    )
    .replace(/<Exhibit\b[^>]*?title="([^"]*)"[^>]*>\n/g, "**$1**\n\n")
    .replace(/<Exhibit\b[^>]*>\n/g, "")
    .replace(/<ExhibitCode(?: label="([^"]*)")?>\n/g, (_, label?: string) =>
      label ? `_${label}_\n` : ""
    )
    .replace(
      /<Install\s+name="([^"]+)"[\s\S]*?\/>/g,
      (_, name: string) =>
        "```bash\nnpx shadcn@latest add https://fibo.toribryan.com/r/" +
        name +
        ".json\n```"
    )
    .replace(
      /<(Callout|Tip)[^>]*>([\s\S]*?)<\/\1>/g,
      (_, _tag, inner: string) =>
        inner
          .trim()
          .split("\n")
          .map((line: string) => `> ${line.trim()}`)
          .join("\n")
    )
  return `# ${doc.metadata.title}\n\n${doc.metadata.description}\n\n${body.trim()}\n`
}
