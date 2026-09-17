import posthog from "posthog-js"

/**
 * PostHog is optional, like the other analytics here: with no project token
 * the SDK is never initialised and `capture` is a no-op, so dev and preview
 * builds stay quiet without a secret. Both variables are `NEXT_PUBLIC_` so the
 * browser bundle can read them.
 */
const POSTHOG_TOKEN = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN
const POSTHOG_HOST =
  process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com"

export const isPostHogEnabled = Boolean(POSTHOG_TOKEN)

/** Called once from `instrumentation-client.ts`, before hydration. */
export function initPostHog() {
  if (!POSTHOG_TOKEN) return

  posthog.init(POSTHOG_TOKEN, {
    api_host: POSTHOG_HOST,
    // Pinned so an SDK upgrade doesn't silently change what gets captured.
    defaults: "2026-05-30",
  })
}

export function capturePostHogEvent(
  name: string,
  properties?: Record<string, string | number | boolean | null>
) {
  if (!isPostHogEnabled) return
  posthog.capture(name, properties)
}
