"use client"

import type { ComponentProps, ReactNode } from "react"
import {
  BellIcon,
  CalendarIcon,
  CloudIcon,
  DatabaseIcon,
  FileTextIcon,
  GitBranchIcon,
  MailIcon,
  MessageSquareIcon,
  WebhookIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/fibo/badge"
import type {
  IntegrationItem,
  IntegrationVisual,
} from "@/components/fibo/integration-visual"

export const tools: IntegrationItem[] = [
  { title: "Database", icon: <DatabaseIcon /> },
  { title: "Repository", icon: <GitBranchIcon /> },
  { title: "Chat", icon: <MessageSquareIcon /> },
  { title: "Calendar", icon: <CalendarIcon /> },
  { title: "Email", icon: <MailIcon /> },
  { title: "Storage", icon: <CloudIcon /> },
  { title: "Alerts", icon: <BellIcon /> },
  { title: "Docs", icon: <FileTextIcon /> },
]

export const pipeline: IntegrationItem[] = [
  { title: "Webhook", icon: <WebhookIcon />, side: "in" },
  { title: "Database", icon: <DatabaseIcon />, side: "in" },
  { title: "Repository", icon: <GitBranchIcon />, side: "in" },
  { title: "Chat", icon: <MessageSquareIcon />, side: "out" },
  { title: "Email", icon: <MailIcon />, side: "out" },
]

export const pair: IntegrationItem[] = [
  { title: "Database", icon: <DatabaseIcon />, side: "in" },
  { title: "Email", icon: <MailIcon />, side: "out" },
]

export const args = {
  layout: "corners",
  background: "dots",
  routes: "solid",
  pulse: "inward",
  size: "default",
  halo: true,
} satisfies Partial<ComponentProps<typeof IntegrationVisual>>

export function SyncPreview() {
  return (
    <div className="flex flex-col gap-2 rounded-lg bg-card p-3">
      <span className="text-xs font-medium text-muted-foreground">
        Last sync
      </span>
      {tools.slice(0, 3).map((tool) => (
        <div
          key={tool.title}
          className="flex items-center justify-between gap-2 text-sm"
        >
          <span className="flex items-center gap-2 text-foreground [&_svg]:size-4 [&_svg]:text-muted-foreground">
            {tool.icon}
            {tool.title}
          </span>
          <Badge variant="secondary">2m ago</Badge>
        </div>
      ))}
    </div>
  )
}

export function Frame({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-xl overflow-hidden rounded-xl border border-border",
        className
      )}
    >
      {children}
    </div>
  )
}

/** The small frame a do or a don't holds. */
export function RuleFrame({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-72 overflow-hidden rounded-lg border border-border">
      {children}
    </div>
  )
}
