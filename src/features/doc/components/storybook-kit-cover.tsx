"use client"

import { useRef, type ComponentType, type CSSProperties } from "react"
import {
  ChevronDownIcon,
  ChevronRightIcon,
  ComponentIcon,
  DiamondIcon,
  FileTextIcon,
  HouseIcon,
  LayoutGridIcon,
  ListFilterIcon,
  PaletteIcon,
  PlusIcon,
  SearchIcon,
  SettingsIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { ScaledStage } from "@/features/portfolio/components/components/covers"

import { useCoverSteps } from "./use-cover-steps"

/** Each step selects the next entry under Button, starting from Docs. */
const STEP_AT = [0, 700, 1400, 2100]

const ENTRIES = ["Docs", "Default", "All Variants", "Disabled"]

function selectedAt(step: number) {
  return ENTRIES[step]
}

/*
 * Storybook's stock manager palette, which the default side draws in whatever
 * the site's theme: that is what an unstyled Storybook looks like.
 */
const SB = {
  surface: "#f6f9fc",
  line: "#e6e9ec",
  text: "#2e3438",
  muted: "#73828c",
  selected: "#029cfd",
  folder: "#6f2cac",
  component: "#029cfd",
  story: "#37d5d3",
  docs: "#ff8300",
}

/*
 * Storybook's own glyphs, from @storybook/icons, so the default side shows
 * the icons a fresh Storybook ships with rather than the kit's.
 */
type Glyph = { className?: string; style?: CSSProperties }

function glyph(paths: string[], viewBox = "0 0 14 14") {
  function StorybookGlyph({ className, style }: Glyph) {
    return (
      <svg
        viewBox={viewBox}
        fill="currentColor"
        className={className}
        style={style}
        aria-hidden
      >
        {paths.map((d) => (
          <path key={d} d={d} fillRule="evenodd" clipRule="evenodd" />
        ))}
      </svg>
    )
  }
  return StorybookGlyph
}

const SbStorybook = glyph([
  "M2.042.616a.704.704 0 00-.66.729L1.816 12.9c.014.367.306.66.672.677l9.395.422h.032a.704.704 0 00.704-.703V.704c0-.015 0-.03-.002-.044a.704.704 0 00-.746-.659l-.773.049.057 1.615a.105.105 0 01-.17.086l-.52-.41-.617.468a.105.105 0 01-.168-.088L9.746.134 2.042.616zm8.003 4.747c-.247.192-2.092.324-2.092.05.04-1.045-.429-1.091-.689-1.091-.247 0-.662.075-.662.634 0 .57.607.893 1.32 1.27 1.014.538 2.24 1.188 2.24 2.823 0 1.568-1.273 2.433-2.898 2.433-1.676 0-3.141-.678-2.976-3.03.065-.275 2.197-.21 2.197 0-.026.971.195 1.256.753 1.256.43 0 .624-.236.624-.634 0-.602-.633-.958-1.361-1.367-.987-.554-2.148-1.205-2.148-2.7 0-1.494 1.027-2.489 2.86-2.489 1.832 0 2.832.98 2.832 2.845z",
])
const SbEllipsis = glyph([
  "M4 7a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM13 7a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM7 8.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z",
])
const SbSearch = glyph([
  "M9.544 10.206a5.5 5.5 0 11.662-.662.5.5 0 01.148.102l3 3a.5.5 0 01-.708.708l-3-3a.5.5 0 01-.102-.148zM10.5 6a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z",
])
const SbChevronDown = glyph([
  "M3.854 4.896a.5.5 0 10-.708.708l3.5 3.5a.5.5 0 00.708 0l3.5-3.5a.5.5 0 00-.708-.708L7 8.043 3.854 4.896z",
])
const SbChevronRight = glyph([
  "M4.896 10.146a.5.5 0 00.708.708l3.5-3.5a.5.5 0 000-.708l-3.5-3.5a.5.5 0 10-.708.708L8.043 7l-3.147 3.146z",
])
const SbComponent = glyph([
  "M3.5 1.004a2.5 2.5 0 00-2.5 2.5v7a2.5 2.5 0 002.5 2.5h7a2.5 2.5 0 002.5-2.5v-7a2.5 2.5 0 00-2.5-2.5h-7zm8.5 5.5H7.5v-4.5h3a1.5 1.5 0 011.5 1.5v3zm0 1v3a1.5 1.5 0 01-1.5 1.5h-3v-4.5H12zm-5.5 4.5v-4.5H2v3a1.5 1.5 0 001.5 1.5h3zM2 6.504h4.5v-4.5h-3a1.5 1.5 0 00-1.5 1.5v3z",
])
const SbDocument = glyph([
  "M4 5.5a.5.5 0 01.5-.5h5a.5.5 0 010 1h-5a.5.5 0 01-.5-.5zM4.5 7.5a.5.5 0 000 1h5a.5.5 0 000-1h-5zM4 10.5a.5.5 0 01.5-.5h5a.5.5 0 010 1h-5a.5.5 0 01-.5-.5z",
  "M1.5 0a.5.5 0 00-.5.5v13a.5.5 0 00.5.5h11a.5.5 0 00.5-.5V3.207a.5.5 0 00-.146-.353L10.146.146A.5.5 0 009.793 0H1.5zM2 1h7.5v2a.5.5 0 00.5.5h2V13H2V1z",
])
const SbBookmark = glyph(
  [
    "M3.5 0h7a.5.5 0 01.5.5v13a.5.5 0 01-.454.498.462.462 0 01-.371-.118L7 11.159l-3.175 2.72a.46.46 0 01-.379.118A.5.5 0 013 13.5V.5a.5.5 0 01.5-.5zM4 12.413l2.664-2.284a.454.454 0 01.377-.128.498.498 0 01.284.12L10 12.412V1H4v11.413z",
  ],
  "0 0 14 15"
)

const DefaultRow = ({
  icon: Icon,
  color,
  label,
  depth,
  active = false,
  chevron,
}: {
  icon: ComponentType<Glyph>
  color: string
  label: string
  depth: number
  active?: boolean
  chevron?: "open" | "closed"
}) => (
  <span
    className="flex h-[14px] items-center gap-1 rounded-[3px] pr-1 transition-colors duration-150"
    style={{
      paddingLeft: 4 + depth * 9,
      background: active ? SB.selected : "transparent",
      color: active ? "#ffffff" : SB.text,
      fontWeight: active ? 700 : 400,
    }}
  >
    <span className="flex w-2 justify-center" style={{ color: SB.muted }}>
      {chevron === "open" && <SbChevronDown className="size-2" />}
      {chevron === "closed" && <SbChevronRight className="size-2" />}
    </span>
    <Icon
      className="size-2.5 shrink-0"
      style={{ color: active ? "#ffffff" : color }}
    />
    {label}
  </span>
)

function DefaultSidebar({ step }: { step: number }) {
  const selected = selectedAt(step)

  return (
    <div
      className="flex h-full flex-col gap-2 overflow-hidden rounded-lg border px-2 py-2.5 text-[8px] shadow-[0_8px_24px_rgb(0_0_0/0.10)]"
      style={{
        background: SB.surface,
        borderColor: SB.line,
        color: SB.text,
        fontFamily: '"Nunito Sans", ui-sans-serif, system-ui, sans-serif',
      }}
    >
      <div className="flex items-center justify-between px-1">
        <span className="flex items-center gap-1 text-[11px] font-extrabold tracking-tight">
          <SbStorybook className="size-3 text-[#ff4785]" />
          Storybook
        </span>
        <SbEllipsis className="size-2.5" style={{ color: SB.muted }} />
      </div>
      <div
        className="flex items-center gap-1 rounded-full border bg-white px-1.5 py-1"
        style={{ borderColor: SB.line, color: SB.muted }}
      >
        <SbSearch className="size-2.5" />
        <span className="flex-1">Find components</span>
        <span className="rounded-[2px] border px-[3px] text-[6.5px] leading-tight">
          /
        </span>
      </div>
      <div className="flex flex-col">
        <span
          className="flex items-center gap-1 px-1 py-[3px] text-[6.5px] font-bold tracking-[0.12em] uppercase"
          style={{ color: SB.muted }}
        >
          <SbChevronRight className="size-2" />
          Foundations
        </span>
        <span
          className="mt-1 flex items-center gap-1 px-1 py-[3px] text-[6.5px] font-bold tracking-[0.12em] uppercase"
          style={{ color: SB.muted }}
        >
          <SbChevronDown className="size-2" />
          Components
        </span>
        <DefaultRow
          icon={SbComponent}
          color={SB.component}
          label="Badge"
          depth={0}
          chevron="closed"
        />
        <DefaultRow
          icon={SbComponent}
          color={SB.component}
          label="Button"
          depth={0}
          chevron="open"
        />
        {ENTRIES.map((entry) => (
          <DefaultRow
            key={entry}
            icon={entry === "Docs" ? SbDocument : SbBookmark}
            color={entry === "Docs" ? SB.docs : SB.story}
            label={entry}
            depth={1}
            active={selected === entry}
          />
        ))}
      </div>
    </div>
  )
}

const KitRow = ({
  icon: Icon,
  label,
  depth,
  chevron,
}: {
  icon: ComponentType<{ className?: string }>
  label: string
  depth: number
  chevron?: "open" | "closed"
}) => (
  <span
    className="flex h-[15px] items-center gap-1 pr-1"
    style={{ paddingLeft: depth * 8 }}
  >
    <span className="flex w-2 justify-center text-muted-foreground">
      {chevron === "open" && <ChevronDownIcon className="size-2" />}
      {chevron === "closed" && <ChevronRightIcon className="size-2" />}
    </span>
    <Icon className="size-2.5 shrink-0" />
    {label}
  </span>
)

function KitSidebar({ step }: { step: number }) {
  const selected = selectedAt(step)
  const index = ENTRIES.indexOf(selected)

  return (
    <div className="flex h-full flex-col gap-2 overflow-hidden rounded-lg border border-line bg-card px-2 py-2.5 text-[8px] text-foreground shadow-[0_8px_24px_rgb(0_0_0/0.12)]">
      <div className="flex items-center justify-between px-1">
        <span className="text-[11px] font-semibold tracking-tight">
          Design system
        </span>
        <span className="relative">
          <SettingsIcon className="size-2.5 text-muted-foreground" />
          <span className="absolute -top-px -right-px size-1 rounded-full bg-success" />
        </span>
      </div>
      <div className="flex items-center gap-1">
        <div className="flex flex-1 items-center gap-1 rounded-full border border-line px-1.5 py-1 text-muted-foreground">
          <SearchIcon className="size-2.5" />
          <span className="flex-1">Find components</span>
          <span className="text-[6.5px]">⌘ K</span>
          <ListFilterIcon className="size-2.5" />
        </div>
        <span className="flex size-[18px] items-center justify-center rounded-md border border-line bg-muted">
          <PlusIcon className="size-2.5" />
        </span>
      </div>
      <div className="flex flex-col">
        <KitRow icon={HouseIcon} label="Welcome" depth={0} />
        <span className="my-1 h-px bg-line" />
        <KitRow
          icon={PaletteIcon}
          label="Foundations"
          depth={0}
          chevron="closed"
        />
        <KitRow
          icon={LayoutGridIcon}
          label="Components"
          depth={0}
          chevron="open"
        />
        <KitRow icon={ComponentIcon} label="Badge" depth={1} chevron="closed" />
        <KitRow icon={ComponentIcon} label="Button" depth={1} chevron="open" />
        <div className="relative">
          {/* One pill that slides to the selected entry, rather than a
              fill that jumps between rows. It moves by `top`, not a
              transform: a transform lifts it onto its own layer mid-slide,
              and inside the scaled cover that nudges the icons around it
              by a fraction of a pixel. */}
          <span
            className="absolute inset-x-0 h-[15px] rounded-md bg-accent transition-[top] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]"
            style={{ top: index * 15 }}
          />
          {ENTRIES.map((entry) => (
            <span
              key={entry}
              className={cn(
                "relative",
                selected === entry ? "font-semibold" : "text-foreground"
              )}
            >
              <KitRow
                icon={entry === "Docs" ? FileTextIcon : DiamondIcon}
                label={entry}
                depth={2}
              />
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

/**
 * What storybook-kit changes, side by side: Storybook's stock sidebar and
 * the designed one the kit ships, with Button open, stepping through the
 * same entries. They move while the card is hovered or focused, or on a loop with `loop` or on
 * a touch screen.
 */
export function StorybookKitCover({ loop = false }: { loop?: boolean }) {
  const frame = useRef<HTMLDivElement>(null)
  const step = useCoverSteps(frame, STEP_AT, { loop })

  return (
    <div
      ref={frame}
      className="absolute inset-0 bg-cover-plate text-foreground"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle, var(--foreground) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
        aria-hidden
      />
      <ScaledStage width={480} zoom>
        {/* Both run taller than the cover, off its bottom edge. */}
        <div className="flex h-full items-start justify-center gap-6 px-8 pt-6">
          <div className="h-[260px] w-[168px]">
            <DefaultSidebar step={step} />
          </div>
          <div className="h-[260px] w-[168px]">
            <KitSidebar step={step} />
          </div>
        </div>
      </ScaledStage>
    </div>
  )
}
