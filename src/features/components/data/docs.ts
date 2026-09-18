import fs from "fs"
import path from "path"
import { cache } from "react"
import matter from "gray-matter"

export type ComponentDocMetadata = {
  title: string
  description: string
  createdAt: string
  updatedAt: string
  new?: boolean
}

export type ComponentDoc = {
  slug: string
  metadata: ComponentDocMetadata
  content: string
}

const CONTENT_DIR = path.join(process.cwd(), "src/features/components/content")

/** Every component doc under `content/`, newest first. */
export const getComponentDocs = cache((): ComponentDoc[] =>
  fs
    .readdirSync(CONTENT_DIR)
    .filter((file) => path.extname(file) === ".mdx")
    .map((file) => {
      const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf-8")
      const parsed = matter(raw)
      return {
        slug: path.basename(file, ".mdx"),
        metadata: parsed.data as ComponentDocMetadata,
        content: parsed.content,
      }
    })
    .sort(
      (a, b) =>
        new Date(b.metadata.createdAt).getTime() -
        new Date(a.metadata.createdAt).getTime()
    )
)

export function getComponentDoc(slug: string) {
  return getComponentDocs().find((doc) => doc.slug === slug)
}
