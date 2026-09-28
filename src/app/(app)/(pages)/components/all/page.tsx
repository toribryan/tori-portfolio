import type { Metadata } from "next"

import { jsonLdBreadcrumbList, JsonLdScript } from "@/lib/json-ld"
import {
  PageHeading,
  PageHeadingDescription,
  PageHeadingTagline,
  PageHeadingTitle,
} from "@/components/page-heading"
import { ComponentCardList } from "@/features/portfolio/components/components/component-card-list"

const title = "Components"
const description =
  "fibo's special components: parts built for real product work, and a few just for fun. Each installs as source with one shadcn command."

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/components/all" },
  openGraph: { url: "/components/all", type: "website" },
}

export default function Page() {
  return (
    <>
      <JsonLdScript
        data={jsonLdBreadcrumbList([
          { name: "Home", href: "/" },
          { name: title, href: "/components/all" },
        ])}
      />

      <PageHeading>
        <PageHeadingTagline>fibo</PageHeadingTagline>
        <PageHeadingTitle>Special components</PageHeadingTitle>
        <PageHeadingDescription>{description}</PageHeadingDescription>
      </PageHeading>

      <ComponentCardList />

      <div className="screen-line-top h-4" />
    </>
  )
}
