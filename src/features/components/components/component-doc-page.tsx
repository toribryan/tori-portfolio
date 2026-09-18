import type { Route } from "next"
import Link from "next/link"
import { getTableOfContents } from "fumadocs-core/content/toc"
import { ArrowLeftIcon, ExternalLinkIcon } from "lucide-react"
import { getTweet } from "react-tweet/api"

import { cleanTableOfContents } from "@/lib/toc"
import { TweetQuote } from "@/components/ui/tweet-card"
import { Button } from "@/components/base/ui/button"
import { Prose } from "@/components/base/ui/typography"
import { MDX } from "@/components/mdx"
import { TOCInline } from "@/components/toc-inline"
import type { ComponentDoc } from "@/features/components/data/docs"
import type { ComponentEntry } from "@/features/components/data/registry"

/**
 * The reading layout for a component doc: the header row with the way back
 * and the registry link, the title, the lead, the table of contents, the MDX
 * body, and the announcement post if there is one.
 */
export async function ComponentDocPage({
  doc,
  entry,
}: {
  doc: ComponentDoc
  entry: ComponentEntry
}) {
  const toc = cleanTableOfContents(await getTableOfContents(doc.content))
  const post = entry.links.post
    ? await getTweet(entry.links.post.id).catch((error) => {
        console.error("Could not fetch the announcement post", error)
        return null
      })
    : null

  return (
    <>
      <div className="screen-line-bottom flex items-center justify-between p-2 pl-4">
        <Button
          className="h-7 gap-2 border-none px-0 tracking-wider text-muted-foreground hover:text-foreground hover:no-underline"
          variant="link"
          size="sm"
          nativeButton={false}
          render={
            <Link href={"/#components" as Route}>
              <ArrowLeftIcon />
              Components
            </Link>
          }
        />
        <Button
          className="h-7 gap-2"
          variant="outline"
          size="sm"
          nativeButton={false}
          render={
            <a href={entry.links.registry} target="_blank" rel="noopener">
              Open on 21st.dev
              <ExternalLinkIcon />
            </a>
          }
        />
      </div>

      <h1 className="screen-line-bottom overflow-x-clip px-4 py-6 font-heading text-4xl font-medium tracking-normal text-balance">
        {doc.metadata.title}
      </h1>

      <Prose className="px-4 pt-8 pb-4">
        <p className="lead text-muted-foreground">{doc.metadata.description}</p>

        <TOCInline items={toc} />

        <div>
          <MDX code={doc.content} />
        </div>

        {post && (
          <div className="not-prose mt-10">
            <TweetQuote tweet={post} />
          </div>
        )}
      </Prose>
    </>
  )
}
