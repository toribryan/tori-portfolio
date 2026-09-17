"use client"

import Image from "next/image"
import { ArrowRightIcon, ArrowUpRightIcon } from "lucide-react"
import type { Variants } from "motion/react"
import { motion } from "motion/react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/base/ui/button"

/** The site's expo-out, as a cubic bezier motion can run. */
export const EASE = [0.16, 1, 0.3, 1] as const

/**
 * Every block on a slide reveals in the order it appears in the tree. The
 * parent slide owns the stagger; children only declare what a reveal is.
 */
export const revealVariants: Variants = {
  hidden: { opacity: 0, y: 14, filter: "blur(3px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: EASE },
  },
  exit: { opacity: 1 },
}

export function Reveal({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) {
  return (
    <motion.div variants={revealVariants} className={className} {...props}>
      {children}
    </motion.div>
  )
}

/**
 * The slide body. Reads top down like a doc page, and scrolls on a short
 * viewport rather than clipping.
 */
export function Slide({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={cn("flex w-full flex-col gap-6 py-8 md:gap-8", className)}>
      {children}
    </div>
  )
}

export function Kicker({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <Reveal>
      <p
        className={cn(
          "font-mono text-xs tracking-wide text-muted-foreground uppercase",
          className
        )}
      >
        {children}
      </p>
    </Reveal>
  )
}

export function Title({
  className,
  size = "lg",
  children,
}: {
  className?: string
  size?: "lg" | "xl" | "display"
  children: React.ReactNode
}) {
  return (
    <Reveal>
      <h2
        className={cn(
          "font-heading font-medium tracking-normal text-balance",
          size === "lg" && "text-3xl/tight md:text-4xl/tight",
          size === "xl" && "text-4xl/tight md:text-5xl/tight",
          size === "display" && "text-5xl/none md:text-7xl/none",
          className
        )}
      >
        {children}
      </h2>
    </Reveal>
  )
}

export function Lede({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <Reveal>
      <p
        className={cn(
          "max-w-2xl text-base/relaxed text-pretty text-muted-foreground md:text-lg/relaxed",
          className
        )}
      >
        {children}
      </p>
    </Reveal>
  )
}

/** A headline figure with its label, the way the case-study results strip sets them. */
export function Stat({
  value,
  label,
  className,
}: {
  value: string
  label: string
  className?: string
}) {
  return (
    <Reveal className={cn("flex flex-col gap-1.5", className)}>
      <p className="font-heading text-3xl/none font-medium tabular-nums">
        {value}
      </p>
      <p className="font-mono text-xs/relaxed tracking-wide text-pretty text-muted-foreground">
        {label}
      </p>
    </Reveal>
  )
}

export function StatRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-5 border-y border-line py-5 sm:grid-cols-3 md:grid-cols-4">
      {children}
    </div>
  )
}

/**
 * One cell of a hairline grid, the way the home page panels divide space.
 * Meant to sit inside `CardGrid`, which draws the lines between cells.
 */
export function Card({
  label,
  title,
  className,
  children,
  emphasis = false,
}: {
  label?: string
  title?: React.ReactNode
  className?: string
  children?: React.ReactNode
  /** Lifts the card to the foreground: the one that matters on the slide. */
  emphasis?: boolean
}) {
  return (
    <Reveal
      className={cn(
        "flex flex-col gap-2 p-4",
        emphasis ? "bg-foreground text-background" : "bg-background",
        className
      )}
    >
      {label && (
        <p
          className={cn(
            "font-mono text-xs tracking-wide uppercase",
            emphasis ? "text-background/60" : "text-muted-foreground"
          )}
        >
          {label}
        </p>
      )}
      {title && (
        <p className="font-heading text-lg/tight font-medium text-balance md:text-xl/tight">
          {title}
        </p>
      )}
      {children && (
        <div
          className={cn(
            "text-sm/relaxed text-pretty md:text-base/relaxed",
            emphasis ? "text-background/80" : "text-muted-foreground"
          )}
        >
          {children}
        </div>
      )}
    </Reveal>
  )
}

export function CardGrid({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "grid gap-px border-y border-line bg-line sm:grid-cols-2",
        className
      )}
    >
      {children}
    </div>
  )
}

/** A numbered list where the number is a pixel tile, matching the site's `step` utility. */
export function Steps({
  items,
}: {
  items: { title: string; body?: string }[]
}) {
  return (
    <ol className="flex flex-col divide-y divide-line border-y border-line">
      {items.map((item, i) => (
        <Reveal key={item.title}>
          <li className="grid grid-cols-[2rem_1fr] gap-4 py-4">
            <span className="mt-0.5 inline-flex size-6 items-center justify-center rounded-lg bg-muted text-[0.8125rem]/6 text-foreground tabular-nums">
              {i + 1}
            </span>
            <div className="flex flex-col gap-1">
              <p className="font-medium text-pretty">{item.title}</p>
              {item.body && (
                <p className="text-sm/relaxed text-pretty text-muted-foreground md:text-base/relaxed">
                  {item.body}
                </p>
              )}
            </div>
          </li>
        </Reveal>
      ))}
    </ol>
  )
}

/**
 * Stages in a row with pixel arrows between them. `tone="fade"` renders the
 * whole row muted, for a flow the slide is about to replace.
 */
export function Flow({
  stages,
  tone = "default",
  className,
}: {
  stages: { label: string; detail?: string }[]
  tone?: "default" | "fade"
  className?: string
}) {
  return (
    <ol
      className={cn(
        "flex flex-wrap items-stretch gap-2",
        tone === "fade" && "opacity-60",
        className
      )}
    >
      {stages.map((stage, i) => (
        <Reveal key={stage.label} className="flex items-center gap-2">
          <li className="flex min-w-28 flex-1 flex-col gap-0.5 border border-line px-3 py-2.5">
            <p className="text-sm font-medium text-pretty">{stage.label}</p>
            {stage.detail && (
              <p className="font-mono text-xs text-muted-foreground">
                {stage.detail}
              </p>
            )}
          </li>
          {i < stages.length - 1 && (
            <ArrowRightIcon
              className="size-5 shrink-0 text-muted-foreground"
              aria-hidden
            />
          )}
        </Reveal>
      ))}
    </ol>
  )
}

/** A screenshot or photo on the case-study plate. */
export function Shot({
  src,
  alt,
  width,
  height,
  label,
  className,
  imageClassName,
  priority,
  fit = "width",
}: {
  src: string
  alt: string
  width: number
  height: number
  label?: string
  className?: string
  imageClassName?: string
  priority?: boolean
  /**
   * `width` fills the column. `viewport` caps the height instead, for tall
   * or square shots that would otherwise push the slide past the fold.
   */
  fit?: "width" | "viewport"
}) {
  return (
    <Reveal className={cn("flex flex-col gap-2", className)}>
      <Image
        className={cn(
          "rounded-xl object-cover inset-ring-1 inset-ring-black/15 dark:inset-ring-white/15",
          fit === "width" && "w-full",
          fit === "viewport" && "mx-auto h-auto max-h-[42vh] w-auto",
          imageClassName
        )}
        src={src}
        alt={alt}
        width={width}
        height={height}
        quality={100}
        priority={priority}
        // A width-auto image has no box until it loads, so lazy loading never
        // sees it enter the viewport. Fetch it up front instead.
        loading={fit === "viewport" ? "eager" : undefined}
        unoptimized
      />
      {label && (
        <p className="font-mono text-xs tracking-wide text-muted-foreground">
          {label}
        </p>
      )}
    </Reveal>
  )
}

/** A looping clip, muted, standing in for an animated screenshot. */
export function Clip({
  src,
  label,
  className,
}: {
  src: string
  label?: string
  className?: string
}) {
  return (
    <Reveal className={cn("flex flex-col gap-2", className)}>
      <video
        className="w-full rounded-xl bg-black inset-ring-1 inset-ring-black/15 dark:inset-ring-white/15"
        src={src}
        autoPlay
        loop
        muted
        playsInline
      />
      {label && (
        <p className="font-mono text-xs tracking-wide text-muted-foreground">
          {label}
        </p>
      )}
    </Reveal>
  )
}

export function Quote({
  attribution,
  children,
}: {
  attribution: string
  children: React.ReactNode
}) {
  return (
    <Reveal className="flex flex-col gap-1.5">
      <p className="font-mono text-xs tracking-wide text-muted-foreground">
        {attribution}
      </p>
      <p className="font-heading text-xl/tight font-medium text-balance md:text-2xl/tight">
        {children}
      </p>
    </Reveal>
  )
}

/** Two columns from `md` up: copy on the left, artefact on the right. */
export function Split({
  className,
  children,
  ratio = "even",
}: {
  className?: string
  children: React.ReactNode
  ratio?: "even" | "copy" | "art"
}) {
  return (
    <div
      className={cn(
        "grid items-start gap-6 md:gap-8",
        ratio === "even" && "md:grid-cols-2",
        ratio === "copy" && "md:grid-cols-[1.2fr_1fr]",
        ratio === "art" && "md:grid-cols-[1fr_1.4fr]",
        className
      )}
    >
      {children}
    </div>
  )
}

export function Stack({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return <div className={cn("flex flex-col gap-5", className)}>{children}</div>
}

/**
 * A destination the reviewer can open. External links open a new tab so the
 * deck stays where it is; in-site links stay in the tab.
 */
export function LinkOut({
  href,
  children,
  variant = "outline",
  className,
}: {
  href: string
  children: React.ReactNode
  variant?: "outline" | "default"
  className?: string
}) {
  const external = /^https?:/.test(href) || href.startsWith("/storybook")
  return (
    <Button
      className={cn("h-9 gap-2", className)}
      variant={variant}
      nativeButton={false}
      render={
        <a
          href={href}
          {...(external
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
        >
          {children}
          <ArrowUpRightIcon data-icon="inline-end" />
        </a>
      }
    />
  )
}

export function LinkRow({ children }: { children: React.ReactNode }) {
  return (
    <Reveal className="flex flex-wrap items-center gap-2">{children}</Reveal>
  )
}

export function Tags({ items }: { items: string[] }) {
  return (
    <Reveal>
      <ul className="flex flex-wrap gap-1.5">
        {items.map((item) => (
          <li
            key={item}
            className="rounded-md bg-surface-warm px-2 py-0.5 font-mono text-xs text-muted-foreground inset-ring-1 inset-ring-border/64"
          >
            {item}
          </li>
        ))}
      </ul>
    </Reveal>
  )
}
