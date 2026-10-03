import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeftIcon } from "lucide-react"

import { VoiceMemoHero } from "@/features/doc/components/voice-memo-object"

/*
 * The voice memo device on its own, with none of the site around it, for
 * screen recordings. Not linked from anywhere and kept out of search; the
 * project page at /work/voice-memo is the one people find. One quiet link
 * in the corner leads back to the site, small enough to crop out.
 */
export const metadata: Metadata = {
  title: "Voice memo",
  robots: { index: false, follow: false },
}

export default function VoiceMemoStage() {
  return (
    <main className="@container relative flex min-h-svh items-center justify-center bg-background px-6">
      <Link
        href="/"
        className="absolute top-5 left-6 inline-flex items-center gap-1.5 rounded-sm text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        <ArrowLeftIcon className="size-4" aria-hidden />
        toribryan.com
      </Link>
      <VoiceMemoHero
        className={[
          // Larger than on the project page, to fill a recording.
          "max-w-6xl [--w:min(34cqw,26rem)] @xl:[&_[data-slot=voice-memo]]:gap-20",
          "[&_[data-slot=voice-memo-transcript]]:w-[26rem]",
          "[&_[data-slot=voice-memo-text]]:max-h-80 [&_[data-slot=voice-memo-text]]:text-lg",
          "[&_[data-slot=voice-memo-header]]:text-sm",
        ].join(" ")}
      />
    </main>
  )
}
