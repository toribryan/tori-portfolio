"use client"

import Image from "next/image"
import { HeartIcon, MapPinIcon, SearchIcon } from "lucide-react"

import { cn } from "@/lib/utils"

import { Frame, Reveal } from "./slide-primitives"

/**
 * Modern Care Homes' own palette, scoped to the demos so the pieces read
 * as the marketplace's and not the deck's.
 */
const MCH = {
  "--mch-green": "#22c55e",
  "--mch-blue": "#1e3a8a",
  "--mch-ink": "#1f2937",
  "--mch-muted": "#6b7280",
  "--mch-surface": "#ffffff",
  "--mch-line": "#e5e7eb",
} as React.CSSProperties

/* ---------------------------------------------------------------- atoms */

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex h-7 items-center rounded-full bg-(--mch-green) px-3 text-[13px] font-medium text-white">
      {children}
    </span>
  )
}

function SaveButton() {
  return (
    <span
      className="inline-flex size-12 items-center justify-center rounded-full bg-(--mch-surface) text-(--mch-blue) shadow-sm inset-ring-1 inset-ring-(--mch-line)"
      aria-label="Save"
    >
      <HeartIcon className="size-5" />
    </span>
  )
}

function Button({
  children,
  variant = "primary",
}: {
  children: React.ReactNode
  variant?: "primary" | "outline"
}) {
  return (
    <span
      className={cn(
        "inline-flex h-12 items-center rounded-full px-5 text-[15px] font-medium",
        variant === "primary"
          ? "bg-(--mch-blue) text-white"
          : "text-(--mch-ink) inset-ring-1 inset-ring-(--mch-line)"
      )}
    >
      {children}
    </span>
  )
}

function Input({ placeholder }: { placeholder: string }) {
  return (
    <span className="inline-flex h-12 min-w-40 items-center gap-2 rounded-full bg-(--mch-surface) px-4 text-[15px] text-(--mch-muted) inset-ring-1 inset-ring-(--mch-line)">
      <SearchIcon className="size-4" />
      {placeholder}
    </span>
  )
}

function Dots({ count = 4, active = 0 }: { count?: number; active?: number }) {
  return (
    <span className="inline-flex h-6 items-center gap-1.5 rounded-full bg-black/45 px-2.5">
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className={cn(
            "h-1.5 rounded-full bg-white",
            i === active ? "w-5" : "w-1.5 opacity-70"
          )}
        />
      ))}
    </span>
  )
}

function Swatches() {
  return (
    <span className="inline-flex gap-1.5">
      {["--mch-blue", "--mch-green", "--mch-ink", "--mch-line"].map((v) => (
        <span
          key={v}
          className="size-6 rounded-md inset-ring-1 inset-ring-black/10"
          style={{ background: `var(${v})` }}
        />
      ))}
    </span>
  )
}

/* ------------------------------------------------------------ molecules */

function SearchBar() {
  return (
    <span className="inline-flex items-center gap-2">
      <Input placeholder="Search by city" />
      <Button>Search</Button>
    </span>
  )
}

function PriceLine() {
  return (
    <span className="flex flex-col gap-0.5 text-(--mch-ink)">
      <span className="text-[15px] font-medium">Agavia Assisted Living</span>
      <span className="flex items-center gap-1 text-[13px] text-(--mch-muted)">
        <MapPinIcon className="size-3.5" />
        Phoenix, AZ 85086
      </span>
      <span className="text-[15px]">Starting at $7000</span>
    </span>
  )
}

/* ------------------------------------------------------------- organism */

function HomeCard({ className }: { className?: string }) {
  return (
    <div className={cn("flex w-64 flex-col gap-2", className)}>
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
        <Image
          className="size-full object-cover object-[50%_40%]"
          src="/case-studies/new-homecard-mch.png"
          alt=""
          width={978}
          height={786}
          unoptimized
        />
        <span className="absolute top-2 left-2">
          <Badge>Available Now</Badge>
        </span>
        <span className="absolute top-2 right-2 [transform-origin:top_right] scale-75">
          <SaveButton />
        </span>
        <span className="absolute bottom-2 left-1/2 -translate-x-1/2">
          <Dots />
        </span>
      </div>
      <PriceLine />
    </div>
  )
}

/* ------------------------------------------------------------- template */

function ResultsTemplate() {
  return (
    <div className="grid w-full max-w-md grid-cols-[4rem_1fr_5rem] gap-2 rounded-xl bg-(--mch-surface) p-2 inset-ring-1 inset-ring-(--mch-line)">
      <div className="flex flex-col gap-1.5">
        {[16, 12, 14, 10].map((w, i) => (
          <span
            key={i}
            className="h-2 rounded-full bg-(--mch-line)"
            style={{ width: `${w * 4}px` }}
          />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="flex flex-col gap-1">
            <span className="aspect-[4/3] rounded-md bg-(--mch-line)" />
            <span className="h-1.5 w-3/4 rounded-full bg-(--mch-line)" />
            <span className="h-1.5 w-1/2 rounded-full bg-(--mch-line)" />
          </div>
        ))}
      </div>
      <div className="relative rounded-md bg-(--mch-line)">
        {[
          [30, 25],
          [55, 60],
          [70, 35],
        ].map(([x, y]) => (
          <span
            key={`${x}-${y}`}
            className="absolute size-2 rounded-full bg-(--mch-blue) ring-2 ring-white"
            style={{ left: `${x}%`, top: `${y}%` }}
          />
        ))}
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------- levels */

const LEVELS = [
  {
    name: "Atoms",
    line: "The floor, in the smallest piece: 18px type, 48px targets, one green.",
    demo: (
      <div className="flex flex-wrap items-center gap-3">
        <Button>Book a tour</Button>
        <Button variant="outline">Compare</Button>
        <Badge>Available Now</Badge>
        <SaveButton />
        <Dots />
        <Swatches />
      </div>
    ),
  },
  {
    name: "Molecules",
    line: "Atoms that only make sense together.",
    demo: (
      <div className="flex flex-wrap items-center gap-6">
        <SearchBar />
        <span className="flex items-center gap-2">
          <Badge>Available Now</Badge>
          <SaveButton />
        </span>
        <PriceLine />
      </div>
    ),
  },
  {
    name: "Organisms",
    line: "The home card: decided once, holds on every listing.",
    demo: <HomeCard />,
  },
  {
    name: "Templates",
    line: "Search results: filters, the grid, the map. Content-agnostic.",
    demo: <ResultsTemplate />,
  },
  {
    name: "Pages",
    line: "The marketplace a family lands on, and the agent platform beside it.",
    demo: (
      <Frame className="w-full">
        <video
          className="w-full rounded-xl"
          src="/case-studies/home-grid-mch.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
      </Frame>
    ),
  },
]

/**
 * Atomic design, walked with Modern Care Homes' own pieces: each level a
 * row, the demo on the right built from the level above it, down to the
 * live page. Rows reveal in order so the build-up reads as one.
 */
export function AtomicDesign({ className }: { className?: string }) {
  return (
    <ol
      className={cn(
        "screen-line-top screen-line-bottom flex flex-col divide-y divide-line",
        className
      )}
      style={MCH}
    >
      {LEVELS.map((level, i) => (
        <Reveal key={level.name}>
          <li className="grid gap-4 py-5 md:grid-cols-[11rem_1fr] md:gap-8">
            <div className="flex flex-col gap-1.5">
              <p className="font-mono text-xs tracking-wide text-muted-foreground uppercase">
                {String(i + 1).padStart(2, "0")} · {level.name}
              </p>
              <p className="text-sm/snug text-pretty text-muted-foreground">
                {level.line}
              </p>
            </div>
            <div className="flex min-w-0 items-center">{level.demo}</div>
          </li>
        </Reveal>
      ))}
    </ol>
  )
}
