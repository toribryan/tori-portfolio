"use client"

import { useRef, useState, type MouseEvent, type ReactNode } from "react"
import {
  ArrowRightIcon,
  FileTextIcon,
  FolderIcon,
  FolderOpenIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"

type TreeRow = {
  path: string
  name: string
  depth: number
  folder: boolean
}

/**
 * Folders first, then files, each alphabetical. A closed folder leaves out
 * everything inside it.
 */
function toRows(files: string[], expanded: Set<string>): TreeRow[] {
  type Node = { folders: Map<string, Node>; files: string[] }
  const root: Node = { folders: new Map(), files: [] }
  for (const file of files) {
    const parts = file.split("/")
    let node = root
    for (const part of parts.slice(0, -1)) {
      if (!node.folders.has(part))
        node.folders.set(part, { folders: new Map(), files: [] })
      node = node.folders.get(part)!
    }
    node.files.push(file)
  }

  const rows: TreeRow[] = []
  const walk = (node: Node, prefix: string, depth: number) => {
    for (const [name, child] of [...node.folders].sort(([a], [b]) =>
      a.localeCompare(b)
    )) {
      const folder = prefix ? `${prefix}/${name}` : name
      rows.push({ path: folder, name, depth, folder: true })
      if (expanded.has(folder)) walk(child, folder, depth + 1)
    }
    for (const file of [...node.files].sort()) {
      rows.push({
        path: file,
        name: file.split("/").pop()!,
        depth,
        folder: false,
      })
    }
  }
  walk(root, "", 0)
  return rows
}

/**
 * A code-editor-style window onto a repo: the file tree beside the open
 * document. Files with a rendered copy open in the pane, and links between
 * them switch files rather than leave the page.
 */
export function RepoWindow({
  name,
  files,
  open,
  guide,
  documents,
}: {
  name: string
  files: string[]
  open: string
  guide?: string
  documents: Record<string, ReactNode>
}) {
  const [current, setCurrent] = useState(open)
  // Folders holding a document start open; the rest start closed.
  const [expanded, setExpanded] = useState(
    () => new Set(Object.keys(documents).flatMap(foldersOf))
  )
  const pane = useRef<HTMLDivElement>(null)
  const rows = toRows(files, expanded)

  const toggle = (folder: string) =>
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(folder)) next.delete(folder)
      else next.add(folder)
      return next
    })

  const show = (file: string) => {
    setCurrent(file)
    pane.current?.scrollTo({ top: 0 })
  }

  const followLink = (event: MouseEvent<HTMLDivElement>) => {
    const link = (event.target as HTMLElement).closest("a")
    const href = link?.getAttribute("href")
    if (!href || /^[a-z]+:|^\/|^#/i.test(href)) return
    const target = path(current, href)
    if (target in documents) {
      event.preventDefault()
      show(target)
    }
  }

  return (
    <figure className="my-6 overflow-hidden rounded-xl border border-line bg-card">
      <figcaption className="not-prose flex items-center gap-2 border-b border-line px-4 py-2.5">
        <span className="flex gap-1.5" aria-hidden>
          <span className="size-2.5 rounded-full bg-muted-foreground/25" />
          <span className="size-2.5 rounded-full bg-muted-foreground/25" />
          <span className="size-2.5 rounded-full bg-muted-foreground/25" />
        </span>
        <span className="ml-2 truncate font-mono text-xs text-muted-foreground">
          {name}/<span className="text-foreground">{current}</span>
        </span>
        {guide && guide in documents && guide !== current && (
          <button
            type="button"
            onClick={() => show(guide)}
            className="ml-auto inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-foreground transition-[background-color] ease-out hover:bg-accent-muted"
          >
            Getting started
            <ArrowRightIcon className="size-3.5" aria-hidden />
          </button>
        )}
      </figcaption>

      <div className="grid h-[32rem] sm:grid-cols-[14rem_1fr]">
        <nav
          aria-label={`Files in ${name}`}
          className="not-prose hidden overflow-y-auto border-r border-line py-2 sm:block"
        >
          <ul>
            {rows.map((row) => {
              const readable = !row.folder && row.path in documents
              const isOpen = row.folder && expanded.has(row.path)
              const Icon = row.folder
                ? isOpen
                  ? FolderOpenIcon
                  : FolderIcon
                : FileTextIcon
              const label = (
                <>
                  <Icon className="size-3.5 shrink-0" aria-hidden />
                  <span className="truncate">{row.name}</span>
                </>
              )
              const indent = { paddingLeft: `${0.75 + row.depth * 0.875}rem` }
              return (
                <li key={row.path}>
                  {row.folder ? (
                    <button
                      type="button"
                      onClick={() => toggle(row.path)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center gap-1.5 py-1 pr-3 text-left font-mono text-xs text-muted-foreground transition-[background-color] ease-out hover:bg-accent-muted hover:text-foreground"
                      style={indent}
                    >
                      {label}
                    </button>
                  ) : readable ? (
                    <button
                      type="button"
                      onClick={() => show(row.path)}
                      aria-current={row.path === current ? "page" : undefined}
                      className={cn(
                        "flex w-full items-center gap-1.5 py-1 pr-3 text-left font-mono text-xs transition-[background-color] ease-out hover:bg-accent-muted",
                        row.path === current
                          ? "bg-accent-muted font-medium text-foreground"
                          : "text-foreground"
                      )}
                      style={indent}
                    >
                      {label}
                    </button>
                  ) : (
                    <span
                      className="flex items-center gap-1.5 py-1 pr-3 font-mono text-xs text-muted-foreground"
                      style={indent}
                    >
                      {label}
                    </span>
                  )}
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="flex min-h-0 flex-col">
          <div
            className="not-prose flex gap-1 overflow-x-auto border-b border-line px-2 py-1.5 sm:hidden"
            role="tablist"
            aria-label={`Documents in ${name}`}
          >
            {Object.keys(documents).map((file) => (
              <button
                key={file}
                type="button"
                role="tab"
                aria-selected={file === current}
                onClick={() => show(file)}
                className={cn(
                  "shrink-0 rounded-md px-2 py-1 font-mono text-xs",
                  file === current
                    ? "bg-accent-muted text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {file.split("/").pop()}
              </button>
            ))}
          </div>

          <div
            ref={pane}
            className="min-h-0 flex-1 overflow-y-auto px-5 py-4 text-sm"
            onClick={followLink}
          >
            {Object.entries(documents).map(([file, document]) => (
              <div key={file} hidden={file !== current}>
                {document}
              </div>
            ))}
          </div>
        </div>
      </div>
    </figure>
  )
}

/** Every folder a file sits in, outermost first. */
function foldersOf(file: string) {
  const parts = file.split("/").slice(0, -1)
  return parts.map((_, i) => parts.slice(0, i + 1).join("/"))
}

/** Resolves a relative link from one repo file to another repo path. */
function path(from: string, href: string) {
  const parts = from.split("/").slice(0, -1)
  for (const part of href.split("#")[0]!.split("/")) {
    if (part === "..") parts.pop()
    else if (part !== ".") parts.push(part)
  }
  return parts.join("/")
}
