"use client"

import React from "react"
import { LinkIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { CopyButton } from "@/components/copy-button"

type HeadingTypes = "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
type HeadingProps<T extends HeadingTypes> = React.ComponentProps<T> & {
  as?: T
}

export function Heading<T extends HeadingTypes = "h1">({
  as,
  className,
  ...props
}: HeadingProps<T>): React.ReactElement {
  const Comp = as ?? "h1"

  if (!props.id) {
    return <Comp className={className} {...props} />
  }

  // `BrandLink` has no "use client", so it fully resolves to a plain <a> on
  // the server before its element ever reaches this client boundary — by
  // the time this runs, there's no trace of `BrandLink` left to check for,
  // only the anchor it rendered. Headings otherwise never contain an <a>.
  const isBrandLink = (child: React.ReactNode) =>
    React.isValidElement(child) && child.type === "a"

  const childArray = React.Children.toArray(props.children)
  const brand = childArray.find(isBrandLink) ?? null
  const textChildren = childArray.filter((child) => !isBrandLink(child))

  return (
    <Comp
      className={cn(
        "group/heading flex flex-row items-center gap-1",
        className
      )}
      {...props}
    >
      <a href={`#${props.id}`} className="peer not-prose">
        {textChildren}
      </a>

      {brand}

      <CopyButton
        className="size-7 shrink-0 text-muted-foreground opacity-0 group-hover/heading:opacity-100"
        variant="ghost"
        text={() => createHeadingUrl(props.id || "")}
        idleIcon={<LinkIcon />}
        aria-label="Copy link to section"
      />
    </Comp>
  )
}

export function createHeadingUrl(id: string) {
  if (typeof window === "undefined") {
    return `#${id}`
  }

  const url = new URL(window.location.href)

  url.hash = id

  return url.toString()
}
