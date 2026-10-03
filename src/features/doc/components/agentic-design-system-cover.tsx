import Image from "next/image"

import { cn } from "@/lib/utils"

/*
 * The cover art with its question mark lifted onto a layer of its own. Both
 * are cut from the 2106 by 1106 export, and the mark is placed at the box it
 * was cut from, as a share of the art.
 */
const MARK = {
  left: `${(950 / 2106) * 100}%`,
  top: `${(20 / 1106) * 100}%`,
  width: `${(270 / 2106) * 100}%`,
}

function Themed({
  light,
  dark,
  className,
  ...props
}: {
  light: string
  dark: string
  className?: string
  width: number
  height: number
}) {
  return (
    <>
      <Image
        className={cn("dark:hidden", className)}
        src={light}
        alt=""
        unoptimized
        {...props}
      />
      <Image
        className={cn("hidden dark:block", className)}
        src={dark}
        alt=""
        unoptimized
        {...props}
      />
    </>
  )
}

/**
 * The box with a question mark over it, drawn light or dark with the site.
 * The mark hops while the card is hovered or focused, or on a loop with
 * `loop` or on a touch screen.
 */
export function AgenticDesignSystemCover({ loop = false }: { loop?: boolean }) {
  return (
    <div className="absolute inset-0">
      <Themed
        className="size-full object-cover"
        light="/cover-agenticds-base.webp"
        dark="/cover-agenticds-base-dark.webp"
        width={2106}
        height={1106}
      />
      <div
        className={cn(
          "absolute motion-reduce:animate-none",
          loop
            ? "animate-mark-hop"
            : "group-focus-within/doc-card:animate-mark-hop group-hover/doc-card:animate-mark-hop [@media(hover:none)]:animate-mark-hop"
        )}
        style={MARK}
      >
        <Themed
          className="h-auto w-full"
          light="/cover-agenticds-mark.webp"
          dark="/cover-agenticds-mark-dark.webp"
          width={270}
          height={412}
        />
      </div>
    </div>
  )
}
