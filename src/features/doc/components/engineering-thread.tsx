import { ArrowRightIcon } from "lucide-react"

import { cn } from "@/lib/utils"

type Comment = { author: "Spencer" | "Tori"; text: string }
type Exchange = {
  where: string
  comments: Comment[]
  outcome: string
  ref?: string
}

/*
 * Taken from the Bridal 2026 Figma comments, the review on PR #512, and the
 * commits that answered it.
 */
const THREAD: Exchange[] = [
  {
    where: "Figma · Real Wedding Submission · #8",
    comments: [
      {
        author: "Spencer",
        text: "We need to show the default vendor categories here: Photographer…",
      },
    ],
    outcome:
      "Vendor credits open on five default categories: Venue, Planner, Photographer, Videographer and Florist.",
  },
  {
    where: "PR #512 review · ChoiceRow.tsx",
    comments: [
      {
        author: "Spencer",
        text: "Could we use something like a choice card here?",
      },
    ],
    outcome: "Swapped the submission choice rows for choice cards.",
    ref: "1a43b26",
  },
  {
    where: "PR #512 review · real-wedding-submission-cover.webp",
    comments: [
      {
        author: "Spencer",
        text: "don't commit images. We will add a brand-based config later. for now it can just be empty.",
      },
      { author: "Tori", text: "ok captain" },
    ],
    outcome:
      "The image came out. The shipped panel uses placeholder art until each brand carries its own.",
  },
  {
    where: "PR #512 review · submitWedding.ts",
    comments: [
      {
        author: "Spencer",
        text: "let's leave the submissions out of this PR, there's a lot to change here.",
      },
    ],
    outcome: "Dropped submission persistence from the PR.",
    ref: "27958be",
  },
  {
    where: "PR #512 · comment",
    comments: [
      {
        author: "Spencer",
        text: "Superseded by a stack of 11 PRs, each scoped under ~1,000 lines and reviewable on its own.",
      },
    ],
    outcome: "Merged in order as #532 to #537, then #548.",
  },
]

const PINK = "#e9939e"

function Avatar({ author }: { author: Comment["author"] }) {
  return (
    <span
      className={cn(
        "flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-medium",
        author === "Spencer"
          ? "bg-muted-foreground/20 text-foreground"
          : "text-foreground"
      )}
      style={author === "Tori" ? { background: PINK } : undefined}
      aria-hidden
    >
      {author[0]}
    </span>
  )
}

/**
 * The review loop with the engineer: each comment, where it was left, and
 * what changed because of it.
 */
export function EngineeringThread({ caption }: { caption?: string }) {
  return (
    <figure className="not-prose my-8">
      <div className="relative overflow-hidden rounded-xl border border-line bg-surface-warm/60">
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              "linear-gradient(var(--line) 1px, transparent 1px)",
            backgroundSize: "100% 28px",
            backgroundPosition: "0 10px",
          }}
          aria-hidden
        />
        <ol className="relative flex flex-col gap-3 p-5">
          {THREAD.map((exchange) => (
            <li
              key={exchange.where}
              className="grid gap-2 md:grid-cols-[1fr_20px_1fr] md:items-center"
            >
              <div className="flex flex-col gap-2 rounded-md border border-line bg-background p-3">
                <p className="text-xs text-muted-foreground">
                  {exchange.where}
                </p>
                {exchange.comments.map((comment) => (
                  <div key={comment.text} className="flex gap-2">
                    <Avatar author={comment.author} />
                    <p className="text-sm leading-snug">
                      <span className="font-medium">{comment.author}</span>{" "}
                      <span className="text-muted-foreground">
                        {comment.text}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
              <ArrowRightIcon
                className="hidden size-4 text-muted-foreground md:block"
                aria-hidden
              />
              <div
                className="flex flex-col gap-1 rounded-md border bg-background p-3 text-sm leading-snug"
                style={{ borderColor: PINK }}
              >
                <span>{exchange.outcome}</span>
                {exchange.ref && (
                  <code className="text-xs text-muted-foreground">
                    {exchange.ref}
                  </code>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>

      {caption && (
        <figcaption className="mt-3 text-sm text-pretty text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
