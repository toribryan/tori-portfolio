"use client"

import * as React from "react"
import {
  ArrowUpDownIcon,
  EllipsisIcon,
  PencilIcon,
  PlusIcon,
  SearchIcon,
  Trash2Icon,
} from "lucide-react"

import { Badge } from "@/components/fibo/badge"
import { Button } from "@/components/fibo/button"
import {
  DataTable,
  DataTableAction,
  DataTableActions,
  DataTableBody,
  DataTableBulkActions,
  DataTableCard,
  DataTableCardField,
  DataTableCards,
  DataTableCell,
  DataTableContent,
  DataTableFilters,
  DataTableHead,
  DataTableHeader,
  DataTableRow,
  DataTableToolbar,
} from "@/components/fibo/data-table"
import { Input } from "@/components/fibo/input"
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
} from "@/components/fibo/menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/fibo/select"

/*
 * Sample data and the table the examples share, ported from fibo's
 * data-table.stories.tsx.
 */

export const STATUS = {
  Active: "success",
  Away: "warning",
  Invited: "info",
  Deactivated: "secondary",
} as const

export type Member = {
  id: string
  name: string
  initials: string
  email: string
  team: string
  role: string
  status: keyof typeof STATUS
  projects: number
  lastActive: string
  lock?: string
}

export const MEMBERS: Member[] = [
  {
    id: "maya",
    name: "Maya Okafor",
    initials: "MO",
    email: "maya@example.com",
    team: "Design",
    role: "Admin",
    status: "Active",
    projects: 12,
    lastActive: "Today",
  },
  {
    id: "priya",
    name: "Priya Raman",
    initials: "PR",
    email: "priya@example.com",
    team: "Engineering",
    role: "Editor",
    status: "Away",
    projects: 8,
    lastActive: "Yesterday",
  },
  {
    id: "jordan",
    name: "Jordan Alvarez",
    initials: "JA",
    email: "jordan@example.com",
    team: "Marketing",
    role: "Editor",
    status: "Active",
    projects: 5,
    lastActive: "Today",
  },
  {
    id: "sam",
    name: "Sam Whitfield",
    initials: "SW",
    email: "sam@example.com",
    team: "Support",
    role: "Viewer",
    status: "Invited",
    projects: 0,
    lastActive: "Never",
  },
  {
    id: "elena",
    name: "Elena Marsh",
    initials: "EM",
    email: "elena@example.com",
    team: "Operations",
    role: "Owner",
    status: "Active",
    projects: 21,
    lastActive: "Today",
    lock: "The workspace owner can't be removed",
  },
  {
    id: "rosa",
    name: "Rosa Delgado",
    initials: "RD",
    email: "rosa@example.com",
    team: "Engineering",
    role: "Viewer",
    status: "Deactivated",
    projects: 3,
    lastActive: "Aug 14",
  },
]

export function RowActions({ name }: { name: string }) {
  return (
    <Menu>
      <MenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Actions for ${name}`}
          />
        }
      >
        <EllipsisIcon />
      </MenuTrigger>
      <MenuContent align="end">
        <MenuItem>
          <PencilIcon />
          Edit
        </MenuItem>
        <MenuSeparator />
        <MenuItem variant="destructive">
          <Trash2Icon />
          Remove
        </MenuItem>
      </MenuContent>
    </Menu>
  )
}

export function MembersToolbar({
  children,
}: {
  /** The bulk actions shown while rows are selected. */
  children?: React.ReactNode
}) {
  return (
    <DataTableToolbar>
      <DataTableFilters
        search={
          <div className="relative w-full">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              size="sm"
              className="pl-8"
              placeholder="Search 248 members"
              aria-label="Search members"
            />
          </div>
        }
      >
        <Select
          defaultValue="name"
          items={[
            { value: "name", label: "Name" },
            { value: "team", label: "Team" },
          ]}
        >
          <SelectTrigger size="sm" aria-label="Sort by">
            <ArrowUpDownIcon />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="team">Team</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="ghost" size="sm">
          <PlusIcon data-icon="inline-start" />
          Add filter
        </Button>
      </DataTableFilters>
      <DataTableActions>
        <DataTableAction icon={<PlusIcon data-icon="inline-start" />}>
          Add member
        </DataTableAction>
      </DataTableActions>
      {children ?? <DataTableBulkActions onDelete={() => {}} />}
    </DataTableToolbar>
  )
}

export function MembersTable({
  members = MEMBERS,
  secondary = false,
  pinned = true,
  footer,
  toolbar,
  ...props
}: Partial<React.ComponentProps<typeof DataTable>> & {
  members?: Member[]
  secondary?: boolean
  pinned?: boolean
  footer?: React.ReactNode
  toolbar?: React.ReactNode
}) {
  const start = pinned ? "start" : "none"
  const end = pinned ? "end" : "none"
  return (
    <DataTable
      aria-label="Members"
      rowIds={members.map((member) => member.id)}
      noun={{ one: "member", other: "members" }}
      {...props}
    >
      {toolbar}
      <DataTableContent>
        <DataTableHeader>
          <DataTableHead type="person" pinned={start} className="w-56">
            Member
          </DataTableHead>
          <DataTableHead className="w-44">Team</DataTableHead>
          <DataTableHead className="w-32">Role</DataTableHead>
          <DataTableHead type="status">Status</DataTableHead>
          <DataTableHead type="numeric">Projects</DataTableHead>
          <DataTableHead className="w-32">Last active</DataTableHead>
          <DataTableHead type="actions" pinned={end}>
            <span className="sr-only">Actions</span>
          </DataTableHead>
        </DataTableHeader>
        <DataTableBody>
          {members.map((member) => (
            <DataTableRow
              key={member.id}
              id={member.id}
              lockedReason={member.lock}
            >
              <DataTableCell
                type="person"
                pinned={start}
                avatar={{ fallback: member.initials }}
                secondary={secondary ? member.email : undefined}
              >
                {member.name}
              </DataTableCell>
              <DataTableCell>{member.team}</DataTableCell>
              <DataTableCell>{member.role}</DataTableCell>
              <DataTableCell type="status">
                <Badge variant={STATUS[member.status]}>{member.status}</Badge>
              </DataTableCell>
              <DataTableCell type="numeric">{member.projects}</DataTableCell>
              <DataTableCell>{member.lastActive}</DataTableCell>
              <DataTableCell type="actions" pinned={end}>
                <RowActions name={member.name} />
              </DataTableCell>
            </DataTableRow>
          ))}
        </DataTableBody>
      </DataTableContent>
      <DataTableCards>
        {members.map((member) => (
          <DataTableCard
            key={member.id}
            id={member.id}
            title={member.name}
            avatar={{ fallback: member.initials }}
            status={
              <Badge variant={STATUS[member.status]}>{member.status}</Badge>
            }
            lockedReason={member.lock}
          >
            <DataTableCardField label="Team">{member.team}</DataTableCardField>
            <DataTableCardField label="Last active">
              {member.lastActive}
            </DataTableCardField>
            <DataTableCardField label="Role">{member.role}</DataTableCardField>
            <DataTableCardField label="Projects">
              {member.projects}
            </DataTableCardField>
          </DataTableCard>
        ))}
      </DataTableCards>
      {footer}
    </DataTable>
  )
}
