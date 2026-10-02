import type { Metadata } from "next"
import { notFound } from "next/navigation"
import type { CreativeWork, WithContext } from "schema-dts"

import { JSON_LD_ID } from "@/config/json-ld"
import { SITE_INFO } from "@/config/site"
import { jsonLdBreadcrumbList, JsonLdScript } from "@/lib/json-ld"
import { absoluteUrl } from "@/lib/utils"
import { DocEnterSound } from "@/features/doc/components/doc-enter-sound"
import { DocPage } from "@/features/doc/components/doc-page"
import { getDocBySlug, getWorkDocs } from "@/features/doc/data/documents"
import type { Doc } from "@/features/doc/types/document"

export const revalidate = false
export const dynamic = "force-static"
export const dynamicParams = false

export async function generateStaticParams() {
  return getWorkDocs().map((doc) => ({ slug: doc.slug }))
}

function findWorkDoc(slug: string) {
  const doc = getDocBySlug(slug)
  return doc && doc.metadata.category === "work" ? doc : undefined
}

export async function generateMetadata({
  params,
}: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params
  const doc = findWorkDoc(slug)

  if (!doc) {
    return notFound()
  }

  const { title, description, image, createdAt, updatedAt } = doc.metadata
  const url = `/work/${doc.slug}`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      url,
      type: "article",
      publishedTime: new Date(createdAt).toISOString(),
      modifiedTime: new Date(updatedAt).toISOString(),
      siteName: SITE_INFO.name,
      locale: "en_US",
      // Metadata from a parent segment is replaced rather than merged, so
      // without a fallback here a doc with no cover of its own would render a
      // card with no image at all. Dimensions are left off because the covers
      // are not all 1200x630 and a wrong hint is worse than none.
      images: [{ url: image ?? SITE_INFO.ogImage, alt: title }],
    },
    twitter: { images: [image ?? SITE_INFO.ogImage] },
  }
}

function getCreativeWorkJsonLd(doc: Doc): WithContext<CreativeWork> {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": absoluteUrl(`/work/${doc.slug}`),
    name: doc.metadata.title,
    description: doc.metadata.description,
    url: absoluteUrl(`/work/${doc.slug}`),
    datePublished: new Date(doc.metadata.createdAt).toISOString(),
    dateModified: new Date(doc.metadata.updatedAt).toISOString(),
    ...(doc.metadata.image && { image: doc.metadata.image }),
    ...(doc.metadata.skills && { keywords: doc.metadata.skills }),
    author: { "@id": JSON_LD_ID.person },
    creator: { "@id": JSON_LD_ID.person },
  }
}

export default async function Page({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params
  const doc = findWorkDoc(slug)

  if (!doc) {
    notFound()
  }

  return (
    <>
      <JsonLdScript data={getCreativeWorkJsonLd(doc)} />
      <JsonLdScript
        data={jsonLdBreadcrumbList([
          { name: "Home", href: "/" },
          { name: doc.metadata.title, href: `/work/${slug}` },
        ])}
      />

      <DocEnterSound slug={slug} />

      <DocPage doc={doc} backHref="/projects" backLabel="Projects" />
    </>
  )
}
