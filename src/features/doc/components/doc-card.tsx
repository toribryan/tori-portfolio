import type { Route } from "next"
import type { ImageProps } from "next/image"
import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"

import { cn } from "@/lib/utils"
import type { Doc } from "@/features/doc/types/document"

type HeadingTypes = "h2" | "h3" | "h4"

/**
 * Cover-image card used by both the Latest feed and the Projects section. The
 * whole card is one link target; the image desaturates until hover.
 */
export function DocCard({
  doc,
  basePath,
  headingAs,
  imageLoading = "lazy",
}: {
  doc: Doc
  /** Route prefix the slug is appended to, e.g. "/work". */
  basePath: string
  headingAs?: HeadingTypes
  imageLoading?: ImageProps["loading"]
}) {
  const Heading = headingAs ?? "h2"
  const {
    image,
    title,
    period,
    createdAt,
    claim,
    new: isNew,
    updated,
  } = doc.metadata

  return (
    <div className="group/doc-card relative flex h-full flex-col gap-2 p-2 transition-[background-color] ease-out hover:bg-accent-muted">
      <div className="relative select-none [--image-radius:var(--radius-xl)]">
        {image ? (
          <Image
            className="aspect-1200/630 w-full rounded-(--image-radius) object-cover grayscale transition-[filter] duration-300 ease-[cubic-bezier(0.42,0,0.58,1)] group-hover/doc-card:grayscale-0"
            src={image}
            alt={title}
            width={1200}
            height={630}
            quality={100}
            loading={imageLoading}
            /**
             * Not negotiable while the password gate is on. `/_next/image`
             * fetches the source URL server-side with no session cookie, so
             * middleware.ts bounces it to /login and the optimizer reports
             * "The requested resource isn't a valid image". Covers are sized
             * to the card at export time instead.
             */
            unoptimized
          />
        ) : (
          <div
            className="flex aspect-1200/630 items-center justify-center rounded-(--image-radius) bg-surface px-6"
            aria-hidden
          >
            <span className="line-clamp-2 text-center font-mono text-sm text-muted-foreground">
              {title}
            </span>
          </div>
        )}
        <div
          className={cn(
            "pointer-events-none absolute inset-0 rounded-(--image-radius)",
            "inset-ring-1 inset-ring-black/15 dark:inset-ring-white/15"
          )}
        />
      </div>

      <div className="flex flex-col gap-1 p-2">
        <Heading className="text-lg leading-snug font-medium text-balance">
          <Link href={`${basePath}/${doc.slug}` as Route}>
            <span className="absolute inset-0" aria-hidden />
            {title}
          </Link>

          {(isNew || updated) && (
            <span className="pointer-events-none ml-2 inline-block size-2 -translate-y-px rounded-full bg-info">
              <span className="sr-only">{isNew ? "New" : "Updated"}</span>
            </span>
          )}
        </Heading>

        {/* The claim is what makes the grid readable without opening anything:
            the title names the project, this says what it changed. Clamped to
            two lines so a long one can't push the cards out of alignment. */}
        {claim && (
          <p className="line-clamp-2 text-sm leading-snug text-pretty text-muted-foreground">
            {claim}
          </p>
        )}

        <dl>
          <dt className="sr-only">Published</dt>
          <dd
            className={cn(
              "text-muted-foreground",
              // With a claim above it the date is the third line down, so it
              // steps back. Without one (the Latest feed) it keeps its size.
              claim ? "font-mono text-xs tracking-wide" : "text-sm"
            )}
          >
            {/* Case studies show their run dates; posts show a publish date. */}
            {period ?? (
              <time dateTime={new Date(createdAt).toISOString()}>
                {format(new Date(createdAt), "dd.MM.yyyy")}
              </time>
            )}
          </dd>
        </dl>
      </div>
    </div>
  )
}
