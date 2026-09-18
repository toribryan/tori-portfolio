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
          "text-xs tracking-wide text-muted-foreground uppercase",
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
      <p className="text-xs/relaxed tracking-wide text-pretty text-muted-foreground">
        {label}
      </p>
    </Reveal>
  )
}

export function StatRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="screen-line-top screen-line-bottom grid grid-cols-2 gap-x-6 gap-y-5 py-5 sm:grid-cols-3 md:grid-cols-4">
      {children}
    </div>
  )
}

/**
 * A grid ruled the way the home page panels are: the top and bottom lines
 * run across the screen, a pair of hairlines sits in each gutter, and the
 * cells bleed past the slide's side padding to the column's own border.
 * Below `md` it stacks and the gutters go.
 */
export function HairlineGrid({
  columns = 2,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  /** A count of equal columns, or a `grid-template-columns` value. */
  columns?: 2 | 3 | 4 | string
}) {
  const template =
    typeof columns === "number" ? `repeat(${columns}, minmax(0, 1fr))` : columns
  const count =
    typeof columns === "number"
      ? columns
      : columns.split(/\s+(?![^(]*\))/).length
  return (
    <div
      className={cn(
        "screen-line-top screen-line-bottom relative -mx-2 flex flex-col py-4 md:-mx-6",
        className
      )}
      style={{ "--cols": template } as React.CSSProperties}
    >
      <div
        className="pointer-events-none absolute inset-0 -z-1 grid gap-4 max-md:hidden md:grid-cols-(--cols)"
        aria-hidden
      >
        {Array.from({ length: count }, (_, i) => (
          <div
            key={i}
            className={cn(
              "border-line",
              i > 0 && "border-l",
              i < count - 1 && "border-r"
            )}
          />
        ))}
      </div>
      <div className="grid flex-1 gap-4 md:grid-cols-(--cols)" {...props}>
        {children}
      </div>
    </div>
  )
}

/** A cell of `HairlineGrid` that is words: a label, a title, a paragraph. */
export function Card({
  label,
  title,
  className,
  children,
}: {
  label?: string
  title?: React.ReactNode
  className?: string
  children?: React.ReactNode
}) {
  return (
    <Reveal className={cn("flex flex-col gap-2 px-6 py-4", className)}>
      {label && (
        <p className="text-xs tracking-wide text-muted-foreground uppercase">
          {label}
        </p>
      )}
      {title && (
        <p className="font-heading text-lg/tight font-medium text-balance md:text-xl/tight">
          {title}
        </p>
      )}
      {children && (
        <div className="text-sm/relaxed text-pretty text-muted-foreground md:text-base/relaxed">
          {children}
        </div>
      )}
    </Reveal>
  )
}

/** The ringed, rounded frame the site's cards put their picture in. */
export function Frame({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={cn("relative select-none", className)}>
      {children}
      <div className="pointer-events-none absolute inset-0 rounded-xl inset-ring-1 inset-ring-black/15 dark:inset-ring-white/15" />
    </div>
  )
}

/**
 * A cell of `HairlineGrid` that is a picture: the media in a `Frame`, then
 * a name, a line and a mono note, set like the project cards on the home
 * page. Media should fill its width and round its own corners.
 */
export function MediaCard({
  media,
  title,
  line,
  meta,
  className,
}: {
  media: React.ReactNode
  title: React.ReactNode
  line?: React.ReactNode
  meta?: React.ReactNode
  className?: string
}) {
  return (
    <Reveal className={cn("flex flex-col gap-2 p-2", className)}>
      <Frame className="flex min-h-0 flex-1 flex-col">{media}</Frame>
      <div className="flex flex-col gap-1 px-4 py-2">
        <p className="text-lg leading-snug font-medium">{title}</p>
        {line && (
          <p className="text-sm leading-snug text-pretty text-muted-foreground">
            {line}
          </p>
        )}
        {meta && (
          <p className="text-xs tracking-wide text-muted-foreground">{meta}</p>
        )}
      </div>
    </Reveal>
  )
}

/** A numbered list where the number is a pixel tile, matching the site's `step` utility. */
export function Steps({
  items,
}: {
  items: { title: string; body?: string }[]
}) {
  return (
    <ol className="screen-line-top screen-line-bottom flex flex-col divide-y divide-line">
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
 * Stages in one row of equal cells, an arrow between each. `tone="fade"`
 * renders the whole row muted, for a flow the slide is about to replace.
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
      className={cn("grid", tone === "fade" && "opacity-60", className)}
      style={{
        gridTemplateColumns: `repeat(${stages.length}, minmax(0, 1fr))`,
      }}
    >
      {stages.map((stage, i) => (
        <Reveal key={stage.label} className="relative flex">
          <li className="flex min-w-0 flex-1 flex-col gap-0.5 border-y border-l border-line px-3 py-2.5 last:border-r">
            <p className="text-sm/snug font-medium text-pretty">
              {stage.label}
            </p>
            {stage.detail && (
              <p className="text-xs text-muted-foreground">{stage.detail}</p>
            )}
          </li>
          {i < stages.length - 1 && (
            <ArrowRightIcon
              className="absolute top-1/2 -right-2.5 z-10 size-5 -translate-y-1/2 rounded-full bg-background p-0.5 text-muted-foreground"
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
    <Reveal className={cn("flex flex-col gap-2 p-2", className)}>
      <Frame className={cn(fit === "viewport" && "mx-auto w-fit")}>
        <Image
          className={cn(
            "rounded-xl object-cover",
            fit === "width" && "w-full",
            fit === "viewport" && "h-auto max-h-[42vh] w-auto",
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
      </Frame>
      {label && (
        <p className="px-4 py-2 text-xs tracking-wide text-muted-foreground">
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
      <Frame>
        <video
          className="w-full rounded-xl bg-black"
          src={src}
          autoPlay
          loop
          muted
          playsInline
        />
      </Frame>
      {label && (
        <p className="text-xs tracking-wide text-muted-foreground">{label}</p>
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
      <p className="text-xs tracking-wide text-muted-foreground">
        {attribution}
      </p>
      <p className="font-heading text-xl/tight font-medium text-balance md:text-2xl/tight">
        {children}
      </p>
    </Reveal>
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
