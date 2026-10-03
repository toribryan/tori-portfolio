import { useSyncExternalStore } from "react"

function subscribe(onChange: () => void) {
  document.addEventListener("visibilitychange", onChange)
  return () => document.removeEventListener("visibilitychange", onChange)
}

/**
 * Whether the tab is showing, so loops can stop in a background tab rather
 * than run on unseen. True on the server, so nothing hydrates paused.
 */
export function usePageVisible() {
  return useSyncExternalStore(
    subscribe,
    () => document.visibilityState !== "hidden",
    () => true
  )
}
