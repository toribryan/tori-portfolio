import { NextResponse } from "next/server"

import { COMPONENTS } from "@/features/components/data/registry"
import {
  getRegistryDoc,
  getRegistryDocs,
  toMarkdown,
} from "@/features/components/data/registry-docs"

export const revalidate = false
export const dynamic = "force-static"
export const dynamicParams = false

export function generateStaticParams() {
  return getRegistryDocs()
    .filter((doc) => doc.slug in COMPONENTS)
    .map((doc) => ({ slug: doc.slug }))
}

/**
 * A component doc as Markdown, reached as `/components/<slug>.md` through a
 * rewrite. The page header's Copy page and View as Markdown, and the open-in
 * links for the AI tools, all read this so none of them can drift from the
 * page.
 */
export async function GET(
  _request: Request,
  { params }: RouteContext<"/components/[slug]/markdown">
) {
  const { slug } = await params
  const doc = getRegistryDoc(slug)
  if (!doc) {
    return new NextResponse("Not found", { status: 404 })
  }

  return new NextResponse(toMarkdown(doc), {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": "inline",
    },
  })
}
