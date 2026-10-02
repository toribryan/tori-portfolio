import { ArrowRightIcon } from "lucide-react"

type FigmaComment = {
  number: number
  author: string
  body: string
  bullets?: string[]
  replies?: number
  outcome?: string
}

/* Spencer's comments on the Real Wedding Submission page in Bridal 2026. */
const COMMENTS: FigmaComment[] = [
  {
    number: 8,
    author: "Spencer",
    body: "We need to show the default vendor categories here:",
    bullets: ["Photographer…"],
    replies: 1,
    outcome:
      "Vendor credits open on five default categories: Venue, Planner, Photographer, Videographer and Florist.",
  },
  {
    number: 9,
    author: "Spencer",
    body: "Back Home?",
  },
]

const PINK = "#e9939e"

function Comment({ comment }: { comment: FigmaComment }) {
  return (
    <div className="flex flex-col gap-1.5 rounded-md border border-line bg-background p-3 text-sm leading-snug">
      <div className="flex items-center gap-2">
        <span
          className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted-foreground/20 text-[11px] font-medium"
          aria-hidden
        >
          {comment.author[0]}
        </span>
        <span className="text-xs text-muted-foreground">
          #{comment.number} · ↳ Real Wedding Submission
        </span>
      </div>
      <p className="font-medium">{comment.author}</p>
      <p>{comment.body}</p>
      {comment.bullets && (
        <ul className="list-disc pl-5">
          {comment.bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      )}
      {comment.replies && (
        <p className="text-xs text-muted-foreground">
          {comment.replies} {comment.replies === 1 ? "reply" : "replies"}
        </p>
      )}
    </div>
  )
}

/**
 * Spencer's Figma comments on the flow, as they read in the comments panel,
 * each beside what changed because of it.
 */
export function EngineeringThread({ caption }: { caption?: string }) {
  return (
    <figure className="not-prose my-8">
      <ol className="flex flex-col gap-3 rounded-xl bg-surface-warm/60 p-5">
        {COMMENTS.map((comment) => (
          <li
            key={comment.number}
            className="grid gap-2 md:grid-cols-[1fr_20px_1fr] md:items-center"
          >
            <Comment comment={comment} />
            {comment.outcome && (
              <>
                <ArrowRightIcon
                  className="hidden size-4 text-muted-foreground md:block"
                  aria-hidden
                />
                <p
                  className="rounded-md border bg-background p-3 text-sm leading-snug"
                  style={{ borderColor: PINK }}
                >
                  {comment.outcome}
                </p>
              </>
            )}
          </li>
        ))}
      </ol>

      {caption && (
        <figcaption className="mt-3 text-sm text-pretty text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
