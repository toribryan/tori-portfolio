import fs from "fs"
import path from "path"
import { cache } from "react"
import matter from "gray-matter"

import type { Doc, DocMetadata } from "@/features/doc/types/document"

function parseFrontmatter(fileContent: string) {
  const file = matter(fileContent)

  return {
    metadata: file.data as DocMetadata,
    content: file.content,
  }
}

function getMDXFiles(dir: string) {
  return fs.readdirSync(dir).filter((file) => path.extname(file) === ".mdx")
}

function readMDXFile(filePath: string) {
  const rawContent = fs.readFileSync(filePath, "utf-8")
  return parseFrontmatter(rawContent)
}

/**
 * Reads MDX docs from `dir`, grouping them by their immediate subfolder.
 * The subfolder name is the doc's category (e.g. `content/work/*.mdx` yields
 * docs with `category: "work"`), so category is derived from the file location
 * rather than declared in frontmatter. Files placed directly in `dir` are
 * ignored — only category folders are read.
 */
function getMDXData(dir: string) {
  const categoryDirs = fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())

  return categoryDirs.flatMap((categoryDir) => {
    const category = categoryDir.name
    const categoryPath = path.join(dir, category)

    return getMDXFiles(categoryPath).map<Doc>((file) => {
      const { metadata, content } = readMDXFile(path.join(categoryPath, file))

      const slug = path.basename(file, path.extname(file))

      return {
        metadata: { ...metadata, category },
        slug,
        content,
      }
    })
  })
}

/**
 * Ordering, in precedence: an explicit `order` wins over everything, then
 * `pinned`, then newest first.
 */
function compareDocs(a: Doc, b: Doc) {
  const aOrder = a.metadata.order
  const bOrder = b.metadata.order

  if (aOrder != null && bOrder != null) return aOrder - bOrder
  if (aOrder != null) return -1
  if (bOrder != null) return 1

  if (a.metadata.pinned && !b.metadata.pinned) return -1
  if (!a.metadata.pinned && b.metadata.pinned) return 1

  return (
    new Date(b.metadata.createdAt).getTime() -
    new Date(a.metadata.createdAt).getTime()
  )
}

export const getAllDocs = cache(() => {
  return getMDXData(path.join(process.cwd(), "src/features/doc/content")).sort(
    compareDocs
  )
})

export function getDocBySlug(slug: string) {
  return getAllDocs().find((doc) => doc.slug === slug)
}

export function getDocsByCategory(category: string) {
  return getAllDocs().filter((doc) => doc.metadata?.category === category)
}

/** Categories derived from the doc's content subfolder. */
export const COMPONENTS_CATEGORY = "components"
export const LATEST_CATEGORY = "latest"
export const WORK_CATEGORY = "work"

/** Component libraries — docs under the `components/` content folder. */
export function getComponentDocs() {
  return getDocsByCategory(COMPONENTS_CATEGORY)
}

/** Latest posts — docs under the `latest/` content folder. */
export function getLatestPosts() {
  return getDocsByCategory(LATEST_CATEGORY)
}

/** Case studies — docs under the `work/` content folder. */
export function getWorkDocs() {
  return getDocsByCategory(WORK_CATEGORY)
}

export function findNeighbour(docs: Doc[], slug: string) {
  const len = docs.length

  for (let i = 0; i < len; ++i) {
    if (docs[i].slug === slug) {
      return {
        previous: i > 0 ? docs[i - 1] : null,
        next: i < len - 1 ? docs[i + 1] : null,
      }
    }
  }

  return { previous: null, next: null }
}
