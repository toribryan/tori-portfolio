import { getTweet } from "react-tweet/api"

import { TweetQuote } from "@/components/ui/tweet-card"
import { ComponentList } from "@/features/components/components/component-list"
import { getComponentDocs } from "@/features/components/data/docs"
import { COMPONENTS } from "@/features/components/data/registry"
import { USER } from "@/features/portfolio/data/user"

import { Panel, PanelHeader, PanelTitle, PanelTitleSup } from "./panel"
import { PanelTitleCopy } from "./panel-title-copy"

const ID = "components"

/**
 * Components published on their own. The newest one's announcement leads as
 * a quote, fetched once at build so the section renders without a request,
 * then every component as a cell into its page.
 */
export async function Components() {
  const docs = getComponentDocs()
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

      {post && (
        <div className="screen-line-bottom p-4">
          <TweetQuote tweet={post} avatar={USER.headerAvatar} />
        </div>
      )}

      <div className="screen-line-bottom h-4" />
      <ComponentList
        items={docs.map((doc) => ({
          slug: doc.slug,
          name: doc.metadata.title,
          isNew: doc.metadata.new,
        }))}
      />
      <div className="screen-line-top h-4" />
    </Panel>
  )
}
