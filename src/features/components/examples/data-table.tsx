"use client"

import * as React from "react"
import {
  CheckIcon,
  DownloadIcon,
  FileTextIcon,
  PencilIcon,
  XIcon,
} from "lucide-react"

import { Button } from "@/components/fibo/button"
import {
  DataTable,
  DataTableBody,
  DataTableBulkAction,
  DataTableBulkActions,
  DataTableCell,
  DataTableContent,
  DataTableFooter,
  DataTableHead,
  DataTableHeader,
  DataTableRow,
  DataTableSelectionCount,
  type DataTableSelection,
} from "@/components/fibo/data-table"
import { MenuItem } from "@/components/fibo/menu"
import { Pagination } from "@/components/fibo/pagination"

import { MEMBERS, MembersTable, MembersToolbar } from "./data-table-data"

export function Default() {
  return <MembersTable toolbar={<MembersToolbar />} />
}

export function Locked() {
  return <MembersTable members={MEMBERS.slice(3, 6)} />
}

export function SecondaryText() {
  return <MembersTable secondary defaultValue={new Set(["priya"])} />
}

export function Pinned() {
  return (
    <div className="max-w-2xl">
      <MembersTable />
    </div>
  )
}

export function WithPagination() {
  const [page, setPage] = React.useState(1)
  return (
    <MembersTable
      totalCount={248}
      footer={
        <DataTableFooter className="justify-end">
          <Pagination
            page={page}
            onPageChange={setPage}
            pageCount={42}
            pageSize={6}
            totalCount={248}
            noun="members"
          />
        </DataTableFooter>
      }
    />
  )
}

export function Picker() {
  const [value, setValue] = React.useState<DataTableSelection>(
    new Set(["onboarding", "release"])
  )
  return (
    <DataTable
      aria-label="Documents"
      rowIds={["onboarding", "brand", "release"]}
      noun={{ one: "document", other: "documents" }}
      value={value}
      onValueChange={setValue}
    >
      <DataTableContent>
        <DataTableHeader>
          <DataTableHead type="primary">Title</DataTableHead>
          <DataTableHead>Access</DataTableHead>
        </DataTableHeader>
        <DataTableBody>
          {[
            ["onboarding", "Onboarding checklist", "Workspace"],
            ["brand", "Brand guidelines", "Public"],
            ["release", "Release notes", "Public"],
          ].map(([id, title, access]) => (
            <DataTableRow key={id} id={id!}>
              <DataTableCell type="primary" icon={<FileTextIcon />}>
                {title}
              </DataTableCell>
              <DataTableCell>{access}</DataTableCell>
            </DataTableRow>
          ))}
        </DataTableBody>
      </DataTableContent>
      <DataTableFooter>
        <DataTableSelectionCount />
      </DataTableFooter>
    </DataTable>
  )
}

const PATTERNS: [string, React.ReactNode][] = [
  ["Delete only", <DataTableBulkActions key="a" onDelete={() => {}} />],
  [
    "Export",
    <DataTableBulkActions key="b" onDelete={() => {}}>
      <DataTableBulkAction icon={<DownloadIcon data-icon="inline-start" />}>
        Export
      </DataTableBulkAction>
    </DataTableBulkActions>,
  ],
  [
    "Several",
    <DataTableBulkActions
      key="c"
      onDelete={() => {}}
      moreActions={
        <>
          <MenuItem>Add to project</MenuItem>
          <MenuItem>Resend invite</MenuItem>
        </>
      }
    >
      <DataTableBulkAction>Change role</DataTableBulkAction>
      <DataTableBulkAction>Change team</DataTableBulkAction>
    </DataTableBulkActions>,
  ],
  [
    "One item, with two selected",
    <DataTableBulkActions key="d" onDelete={() => {}}>
      <DataTableBulkAction
        single
        icon={<PencilIcon data-icon="inline-start" />}
      >
        Edit
      </DataTableBulkAction>
    </DataTableBulkActions>,
  ],
]

export function BulkActionPatterns() {
  return (
    <div className="flex w-full flex-col gap-6">
      {PATTERNS.map(([label, bulk]) => (
        <section key={label} aria-label={label} className="flex flex-col gap-2">
          <h3 className="text-sm font-medium">{label}</h3>
          <MembersTable
            members={MEMBERS.slice(0, 2)}
            defaultValue={new Set(["maya", "priya"])}
            toolbar={<MembersToolbar>{bulk}</MembersToolbar>}
          />
        </section>
      ))}
    </div>
  )
}

export function ReviewQueue() {
  return (
    <MembersTable
      secondary
      defaultValue={new Set(["priya", "sam"])}
      toolbar={
        <MembersToolbar>
          <DataTableBulkActions>
            <Button size="sm">
              <CheckIcon data-icon="inline-start" />
              Approve
            </Button>
            <Button variant="destructive" size="sm">
              <XIcon data-icon="inline-start" />
              Deny
            </Button>
          </DataTableBulkActions>
        </MembersToolbar>
      }
    />
  )
}

export function Directory() {
  const [showSelectedOnly, setShowSelectedOnly] = React.useState(false)
  const [value, setValue] = React.useState<DataTableSelection>(new Set())
  const members = showSelectedOnly
    ? MEMBERS.filter((member) => value === "all" || value.has(member.id))
    : MEMBERS
  return (
    <MembersTable
      members={members}
      totalCount={248}
      value={value}
      onValueChange={setValue}
      showSelectedOnly={showSelectedOnly}
      onShowSelectedOnlyChange={setShowSelectedOnly}
      toolbar={<MembersToolbar />}
    />
  )
}

export function NarrowScroll() {
  return (
    <div className="w-full max-w-[375px]">
      <MembersTable narrowLayout="scroll" toolbar={<MembersToolbar />} />
    </div>
  )
}

export function NarrowCards() {
  return (
    <div className="w-full max-w-[375px]">
      <MembersTable
        narrowLayout="cards"
        defaultValue={new Set(["priya"])}
        toolbar={
          <MembersToolbar>
            <DataTableBulkActions onDelete={() => {}}>
              <DataTableBulkAction icon={<DownloadIcon />}>
                Export
              </DataTableBulkAction>
            </DataTableBulkActions>
          </MembersToolbar>
        }
      />
    </div>
  )
}
