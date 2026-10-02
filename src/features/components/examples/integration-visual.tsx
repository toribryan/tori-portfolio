"use client"

import { useEffect, useRef, useState } from "react"
import { WorkflowIcon } from "lucide-react"

import { IntegrationVisual } from "@/components/fibo/integration-visual"

import { AnatomyMap, slot, type Callout } from "../components/anatomy-map"
import {
  args,
  Frame,
  pair,
  pipeline,
  RuleFrame,
  SyncPreview,
  tools,
} from "./integration-visual-data"

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

const tracks = (root: HTMLElement) =>
  root.querySelectorAll(
    "[data-slot=integration-visual] > svg:last-of-type path:not(.stroke-muted-foreground)"
  )
const pulses = (root: HTMLElement) =>
  root.querySelectorAll(
    "[data-slot=integration-visual] path.stroke-muted-foreground"
  )

const PARTS: Callout[] = [
  {
    label: "Tile",
    side: "left",
    find: (root) => root.querySelector("[data-slot=integration-visual-item]"),
  },
  {
    label: "Hub",
    side: "left",
    find: slot("integration-visual-hub"),
  },
  {
    label: "Route",
    side: "left",
    // The bottom left route, pointed at on the leg leaving the hub so the
    // leader line clears the tiles.
    find: (root) => tracks(root)[2],
    point: (r) => ({ x: r.right, y: r.top + r.height * 0.6 }),
  },
  {
    label: "Halo",
    side: "right",
    // The halo breathes out from the hub's edge, so its resting box is the hub's.
    find: slot("integration-visual-hub"),
    point: (r) => ({ x: r.right + 3, y: r.top - 3 }),
  },
  {
    label: "Plate",
    side: "right",
    find: (root) =>
      root.querySelector("[data-slot=integration-visual] > svg:first-of-type"),
    point: (r) => ({ x: r.right - 16, y: r.top + r.height * 0.5 }),
  },
  {
    label: "Pulse",
    side: "right",
    find: (root) => pulses(root)[3],
    point: (r) => ({ x: r.left, y: r.top + r.height * 0.6 }),
  },
]

export function Anatomy() {
  // Tiles scale in on mount, so measure again once they've landed.
  const [settled, setSettled] = useState(false)
  useEffect(() => {
    const id = setTimeout(() => setSettled(true), 900)
    return () => clearTimeout(id)
  }, [])
  return (
    <AnatomyMap callouts={PARTS} measureKey={settled}>
      <div className="flex justify-center px-10 py-4">
        <div
          data-anatomy-subject
          className="w-[440px] overflow-hidden rounded-xl border border-border"
        >
          <IntegrationVisual {...args} items={tools.slice(0, 4)} />
        </div>
      </div>
    </AnatomyMap>
  )
}

export function Corners() {
  return (
    <Frame>
      <IntegrationVisual {...args} items={tools.slice(0, 4)} />
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
        pulse="through"
        items={pipeline}
      />
    </Frame>
  )
}

export function TwoTools() {
  return (
    <Frame>
      <IntegrationVisual
        {...args}
        layout="sides"
        pulse="through"
        items={pair}
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

export function PulseOutward() {
  return (
    <Frame>
      <IntegrationVisual {...args} pulse="outward" items={tools.slice(0, 4)} />
    </Frame>
  )
}

export function PulseOff() {
  return (
    <Frame>
      <IntegrationVisual {...args} pulse="none" items={tools.slice(0, 4)} />
    </Frame>
  )
}

export function HaloOff() {
  return (
    <Frame>
      <IntegrationVisual {...args} halo={false} items={tools.slice(0, 4)} />
    </Frame>
  )
}

export function HubMark() {
  return (
    <Frame>
      <IntegrationVisual
        {...args}
        center={<WorkflowIcon />}
        centerLabel="Flows"
        items={tools.slice(0, 4)}
      />
    </Frame>
  )
}

export function HubCount() {
  return (
    <Frame>
      <IntegrationVisual {...args} center="12" items={tools.slice(0, 4)} />
    </Frame>
  )
}

/** Holds the preview open by hovering the hub the way a pointer would. */
export function PreviewOpen() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const hub = ref.current?.querySelector<HTMLElement>(
      "[data-slot=integration-visual-hub]"
    )
    if (!hub) return
    const id = setTimeout(() => {
      hub.dispatchEvent(new MouseEvent("mouseenter"))
    }, 600)
    return () => clearTimeout(id)
  }, [])
  return (
    <div ref={ref} className="w-full">
      <Frame>
        <IntegrationVisual
          {...args}
          preview={<SyncPreview />}
          items={tools.slice(0, 4)}
        />
      </Frame>
    </div>
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

export function DashedRoutes() {
  return (
    <Frame>
      <IntegrationVisual {...args} routes="dashed" items={tools.slice(0, 4)} />
    </Frame>
  )
}

export function Sizes() {
  return (
    <div className="grid w-full max-w-5xl gap-4 sm:grid-cols-3">
      {(["sm", "default", "lg"] as const).map((size) => (
        <div key={size} className="flex flex-col gap-2">
          <div className="overflow-hidden rounded-xl border border-border">
            <IntegrationVisual
              {...args}
              size={size}
              items={tools.slice(0, 4)}
            />
          </div>
          <span className="font-mono text-xs text-muted-foreground">
            {size}
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
          Routes pulse while a source is active, and dim while it waits to
          connect.
        </span>
      </div>
    </div>
  )
}

export function PipelineCard() {
  return (
    <div className="mx-auto flex w-full max-w-sm flex-col overflow-hidden rounded-2xl border border-border bg-card">
      <IntegrationVisual
        {...args}
        layout="sides"
        pulse="through"
        center={<WorkflowIcon />}
        label="Alert pipeline"
        items={pipeline}
      />
      <div className="flex flex-col gap-1.5 border-t border-border px-5 py-4">
        <span className="text-lg font-semibold tracking-tight text-card-foreground">
          Events in, alerts out
        </span>
        <span className="text-sm leading-6 text-muted-foreground">
          Webhooks, commits and new rows become messages in the places your team
          already reads.
        </span>
      </div>
    </div>
  )
}

export function DoIdle() {
  return (
    <RuleFrame>
      <IntegrationVisual
        {...args}
        size="sm"
        items={tools
          .slice(0, 4)
          .map((tool, i) =>
            i > 1 ? { ...tool, status: "idle" as const } : tool
          )}
      />
    </RuleFrame>
  )
}

export function DontSparse() {
  return (
    <RuleFrame>
      <IntegrationVisual {...args} size="sm" items={tools.slice(0, 2)} />
    </RuleFrame>
  )
}

export function DoShortHub() {
  return (
    <RuleFrame>
      <IntegrationVisual
        {...args}
        size="sm"
        center="12"
        items={tools.slice(0, 4)}
      />
    </RuleFrame>
  )
}

export function DontLongHub() {
  return (
    <RuleFrame>
      <IntegrationVisual
        {...args}
        size="sm"
        center="All your integrations"
        items={tools.slice(0, 4)}
      />
    </RuleFrame>
  )
}

export function DoThrough() {
  return (
    <RuleFrame>
      <IntegrationVisual
        {...args}
        size="sm"
        layout="sides"
        pulse="through"
        items={pipeline}
      />
    </RuleFrame>
  )
}

export function DontInward() {
  return (
    <RuleFrame>
      <IntegrationVisual
        {...args}
        size="sm"
        layout="sides"
        pulse="inward"
        items={pipeline}
      />
    </RuleFrame>
  )
}
