import { cn } from "@/lib/utils"

export type TestimonialProps = {
  /** Who said it. */
  authorName: string
  /** Their relation to the speaker, or their title. */
  authorTagline?: string
  /** Where the words came from; the name links out when set. */
  url?: string
  quote: string
  /**
   * The attribution is a lead-in ("My dad would tell you I am a"), so it
   * sits above the quote and reads into it.
   */
  lead?: boolean
  className?: string
}

/**
 * A quote with hanging quotation marks, credited on a hairline: below and
 * to the right like a signature, or above and to the left as a lead-in.
 */
export function Testimonial({
  className,
  authorName,
  authorTagline,
  url,
  quote,
  lead = false,
}: TestimonialProps) {
  return (
    <figure
      className={cn(
        "relative flex gap-4 pl-3",
        lead ? "flex-col-reverse" : "flex-col",
        className
      )}
    >
      <blockquote className="relative block w-full font-heading text-xl/tight font-medium text-foreground md:text-2xl/tight">
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

      <figcaption
        className={cn(
          "flex w-full items-center gap-3 md:w-2/3",
          lead ? "-ml-3 flex-row-reverse" : "ml-auto"
        )}
      >
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
