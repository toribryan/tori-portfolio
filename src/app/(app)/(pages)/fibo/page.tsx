import type { Metadata } from "next"

import { jsonLdBreadcrumbList, JsonLdScript } from "@/lib/json-ld"
import { FiboHero } from "@/features/portfolio/components/fibo-hero"
import { FiboStory } from "@/features/portfolio/components/fibo-story"

const title = "fibo"
const description =
  "The story behind fibo: a pixel rabbit, and the puzzle that started the Fibonacci sequence."

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/fibo" },
  openGraph: { url: "/fibo", type: "website" },
}

export default function Page() {
  return (
    <>
      <JsonLdScript
        data={jsonLdBreadcrumbList([
          { name: "Home", href: "/" },
          { name: title, href: "/fibo" },
        ])}
      />

      <FiboHero variant="page" />
      <div className="stripe-divider h-8 w-full" />
      <FiboStory />
      <div className="h-4" />
    </>
  )
}
