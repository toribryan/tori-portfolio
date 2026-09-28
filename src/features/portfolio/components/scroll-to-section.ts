/**
 * Glides to an in-page section instead of jumping, and keeps the hash in the
 * address bar. The sections carry a scroll margin for the sticky header, which
 * `scrollIntoView` honours. Under reduced motion the jump stays instant.
 */
export function scrollToSection(event: React.MouseEvent<HTMLAnchorElement>) {
  const hash = event.currentTarget.hash
  const target = hash ? document.getElementById(hash.slice(1)) : null
  if (!target) return
  event.preventDefault()
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  target.scrollIntoView({
    behavior: reduce ? "auto" : "smooth",
    block: "start",
  })
  history.replaceState(null, "", hash)
}
