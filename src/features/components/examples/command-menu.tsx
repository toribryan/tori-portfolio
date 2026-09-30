"use client"

import { useState, type ReactNode } from "react"

import { Button } from "@/components/fibo/button"
import {
  CommandMenu,
  type CommandMenuProps,
} from "@/components/fibo/command-menu"

import { FILES, GROUPS } from "./command-menu-data"

// Only the lead example listens for Cmd+K: every menu on the page would open
// on the same key otherwise.
function Story(props: Partial<CommandMenuProps>) {
  return <CommandMenu groups={GROUPS} hotkey={null} {...props} />
}

export function Default() {
  return <Story hotkey="k" />
}

export function WithPreview() {
  return (
    <Story groups={FILES} placeholder="Search files, people and actions…" />
  )
}

export function WithRecents() {
  return <Story defaultRecent={["theme-dark", "calendar", "profile"]} />
}

export function NoMatches() {
  return <Story />
}

export function CustomTrigger() {
  return (
    <Story
      trigger={
        <Button variant="ghost" size="sm">
          Commands
        </Button>
      }
    />
  )
}

export function Controlled() {
  const [open, setOpen] = useState(false)
  const [last, setLast] = useState<ReactNode>(null)
  return (
    <div className="flex flex-col items-start gap-3 text-sm">
      <Button variant="outline" onClick={() => setOpen(true)}>
        Open commands
      </Button>
      <p>
        Last command: <span className="font-medium">{last ?? "none"}</span>
      </p>
      <Story
        trigger={null}
        open={open}
        onOpenChange={setOpen}
        onSelect={(item) => setLast(item.label)}
      />
    </div>
  )
}
