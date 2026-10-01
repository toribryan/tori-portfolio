"use client"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/base/ui/tabs"
import { CommandLine } from "@/features/components/components/doc-blocks"

import { FIBO } from "./fibo-hero/links"

const RUNNERS = {
  pnpm: "pnpm dlx shadcn@latest add",
  npm: "npx shadcn@latest add",
  yarn: "yarn shadcn@latest add",
  bun: "bunx --bun shadcn@latest add",
}

/**
 * The two ways into fibo, per package manager: its theme over stock shadcn,
 * or one special component. Both name the registry by URL, so they work
 * without adding fibo to `components.json` first.
 */
export function FiboInstall() {
  return (
    <Tabs defaultValue="pnpm" className="gap-0">
      <TabsList className="px-4">
        {Object.keys(RUNNERS).map((runner) => (
          <TabsTrigger key={runner} value={runner} className="font-mono">
            {runner}
          </TabsTrigger>
        ))}
      </TabsList>
      {Object.entries(RUNNERS).map(([runner, command]) => (
        <TabsContent
          key={runner}
          value={runner}
          className="divide-y divide-line"
        >
          <CommandLine
            label="Theme"
            value={`${command} ${FIBO.site}/r/theme.json`}
          />
          <CommandLine
            label="Part"
            value={`${command} ${FIBO.site}/r/command-menu.json`}
          />
        </TabsContent>
      ))}
    </Tabs>
  )
}
