import { ArrowRightIcon } from "lucide-react"

import { Badge } from "@/components/fibo/badge"

import { Plate } from "./fibo-blocks"

const STATUSES: {
  role: string
  variant: "success" | "warning" | "destructive" | "info"
  old: string[]
}[] = [
  {
    role: "success",
    variant: "success",
    old: ["Green", "Valid", "Success", "OK"],
  },
  { role: "warning", variant: "warning", old: ["Yellow", "Warn", "Caution"] },
  {
    role: "danger",
    variant: "destructive",
    old: ["Red", "Error", "Danger", "Negative"],
  },
  { role: "info", variant: "info", old: ["Blue", "Info", "Note"] },
]

/** Every name the old library used for a status, folded into its role. */
export function StatusNames() {
  const total = STATUSES.reduce((sum, s) => sum + s.old.length, 0)
  return (
    <Plate
      background="none"
      caption={`${total} names for four meanings became four roles, each backed by its own status tokens.`}
    >
      {/* Columns sized to their content and shared by every row, so the
          arrows line up and the roles sit right beside the names they replace. */}
      <ul className="m-0 grid list-none grid-cols-[minmax(0,max-content)_auto_auto] items-center justify-center gap-x-4 gap-y-3 p-0">
        {STATUSES.map(({ role, variant, old }) => (
          <li
            key={role}
            className="col-span-3 grid grid-cols-subgrid items-center"
          >
            <span className="flex flex-wrap gap-1.5">
              {old.map((name) => (
                <span
                  key={name}
                  className="rounded-md border border-line px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground line-through"
                >
                  {name}
                </span>
              ))}
            </span>
            <ArrowRightIcon
              aria-hidden
              className="size-3.5 text-muted-foreground"
            />
            <Badge variant={variant} className="justify-self-start font-mono">
              {role}
            </Badge>
          </li>
        ))}
      </ul>
    </Plate>
  )
}
