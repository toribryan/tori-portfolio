"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowUpRightIcon } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * A live prototype or Storybook build, embedded from `public/`.
 *
 * The things this frames are desktop apps — the BAB console's shell declares
 * `min-width: 1180px` — and the doc column is roughly 736px. Handing the reader
 * a horizontally-scrolling box would show a quarter of a screen at a time, so
 * the iframe is instead laid out at its true `width` and scaled down to fit
 * whatever the column gives it. The whole layout stays visible; the text gets
 * small, which is why "Full screen" sits in the chrome bar.
 *
 * Scale is measured rather than expressed in CSS: dividing one length by
 * another inside `calc()` isn't reliable across browsers yet, so a
 * ResizeObserver does the arithmetic. It's capped at 1 — a wide monitor gets
 * the prototype at native size, not a blown-up one.
 */
export function Embed({
  src,
  title,
  width = 1280,
  height = 820,
  autoHeight = false,
  focusOptions,
  caption,
  className,
}: {
  /** Path under `public/`, e.g. `/prototype/bab/index.html`. */
  src: string
  /** Names the frame for screen readers, and labels the chrome bar. */
  title: string
  /** Logical viewport the frame is laid out at, before scaling. */
  width?: number
  height?: number
  /**
   * Measures the iframe's real content height and uses that instead of
   * `height`, so the frame shrink-wraps the story instead of guessing a
   * fixed size that either clips it (an internal scrollbar) or leaves empty
   * ground below it. Only safe for same-origin embeds — the Storybook build
   * under `/storybook/bab/`, served from this same app, is: `contentDocument`
   * is reachable, unlike a true cross-origin iframe. `height` still applies
   * as the size shown before the first measurement lands.
   */
  autoHeight?: boolean
  /**
   * Renders a picker above the frame, for embeds that can bring one region of
   * themselves forward. It sits outside the iframe deliberately: inside, it
   * would be scaled down with everything else, and a control the reader is
   * meant to operate shouldn't shrink to 58% on a laptop.
   *
   * The embedded page opts in by listening for the message posted below; one
   * that doesn't simply ignores it.
   */
  focusOptions?: { value: string; label: string }[]
  caption?: React.ReactNode
  className?: string
}) {
  const frameRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [scale, setScale] = useState(1)
  const [focus, setFocus] = useState(focusOptions?.[0]?.value)
  const [measuredHeight, setMeasuredHeight] = useState<number | null>(null)

  const effectiveHeight = autoHeight && measuredHeight ? measuredHeight : height

  useEffect(() => {
    const el = frameRef.current
    if (!el) return

    const observer = new ResizeObserver(([entry]) => {
      setScale(Math.min(1, entry.contentRect.width / width))
    })

    observer.observe(el)
    return () => observer.disconnect()
  }, [width])

  /**
   * Also wired to the iframe's `load`: these are lazy-loaded, so a selection
   * made before the frame is ready would otherwise post into nothing.
   */
  function postFocus() {
    if (focus === undefined) return
    iframeRef.current?.contentWindow?.postMessage(
      { source: "embed-focus", value: focus },
      window.location.origin
    )
  }

  useEffect(postFocus, [focus])

  /**
   * Re-measures on load and keeps watching: fonts and images finishing after
   * `load` can still grow the content, and a stale height would bring the
   * scrollbar right back.
   */
  useEffect(() => {
    if (!autoHeight) return

    const iframe = iframeRef.current
    if (!iframe) return

    let resizeObserver: ResizeObserver | undefined

    const measure = () => {
      const doc = iframe.contentDocument
      if (!doc?.body) return
      const next = Math.ceil(doc.documentElement.scrollHeight)
      if (next > 0) setMeasuredHeight(next)
    }

    const attach = () => {
      const doc = iframe.contentDocument
      if (!doc?.body) return
      measure()
      resizeObserver = new ResizeObserver(measure)
      resizeObserver.observe(doc.body)
    }

    if (iframe.contentDocument?.readyState === "complete") {
      attach()
    }

    iframe.addEventListener("load", attach)
    return () => {
      iframe.removeEventListener("load", attach)
      resizeObserver?.disconnect()
    }
  }, [autoHeight, src])

  return (
    <figure className={cn("not-prose my-8", className)}>
      <div
        className={cn(
          "overflow-hidden rounded-xl bg-surface",
          "inset-ring-1 inset-ring-border/64"
        )}
      >
        <div className="flex items-center gap-3 border-b border-line px-3 py-2">
          <div className="flex shrink-0 gap-1.5" aria-hidden>
            <span className="size-2.5 rounded-full bg-line" />
            <span className="size-2.5 rounded-full bg-line" />
            <span className="size-2.5 rounded-full bg-line" />
          </div>

          <p className="min-w-0 flex-1 truncate font-mono text-xs tracking-wide text-muted-foreground">
            {title}
          </p>

          <a
            className="inline-flex shrink-0 items-center gap-1 font-mono text-xs tracking-wide text-muted-foreground transition-colors hover:text-foreground"
            href={src}
            target="_blank"
            rel="noopener noreferrer"
          >
            Full screen
            <ArrowUpRightIcon className="size-3.5" />
          </a>
        </div>

        {focusOptions && (
          <div className="flex flex-wrap items-center gap-1 border-b border-line p-2">
            {focusOptions.map((option) => {
              const active = option.value === focus

              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={active}
                  className={cn(
                    "rounded-full px-3 py-1 font-mono text-xs tracking-wide transition-colors",
                    active
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:bg-accent-muted hover:text-foreground"
                  )}
                  onClick={() => setFocus(option.value)}
                >
                  {option.label}
                </button>
              )
            })}
          </div>
        )}

        <div
          ref={frameRef}
          className="relative overflow-hidden bg-white"
          style={{ height: effectiveHeight * scale }}
        >
          <iframe
            ref={iframeRef}
            className="absolute top-0 left-0 origin-top-left border-0"
            src={src}
            title={title}
            loading="lazy"
            onLoad={postFocus}
            style={{ width, height: effectiveHeight, transform: `scale(${scale})` }}
          />
        </div>
      </div>

      {caption && (
        <figcaption className="mt-3 text-sm text-pretty text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
