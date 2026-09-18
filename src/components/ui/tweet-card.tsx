import { enrichTweet, type EnrichedTweet } from "react-tweet"
import type { Tweet } from "react-tweet/api"

import { cn } from "@/lib/utils"

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

/** Fills in the entity lists the API leaves out when a post has none of that kind. */
function enrich(tweet: Tweet) {
  return enrichTweet({
    ...tweet,
    entities: {
      hashtags: [],
      urls: [],
      symbols: [],
      user_mentions: [],
      ...tweet.entities,
    },
  })
}

/**
 * The post's text with its links live. Text entities come from the
 * syndication API already HTML-encoded, so they are set as HTML the way
 * react-tweet's own body does.
 */
function TweetEntities({ tweet }: { tweet: EnrichedTweet }) {
  return tweet.entities.map((entity, i) => {
    switch (entity.type) {
      case "url":
      case "symbol":
      case "hashtag":
      case "mention":
        return (
          <a
            key={i}
            href={entity.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            {entity.text}
          </a>
        )
      case "text":
        return (
          <span key={i} dangerouslySetInnerHTML={{ __html: entity.text }} />
        )
      default:
        return null
    }
  })
}

/**
 * A post as a pull quote: the text, then who said it, with the X mark in
 * the corner leading to the original. No media, so it reads as a quote
 * rather than an embed. Built from data fetched with `getTweet` from
 * `react-tweet/api` wherever it is convenient to fetch.
 */
export function TweetQuote({
  tweet,
  avatar,
  className,
}: {
  tweet: Tweet
  /** Stands in for the profile picture X serves, e.g. the site's own avatar for its owner. */
  avatar?: string
  className?: string
}) {
  const enriched = enrich(tweet)
  return (
    <figure
      className={cn(
        "flex flex-col gap-6 rounded-2xl border border-line bg-background p-6",
        className
      )}
    >
      <blockquote className="text-lg/relaxed wrap-break-word text-foreground">
        <TweetEntities tweet={enriched} />
      </blockquote>
      <figcaption className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img
            alt=""
            height={44}
            width={44}
            src={avatar ?? enriched.user.profile_image_url_https}
            className="size-11 rounded-full border border-line"
          />
          <div className="flex flex-col">
            <a
              href={enriched.user.url}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-foreground"
            >
              {enriched.user.name}
            </a>
            <span className="text-sm text-muted-foreground">
              @{enriched.user.screen_name}
            </span>
          </div>
        </div>
        <a
          href={enriched.url}
          target="_blank"
          rel="noreferrer"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          <span className="sr-only">Open the post on X</span>
          <XIcon className="size-5" />
        </a>
      </figcaption>
    </figure>
  )
}
