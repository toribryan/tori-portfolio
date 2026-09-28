import fs from "fs"
import path from "path"

import { MDX } from "@/components/mdx"
import { STORYBOOK_KIT } from "@/features/doc/repos/storybook-kit"

import { RepoWindow } from "./repo-window"

const REPOS = { "storybook-kit": STORYBOOK_KIT }

/**
 * A repo as a window: its file tree, and the documents it can open rendered
 * as Markdown, read from the copies kept in `features/doc/repos/` at build.
 */
export function RepoViewer({
  repo,
  guide,
}: {
  repo: keyof typeof REPOS
  /** A document to offer as "Getting started" in the window's title bar. */
  guide?: string
}) {
  const { name, dir, open, readable, files } = REPOS[repo]
  const documents = Object.fromEntries(
    readable.map((file) => [
      file,
      <MDX
        key={file}
        code={fs.readFileSync(path.join(process.cwd(), dir, file), "utf-8")}
        format="md"
      />,
    ])
  )

  return (
    <RepoWindow
      name={name}
      files={files}
      open={open}
      guide={guide}
      documents={documents}
    />
  )
}
