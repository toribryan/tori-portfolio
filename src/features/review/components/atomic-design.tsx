"use client"

import { cn } from "@/lib/utils"
import { REVIEW_LINKS } from "@/features/review/data/links"

import { Frame, Reveal } from "./slide-primitives"

type Story = {
  /** Storybook story id, as `index.json` lists it. */
  id: string
  label: string
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
      { id: "ui-button--default", label: "Button" },
      { id: "ui-checkbox--states", label: "Checkbox · states" },
      { id: "ui-switch--sizes", label: "Switch · sizes" },
    ],
  },
  {
    name: "Molecules",
    line: "Atoms that only make sense together.",
    height: 170,
    stories: [
      { id: "ui-inputgroup--with-button", label: "Input group" },
      { id: "ui-field--input", label: "Field" },
      { id: "ui-buttongroup--pill-buttons", label: "Button group · pill" },
    ],
  },
  {
    name: "Organisms",
    line: "Molecules doing a job: search on the marketplace, the availability table on the agent platform.",
    height: 320,
    stories: [
      {
        id: "components-search-homeherosearch--with-suggestions",
        label: "Hero search · suggestions",
      },
      { id: "ui-table--rooms-availability", label: "Rooms · availability" },
    ],
  },
  {
    name: "Templates",
    line: "Filters, results and the map, before any listing is real.",
    height: 480,
    stories: [
      { id: "search-filterform--default", label: "Filter form" },
      {
        id: "search-filterform--with-active-filters",
        label: "Filter form · active filters",
      },
    ],
  },
  {
    name: "Pages",
    line: "The hero a family lands on, made of everything above.",
    height: 520,
    stories: [{ id: "components-homehero--default", label: "Home hero" }],
  },
]

function storyUrl(id: string) {
  return `${REVIEW_LINKS.modernCareHomes.storybook}/iframe.html?id=${id}&viewMode=story`
}

function StoryFrame({ story, height }: { story: Story; height: number }) {
  return (
    <figure className="flex min-w-0 flex-1 flex-col gap-2">
      <Frame>
        <iframe
          className="block w-full rounded-xl bg-white"
          style={{ height }}
          src={storyUrl(story.id)}
          title={story.label}
          loading="lazy"
        />
      </Frame>
      <figcaption className="flex items-center justify-between gap-2 px-1 font-mono text-xs text-muted-foreground">
        <span>{story.label}</span>
        <a
          className="link-underline"
          href={`${REVIEW_LINKS.modernCareHomes.storybook}/?path=/story/${story.id}`}
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
 * row, its stories live on the right, from a button up to the page hero.
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
              <p className="font-mono text-xs tracking-wide text-muted-foreground uppercase">
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
