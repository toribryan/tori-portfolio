"use client"

import { cn } from "@/lib/utils"
import { EXAMPLES } from "@/features/components/examples"

/**
 * One of a doc's live examples, named `<slug>.<Story>` after the fibo story
 * it was ported from, in the frame the doc's preview uses.
 */
export function Example({ of, className }: { of: string; className?: string }) {
  const [slug = "", name = ""] = of.split(".")
  const Demo = EXAMPLES[slug]?.[name]
  if (!Demo) throw new Error(`No example named "${of}"`)
  return (
    <div
      className={cn(
        "not-prose my-6 flex min-h-48 items-center justify-center overflow-x-auto rounded-xl border border-line bg-background p-4 sm:p-6",
        className
      )}
    >
      <Demo />
    </div>
  )
}
