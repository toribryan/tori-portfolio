import { FolderOpenIcon } from "@/components/icons"
import { IconTile } from "@/components/ui/icon-tile"
import { Kbd } from "@/components/ui/kbd"

const COMMANDS = [
  {
    command: "/write-spec",
    detail: "Prototype in, design-to-dev spec out",
  },
  {
    command: "/research-synthesis",
    detail: "Raw interview notes, synthesized findings",
  },
  {
    command: "/ux-copy",
    detail: "Draft UI copy, on brand by default",
  },
  {
    command: "/handoff",
    detail: "The skill at the center: release notes generated automatically",
  },
]

/**
 * Mid-post visual for the Design Skills Infrastructure post — the actual
 * named commands from the "A command per phase" section, laid out as a
 * repo listing rather than a screenshot of internal tooling.
 */
export function SkillCommandsVisual() {
  return (
    <div className="not-prose my-8 rounded-xl bg-surface-warm p-5 inset-ring-1 inset-ring-border/64">
      <div className="mb-4 flex items-center gap-2 font-mono text-xs font-medium tracking-wide text-muted-foreground uppercase">
        <IconTile>
          <FolderOpenIcon />
        </IconTile>
        skills/: one command per phase
      </div>

      <ul className="flex flex-col gap-3">
        {COMMANDS.map((entry) => (
          <li
            key={entry.command}
            className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm"
          >
            <Kbd className="h-6 px-2 font-mono text-xs text-surface-foreground">
              {entry.command}
            </Kbd>
            <span className="text-muted-foreground">{entry.detail}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
