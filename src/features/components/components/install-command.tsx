"use client"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/base/ui/tabs"
import { CopyButton } from "@/components/copy-button"

const RUNNERS = {
  pnpm: "pnpm dlx",
  yarn: "yarn dlx",
  npm: "npx",
  bun: "bunx",
} as const

type Manager = keyof typeof RUNNERS

const MANAGERS = Object.keys(RUNNERS) as Manager[]

/**
 * The install line for a 21st.dev component, with a tab per package
 * manager and a copy button on each.
 */
export function InstallCommand({
  name,
}: {
  /** The registry name, e.g. `@iamtoribryan/token-flow`. */
  name: string
}) {
  return (
    <Tabs
      defaultValue="pnpm"
      className="not-prose my-6 gap-0 overflow-hidden rounded-[9px] border bg-code"
    >
      <TabsList className="gap-0 px-2">
        {MANAGERS.map((manager) => (
          <TabsTrigger
            key={manager}
            value={manager}
            className="px-2.5 font-mono text-xs after:inset-x-2.5"
          >
            {manager}
          </TabsTrigger>
        ))}
      </TabsList>
      {MANAGERS.map((manager) => {
        const command = `${RUNNERS[manager]} @21st-dev/cli add ${name}`
        return (
          <TabsContent
            key={manager}
            value={manager}
            className="flex items-center justify-between gap-3 pr-2"
          >
            <pre className="overflow-x-auto px-4 py-3 font-mono text-sm">
              {command}
            </pre>
            <CopyButton
              className="size-7 shrink-0 border-none text-muted-foreground"
              variant="ghost"
              size="icon-xs"
              text={command}
              aria-label="Copy install command"
            />
          </TabsContent>
        )
      })}
    </Tabs>
  )
}
