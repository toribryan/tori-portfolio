import Link from "next/link"
import { ArrowUpRightIcon } from "lucide-react"

import { Button } from "@/components/base/ui/button"
import { CommandLine } from "@/features/components/components/doc-blocks"
import {
  Panel,
  PanelContent,
  PanelHeader,
  PanelTitle,
} from "@/features/portfolio/components/panel"

import { FigmaIcon, GithubIcon, StorybookIcon } from "./fibo-hero/brand-icons"
import { FIBO } from "./fibo-hero/links"
import { PanelTitleCopy } from "./panel-title-copy"

const ID = "use"

const PATHS = [
  {
    title: "Use the theme",
    body: "Keep shadcn's components and give them fibo's colors, in light and dark.",
    command: `npx shadcn@latest add ${FIBO.site}/r/theme.json`,
  },
  {
    title: "Add special components",
    body: "Install the parts shadcn doesn't have, such as the Command menu, as source you own.",
    command: `npx shadcn@latest add ${FIBO.site}/r/command-menu.json`,
  },
]

/** How to bring fibo into a project, and where its docs and source live. */
export function FiboUse() {
  return (
    <Panel id={ID}>
      <PanelHeader>
        <PanelTitle>
          <a href={`#${ID}`}>Use fibo</a>
          <PanelTitleCopy id={ID} />
        </PanelTitle>
      </PanelHeader>

      <PanelContent className="flex flex-col gap-6">
        <p className="text-base text-balance text-muted-foreground">
          fibo is a shadcn registry. In a project that already uses shadcn,
          there are two ways in.
        </p>

        {PATHS.map(({ title, body, command }) => (
          <div key={title} className="flex flex-col gap-2">
            <h3 className="font-medium">{title}</h3>
            <p className="text-sm text-muted-foreground">{body}</p>
            <div className="overflow-hidden rounded-xl border border-line bg-card">
              <CommandLine label="Install" value={command} />
            </div>
          </div>
        ))}
      </PanelContent>

      <div className="screen-line-top flex flex-wrap justify-center gap-2 py-4">
        <Button
          size="sm"
          nativeButton={false}
          render={
            <a
              href={`${FIBO.site}/?path=/docs/getting-started--docs`}
              target="_blank"
              rel="noreferrer"
            />
          }
        >
          <StorybookIcon data-icon="inline-start" />
          Read the docs
          <ArrowUpRightIcon data-icon="inline-end" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          nativeButton={false}
          render={<Link href="/fibo/figma" />}
        >
          <FigmaIcon data-icon="inline-start" />
          Figma
        </Button>
        <Button
          size="sm"
          variant="outline"
          nativeButton={false}
          render={<a href={FIBO.github} target="_blank" rel="noreferrer" />}
        >
          <GithubIcon data-icon="inline-start" />
          GitHub
          <ArrowUpRightIcon data-icon="inline-end" />
        </Button>
      </div>
    </Panel>
  )
}
