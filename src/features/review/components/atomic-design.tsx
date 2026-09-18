"use client"

import Image from "next/image"

import { cn } from "@/lib/utils"
import { REVIEW_LINKS } from "@/features/review/data/links"

import { Frame, Reveal } from "./slide-primitives"

type Story = {
  /** Storybook story id, as `index.json` lists it, or a full URL to frame. */
  id: string
  label: string
  /**
   * Sit the story in the middle of its frame rather than its top-left
   * corner. Storybook only centers a story that declares `layout:
   * centered` itself, so the frame is offset by the control's rough size
   * instead: `[width, height]` in pixels, or `true` for a 96 by 40 one.
   */
  center?: true | [number, number]
  /**
   * Draw the story at this fraction of its size, so a component that
   * collapses below a desktop width sees one inside a narrow frame.
   */
  scale?: number
  /**
   * A still instead of a frame, for a story the published Storybook cannot
   * render yet.
   */
  image?: { src: string; alt: string; width: number; height: number }
}

type Level = {
  name: string
  line: string
  stories: Story[]
  /** Height of each story frame; the row's stories share it. */
  height: number
}

/**
 * Atomic design walked with the library's own stories, bottom up. Each id
 * is a real story on the Modern Care Homes Storybook.
 */
const LEVELS: Level[] = [
  {
    name: "Atoms",
    line: "The floor lives here: 18px type, 48px targets, AA on every surface.",
    height: 150,
    stories: [
      { id: "ui-button--default", label: "Button", center: true },
      { id: "ui-checkbox--states", label: "Checkbox · states", center: true },
      { id: "ui-switch--sizes", label: "Switch · sizes", center: true },
    ],
  },
  {
    name: "Molecules",
    line: "Atoms that only make sense together.",
    height: 260,
    stories: [
      { id: "ui-select--default", label: "Select", center: [150, 56] },
      {
        id: "ui-buttongroup--pill-buttons",
        label: "Button group · pill",
        center: [200, 56],
      },
    ],
  },
  {
    name: "Organisms",
    line: "The home card and the agent platform’s sidebar, from the same atoms.",
    height: 320,
    stories: [
      {
        id: "components-cards-hometablecard--default",
        label: "Home card",
        image: {
          src: "/case-studies/new-homecard-mch.png",
          alt: "The home card: an Available Now badge, a save control, photo carousel dots, then name, address and price",
          width: 978,
          height: 786,
        },
      },
      { id: "ui-sidebar--default", label: "Sidebar", scale: 0.4 },
    ],
  },
  {
    name: "Templates",
    line: "Filters, results, and the map, before any listing is real.",
    height: 480,
    stories: [
      { id: "search-filterform--in-dialog-chrome", label: "Filter form" },
    ],
  },
  {
    name: "Pages",
    line: "The marketplace itself, live, made of everything above.",
    height: 560,
    stories: [
      {
        id: REVIEW_LINKS.modernCareHomes.findHomes,
        label: "moderncarehomes.com/find-homes",
      },
    ],
  },
]

function isUrl(id: string) {
  return /^https?:/.test(id)
}

function frameUrl(id: string) {
  return isUrl(id)
    ? id
    : `${REVIEW_LINKS.modernCareHomes.storybook}/iframe.html?id=${id}&viewMode=story`
}

function openUrl(id: string) {
  return isUrl(id)
    ? id
    : `${REVIEW_LINKS.modernCareHomes.storybook}/?path=/story/${id}`
}

/** Storybook's own padding around a story's canvas. */
const CANVAS_PADDING = 16

function StoryFrame({ story, height }: { story: Story; height: number }) {
  const [width, controlHeight] =
    story.center === true ? [96, 40] : (story.center ?? [0, 0])
  return (
    <figure className="flex min-w-0 flex-1 flex-col gap-2">
      <Frame>
        {story.image ? (
          <Image
            className="block w-full rounded-xl bg-white object-cover"
            style={{ height }}
            src={story.image.src}
            alt={story.image.alt}
            width={story.image.width}
            height={story.image.height}
            unoptimized
          />
        ) : (
          <div
            className="relative overflow-hidden rounded-xl bg-white"
            style={{ height }}
          >
            <iframe
              className={cn(
                "block origin-top-left",
                story.center ? "absolute" : "w-full"
              )}
              style={
                story.center
                  ? {
                      width: "100%",
                      height,
                      left: `calc(50% - ${width / 2 + CANVAS_PADDING}px)`,
                      top: `calc(50% - ${controlHeight / 2 + CANVAS_PADDING}px)`,
                    }
                  : story.scale
                    ? {
                        width: `${100 / story.scale}%`,
                        height: height / story.scale,
                        transform: `scale(${story.scale})`,
                      }
                    : { height }
              }
              src={frameUrl(story.id)}
              title={story.label}
              loading="lazy"
            />
          </div>
        )}
      </Frame>
      <figcaption className="flex items-center justify-between gap-2 px-1 text-xs text-muted-foreground">
        <span>{story.label}</span>
        <a
          className="link-underline"
          href={openUrl(story.id)}
          target="_blank"
          rel="noopener noreferrer"
        >
          Open
        </a>
      </figcaption>
    </figure>
  )
}

/**
 * Atomic design, walked with Modern Care Homes' own Storybook: each level a
 * row, its stories live on the right, from a button up to the live site.
 * Rows reveal in order so the build-up reads as one.
 */
export function AtomicDesign({ className }: { className?: string }) {
  return (
    <ol
      className={cn(
        "screen-line-top screen-line-bottom flex flex-col divide-y divide-line",
        className
      )}
    >
      {LEVELS.map((level, i) => (
        <Reveal key={level.name}>
          <li className="grid gap-4 py-5 md:grid-cols-[10rem_1fr] md:gap-8">
            <div className="flex flex-col gap-1.5">
              <p className="text-xs tracking-wide text-muted-foreground uppercase">
                {String(i + 1).padStart(2, "0")} · {level.name}
              </p>
              <p className="text-sm/snug text-pretty text-muted-foreground">
                {level.line}
              </p>
            </div>
            <div className="flex min-w-0 gap-3">
              {level.stories.map((story) => (
                <StoryFrame
                  key={story.id}
                  story={story}
                  height={level.height}
                />
              ))}
            </div>
          </li>
        </Reveal>
      ))}
    </ol>
  )
}
