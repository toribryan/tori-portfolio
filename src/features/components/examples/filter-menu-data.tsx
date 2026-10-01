import {
  CircleDashedIcon,
  SignalHighIcon,
  TagIcon,
  UserIcon,
  XIcon,
} from "lucide-react"

import type { FilterField, FilterValue } from "@/components/fibo/filter-menu"

export const FIELDS: FilterField[] = [
  {
    id: "status",
    label: "Status",
    icon: <CircleDashedIcon />,
    options: [
      { value: "backlog", label: "Backlog" },
      { value: "todo", label: "Todo" },
      { value: "in-progress", label: "In progress" },
      { value: "done", label: "Done" },
    ],
  },
  {
    id: "assignee",
    label: "Assignee",
    icon: <UserIcon />,
    options: [
      { value: "ada", label: "Ada Lovelace" },
      { value: "grace", label: "Grace Hopper" },
      { value: "katherine", label: "Katherine Johnson" },
    ],
  },
  {
    id: "priority",
    label: "Priority",
    icon: <SignalHighIcon />,
    options: [
      { value: "urgent", label: "Urgent" },
      { value: "high", label: "High" },
      { value: "medium", label: "Medium" },
      { value: "low", label: "Low" },
    ],
  },
  {
    id: "label",
    label: "Label",
    icon: <TagIcon />,
    options: [
      { value: "bug", label: "Bug" },
      { value: "urgent-fix", label: "urgent-fix" },
      { value: "design", label: "Design" },
    ],
  },
]

export const labelOf = (fieldId: string, optionValue: string) =>
  FIELDS.find((f) => f.id === fieldId)?.options.find(
    (o) => o.value === optionValue
  )?.label ?? optionValue

/** Applied filters as removable chips, the way an app might show them. */
export function Chips({
  value,
  onRemove,
}: {
  value: FilterValue
  onRemove?: (fieldId: string) => void
}) {
  return Object.entries(value).map(([fieldId, values]) => {
    const field = FIELDS.find((f) => f.id === fieldId)
    return (
      <span
        key={fieldId}
        className="inline-flex h-8 items-center gap-1.5 rounded-full border border-border bg-card pr-1 pl-3 text-sm"
      >
        <span className="text-muted-foreground">{field?.label}</span>
        {values.map((v) => labelOf(fieldId, v)).join(", ")}
        <button
          type="button"
          aria-label={`Remove ${field?.label} filter`}
          onClick={() => onRemove?.(fieldId)}
          className="flex size-6 items-center justify-center rounded-full text-muted-foreground outline-none hover:bg-muted hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring-subtle"
        >
          <XIcon className="size-3.5" />
        </button>
      </span>
    )
  })
}
