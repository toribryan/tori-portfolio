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

/**
 * The doc as plain Markdown: title, description and the body with the two
 * page-only blocks replaced by what they stand for, so a reader or a model
 * gets the same information the page shows.
 */
export function toMarkdown(doc: RegistryDoc) {
  const body = doc.content
    .replace(/<ComponentPreview[^>]*\/>\n?/g, "")
    .replace(
      /<InstallCommand name="([^"]+)"\s*\/>/g,
      (_, name: string) => "```bash\nnpx @21st-dev/cli add " + name + "\n```"
    )
    .replace(/<Callout>([\s\S]*?)<\/Callout>/g, (_, inner: string) =>
      inner
        .trim()
        .split("\n")
        .map((line) => `> ${line.trim()}`)
        .join("\n")
    )
  return `# ${doc.metadata.title}\n\n${doc.metadata.description}\n\n${body.trim()}\n`
}
