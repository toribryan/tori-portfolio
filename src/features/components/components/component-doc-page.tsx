import { getTableOfContents } from "fumadocs-core/content/toc"
import { ArrowUpRightIcon } from "lucide-react"
import { getTweet } from "react-tweet/api"

import { cleanTableOfContents } from "@/lib/toc"
import { absoluteUrl } from "@/lib/utils"
import { TweetQuote } from "@/components/ui/tweet-card"
import { Button } from "@/components/base/ui/button"
import { Prose } from "@/components/base/ui/typography"
import { MDX } from "@/components/mdx"
import { TOCInline } from "@/components/toc-inline"
import type { ComponentEntry } from "@/features/components/data/registry"
import { COMPONENTS } from "@/features/components/data/registry"
import type { RegistryDoc } from "@/features/components/data/registry-docs"
import {
  getRegistryDocs,
  toMarkdown,
} from "@/features/components/data/registry-docs"
import { USER } from "@/features/portfolio/data/user"

import { ComponentPageActions } from "./component-page-actions"
import { ComponentPreview } from "./component-preview"
import { InstallCommand } from "./install-command"

/**
 * The reading layout for a component doc: the header actions, the title, links to
 * the registry and the post, the post itself, the table of contents and the
 * MDX body. The description stays in metadata for search and social cards.
 */
export async function ComponentDocPage({
  doc,
  entry,
}: {
  doc: RegistryDoc
  entry: ComponentEntry
}) {
  const toc = cleanTableOfContents(await getTableOfContents(doc.content))
  const siblings = getRegistryDocs().filter((d) => d.slug in COMPONENTS)
  const index = siblings.findIndex((d) => d.slug === doc.slug)
  const post = entry.links.post
    ? await getTweet(entry.links.post.id).catch((error) => {
        console.error("Could not fetch the announcement post", error)
        return null
      })
    : null

  return (
    <>
      <ComponentPageActions
        slug={doc.slug}
        title={doc.metadata.title}
        markdown={toMarkdown(doc)}
        markdownUrl={absoluteUrl(`/components/${doc.slug}.md`)}
        pageUrl={absoluteUrl(`/components/${doc.slug}`)}
        previous={neighbour(siblings, index - 1)}
        next={neighbour(siblings, index + 1)}
      />

      <h1 className="screen-line-bottom overflow-x-clip px-4 py-6 font-heading text-4xl font-medium tracking-normal text-balance">
        {doc.metadata.title}
      </h1>

      <Prose className="px-4 pt-8 pb-4">
        <div className="not-prose mb-6 flex flex-wrap items-center gap-2">
          <Button
            className="gap-1.5"
            size="sm"
            nativeButton={false}
            render={
              <a
                href={entry.links.registry}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open on 21st.dev
                <ArrowUpRightIcon />
              </a>
            }
          />
          {entry.links.post && (
            <Button
              className="gap-1.5"
              variant="outline"
              size="sm"
              nativeButton={false}
              render={
                <a
                  href={entry.links.post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Read the post on X
                  <ArrowUpRightIcon />
                </a>
              }
            />
          )}
        </div>

        {post && (
          <div className="not-prose mb-6">
            <TweetQuote tweet={post} avatar={USER.headerAvatar} />
          </div>
        )}

        <TOCInline items={toc} />

        <div>
          <MDX
            code={doc.content}
            components={{ ComponentPreview, InstallCommand }}
          />
        </div>
      </Prose>
    </>
  )
}

function neighbour(docs: RegistryDoc[], index: number) {
  const doc = docs[index]
  return doc ? { slug: doc.slug, title: doc.metadata.title } : undefined
}
