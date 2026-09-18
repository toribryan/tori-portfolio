import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ArrowUpRightIcon } from "lucide-react"
import { getTweet } from "react-tweet/api"

import { jsonLdBreadcrumbList, JsonLdScript } from "@/lib/json-ld"
import { TweetQuote } from "@/components/ui/tweet-card"
import { Button } from "@/components/base/ui/button"
import { CopyButton } from "@/components/copy-button"
import {
  PageHeading,
  PageHeadingDescription,
  PageHeadingTagline,
  PageHeadingTitle,
} from "@/components/page-heading"
import { COMPONENTS, getComponent } from "@/features/components/data/registry"

export const dynamicParams = false

export function generateStaticParams() {
  return COMPONENTS.map((entry) => ({ slug: entry.slug }))
}

export async function generateMetadata({
  params,
}: PageProps<"/components/[slug]">): Promise<Metadata> {
  const { slug } = await params
  const entry = getComponent(slug)
  if (!entry) return {}
  return {
    title: entry.name,
    description: entry.description,
    alternates: { canonical: `/components/${entry.slug}` },
    openGraph: { url: `/components/${entry.slug}`, type: "website" },
  }
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="screen-line-top screen-line-bottom px-4 py-2 font-heading text-lg font-medium">
      {children}
    </h2>
  )
}

export default async function Page({
  params,
}: PageProps<"/components/[slug]">) {
  const { slug } = await params
  const entry = getComponent(slug)
  if (!entry) notFound()

  const post = entry.links.post
    ? await getTweet(entry.links.post.id).catch((error) => {
        console.error("Could not fetch the announcement post", error)
        return null
      })
    : null

  return (
    <>
      <JsonLdScript
        data={jsonLdBreadcrumbList([
          { name: "Home", href: "/" },
          { name: "Components", href: "/#components" },
          { name: entry.name, href: `/components/${entry.slug}` },
        ])}
      />

      <PageHeading>
        <PageHeadingTagline>Component</PageHeadingTagline>
        <PageHeadingTitle>{entry.name}</PageHeadingTitle>
        <PageHeadingDescription>{entry.description}</PageHeadingDescription>
      </PageHeading>

      <div className="flex flex-col gap-4 p-4">
        <entry.Preview />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            Live. Switch the site theme and watch the rows swap.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            nativeButton={false}
            render={
              <a
                href={entry.links.registry}
                target="_blank"
                rel="noopener noreferrer"
              />
            }
          >
            Open on 21st.dev
            <ArrowUpRightIcon className="size-3.5" aria-hidden />
          </Button>
        </div>
      </div>

      <SectionTitle>About</SectionTitle>
      <p className="p-4 text-base text-pretty text-muted-foreground">
        {entry.summary}
      </p>

      <SectionTitle>Install</SectionTitle>
      <div className="p-4">
        <div className="group/install relative rounded-[9px] border bg-code">
          <pre className="overflow-x-auto px-4 py-3 pr-12 font-mono text-sm">
            {entry.install}
          </pre>
          <CopyButton
            className="absolute top-1.5 right-1.5 size-7 rounded-[5px] border-none text-muted-foreground"
            variant="ghost"
            size="icon-xs"
            text={entry.install}
            aria-label="Copy install command"
          />
        </div>
      </div>

      <SectionTitle>Props</SectionTitle>
      <dl className="divide-y divide-line">
        {entry.props.map((prop) => (
          <div
            key={prop.name}
            className="grid gap-1 px-4 py-3 sm:grid-cols-[10rem_1fr] sm:gap-4"
          >
            <dt className="flex flex-col gap-0.5 font-mono text-sm">
              <span>{prop.name}</span>
              <span className="text-xs text-muted-foreground">
                {prop.type}
                {prop.default && ` = ${prop.default}`}
              </span>
            </dt>
            <dd className="text-sm text-pretty text-muted-foreground">
              {prop.description}
            </dd>
          </div>
        ))}
      </dl>

      {post && (
        <>
          <SectionTitle>The post</SectionTitle>
          <div className="p-4">
            <TweetQuote tweet={post} />
          </div>
        </>
      )}

      <div className="screen-line-top h-4" />
    </>
  )
}
