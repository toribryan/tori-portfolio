import type { Metadata } from "next"

import { jsonLdBreadcrumbList, JsonLdScript } from "@/lib/json-ld"
import { Components } from "@/features/portfolio/components/components"
import { FiboHero } from "@/features/portfolio/components/fibo-hero"
import { FiboStory } from "@/features/portfolio/components/fibo-story"
import { FiboUse } from "@/features/portfolio/components/fibo-use"

const title = "fibo"
const description =
  "An achromatic design system for experimental projects, named after a pixel rabbit and the puzzle that started the Fibonacci sequence. Installs as source from a shadcn registry."

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

      <FiboHero heading="h1" />
      <Components />
      <Separator />

      <FiboStory />
      <Separator />

      <FiboUse />
      <div className="h-4" />
    </>
  )
}

function Separator() {
  return <div className="stripe-divider h-8 w-full" />
}
