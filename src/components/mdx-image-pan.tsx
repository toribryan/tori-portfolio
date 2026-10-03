import { cn } from "@/lib/utils"

/**
 * An image wider than the column, panned slowly from end to end and back so
 * a long strip reads at a size you can see. The whole image links to the
 * full-size file. With reduced motion it rests at the start.
 *
 * Props are strings because expression attributes don't survive the MDX
 * pipeline (see `mdx-figure.tsx`). `ratio` is the visible window, as a CSS
 * aspect ratio such as "16/7"; `duration` is seconds for one pass.
 */
export function ImagePan({
  src,
  alt,
  caption,
  ratio = "16/7",
  duration = "18",
  className,
}: {
  src: string
  alt: string
  caption?: React.ReactNode
  ratio?: string
  duration?: string
  className?: string
}) {
  return (
    <figure className={cn("not-prose my-8", className)}>
      <style>{`@keyframes image-pan { from { object-position: 0% 50%; } to { object-position: 100% 50%; } }`}</style>
      <a href={src} target="_blank" rel="noopener noreferrer" className="block">
        <img
          className="w-full rounded-xl object-cover inset-ring-1 inset-ring-black/15 motion-reduce:animate-none! dark:inset-ring-white/15"
          style={{
            aspectRatio: ratio,
            objectPosition: "0% 50%",
            animation: `image-pan ${Number(duration) || 18}s ease-in-out infinite alternate`,
          }}
          src={src}
          alt={alt}
          loading="lazy"
        />
      </a>

      {caption && (
        <figcaption className="mt-3 text-sm text-pretty text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
