import Image from "next/image"
import { addQueryParams } from "@/utils/url"
import {
  ComponentIcon,
  FrameIcon,
  HashIcon,
  MapPinIcon,
  MessageCircleIcon,
} from "lucide-react"

import { UTM_PARAMS } from "@/config/site"
import { Button } from "@/components/base/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/base/ui/tooltip"
import { SOCIAL_ICONS } from "@/features/portfolio/components/social-link-icons"
import { SOCIAL_LINKS } from "@/features/portfolio/data/social-links"
import { USER } from "@/features/portfolio/data/user"

import { FlipSentences } from "./flip-sentences"
import { Greeting } from "./greeting"
import { HeroActions } from "./hero-actions"
import { VerifiedIcon } from "./verified-icon"

/*
 * The hero as a design tool's inspector: a layers panel that navigates the
 * page, a canvas with the portrait selected, and a properties panel that
 * holds who I am, what I do and how to reach me. It says "I build design
 * systems and ship them" by being one.
 */

// Selection colour, taken from the rose in the site's dither palette and
// darkened so white labels on it clear 4.5:1.
const SELECT = "#A64B58"
// The same rose as text: lighter in dark mode, where the fill tone is too
// dim to read on the canvas.
const SELECT_TEXT = "text-[#A64B58] dark:text-[#E39AA4]"

const LAYERS = [
  { label: "Work", href: "#projects" },
  { label: "Components", href: "#components" },
  { label: "About", href: "#hello" },
  { label: "Experience", href: "#experience" },
  { label: "Stack", href: "#stack" },
]

export function ProfileHeader() {
  return (
    <div className="screen-line-bottom border-x border-line">
      <div className="flex h-9 items-center justify-between border-b border-line px-3 font-mono text-xs text-muted-foreground">
        <span>
          toribryan <span aria-hidden>/</span> home
        </span>
        <span aria-hidden>100%</span>
      </div>

      <div className="grid sm:grid-cols-[1fr_18rem] md:grid-cols-[8.5rem_1fr_18rem]">
        <LayersPanel />
        <Canvas />
        <PropertiesPanel />
      </div>
    </div>
  )
}

function PanelLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="px-3 pt-3 pb-2 text-xs font-medium text-foreground">
      {children}
    </p>
  )
}

function LayersPanel() {
  return (
    <nav
      aria-label="Sections"
      className="border-r border-line text-xs max-md:hidden"
    >
      <PanelLabel>Layers</PanelLabel>
      <ul className="flex flex-col pb-3">
        <li className="flex items-center gap-1.5 px-3 py-1 text-muted-foreground">
          <FrameIcon className="size-3.5" aria-hidden />
          Home
        </li>
        <li
          className="flex items-center gap-1.5 py-1 pr-3 pl-6 font-medium text-white"
          style={{ backgroundColor: SELECT }}
        >
          <ComponentIcon className="size-3.5" aria-hidden />
          {USER.displayName}
        </li>
        {LAYERS.map((layer) => (
          <li key={layer.href}>
            <a
              href={layer.href}
              className="flex items-center gap-1.5 py-1 pr-3 pl-6 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <HashIcon className="size-3.5" aria-hidden />
              {layer.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

function Canvas() {
  return (
    <div className="relative flex min-h-80 flex-col items-center justify-center overflow-hidden bg-muted/40 [background-image:radial-gradient(var(--color-line)_1px,transparent_1px)] [background-size:16px_16px] pb-10 max-sm:border-b max-sm:border-line max-sm:pt-4 sm:border-r sm:border-line sm:pb-0">
      {/* A comment thread pinned to the canvas: the greeting, and the
          rotating note as its reply. */}
      <div className="flex w-64 max-w-[85%] items-start gap-1.5 self-end max-sm:mr-4 max-sm:mb-8 sm:absolute sm:top-4 sm:right-4">
        <span
          className="grid size-6 shrink-0 place-items-center rounded-full rounded-bl-none text-white"
          style={{ backgroundColor: SELECT }}
          aria-hidden
        >
          <MessageCircleIcon className="size-3.5" />
        </span>
        <div className="min-w-0 flex-1 rounded-xl rounded-tl-none border border-line bg-background px-2.5 py-2 shadow-sm">
          <Greeting className="block font-mono text-xs text-foreground" />
          <FlipSentences className="mt-1.5 h-16 border-t border-line pt-1.5">
            {USER.flipSentences}
          </FlipSentences>
        </div>
      </div>

      <div className="relative mt-6">
        <span
          className={`absolute -top-6 left-0 flex items-center gap-1 text-[11px] font-medium ${SELECT_TEXT}`}
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
            style={{ borderColor: SELECT }}
            aria-hidden
          />
          {(
            [
              "-top-1 -left-1",
              "-top-1 -right-1",
              "-bottom-1 -left-1",
              "-bottom-1 -right-1",
            ] as const
          ).map((corner) => (
            <span
              key={corner}
              className={`pointer-events-none absolute size-2 border bg-white ${corner}`}
              style={{ borderColor: SELECT }}
              aria-hidden
            />
          ))}
        </div>

        <span
          className="absolute -bottom-7 left-1/2 -translate-x-1/2 rounded px-1.5 py-0.5 font-mono text-[11px] whitespace-nowrap text-white tabular-nums"
          style={{ backgroundColor: SELECT }}
          aria-hidden
        >
          176 × 176
        </span>
      </div>
    </div>
  )
}

function Property({
  name,
  children,
}: {
  name: string
  children: React.ReactNode
}) {
  return (
    <div className="grid grid-cols-[4.5rem_1fr] items-baseline gap-2 px-3 py-1.5">
      <dt className="font-mono text-xs text-muted-foreground">{name}</dt>
      <dd className="min-w-0 text-sm text-foreground">{children}</dd>
    </div>
  )
}

function PropertiesPanel() {
  const status = USER.availability ? "open" : "busy"

  return (
    <div className="flex flex-col">
      <div className="border-b border-line px-3 py-3">
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <ComponentIcon className="size-3.5" aria-hidden />
          Main component
        </p>
        <h1 className="mt-1 flex items-center gap-2 font-heading text-2xl font-medium tracking-tight">
          {USER.displayName}
          <VerifiedIcon className="size-4.5 shrink-0 select-none" aria-hidden />
        </h1>
      </div>

      <div className="border-b border-line pb-2">
        <PanelLabel>Properties</PanelLabel>
        <dl>
          <Property name="role">{USER.discipline}</Property>
          {USER.availability && (
            <Property name="status">
              <span className="inline-flex items-center gap-1.5">
                <span
                  className="size-2 shrink-0 rounded-full bg-green-500"
                  aria-hidden
                />
                {USER.availability}
              </span>
            </Property>
          )}
          <Property name="location">
            <a
              className="inline-flex items-center gap-1 transition-colors hover:text-muted-foreground"
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(USER.address)}`}
              target="_blank"
              rel="noopener"
            >
              <MapPinIcon className="size-3.5 shrink-0" aria-hidden />
              {USER.address}
            </a>
          </Property>
        </dl>
      </div>

      <div className="border-b border-line p-3">
        <HeroActions emailB64={USER.emailB64} />
      </div>

      <div className="flex items-center justify-between gap-2 border-b border-line px-3 py-2.5">
        <span className="text-xs font-medium text-foreground">Links</span>
        <ul className="flex gap-1">
          {SOCIAL_LINKS.map((item) => (
            <li key={item.name}>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      className="text-foreground/80 shadow-none [&_svg:not([class*='size-'])]:size-4"
                      variant="ghost"
                      size="icon-sm"
                      nativeButton={false}
                      render={
                        <a
                          href={addQueryParams(item.href, UTM_PARAMS)}
                          target="_blank"
                          rel="noopener"
                        >
                          {SOCIAL_ICONS[item.name]}
                          <span className="sr-only">{item.title}</span>
                        </a>
                      }
                    />
                  }
                />
                <TooltipContent>
                  {item.title} ({item.handle})
                </TooltipContent>
              </Tooltip>
            </li>
          ))}
        </ul>
      </div>

      {/* The inspector's code view: the same facts as a component call. */}
      <div className="px-3 py-3">
        <p className="pb-2 text-xs font-medium text-foreground">Code</p>
        <pre className="overflow-x-auto rounded-md bg-muted px-2.5 py-2 font-mono text-[11px] leading-5 text-muted-foreground">
          <code>
            {"<"}
            <span className="text-foreground">Tori</span>
            {" role="}
            <span className={SELECT_TEXT}>&quot;design-engineer&quot;</span>
            {"\n      status="}
            <span className={SELECT_TEXT}>&quot;{status}&quot;</span>
            {" />"}
          </code>
        </pre>
      </div>
    </div>
  )
}
