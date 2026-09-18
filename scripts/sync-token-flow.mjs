// Writes .21st/token-flow.tsx from src/components/ui/token-flow.tsx so the
// published copy cannot drift. The site copy leans on the site's `cn` and
// Chip; the published one inlines both so it installs anywhere.
//
//   node scripts/sync-token-flow.mjs          write the copy
//   node scripts/sync-token-flow.mjs --check  exit 1 if the copy is stale

import fs from "node:fs"
import path from "node:path"

const root = process.cwd()
const sourcePath = path.join(root, "src/components/ui/token-flow.tsx")
const targetPath = path.join(root, ".21st/token-flow.tsx")

const HEADER = `"use client"

import { useEffect, useRef, useState, useSyncExternalStore } from "react"
import { motion, useInView, useReducedMotion } from "motion/react"

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ")
}

/** A small labelled pill with something, usually a swatch, before the label. */
function Chip({
  children,
  className,
  startContent,
}: {
  children: React.ReactNode
  className?: string
  startContent?: React.ReactNode
}) {
  return (
    <span
      className={cn(
        "relative box-border inline-flex h-6 max-w-fit min-w-min items-center rounded-full border border-border bg-white px-1 text-xs whitespace-nowrap text-foreground dark:bg-card",
        className
      )}
      data-slot="chip"
    >
      {startContent}
      <span className="flex-1 px-1 pl-0.5">{children}</span>
    </span>
  )
}

`

const source = fs.readFileSync(sourcePath, "utf-8")
const marker = "export type TokenRow"
const start = source.indexOf(marker)
if (start < 0) {
  console.error(`Could not find "${marker}" in ${sourcePath}`)
  process.exit(1)
}
const expected = HEADER + source.slice(start)

if (process.argv.includes("--check")) {
  const current = fs.existsSync(targetPath)
    ? fs.readFileSync(targetPath, "utf-8")
    : ""
  if (current !== expected) {
    console.error(
      ".21st/token-flow.tsx is out of date. Run `npm run sync:token-flow`."
    )
    process.exit(1)
  }
  console.log(".21st/token-flow.tsx is in sync.")
} else {
  fs.writeFileSync(targetPath, expected)
  console.log(`Wrote ${path.relative(root, targetPath)}`)
}
