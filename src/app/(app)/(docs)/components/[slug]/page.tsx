import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { jsonLdBreadcrumbList, JsonLdScript } from "@/lib/json-ld"
import { ComponentDocPage } from "@/features/components/components/component-doc-page"
import {
  getComponentDoc,
  getComponentDocs,
} from "@/features/components/data/docs"
import { COMPONENTS } from "@/features/components/data/registry"

export const revalidate = false
export const dynamic = "force-static"
export const dynamicParams = false

export function generateStaticParams() {
  return getComponentDocs().map((doc) => ({ slug: doc.slug }))
}

export async function generateMetadata({
  params,
}: PageProps<"/components/[slug]">): Promise<Metadata> {
  const { slug } = await params
  const doc = getComponentDoc(slug)
  if (!doc) return {}
  const url = `/components/${doc.slug}`
  return {
    title: doc.metadata.title,
    description: doc.metadata.description,
    alternates: { canonical: url },
    openGraph: { url, type: "article" },
  }
}

export default async function Page({
  params,
}: PageProps<"/components/[slug]">) {
  const { slug } = await params
  const doc = getComponentDoc(slug)
  const entry = COMPONENTS[slug]
  if (!doc || !entry) notFound()

  return (
    <>
      <JsonLdScript
        data={jsonLdBreadcrumbList([
          { name: "Home", href: "/" },
          { name: "Components", href: "/#components" },
          { name: doc.metadata.title, href: `/components/${doc.slug}` },
        ])}
      />
      <ComponentDocPage doc={doc} entry={entry} />
    </>
  )
}
