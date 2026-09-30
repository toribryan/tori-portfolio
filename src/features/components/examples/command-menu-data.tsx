import {
  CalendarIcon,
  FilePlusIcon,
  FileTextIcon,
  InboxIcon,
  LaptopIcon,
  LogOutIcon,
  MoonIcon,
  PaletteIcon,
  SettingsIcon,
  SunIcon,
  UserIcon,
  UserPlusIcon,
} from "lucide-react"

import type {
  CommandMenuGroup,
  CommandMenuItem,
} from "@/components/fibo/command-menu"

/*
 * Sample commands from fibo's command-menu stories, shared by the doc's
 * examples and the home page cover.
 */

export function FilePreview({
  title,
  edited,
  body,
}: {
  title: string
  edited: string
  body: string
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex aspect-4/3 items-center justify-center rounded-md border border-border bg-muted">
        <FileTextIcon
          aria-hidden="true"
          className="size-8 text-muted-foreground"
        />
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="font-medium">{title}</span>
        <span className="text-xs text-muted-foreground">Edited {edited}</span>
      </div>
      <p className="text-muted-foreground">{body}</p>
    </div>
  )
}

export function PersonPreview({
  name,
  initials,
  role,
}: {
  name: string
  initials: string
  role: string
}) {
  return (
    <div className="flex flex-col items-start gap-3">
      <span className="flex size-12 items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-foreground">
        {initials}
      </span>
      <div className="flex flex-col gap-0.5">
        <span className="font-medium">{name}</span>
        <span className="text-xs text-muted-foreground">{role}</span>
      </div>
    </div>
  )
}

const person = (
  value: string,
  name: string,
  initials: string,
  role: string
): CommandMenuItem => ({
  value,
  label: name,
  icon: <UserIcon />,
  preview: <PersonPreview name={name} initials={initials} role={role} />,
})

export const GROUPS: CommandMenuGroup[] = [
  {
    label: "Suggestions",
    items: [
      {
        value: "new-file",
        label: "New file",
        icon: <FilePlusIcon />,
        shortcut: ["⌘", "N"],
        keywords: ["create", "document"],
      },
      { value: "inbox", label: "Go to inbox", icon: <InboxIcon /> },
      { value: "calendar", label: "Open calendar", icon: <CalendarIcon /> },
    ],
  },
  {
    label: "Actions",
    items: [
      {
        value: "theme",
        label: "Change theme",
        icon: <PaletteIcon />,
        keywords: ["appearance", "mode"],
        placeholder: "Pick a theme…",
        items: [
          { value: "theme-light", label: "Light", icon: <SunIcon /> },
          { value: "theme-dark", label: "Dark", icon: <MoonIcon /> },
          { value: "theme-system", label: "System", icon: <LaptopIcon /> },
        ],
      },
      {
        value: "assign",
        label: "Assign to",
        icon: <UserPlusIcon />,
        placeholder: "Search people…",
        items: [
          person("ada", "Ada Lovelace", "AL", "Engineering"),
          person("grace", "Grace Hopper", "GH", "Platform"),
          person("katherine", "Katherine Johnson", "KJ", "Research"),
        ],
      },
    ],
  },
  {
    label: "Settings",
    items: [
      {
        value: "profile",
        label: "Profile",
        icon: <UserIcon />,
        shortcut: ["⌘", "P"],
      },
      {
        value: "preferences",
        label: "Preferences",
        icon: <SettingsIcon />,
        shortcut: ["⌘", ","],
      },
      { value: "sign-out", label: "Sign out", icon: <LogOutIcon /> },
    ],
  },
]

export const FILES: CommandMenuGroup[] = [
  {
    label: "Files",
    items: [
      {
        value: "roadmap",
        label: "Roadmap 2027",
        icon: <FileTextIcon />,
        preview: (
          <FilePreview
            title="Roadmap 2027"
            edited="2 hours ago"
            body="Themes for next year: a faster editor, shared libraries and offline mode."
          />
        ),
      },
      {
        value: "research",
        label: "Research notes",
        icon: <FileTextIcon />,
        preview: (
          <FilePreview
            title="Research notes"
            edited="yesterday"
            body="Twelve interviews on how teams hand designs to engineering."
          />
        ),
      },
      {
        value: "launch",
        label: "Launch checklist",
        icon: <FileTextIcon />,
        preview: (
          <FilePreview
            title="Launch checklist"
            edited="last week"
            body="Docs, changelog, social posts and the support macro."
          />
        ),
      },
    ],
  },
  {
    label: "People",
    items: [
      person("ada", "Ada Lovelace", "AL", "Engineering"),
      person("grace", "Grace Hopper", "GH", "Platform"),
    ],
  },
  {
    label: "Actions",
    items: [{ value: "new-file", label: "New file", icon: <FilePlusIcon /> }],
  },
]
