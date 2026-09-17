import { Children, isValidElement } from "react"
import {
  ArrowRightIcon,
  CircleHelpIcon,
  ComponentIcon,
  LayersIcon,
  LayoutTemplateIcon,
  PencilLineIcon,
  RocketIcon,
  SearchIcon,
  SplitIcon,
  ShieldIcon,
  UsersIcon,
  WrenchIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { ClaudeIcon, ReactIcon, TerminalIcon } from "@/components/icons"
import { IconTile } from "@/components/ui/icon-tile"

/**
 * The marks a `<Stage>` can show, already sized for the 40px tile.
 *
 * Brand marks and generic icons live in one map on purpose. A stage is a step
 * in a process, and a step is sometimes a tool and sometimes an activity, so
 * the author shouldn't have to know which kind of icon they're reaching for.
 * These are deliberately not the `@/lib/tech` catalog icons: those are sized
 * for a badge, and re-sizing them here would fight their own class.
 */
const STAGE_MARKS = {
  claude: <ClaudeIcon className="size-5" />,
  component: <ComponentIcon className="size-5" />,
  figma: <img src="/Figma.svg" alt="" aria-hidden className="size-5" />,
  layers: <LayersIcon className="size-5" />,
  layout: <LayoutTemplateIcon className="size-5" />,
  pencil: <PencilLineIcon className="size-5" />,
  question: <CircleHelpIcon className="size-5" />,
  react: <ReactIcon className="size-5" />,
  rocket: <RocketIcon className="size-5" />,
  search: <SearchIcon className="size-5" />,
  shield: <ShieldIcon className="size-5" />,
  split: <SplitIcon className="size-5" />,
  storybook: (
    <img src="/storybook-icon.svg" alt="" aria-hidden className="size-5" />
  ),
  terminal: <TerminalIcon className="size-5" />,
  users: <UsersIcon className="size-5" />,
  wrench: <WrenchIcon className="size-5" />,
} satisfies Record<string, React.ReactElement>

export type StageMark = keyof typeof STAGE_MARKS

/** Column counts a pipeline can take. Tailwind needs the literal class names. */
const COLUMNS: Record<number, string> = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-4",
  5: "sm:grid-cols-5",
}

/**
 * One step in a `<Pipeline>`: a mark, a label, and a line of detail.
 *
 * Renders its contents only. `Pipeline` owns the cell and the arrow, so a
 * stage never has to know its own position in the row.
 *
 * Every prop is a string because expression attributes don't survive the MDX
 * pipeline. See the note in `mdx-inbox-regions.tsx`.
 */
export function Stage({
  label,
  detail,
  mark,
}: {
  label: string
  detail?: string
  mark?: StageMark
}) {
  return (
    <>
      <IconTile className="size-10">{mark ? STAGE_MARKS[mark] : null}</IconTile>

      <div className="font-medium text-surface-foreground">{label}</div>

      {detail && <div className="text-xs text-muted-foreground">{detail}</div>}
    </>
  )
}

/**
 * A row of `<Stage>` children reading left to right, with arrows between them:
 * the shape of a process, as a cover visual or a section opener.
 *
 * Takes children rather than a stages array so a case study can author one in
 * MDX without a component per page. Two columns on a phone, one column per
 * stage from `sm` up, for two to five stages.
 */
export function Pipeline({ children }: { children?: React.ReactNode }) {
  const stages = Children.toArray(children).filter(isValidElement)

  if (stages.length === 0) return null

  return (
    <div className="not-prose my-8 overflow-hidden rounded-xl bg-surface-warm inset-ring-1 inset-ring-border/64">
      <div
        className={cn(
          "grid grid-cols-2 divide-y divide-border sm:divide-x sm:divide-y-0",
          COLUMNS[stages.length] ?? COLUMNS[4]
        )}
      >
        {stages.map((stage, index) => (
          <div
            key={index}
            className="relative flex flex-col items-center gap-2 p-6 text-center"
          >
            {stage}

            {index < stages.length - 1 && (
              <ArrowRightIcon
                className="pointer-events-none absolute top-1/2 -right-3 z-1 hidden size-4 -translate-y-1/2 text-muted-foreground/50 sm:block"
                aria-hidden
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
