import { SmileIcon } from "lucide-react"

import { cn } from "@/lib/utils"

export type PrComment = {
  handle: string
  body: string
  when: string
  author?: boolean
}

/**
 * A pull request review thread, drawn the way GitHub draws one: avatar,
 * handle, a timestamp, the comment, a reaction pill, joined down the left
 * by the thread line.
 */
export function PrThread({
  comments,
  className,
}: {
  comments: PrComment[]
  className?: string
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-line bg-background",
        className
      )}
    >
      <ol className="flex flex-col px-4 py-3">
        {comments.map((comment, i) => (
          <li key={comment.body} className="relative flex gap-3">
            {i < comments.length - 1 && (
              <span
                className="absolute top-8 bottom-0 left-4 w-px bg-line"
                aria-hidden
              />
            )}
            <span className="relative z-1 flex size-8 shrink-0 items-center justify-center rounded-full bg-surface text-[0.65rem] tracking-wide uppercase inset-ring-1 inset-ring-border/64">
              {comment.handle.slice(0, 2)}
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-1.5 pb-4 last:pb-0">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 pt-1.5">
                <span className="text-sm font-medium">{comment.handle}</span>
                <span className="text-xs text-muted-foreground">
                  {comment.when}
                </span>
                {comment.author && (
                  <span className="ml-auto rounded-full px-2 py-px text-[0.65rem] text-muted-foreground inset-ring-1 inset-ring-border">
                    Author
                  </span>
                )}
              </div>
              <p className="text-sm/relaxed text-pretty">{comment.body}</p>
              <span
                className="flex size-7 items-center justify-center rounded-md text-muted-foreground inset-ring-1 inset-ring-border/64"
                aria-hidden
              >
                <SmileIcon className="size-3.5" />
              </span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
