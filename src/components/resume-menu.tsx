"use client"

import { copyText } from "@/utils/copy"
import { useTiks } from "@rexa-developer/tiks/react"
import { ChevronDownIcon, CopyIcon, FileTextIcon } from "lucide-react"
import { toast } from "sonner"

import { trackEvent } from "@/lib/events"
import { toggleOnSound } from "@/lib/soundcn/toggle-on"
import { useSound } from "@/hooks/soundcn/use-sound"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLinkItem,
  DropdownMenuTrigger,
} from "@/components/base/ui/dropdown-menu"
import { MarkdownIcon } from "@/components/icons"

const RESUME_PDF = "/resume.pdf"
const RESUME_MARKDOWN = "/resume.md"

/**
 * The footer's Resume link, as a menu of formats: the PDF, the Markdown
 * version served at `/resume.md`, or that Markdown straight to the clipboard.
 *
 * The two link rows are real anchors so they open in a new tab like the plain
 * link they replace. The copy row fetches the same route the "view" row links
 * to, so there is one copy of the text to keep current.
 */
export function ResumeMenu({ className }: { className?: string }) {
  const { success, error } = useTiks()
  // `interrupt` so a repeat copy restarts the blip instead of layering one
  // over the other, the same as every other copy on the site.
  const [playCopy] = useSound(toggleOnSound, { volume: 0.3, interrupt: true })

  const copyMarkdown = async () => {
    let markdown: string

    try {
      const res = await fetch(RESUME_MARKDOWN)
      if (!res.ok) throw new Error(`${res.status}`)
      markdown = await res.text()
    } catch {
      error()
      toast.error("Couldn't load the resume")
      return
    }

    const copied = await copyText(markdown)

    if (!copied) {
      error()
      toast.error("Couldn't copy the resume")
      return
    }

    success()
    playCopy()
    toast.success("Resume copied as Markdown")
    trackEvent({
      name: "resume_menu_action",
      properties: { format: "copy" },
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={className} aria-label="Resume formats">
        Resume
        <ChevronDownIcon
          className="size-3.5 text-muted-foreground transition-transform group-aria-expanded/resume:rotate-180"
          aria-hidden
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" side="top" className="w-fit">
        <DropdownMenuLinkItem
          href={RESUME_PDF}
          target="_blank"
          rel="noopener"
          onClick={() =>
            trackEvent({
              name: "resume_menu_action",
              properties: { format: "pdf" },
            })
          }
        >
          <FileTextIcon />
          Open PDF
        </DropdownMenuLinkItem>

        <DropdownMenuLinkItem
          href={RESUME_MARKDOWN}
          target="_blank"
          rel="noopener"
          onClick={() =>
            trackEvent({
              name: "resume_menu_action",
              properties: { format: "markdown" },
            })
          }
        >
          <MarkdownIcon />
          View as Markdown
        </DropdownMenuLinkItem>

        <DropdownMenuItem onClick={copyMarkdown}>
          <CopyIcon />
          Copy as Markdown
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
