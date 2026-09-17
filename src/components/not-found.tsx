import Link from "next/link"
import { ArrowRightOutline24 } from "@/components/icons/pixel"

import { Button } from "@/components/base/ui/button"

export function NotFound() {
  return (
    <div className="grid min-h-svh place-items-center py-6">
      <section className="flex flex-col items-center gap-6">
        <h1 className="font-mono text-8xl font-medium">404</h1>
        <Button
          variant="outline"
          nativeButton={false}
          render={
            <Link href="/">
              Go to Home
              <ArrowRightOutline24 />
            </Link>
          }
        />
      </section>
    </div>
  )
}
