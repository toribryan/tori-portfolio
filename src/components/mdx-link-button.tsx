import { ArrowUpRightIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/base/ui/button"

/**
 * A call-to-action button usable from MDX bodies, for pages whose point is to
 * send the reader somewhere — a shipped product page, a live site, a write-up
 * hosted elsewhere.
 *
 * External by default. Pass `external={false}` for an in-site link.
 */
export function LinkButton({
  href,
  children,
  className,
  external = true,
}: {
  href: string
  children: React.ReactNode
  className?: string
  external?: boolean
}) {
  return (
    <div className={cn("not-prose my-8 flex", className)}>
      <Button
        size="lg"
        nativeButton={false}
        render={
          <a
            href={href}
            {...(external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
          >
            {children}
            <ArrowUpRightIcon data-icon="inline-end" />
          </a>
        }
      />
    </div>
  )
}
