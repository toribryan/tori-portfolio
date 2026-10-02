"use client"

import { useEffect, useRef, type ReactNode } from "react"

import { cn } from "@/lib/utils"
import { Reactions, type Reaction } from "@/components/fibo/reactions"

export const THUMBS = "\u{1F44D}"
export const HEART = "❤️"
export const LAUGH = "\u{1F602}"
export const PARTY = "\u{1F389}"
export const WOW = "\u{1F62E}"
export const FIRE = "\u{1F525}"
export const EYES = "\u{1F440}"
export const HANDS = "\u{1F64C}"
export const HUNDRED = "\u{1F4AF}"

export const SEEDED: Reaction[] = [
  { emoji: THUMBS, label: "Thumbs up", count: 5 },
  { emoji: HEART, label: "Heart", count: 3, active: true },
  { emoji: LAUGH, label: "Laughing", count: 1 },
]

export const BUSY: Reaction[] = [
  { emoji: THUMBS, label: "Thumbs up", count: 12_847 },
  { emoji: HEART, label: "Heart", count: 3_420, active: true },
  { emoji: PARTY, label: "Celebrate", count: 1_205 },
]

export const WALL: Reaction[] = [
  THUMBS,
  HEART,
  LAUGH,
  PARTY,
  WOW,
  FIRE,
  EYES,
  HANDS,
  HUNDRED,
].map((emoji, i) => ({ emoji, label: emoji, count: 9 - i }))

/** A chat message with room for its reactions above or below the text. */
export function Message({
  children,
  above = false,
  className,
}: {
  children: ReactNode
  above?: boolean
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex w-full max-w-md flex-col gap-3 rounded-xl border border-border bg-card p-4",
        className
      )}
    >
      <div className="flex items-center gap-2.5">
        <span className="grid size-8 place-content-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
          TB
        </span>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-card-foreground">
            Tori Bryan
          </span>
          <span className="text-xs font-medium text-muted-foreground">
            12:45 PM
          </span>
        </div>
      </div>
      {above ? children : null}
      <p className="text-sm text-card-foreground">
        Just shipped the reactions component. Picking one turns a click into a
        small celebration, which is the whole point.
      </p>
      {above ? null : children}
    </div>
  )
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Only one picker is opened at a time, so each snapshot knows the open panel
// on the page is its own.
let queue: Promise<unknown> = Promise.resolve()

/**
 * Reactions with the picker held open for a picture. The panel is portalled
 * to the body and closes on any outside click or focus change, so it can't
 * stay open inside a doc. Instead the real picker is opened once, its settled
 * panel is copied into place above the trigger, and the real one closes.
 * The copy is inert: it only shows what the open picker looks like.
 */
export function PickerHeldOpen({
  reactions = SEEDED,
  onReady,
  className,
}: {
  reactions?: Reaction[]
  onReady?: () => void
  className?: string
}) {
  const root = useRef<HTMLDivElement>(null)
  const layer = useRef<HTMLDivElement>(null)
  const ready = useRef(onReady)

  useEffect(() => {
    ready.current = onReady
  })

  useEffect(() => {
    const node = root.current
    const host = layer.current
    if (!node || !host) return
    let canceled = false

    const snapshot = async () => {
      const trigger = node.querySelector<HTMLElement>(
        "[data-slot=reactions-trigger]"
      )
      if (!trigger || canceled) return
      const previous = document.activeElement
      trigger.click()
      let panel: HTMLElement | null = null
      for (let i = 0; i < 60 && !panel; i++) {
        await wait(16)
        panel = document.querySelector("[data-slot=reactions-panel]")
      }
      // Let the choices finish unfurling before copying them.
      await wait(700)
      if (!panel || canceled) {
        trigger.click()
        return
      }
      const copy = panel.cloneNode(true) as HTMLElement
      copy.removeAttribute("id")
      copy.style.transform = "none"
      host.replaceChildren(copy)
      const base = node.getBoundingClientRect()
      const at = trigger.getBoundingClientRect()
      host.style.left = `${at.left - base.left}px`
      host.style.bottom = `${base.bottom - at.top + 8}px`
      // Widen to hold the panel too, so markers lay out around both.
      node.style.minWidth = `${at.left - base.left + copy.offsetWidth}px`

      trigger.click()
      await wait(300)
      if (previous instanceof HTMLElement && previous !== document.body) {
        previous.focus({ preventScroll: true })
      } else if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur()
      }
      // React set the trigger back to closed; show it as it looks while open.
      trigger.setAttribute("data-state", "open")
      await wait(600)
      if (!canceled) ready.current?.()
    }

    // Wait until it's on screen: opening the picker moves focus into it, which
    // would otherwise scroll the page down to it.
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return
      observer.disconnect()
      queue = queue.then(snapshot)
    })
    observer.observe(node)
    return () => {
      canceled = true
      observer.disconnect()
    }
  }, [])

  return (
    <div
      ref={root}
      data-anatomy-subject
      className={cn("relative inline-flex pt-16", className)}
    >
      <Reactions defaultReactions={reactions} particles={0} />
      <div ref={layer} inert className="absolute" />
    </div>
  )
}
