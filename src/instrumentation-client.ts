import { initPostHog } from "@/lib/posthog"

// Runs after the document loads and before hydration. Wrapped so an analytics
// failure can never take the page down with it.
try {
  initPostHog()
} catch (error) {
  console.error("PostHog failed to initialise", error)
}
