"use client"

import type { Route } from "next"
import Link from "next/link"
import {
  ChevronDownIcon,
  ComponentIcon,
  FileIcon,
  FrameIcon,
  HashIcon,
} from "lucide-react"

import { MAIN_NAV } from "@/config/site"
import { cn } from "@/lib/utils"
import { USER } from "@/features/portfolio/data/user"

import { scrollToSection } from "./scroll-to-section"

// The home page's sections in page order, named as their titles read, so the
// layers mirror the canvas the way Figma's do.
const SECTIONS = [
  { id: "hello", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "components", label: "Components" },
  { id: "blog", label: "Blog" },
  { id: "stack", label: "Stack" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "awards", label: "Achievements" },
  { id: "certs", label: "Certifications" },
]

// Figma's selected-row tint, and its component purple, lifted for dark mode.
const SELECTED = "bg-[#E5F4FF] dark:bg-[#0D99FF]/25"
const COMPONENT = "text-[#8638E5] dark:text-[#C29CFF]"

/**
 * The left panel of the inspector. The pages link out, and the layers are the
 * home page's sections: clicking one glides the page to it. The selection
 * stays on Tori Bryan, matching the canvas.
 */
export function HeroLayers() {
  const row =
    "flex w-full items-center gap-1.5 py-1 pr-3 transition-colors hover:bg-accent"

  return (
    <nav
      aria-label="Sections"
      className="flex flex-col border-r border-line text-xs max-md:hidden"
    >
      <div className="border-b border-line pb-2">
        <p className="px-3 pt-3 pb-1.5 font-medium text-foreground">Pages</p>
        <ul>
          <li
            className={cn(row, "pl-3 font-medium text-foreground")}
            aria-current="page"
          >
            <FileIcon className="size-3.5" aria-hidden />
            Home
          </li>
          {MAIN_NAV.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href as Route}
                className={cn(row, "pl-3 text-muted-foreground")}
              >
                <FileIcon className="size-3.5" aria-hidden />
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <p className="px-3 pt-3 pb-1.5 font-medium text-foreground">Layers</p>
      <ul className="pb-3">
        <li className={cn(row, "pl-1.5 text-foreground")}>
          <ChevronDownIcon
            className="size-3 text-muted-foreground"
            aria-hidden
          />
          <FrameIcon className="size-3.5" aria-hidden />
          Hero
        </li>
        <li
          className={cn(row, "pl-7 font-medium", COMPONENT, SELECTED)}
          aria-current="true"
        >
          <ComponentIcon className="size-3.5" aria-hidden />
          {USER.displayName}
        </li>
        {SECTIONS.map((section) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              onClick={scrollToSection}
              className={cn(
                row,
                "pl-3 text-muted-foreground hover:text-foreground"
              )}
            >
              <HashIcon className="size-3.5" aria-hidden />
              {section.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
