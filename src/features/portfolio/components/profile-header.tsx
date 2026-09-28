import Image from "next/image"
import {
  ChevronDownIcon,
  ComponentIcon,
  FrameIcon,
  HandIcon,
  MenuIcon,
  MessageCircleIcon,
  MousePointer2Icon,
  PenToolIcon,
  SquareIcon,
  TypeIcon,
} from "lucide-react"

import { USER } from "@/features/portfolio/data/user"

import { FlipSentences } from "./flip-sentences"
import { Greeting } from "./greeting"
import { HeroLayers } from "./hero-layers"
import { HeroProperties } from "./hero-properties"

/*
 * The hero as a Figma file: a toolbar, a layers panel that navigates the page,
 * a canvas with the pixel portrait selected, and a properties panel with who
 * I am, what I do and how to reach me. It says "I build design systems and
 * ship them" by being one.
 */

// Figma's selection blue and component purple. The purple is darkened a step
// as text on the light canvas and lifted a step in dark mode.
const BLUE = "#0D99FF"
const COMPONENT = "text-[#8638E5] dark:text-[#C29CFF]"
// The file owner's colour, from the site's dither palette.
const ROSE = "#A64B58"

const TOOLS = [
  MousePointer2Icon,
  FrameIcon,
  SquareIcon,
  PenToolIcon,
  TypeIcon,
  HandIcon,
  MessageCircleIcon,
]

export function ProfileHeader() {
  return (
    <div className="screen-line-bottom border-x border-line">
      <Toolbar />
      <div className="grid sm:grid-cols-[1fr_18rem] md:grid-cols-[9rem_1fr_18rem]">
        <HeroLayers />
        <Canvas />
        <HeroProperties />
      </div>
    </div>
  )
}

function Toolbar() {
  return (
    <div className="grid h-10 grid-cols-[1fr_auto_1fr] items-center border-b border-line px-2 text-xs">
      {/* The tools are a picture of Figma, not controls, so they stay out of
          the tab order and the accessibility tree. */}
      <div className="flex items-center gap-0.5" aria-hidden>
        <span className="grid size-7 place-items-center rounded-md text-muted-foreground">
          <MenuIcon className="size-4" />
        </span>
        {TOOLS.map((Icon, index) => (
          <span
            key={index}
            className="grid size-7 place-items-center rounded-md text-muted-foreground max-sm:[&:nth-child(n+5)]:hidden"
            style={
              index === 0
                ? { backgroundColor: BLUE, color: "white" }
                : undefined
            }
          >
            <Icon className="size-4" />
          </span>
        ))}
      </div>

      <p className="flex items-center gap-1 text-muted-foreground">
        <span className="max-sm:hidden">toribryan</span>
        <span className="max-sm:hidden" aria-hidden>
          /
        </span>
        <span className="font-medium text-foreground">Home</span>
        <ChevronDownIcon className="size-3" aria-hidden />
      </p>

      <div className="flex items-center justify-end gap-2" aria-hidden>
        <Image
          className="size-6 rounded-full border-2 select-none"
          style={{ borderColor: ROSE }}
          src="/images/header/nav-photo.webp"
          alt=""
          width={48}
          height={48}
          unoptimized
        />
        <span className="font-mono text-muted-foreground tabular-nums max-sm:hidden">
          100%
        </span>
      </div>
    </div>
  )
}

function Canvas() {
  return (
    <div className="relative flex min-h-96 flex-col items-center justify-center overflow-hidden bg-muted/40 [background-image:radial-gradient(var(--color-line)_1px,transparent_1px)] [background-size:16px_16px] pb-10 max-sm:border-b max-sm:border-line max-sm:pt-4 sm:justify-end sm:border-r sm:border-line sm:pb-14">
      <span
        className="absolute top-3 left-3 text-[11px] text-muted-foreground max-sm:hidden"
        aria-hidden
      >
        Hero
      </span>

      {/* A comment thread pinned to the canvas, left by the owner of the
          file: the greeting, and the rotating note as its reply. */}
      <div className="flex w-64 max-w-[85%] items-start gap-2 self-end max-sm:mr-4 max-sm:mb-8 sm:absolute sm:top-4 sm:right-4">
        <Image
          className="size-7 shrink-0 rounded-full rounded-bl-none border-2 bg-background select-none"
          style={{ borderColor: ROSE }}
          src="/images/header/nav-photo.webp"
          alt=""
          width={56}
          height={56}
          unoptimized
        />
        <div className="min-w-0 flex-1 rounded-xl rounded-tl-none border border-line bg-background px-2.5 py-2 shadow-md">
          <p className="flex items-baseline justify-between gap-2 text-[11px]">
            <span className="font-medium text-foreground">
              {USER.firstName}
            </span>
            <span className="text-muted-foreground">just now</span>
          </p>
          <Greeting className="mt-1 block font-mono text-xs text-foreground" />
          <FlipSentences className="mt-1.5 h-16 border-t border-line pt-1.5">
            {USER.flipSentences}
          </FlipSentences>
        </div>
      </div>

      <div className="relative mt-6">
        <span
          className={`absolute -top-6 left-0 flex items-center gap-1 text-[11px] font-medium ${COMPONENT}`}
          aria-hidden
        >
          <ComponentIcon className="size-3" />
          {USER.displayName}
        </span>

        <div className="group relative bg-[#EDDFD6]">
          <Image
            className="size-44 select-none group-hover:animate-pixel-hop motion-reduce:animate-none"
            src={USER.portrait}
            alt={`${USER.displayName}'s pixel portrait`}
            width={495}
            height={495}
            priority
            unoptimized
          />
          <span
            className="pointer-events-none absolute inset-0 border"
            style={{ borderColor: BLUE }}
            aria-hidden
          />
          {[
            "-top-1 -left-1",
            "-top-1 -right-1",
            "-bottom-1 -left-1",
            "-bottom-1 -right-1",
          ].map((corner) => (
            <span
              key={corner}
              className={`pointer-events-none absolute size-2 border bg-white ${corner}`}
              style={{ borderColor: BLUE }}
              aria-hidden
            />
          ))}
        </div>

        <span
          className="absolute -bottom-7 left-1/2 -translate-x-1/2 rounded-sm px-1.5 py-0.5 font-mono text-[11px] whitespace-nowrap text-white tabular-nums"
          style={{ backgroundColor: BLUE }}
          aria-hidden
        >
          176 × 176
        </span>
      </div>
    </div>
  )
}
