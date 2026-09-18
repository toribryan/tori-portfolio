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

function VerifiedIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-label="Verified">
      <path
        fill="currentColor"
        d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z"
      />
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

function truncate(str: string | null, length: number) {
  if (!str || str.length <= length) return str
  return `${str.slice(0, length - 3)}...`
}

export function TweetNotFound({
  href,
  className,
}: {
  /** Where to send the reader when the post could not be loaded. */
  href?: string
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex size-full flex-col items-center justify-center gap-2 rounded-xl border border-line p-4 text-sm text-muted-foreground",
        className
      )}
    >
      <p>Post not found</p>
      {href && (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="link-underline"
        >
          Open on X
        </a>
      )}
    </div>
  )
}

function TweetHeader({
  tweet,
  avatar,
}: {
  tweet: EnrichedTweet
  avatar?: string
}) {
  const verified = tweet.user.verified || tweet.user.is_blue_verified
  return (
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-3">
        <a
          href={tweet.user.url}
          target="_blank"
          rel="noreferrer"
          className="shrink-0"
        >
          <img
            alt={tweet.user.screen_name}
            height={40}
            width={40}
            src={avatar ?? tweet.user.profile_image_url_https}
            className="size-10 rounded-full border border-line"
          />
        </a>
        <div className="flex flex-col gap-0.5">
          <a
            href={tweet.user.url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center text-sm font-medium whitespace-nowrap text-foreground transition-opacity hover:opacity-80"
          >
            {truncate(tweet.user.name, 20)}
            {verified && (
              <VerifiedIcon className="ml-1 inline size-4 text-info" />
            )}
          </a>
          <a
            href={tweet.user.url}
            target="_blank"
            rel="noreferrer"
            className="font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            @{truncate(tweet.user.screen_name, 16)}
          </a>
        </div>
      </div>
      <a
        href={tweet.url}
        target="_blank"
        rel="noreferrer"
        className="text-muted-foreground transition-colors hover:text-foreground"
      >
        <span className="sr-only">Open the post on X</span>
        <XIcon className="size-4" />
      </a>
    </div>
  )
}

function TweetBody({ tweet }: { tweet: EnrichedTweet }) {
  return (
    <p className="text-[15px] leading-relaxed wrap-break-word text-foreground">
      {tweet.entities.map((entity, i) => {
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
      })}
    </p>
  )
}

function TweetMedia({ tweet }: { tweet: EnrichedTweet }) {
  if (tweet.video) {
    return (
      <video
        poster={tweet.video.poster}
        autoPlay
        loop
        muted
        playsInline
        className="w-full rounded-lg border border-line"
      >
        <source src={tweet.video.variants[0].src} type="video/mp4" />
      </video>
    )
  }
  if (tweet.photos) {
    return (
      <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto">
        {tweet.photos.map((photo) => (
          <img
            key={photo.url}
            src={photo.url}
            width={photo.width}
            height={photo.height}
            alt={tweet.text}
            className="h-64 w-5/6 shrink-0 snap-center rounded-lg border border-line object-cover"
          />
        ))}
      </div>
    )
  }
  return null
}

/**
 * A post as a pull quote: the text, then who said it, with the X
 * mark in the corner leading to the original. No media, so it reads as a
 * quote rather than an embed.
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
        {enriched.entities.map((entity, i) => {
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
                <span
                  key={i}
                  dangerouslySetInnerHTML={{ __html: entity.text }}
                />
              )
            default:
              return null
          }
        })}
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

/**
 * A post from X in the site's own type and hairlines, built from data
 * fetched with `getTweet` from `react-tweet/api` wherever it is convenient
 * to fetch, so this stays free of any request.
 */
export function TweetCard({
  tweet,
  avatar,
  className,
}: {
  tweet: Tweet
  /** Stands in for the profile picture X serves. */
  avatar?: string
  className?: string
}) {
  const enriched = enrich(tweet)
  return (
    <div
      className={cn(
        "flex w-full flex-col gap-4 rounded-xl border border-line bg-background p-5",
        className
      )}
    >
      <TweetHeader tweet={enriched} avatar={avatar} />
      <TweetBody tweet={enriched} />
      <TweetMedia tweet={enriched} />
    </div>
  )
}
