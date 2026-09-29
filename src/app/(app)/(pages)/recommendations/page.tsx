import type { Metadata } from "next"
import { format } from "date-fns"
import { ArrowUpRightIcon } from "lucide-react"

import { jsonLdBreadcrumbList, JsonLdScript } from "@/lib/json-ld"
import { Button } from "@/components/base/ui/button"
import {
  PageHeading,
  PageHeadingDescription,
  PageHeadingTagline,
  PageHeadingTitle,
} from "@/components/page-heading"
import {
  recommendationId,
  RECOMMENDATIONS,
} from "@/features/portfolio/data/recommendations"
import { SOCIAL } from "@/features/portfolio/data/social-links"

const title = "Recommendations"
const description =
  "What the people I've worked with wrote about me on LinkedIn, in full."

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/recommendations" },
  openGraph: { url: "/recommendations", type: "website" },
}

export default function Page() {
  return (
    <>
      <JsonLdScript
        data={jsonLdBreadcrumbList([
          { name: "Home", href: "/" },
          { name: title, href: "/recommendations" },
        ])}
      />

      <PageHeading>
        <PageHeadingTagline>LinkedIn</PageHeadingTagline>
        <PageHeadingTitle>{title}</PageHeadingTitle>
        <PageHeadingDescription>{description}</PageHeadingDescription>
      </PageHeading>

      <div className="screen-line-bottom px-4 pb-4">
        <Button
          className="gap-1.5"
          variant="outline"
          size="sm"
          nativeButton={false}
          render={
            <a
              href={`${SOCIAL.linkedin.href}details/recommendations/`}
              target="_blank"
              rel="noopener noreferrer"
            />
          }
        >
          View on LinkedIn
          <ArrowUpRightIcon />
        </Button>
      </div>

      <ol className="flex flex-col">
        {RECOMMENDATIONS.map(({ name, role, date, quote, text, profile }) => (
          <li
            key={name}
            id={recommendationId(name)}
            className="screen-line-bottom scroll-mt-[calc(var(--header-height)+1rem)] p-4"
          >
            <p className="flex flex-wrap items-baseline gap-x-2">
              {profile ? (
                <a
                  href={profile}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium underline-offset-2 hover:underline"
                >
                  {name}
                </a>
              ) : (
                <span className="font-medium">{name}</span>
              )}
              <span className="text-sm text-muted-foreground">{role}</span>
              <time
                className="ml-auto font-mono text-xs text-muted-foreground"
                dateTime={date}
              >
                {format(new Date(`${date}-01T00:00:00`), "MMM yyyy")}
              </time>
            </p>
            <blockquote className="mt-2 text-pretty whitespace-pre-line text-muted-foreground">
              {text ?? quote}
            </blockquote>
          </li>
        ))}
      </ol>
    </>
  )
}
