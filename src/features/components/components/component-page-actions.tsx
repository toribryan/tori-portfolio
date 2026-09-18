"use client"

import type { Route } from "next"
import Link from "next/link"
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  ChevronDownIcon,
  CopyIcon,
  ShareIcon,
} from "lucide-react"
import { toast } from "sonner"

import { trackEvent } from "@/lib/events"
import { cn } from "@/lib/utils"
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
import { Button } from "@/components/base/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLinkItem,
  DropdownMenuTrigger,
} from "@/components/base/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/base/ui/tooltip"
import {
  ClaudeIcon,
  GitHubIcon,
  MarkdownIcon,
  OpenAIIcon,
  V0Icon,
} from "@/components/icons"

const GITHUB_CONTENT =
  "https://github.com/toribryan/tori-portfolio/blob/main/src/features/components/content"

function openInPrompt(markdownUrl: string) {
  return `Read ${markdownUrl}, I want to ask questions about it.`
}

/**
 * The header row of a component page: the way back on the left, and on the
 * right a Copy page button with a menu of other ways to read the doc, a
 * share button, and arrows to the neighbouring components when there are any.
 */
export function ComponentPageActions({
  slug,
  title,
  markdown,
  markdownUrl,
  pageUrl,
  previous,
  next,
}: {
  slug: string
  title: string
  /** The doc as Markdown, what Copy page puts on the clipboard. */
  markdown: string
  /** Absolute URL of the Markdown route. */
  markdownUrl: string
  /** Absolute URL of the page, for the share sheet. */
  pageUrl: string
  previous?: { slug: string; title: string }
  next?: { slug: string; title: string }
}) {
  const { copy, state } = useCopyToClipboard()

  const track = (action: string) =>
    trackEvent({ name: "component_page_action", properties: { slug, action } })

  const copyPage = async () => {
    await copy(markdown)
    toast.success("Page copied as Markdown")
    track("copy")
  }

  const share = async () => {
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title, url: pageUrl })
        track("share")
        return
      } catch {
        // The sheet was dismissed, or the browser refused. Fall through to copying.
      }
    }
    await copy(pageUrl)
    toast.success("Link copied")
    track("share_copy")
  }

  return (
    <div className="screen-line-bottom flex items-center justify-between p-2 pl-4">
      <Button
        className="h-7 gap-2 border-none px-0 tracking-wider text-muted-foreground hover:text-foreground hover:no-underline"
        variant="link"
        size="sm"
        nativeButton={false}
        render={
          <Link href="/">
            <ArrowLeftIcon />
            Home
          </Link>
        }
      />

      <div className="flex items-center gap-2">
        <div className="flex h-7 items-center overflow-hidden rounded-lg border border-border bg-background shadow-xs dark:border-input dark:bg-input/30">
          <Button
            className="h-full gap-2 rounded-none pr-3 pl-2.5"
            variant="ghost"
            size="sm"
            onClick={copyPage}
          >
            {state === "done" ? <CheckIcon /> : <CopyIcon />}
            Copy page
          </Button>
          <div className="h-4 w-px bg-border" aria-hidden />
          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(
                "inline-flex h-full items-center px-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
                "[&_svg]:size-4 [&_svg]:transition-transform aria-expanded:[&_svg]:rotate-180"
              )}
              aria-label="More ways to read this page"
            >
              <ChevronDownIcon />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-fit">
              <DropdownMenuLinkItem
                href={markdownUrl}
                target="_blank"
                rel="noopener"
                onClick={() => track("markdown")}
              >
                <MarkdownIcon />
                View as Markdown
              </DropdownMenuLinkItem>
              <DropdownMenuLinkItem
                href={`${GITHUB_CONTENT}/${slug}.mdx`}
                target="_blank"
                rel="noopener"
                onClick={() => track("github")}
              >
                <GitHubIcon />
                Open in GitHub
              </DropdownMenuLinkItem>
              <DropdownMenuLinkItem
                href={`https://v0.dev/chat/api/open?url=${encodeURIComponent(markdownUrl)}`}
                target="_blank"
                rel="noopener"
                onClick={() => track("v0")}
              >
                <V0Icon />
                Open in v0
              </DropdownMenuLinkItem>
              <DropdownMenuLinkItem
                href={`https://chatgpt.com/?hints=search&q=${encodeURIComponent(openInPrompt(markdownUrl))}`}
                target="_blank"
                rel="noopener"
                onClick={() => track("chatgpt")}
              >
                <OpenAIIcon />
                Open in ChatGPT
              </DropdownMenuLinkItem>
              <DropdownMenuLinkItem
                href={`https://claude.ai/new?q=${encodeURIComponent(openInPrompt(markdownUrl))}`}
                target="_blank"
                rel="noopener"
                onClick={() => track("claude")}
              >
                <ClaudeIcon />
                Open in Claude
              </DropdownMenuLinkItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                className="size-7"
                variant="outline"
                size="icon-sm"
                onClick={share}
                aria-label="Share this page"
              />
            }
          >
            <ShareIcon />
          </TooltipTrigger>
          <TooltipContent>Share</TooltipContent>
        </Tooltip>

        {previous && (
          <NeighbourLink
            slug={previous.slug}
            title={previous.title}
            label="Previous component"
            icon={<ArrowLeftIcon />}
          />
        )}
        {next && (
          <NeighbourLink
            slug={next.slug}
            title={next.title}
            label="Next component"
            icon={<ArrowRightIcon />}
          />
        )}
      </div>
    </div>
  )
}

function NeighbourLink({
  slug,
  title,
  label,
  icon,
}: {
  slug: string
  title: string
  label: string
  icon: React.ReactNode
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            className="size-7"
            variant="outline"
            size="icon-sm"
            nativeButton={false}
            render={
              <Link href={`/components/${slug}` as Route}>
                <span className="sr-only">{label}</span>
              </Link>
            }
          />
        }
      >
        {icon}
      </TooltipTrigger>
      <TooltipContent>{title}</TooltipContent>
    </Tooltip>
  )
}
