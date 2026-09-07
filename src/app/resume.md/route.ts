import { readFile } from "node:fs/promises"
import path from "node:path"
import { NextResponse } from "next/server"

export const revalidate = false
export const dynamic = "force-static"
export const dynamicParams = false

/**
 * The résumé as Markdown, at `/resume.md`. The footer's Resume menu links here
 * for "View as Markdown" and fetches it for "Copy as Markdown", so the two
 * formats can't drift from each other.
 *
 * The text is kept next to the other portfolio content rather than under
 * `public/`: a static file there would be served as a download in most
 * browsers, and a route can set the headers it wants. `inline` so a browser
 * renders it instead of saving it.
 */
export async function GET() {
  const file = path.join(
    process.cwd(),
    "src/features/portfolio/content/resume.md"
  )
  const markdown = await readFile(file, "utf8")

  return new NextResponse(markdown, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": "inline",
    },
  })
}
