import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getTweet } from "react-tweet/api"

import { SITE_INFO } from "@/config/site"
import { USER } from "@/features/portfolio/data/user"
import { Deck } from "@/features/review/components/deck"
import { findSlideIndex, SECTIONS, SLIDES } from "@/features/review/data/deck"

/** Who the hello screen greets. */
const AUDIENCE = "Assembled"

/** The post quoted on the observations slide. */
const TWEET_ID = "2097051500044513414"

export const revalidate = false
export const dynamic = "force-static"
export const dynamicParams = false

/**
 * The deck is one client tree; every slide is a route only so that a moment
 * of it can be linked. `/review` alone opens on the cover.
 */
export async function generateStaticParams() {
  return [
    { path: [] },
    ...SLIDES.map((slide) => ({ path: [slide.section, slide.slug] })),
  ]
}

export async function generateMetadata({
  params,
}: PageProps<"/review/[[...path]]">): Promise<Metadata> {
  const { path } = await params
  const index = findSlideIndex(path?.join("/"))
  const slide = SLIDES[index]
  const section = SECTIONS.find((s) => s.slug === slide?.section)

  const title = slide
    ? `${slide.title} – ${section?.title} – Portfolio review`
    : "Portfolio review"

  return {
    title: { absolute: `${title} – ${USER.displayName}` },
    description:
      "A guided walkthrough of one product project and one design system project, with links to the case studies, the live products, and the Storybook.",
    // Unlisted: it is a link to hand to a reviewer, not a page to be found.
    robots: { index: false, follow: false },
    alternates: { canonical: "/review" },
    openGraph: {
      title: `Portfolio review – ${USER.displayName}`,
      url: "/review",
      siteName: SITE_INFO.name,
      images: [{ url: SITE_INFO.ogImage, width: 1200, height: 630 }],
    },
  }
}

export default async function Page({
  params,
}: PageProps<"/review/[[...path]]">) {
  const { path } = await params
  const index = findSlideIndex(path?.join("/"))

  if (index < 0) {
    notFound()
  }

  const tweet = await getTweet(TWEET_ID).catch((error) => {
    console.warn(`Could not fetch tweet ${TWEET_ID}:`, error)
    return null
  })

  return (
    <Deck
      initialIndex={index}
      greeting={!path?.length}
      audience={AUDIENCE}
      data={{ tweet: tweet ?? null }}
    />
  )
}
