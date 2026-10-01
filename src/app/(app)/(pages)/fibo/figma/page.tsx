import type { Metadata } from "next"

import { jsonLdBreadcrumbList, JsonLdScript } from "@/lib/json-ld"
import { ArrowUpRightIcon } from "@/components/animated-icons/arrow-up-right-icon"
import { Button } from "@/components/base/ui/button"
import {
  PageHeading,
  PageHeadingDescription,
  PageHeadingTagline,
  PageHeadingTitle,
} from "@/components/page-heading"
import { FigmaIcon } from "@/features/portfolio/components/fibo-hero/brand-icons"
import { FIBO } from "@/features/portfolio/components/fibo-hero/links"

const title = "fibo in Figma"
const description =
  "The fibo library file: every component and the variables its tokens are named after. Pan and zoom here, or open the file in Figma to inspect it."

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/fibo/figma" },
  openGraph: { url: "/fibo/figma", type: "website" },
}

export default function Page() {
  return (
    <>
      <JsonLdScript
        data={jsonLdBreadcrumbList([
          { name: "Home", href: "/" },
          { name: title, href: "/fibo/figma" },
        ])}
      />

      <PageHeading>
        <PageHeadingTagline>fibo</PageHeadingTagline>
        <PageHeadingTitle>{title}</PageHeadingTitle>
        <PageHeadingDescription>{description}</PageHeadingDescription>
      </PageHeading>

      <div className="screen-line-bottom flex flex-wrap gap-2 p-4">
        <Button
          nativeButton={false}
          render={<a href={FIBO.figma} target="_blank" rel="noreferrer" />}
        >
          <FigmaIcon data-icon="inline-start" />
          Open in Figma
          <ArrowUpRightIcon data-icon="inline-end" />
        </Button>
      </div>

      <iframe
        src={FIBO.figmaEmbed}
        title="The fibo design system file in Figma"
        className="block h-[max(28rem,75svh)] w-full border-0 bg-muted"
        allowFullScreen
      />

      <div className="screen-line-top h-4" />
    </>
  )
}
