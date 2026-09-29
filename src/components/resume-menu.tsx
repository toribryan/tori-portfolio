"use client"

import { copyText } from "@/utils/copy"
import { useTiks } from "@rexa-developer/tiks/react"
import {
  ChevronDownIcon,
  CopyIcon,
  DownloadIcon,
  ExternalLinkIcon,
} from "lucide-react"
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

const RESUME_PDF = "/resume.pdf"
const RESUME_MARKDOWN = "/resume.md"
const RESUME_FILENAME = "Tori-Bryan-Resume.pdf"

/**
 * The resume as a menu of formats: the PDF in a new tab, the PDF as a
 * download, or the Markdown version served at `/resume.md` straight to the
 * clipboard. The footer uses the default text trigger; the profile header
 * passes its icon button through `render`.
 *
 * The two PDF rows are real anchors, so a new tab and a download behave the
 * way a plain link would.
 */
export function ResumeMenu({
  className,
  render,
  children,
  side = "top",
  align = "end",
}: Pick<
  React.ComponentProps<typeof DropdownMenuTrigger>,
  "className" | "render" | "children"
> &
  Pick<React.ComponentProps<typeof DropdownMenuContent>, "side" | "align">) {
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
      <DropdownMenuTrigger
        className={className}
        render={render}
        aria-label="Resume formats"
      >
        {children ?? (
          <>
            Resume
            <ChevronDownIcon
              className="size-3.5 text-muted-foreground transition-transform group-aria-expanded/resume:rotate-180"
              aria-hidden
            />
          </>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent align={align} side={side} className="w-fit">
        <DropdownMenuLinkItem
          href={RESUME_PDF}
          target="_blank"
          rel="noopener"
          closeOnClick
          onClick={() =>
            trackEvent({
              name: "resume_menu_action",
              properties: { format: "pdf" },
            })
          }
        >
          <ExternalLinkIcon />
          Open in browser
        </DropdownMenuLinkItem>

        <DropdownMenuLinkItem
          href={RESUME_PDF}
          download={RESUME_FILENAME}
          closeOnClick
          onClick={() =>
            trackEvent({
              name: "resume_menu_action",
              properties: { format: "download" },
            })
          }
        >
          <DownloadIcon />
          Download PDF
        </DropdownMenuLinkItem>

        <DropdownMenuItem onClick={copyMarkdown}>
          <CopyIcon />
          Copy as Markdown
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
