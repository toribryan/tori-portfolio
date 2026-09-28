"use client"

import { copyToClipboardWithEvent } from "@/utils/copy"
import { decodeEmail } from "@/utils/string"
import { useTiks } from "@rexa-developer/tiks/react"
import { ArrowDownIcon, FileTextIcon, MailIcon } from "lucide-react"
import { useHotkeys } from "react-hotkeys-hook"
import { toast } from "sonner"

import { toggleOnSound } from "@/lib/soundcn/toggle-on"
import { cn } from "@/lib/utils"
import { useSound } from "@/hooks/soundcn/use-sound"
import { useIsClient } from "@/hooks/use-is-client"
import { Button } from "@/components/base/ui/button"

/**
 * The three things a visitor comes to the hero for: the work, the résumé and
 * a way to get in touch. The address is stored encoded and only decoded in
 * the browser, so it never sits in the HTML for scrapers.
 */
export function HeroActions({
  emailB64,
  className,
}: {
  emailB64: string
  className?: string
}) {
  const isClient = useIsClient()
  const email = decodeEmail(emailB64)

  const { success } = useTiks()
  const [playCopy] = useSound(toggleOnSound, { volume: 0.3, interrupt: true })

  useHotkeys("shift+e", () => {
    copyToClipboardWithEvent(email, {
      name: "copy_email",
      properties: { method: "keyboard", key: "shift+e" },
    })
    success()
    playCopy()
    toast.success("Email copied")
  })

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      <Button
        className="grow"
        nativeButton={false}
        render={<a href="#projects" />}
      >
        View work
        <ArrowDownIcon data-icon="inline-end" />
      </Button>
      <Button
        className="grow"
        variant="outline"
        nativeButton={false}
        render={<a href="/resume.pdf" target="_blank" rel="noopener" />}
      >
        <FileTextIcon data-icon="inline-start" />
        Résumé
      </Button>
      <Button
        className="grow"
        variant="outline"
        nativeButton={false}
        render={
          <a
            href={isClient ? `mailto:${email}` : undefined}
            title="Shift + E copies the address"
          />
        }
      >
        <MailIcon data-icon="inline-start" />
        Email
      </Button>
    </div>
  )
}
