"use client"

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"

import { cn } from "@/lib/utils"
import type { ChartConfig } from "@/components/ui/radar-chart"
import {
  Chart,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/radar-chart"

/**
 * How far each product reaches on the six things the suite has to cover,
 * as a share of the axis. Read off the Figma drawing.
 */
const DATA = [
  { vector: "Prevent content theft", integrity: 80, vault: 100, origin: 10 },
  { vector: "Block AI assistance", integrity: 100, vault: 20, origin: 100 },
  { vector: "Track leaked content", integrity: 60, vault: 100, origin: 10 },
  { vector: "Prevent impersonation", integrity: 100, vault: 100, origin: 10 },
  { vector: "Detect AI use", integrity: 100, vault: 10, origin: 100 },
  { vector: "Monitor behaviour", integrity: 100, vault: 60, origin: 100 },
]

const CONFIG = {
  integrity: { label: "Integrity", color: "var(--muted-foreground)" },
  vault: { label: "Vault", color: "var(--muted-foreground)" },
  origin: { label: "Origin", color: "var(--success)" },
} satisfies ChartConfig

/**
 * Axis labels in the deck's small mono style, broken over two lines so they
 * sit close to the grid without running into the edge of the chart.
 */
function AxisTick({
  x,
  y,
  payload,
  textAnchor,
}: {
  x?: number
  y?: number
  payload?: { value: string }
  textAnchor?: "start" | "middle" | "end"
}) {
  const words = (payload?.value ?? "").split(" ")
  const split = Math.ceil(words.length / 2)
  const lines = [words.slice(0, split).join(" "), words.slice(split).join(" ")]
  return (
    <text
      x={x}
      y={y}
      textAnchor={textAnchor}
      className="fill-muted-foreground font-mono text-[10px] tracking-wide uppercase"
    >
      {lines.map((line, i) => (
        <tspan key={line} x={x} dy={i === 0 ? -2 : 12}>
          {line}
        </tspan>
      ))}
    </text>
  )
}

/**
 * The integrity suite as a radar. Integrity and Vault sit back as dashed
 * outlines; Origin, the task, fills in green. Each area grows out of the
 * centre when the chart mounts.
 */
export function AuthorProofRadar({ className }: { className?: string }) {
  return (
    <Chart
      config={CONFIG}
      className={cn("[&_.recharts-surface]:overflow-visible", className)}
    >
      <RadarChart
        data={DATA}
        outerRadius="78%"
        margin={{ top: 16, right: 24, bottom: 16, left: 24 }}
      >
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <PolarAngleAxis dataKey="vector" tick={<AxisTick />} />
        <PolarGrid stroke="var(--border)" />
        <Radar
          dataKey="integrity"
          stroke="var(--color-integrity)"
          strokeDasharray="3 3"
          fill="var(--color-integrity)"
          fillOpacity={0.06}
          animationDuration={1500}
        />
        <Radar
          dataKey="vault"
          stroke="var(--color-vault)"
          strokeDasharray="3 3"
          fill="var(--color-vault)"
          fillOpacity={0.06}
          animationDuration={1500}
          animationBegin={200}
        />
        <Radar
          dataKey="origin"
          stroke="var(--color-origin)"
          strokeWidth={1.5}
          fill="var(--color-origin)"
          fillOpacity={0.3}
          dot={{ r: 3.5, fill: "var(--color-origin)", strokeWidth: 0 }}
          animationDuration={1500}
          animationBegin={400}
        />
      </RadarChart>
    </Chart>
  )
}
