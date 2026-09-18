import { ArrowUpRightIcon } from "lucide-react"
import { getTweet } from "react-tweet/api"

import { TokenFlow } from "@/components/ui/token-flow"
import { TweetCard, TweetNotFound } from "@/components/ui/tweet-card"
import { Button } from "@/components/base/ui/button"

import { TOKEN_ROWS } from "../data/token-flow"
import { Panel, PanelHeader, PanelTitle, PanelTitleSup } from "./panel"
import { PanelTitleCopy } from "./panel-title-copy"

const ID = "components"

const TOKEN_FLOW = {
  url: "https://21st.dev/@iamtoribryan/components/token-flow",
  postId: "2100753096825786556",
  postUrl: "https://x.com/iamtoribryan/status/2100753096825786556",
}

/**
 * Components published outside the case studies. The post is fetched once at
 * build, so the section renders without a request and falls back to a link
 * if X was unreachable.
 */
export async function Components() {
  const post = await getTweet(TOKEN_FLOW.postId).catch((error) => {
    console.error("Could not fetch the token flow post", error)
    return null
  })

  return (
    <Panel id={ID}>
      <PanelHeader>
        <PanelTitle>
          <a href={`#${ID}`}>Components</a>
          <PanelTitleSup>(1)</PanelTitleSup>
          <PanelTitleCopy id={ID} />
        </PanelTitle>
      </PanelHeader>

      <div className="grid gap-4 p-4 md:grid-cols-[1.2fr_1fr]">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h3 className="font-medium">Token flow</h3>
            <p className="text-sm text-balance text-muted-foreground">
              How a colour travels from raw value to primitive to semantic
              utility. Theme aware: switch the site to dark and the rows
              scramble to their dark values.
            </p>
          </div>
          <TokenFlow rows={TOKEN_ROWS} />
          <Button
            variant="outline"
            size="sm"
            className="w-fit gap-1.5"
            nativeButton={false}
            render={
              <a
                href={TOKEN_FLOW.url}
                target="_blank"
                rel="noopener noreferrer"
              />
            }
          >
            Open on 21st.dev
            <ArrowUpRightIcon className="size-3.5" aria-hidden />
          </Button>
        </div>

        {post ? (
          <TweetCard tweet={post} />
        ) : (
          <TweetNotFound href={TOKEN_FLOW.postUrl} />
        )}
      </div>
    </Panel>
  )
}
