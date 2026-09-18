import { getTweet } from "react-tweet/api"

import { TweetQuote } from "@/components/ui/tweet-card"
import { ComponentList } from "@/features/components/components/component-list"
import { COMPONENTS } from "@/features/components/data/registry"
import { getRegistryDocs } from "@/features/components/data/registry-docs"
import { USER } from "@/features/portfolio/data/user"

import { Panel, PanelHeader, PanelTitle, PanelTitleSup } from "./panel"
import { PanelTitleCopy } from "./panel-title-copy"

const ID = "components"

/**
 * Components published on their own: every component as a cell into its
 * page, then the newest one's announcement as a quote, fetched once at build
 * so the section renders without a request.
 */
export async function Components() {
  const docs = getRegistryDocs().filter((doc) => doc.slug in COMPONENTS)
  const featured = docs
    .map((doc) => COMPONENTS[doc.slug]?.links.post)
    .find(Boolean)
  const post = featured
    ? await getTweet(featured.id).catch((error) => {
        console.error("Could not fetch the announcement post", error)
        return null
      })
    : null

  return (
    <Panel id={ID}>
      <PanelHeader>
        <PanelTitle>
          <a href={`#${ID}`}>Components</a>
          <PanelTitleSup>({docs.length})</PanelTitleSup>
          <PanelTitleCopy id={ID} />
        </PanelTitle>
      </PanelHeader>

      <div className="screen-line-bottom h-4" />
      <ComponentList
        items={docs.map((doc) => ({
          slug: doc.slug,
          name: doc.metadata.title,
          isNew: doc.metadata.new,
        }))}
      />
      <div className="screen-line-top h-4" />

      {post && (
        <div className="screen-line-top p-4">
          <TweetQuote tweet={post} avatar={USER.headerAvatar} />
        </div>
      )}
    </Panel>
  )
}
