"use client"

import { useSyncExternalStore } from "react"

import { InlineScript } from "@/components/inline-script"

const ID = "hello"
const SSR_TEXT = "Hello"

/**
 * The viewer's local greeting with its kaomoji. The server renders "Hello" for
 * SEO, and a blocking script swaps in the local greeting before hydration so
 * it never flashes.
 */
export function Greeting({ className }: { className?: string }) {
  const greeting = useSyncExternalStore(
    () => () => {},
    getGreeting,
    () => SSR_TEXT
  )

  return (
    <span className={className}>
      {/* The id sits on this inner span: the pre-hydration script replaces its
          textContent, which would wipe the kaomoji beside it. */}
      <span id={`${ID}-greeting`} suppressHydrationWarning>
        {greeting}
      </span>
      <span className="ml-2 select-none" aria-hidden>
        ( ˶ˆ ᗜ ˆ˵ )
      </span>
      <InlineScript html={getInlineScript(`${ID}-greeting`)} />
    </span>
  )
}

// Self-contained (globals only) so it can be serialized via `.toString()` into
// the pre-hydration script as well as used as the client snapshot.
function getGreeting() {
  const hour = new Date().getHours()
  if (hour >= 0 && hour < 12) return "Good morning"
  if (hour >= 12 && hour < 17) return "Good afternoon"
  return "Good evening"
}

function runGreetingScript(elementId: string, compute: typeof getGreeting) {
  try {
    const el = document.getElementById(elementId)
    if (el) el.textContent = compute()
  } catch {}
}

// Blocking inline script that paints the greeting before hydration on the
// initial document load (Next.js "prevent flash before hydration").
function getInlineScript(elementId: string) {
  return `(${runGreetingScript.toString()})(${JSON.stringify(elementId)},${getGreeting.toString()})`
}
