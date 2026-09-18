"use client"

import { useState } from "react"

import { cn } from "@/lib/utils"
import { CopyButton } from "@/components/copy-button"

const MANAGERS = [
  { key: "pnpm", run: "pnpm dlx" },
  { key: "yarn", run: "yarn dlx" },
  { key: "npm", run: "npx" },
  { key: "bun", run: "bunx" },
] as const

/**
 * The install line for a 21st.dev component, with a tab per package
 * manager and a copy button for whichever is showing.
 */
export function InstallCommand({
  name,
  className,
}: {
  /** The registry name, e.g. `@iamtoribryan/token-flow`. */
  name: string
  className?: string
}) {
  const [active, setActive] = useState<(typeof MANAGERS)[number]["key"]>("pnpm")
  const manager = MANAGERS.find((m) => m.key === active)!
  const command = `${manager.run} @21st-dev/cli add ${name}`

  return (
    <div
      className={cn(
        "not-prose my-6 overflow-hidden rounded-[9px] border bg-code",
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-line px-2">
        <div role="tablist" className="flex">
          {MANAGERS.map((m) => (
            <button
              key={m.key}
              role="tab"
              type="button"
              aria-selected={active === m.key}
              onClick={() => setActive(m.key)}
              className={cn(
                "relative px-2.5 py-2.5 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground",
                active === m.key &&
                  "text-foreground after:absolute after:inset-x-2.5 after:-bottom-px after:h-px after:bg-foreground"
              )}
            >
              {m.key}
            </button>
          ))}
        </div>
        <CopyButton
          className="size-7 border-none text-muted-foreground"
          variant="ghost"
          size="icon-xs"
          text={command}
          aria-label="Copy install command"
        />
      </div>
      <pre className="overflow-x-auto px-4 py-3 font-mono text-sm">
        {command}
      </pre>
    </div>
  )
}
