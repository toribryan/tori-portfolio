"use client"

import { useState, type ReactNode } from "react"
import { ChevronDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/base/ui/button"

/**
 * Shows the first page, then one more with each press of Load more. Once
 * every page is out, the button folds them back to the first.
 */
export function LoadMore({ pages }: { pages: ReactNode[] }) {
  const [shown, setShown] = useState(1)
  const all = shown >= pages.length

  return (
    <>
      {pages.slice(0, shown)}

      {pages.length > 1 && (
        <div className="flex items-center justify-center pt-4">
          <Button
            className="gap-2 pr-2.5 pl-3"
            variant="outline"
            size="sm"
            onClick={() => setShown(all ? 1 : shown + 1)}
          >
            {all ? "Show less" : "Load more"}
            <ChevronDownIcon className={cn(all && "rotate-180")} />
          </Button>
        </div>
      )}
    </>
  )
}
