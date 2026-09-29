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

import { Badge } from "@/components/fibo/badge"
import {
  IntegrationVisual,
  type IntegrationItem,
} from "@/components/fibo/integration-visual"

const tools: IntegrationItem[] = [
  { title: "Database", icon: <DatabaseIcon /> },
  { title: "Repository", icon: <GitBranchIcon /> },
  { title: "Chat", icon: <MessageSquareIcon /> },
  { title: "Calendar", icon: <CalendarIcon /> },
  { title: "Email", icon: <MailIcon /> },
  { title: "Storage", icon: <CloudIcon /> },
  { title: "Alerts", icon: <BellIcon /> },
  { title: "Docs", icon: <FileTextIcon /> },
]

const pipeline: IntegrationItem[] = [
  { title: "Webhook", icon: <WebhookIcon />, side: "in" },
  { title: "Database", icon: <DatabaseIcon />, side: "in" },
  { title: "Repository", icon: <GitBranchIcon />, side: "in" },
  { title: "Chat", icon: <MessageSquareIcon />, side: "out" },
  { title: "Email", icon: <MailIcon />, side: "out" },
]

const args = {
  layout: "corners",
  background: "dots",
  routes: "solid",
  pulse: "inward",
  size: "default",
  halo: true,
} satisfies Partial<ComponentProps<typeof IntegrationVisual>>

function SyncPreview() {
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

function Frame({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-xl overflow-hidden rounded-xl border border-border">
      {children}
    </div>
  )
}

// Only examples with room above the hub carry a preview. In a small plate or
// a card it would be clipped by the frame.
export function Default() {
  return (
    <Frame>
      <IntegrationVisual
        {...args}
        preview={<SyncPreview />}
        items={tools.slice(0, 4)}
      />
    </Frame>
  )
}

export function MediaPreview() {
  return (
    <Frame>
      <IntegrationVisual
        {...args}
        preview={{
          src: "/images/fibo/snail-sync.svg",
          alt: "A snail inching along a sync track",
        }}
        items={tools.slice(0, 4)}
      />
    </Frame>
  )
}

export function Orbit() {
  return (
    <Frame>
      <IntegrationVisual {...args} layout="orbit" items={tools.slice(0, 6)} />
    </Frame>
  )
}

export function Sides() {
  return (
    <Frame>
      <IntegrationVisual
        {...args}
        layout="sides"
        pulse="outward"
        items={pipeline}
      />
    </Frame>
  )
}

export function IdleItems() {
  return (
    <Frame>
      <IntegrationVisual
        {...args}
        items={tools
          .slice(0, 4)
          .map((tool, i) =>
            i % 2 ? { ...tool, status: "idle" as const } : tool
          )}
      />
    </Frame>
  )
}

export function Plates() {
  return (
    <div className="grid w-full max-w-5xl gap-4 sm:grid-cols-3">
      {(["dots", "grid", "none"] as const).map((background) => (
        <div key={background} className="flex flex-col gap-2">
          <div className="overflow-hidden rounded-xl border border-border">
            <IntegrationVisual
              {...args}
              background={background}
              size="sm"
              items={tools.slice(0, 4)}
            />
          </div>
          <span className="font-mono text-xs text-muted-foreground">
            {background}
          </span>
        </div>
      ))}
    </div>
  )
}

export function InACard() {
  return (
    <div className="mx-auto flex w-full max-w-sm flex-col overflow-hidden rounded-2xl border border-border bg-card">
      <IntegrationVisual {...args} center="12" items={tools.slice(0, 4)} />
      <div className="flex flex-col gap-1.5 border-t border-border px-5 py-4">
        <span className="text-lg font-semibold tracking-tight text-card-foreground">
          Twelve sources, one feed
        </span>
        <span className="text-sm leading-6 text-muted-foreground">
          Hover the hub to see what synced last. Routes pulse while a source is
          active.
        </span>
      </div>
    </div>
  )
}
