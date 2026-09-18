import { cn } from "@/lib/utils"

export type TestimonialProps = {
  /** Who said it. */
  authorName: string
  /** Their relation to the speaker, or their title. */
  authorTagline?: string
  /** Where the words came from; the name links out when set. */
  url?: string
  quote: string
  className?: string
}

/**
 * A quote in serif with hanging quotation marks, credited on a hairline
 * that runs in from the left so the attribution reads as a signature.
 */
export function Testimonial({
  className,
  authorName,
  authorTagline,
  url,
  quote,
}: TestimonialProps) {
  return (
    <figure className={cn("relative flex flex-col gap-4 pl-3", className)}>
      <blockquote className="relative block w-full font-serif text-xl/snug text-foreground md:text-2xl/snug">
        <span
          className="absolute -left-3 text-muted-foreground select-none"
          aria-hidden="true"
        >
          “
        </span>
        <p className="inline text-pretty">{quote}</p>
        <span
          className="absolute translate-x-0.5 text-muted-foreground select-none"
          aria-hidden="true"
        >
          ”
        </span>
      </blockquote>

      <figcaption className="ml-auto flex w-full items-center gap-3 md:w-2/3">
        <div className="h-px grow translate-y-px bg-line" />

        <p className="shrink-0 font-mono text-xs tracking-wide text-muted-foreground">
          {url ? (
            <a
              className="text-foreground hover:underline"
              href={url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {authorName}
            </a>
          ) : (
            <span className="text-foreground">{authorName}</span>
          )}
          {authorTagline && <span>, {authorTagline}</span>}
        </p>
      </figcaption>
    </figure>
  )
}
