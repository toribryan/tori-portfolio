import type { CSSProperties } from "react"
import Image from "next/image"

import { cn } from "@/lib/utils"

type Themed = { light: string; dark: string }

/** A pair of images, one shown in each of the site's themes. */
function ThemedImage({
  src,
  className,
  width,
  height,
}: {
  src: Themed
  className?: string
  width: number
  height: number
}) {
  return (
    <>
      <Image
        className={cn("dark:hidden", className)}
        src={src.light}
        alt=""
        width={width}
        height={height}
        unoptimized
      />
      <Image
        className={cn("hidden dark:block", className)}
        src={src.dark}
        alt=""
        width={width}
        height={height}
        unoptimized
      />
    </>
  )
}

/**
 * A flat cover with one figure lifted onto a layer of its own so it can hop.
 * The base is the art with the figure painted out, and the sprite is the
 * figure cut from the box `sprite.box` (x, y, width, height) of the art. The
 * figure hops while the card is hovered or focused, or on a loop with `loop`
 * or on a touch screen.
 */
export function SpriteCover({
  art,
  base,
  sprite,
  loop = false,
}: {
  /** The art's export size, which the sprite's box is measured in. */
  art: { width: number; height: number }
  base: Themed
  sprite: Themed & {
    box: [number, number, number, number]
    /** One of the figure's pixels, in the art's pixels. */
    cell: number
  }
  loop?: boolean
}) {
  const [x, y, width, height] = sprite.box
  return (
    <div className="absolute inset-0">
      <ThemedImage
        className="size-full object-cover"
        src={base}
        width={art.width}
        height={art.height}
      />
      <div
        className={cn(
          "absolute motion-reduce:animate-none",
          loop
            ? "animate-cover-hop"
            : "group-focus-within/doc-card:animate-cover-hop group-hover/doc-card:animate-cover-hop [@media(hover:none)]:animate-cover-hop"
        )}
        style={
          {
            left: `${(x / art.width) * 100}%`,
            top: `${(y / art.height) * 100}%`,
            width: `${(width / art.width) * 100}%`,
            "--hop-cell": `${(sprite.cell / height) * 100}%`,
          } as CSSProperties
        }
      >
        <ThemedImage
          className="h-auto w-full"
          src={sprite}
          width={width}
          height={height}
        />
      </div>
    </div>
  )
}
