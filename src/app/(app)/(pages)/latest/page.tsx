import type { Metadata } from "next"
import Image from "next/image"
import type { Blog, WithContext } from "schema-dts"

import { JSON_LD_ID } from "@/config/json-ld"
import { jsonLdBreadcrumbList, JsonLdScript } from "@/lib/json-ld"
import { absoluteUrl } from "@/lib/utils"
import {
  PageHeading,
  PageHeadingDescription,
  PageHeadingTagline,
  PageHeadingTitle,
} from "@/components/page-heading"
import { DocList } from "@/features/doc/components/doc-list"
import { getLatestPosts } from "@/features/doc/data/documents"
import type { Doc } from "@/features/doc/types/document"

const title = "Blog"
const description = "Projects, creative retros, and notes from the work"

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/latest" },
  openGraph: { url: "/latest", type: "website" },
}

function getBlogJsonLd(posts: Doc[]): WithContext<Blog> {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": absoluteUrl("/latest"),
    name: title,
    description,
    url: absoluteUrl("/latest"),
    author: { "@id": JSON_LD_ID.person },
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      "@id": absoluteUrl(`/latest/${post.slug}`),
      headline: post.metadata.title,
      datePublished: new Date(post.metadata.createdAt).toISOString(),
      url: absoluteUrl(`/latest/${post.slug}`),
    })),
    isPartOf: { "@id": JSON_LD_ID.website },
  }
}

export default function Page() {
  const posts = getLatestPosts()

  return (
    <>
      <JsonLdScript data={getBlogJsonLd(posts)} />
      <JsonLdScript
        data={jsonLdBreadcrumbList([
          { name: "Home", href: "/" },
          { name: "Blog", href: "/latest" },
        ])}
      />

      <div>
        {/* Opens the page the way the profile header's shader opens the home
            page. The layout already draws the side rules, so this only needs
            the bottom one to sit in the same grid. */}
        {/* `-mt-12` cancels the pt-12 the (pages) layout applies, so the banner
            sits flush under the site header. */}
        <figure className="screen-line-bottom relative -mt-12 h-[112px] overflow-hidden bg-[#1A1423]">
          <Image
            className="object-cover object-center"
            src="/images/blog/banner.webp"
            alt="A painted Victorian parlour: a vase of red, white and yellow flowers on a round table before a curtained window, a green armchair to one side and two pale statues flanking the room."
            fill
            sizes="(min-width: 768px) 48rem, 100vw"
            priority
            unoptimized
          />

          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-black/50 to-transparent"
            aria-hidden
          />

          <figcaption className="pointer-events-none absolute right-2 bottom-2 text-sm leading-none tracking-wide text-white/80 select-none sm:right-4 sm:bottom-4">
            Horace Pippin, 1945.
          </figcaption>
        </figure>

        <PageHeading className="pt-5">
          <PageHeadingTagline>Blog</PageHeadingTagline>
          <PageHeadingTitle>Pivot Notes and Creative Retros</PageHeadingTitle>
          <PageHeadingDescription>{description}</PageHeadingDescription>
        </PageHeading>

        <DocList docs={posts} basePath="/latest" emptyMessage="No posts yet." />

        <div className="h-4" />
      </div>
    </>
  )
}
