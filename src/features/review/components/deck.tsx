"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  FileTextIcon,
  XIcon,
} from "lucide-react"
import type { Variants } from "motion/react"
import { AnimatePresence, motion, MotionConfig } from "motion/react"

import { Kbd } from "@/components/ui/kbd"
import { Button } from "@/components/base/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { ChapterScrubber } from "@/registry/components/chapter-scrubber"
import { LineNav } from "@/registry/components/line-nav"
import {
  firstSlideOfSection,
  SECTIONS,
  slideHref,
  SLIDES,
} from "@/features/review/data/deck"
import { stageKey } from "@/features/review/types"

import { Greeting } from "./greeting"
import { EASE } from "./slide-primitives"
import { renderSlide } from "./slides"

/**
 * Slides move the way the site's text flips do: in from below with a touch of
 * blur, out the way they came. `custom` carries the direction so stepping
 * back reads as stepping back.
 */
const slideVariants: Variants = {
  hidden: (direction: number) => ({
    opacity: 0,
    y: direction >= 0 ? 32 : -32,
    filter: "blur(6px)",
  }),
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.55,
      ease: EASE,
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
  exit: (direction: number) => ({
    opacity: 0,
    y: direction >= 0 ? -24 : 24,
    filter: "blur(4px)",
    transition: { duration: 0.25, ease: "easeIn" },
  }),
}

const KEYS_NEXT = new Set([
  "ArrowRight",
  "ArrowDown",
  "PageDown",
  " ",
  "j",
  "l",
])
const KEYS_PREV = new Set(["ArrowLeft", "ArrowUp", "PageUp", "k", "h"])
const KEYS_ENTER = new Set(["Enter", " ", "ArrowRight"])

function isTypingTarget(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable ||
      ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))
  )
}

export function Deck({
  initialIndex,
  greeting,
  audience,
}: {
  initialIndex: number
  /** Open on the hello screen instead of a slide. */
  greeting: boolean
  audience: string
}) {
  const [[index, direction], setPosition] = useState([initialIndex, 0])
  const [started, setStarted] = useState(!greeting)
  const [notesOpen, setNotesOpen] = useState(false)

  const slide = SLIDES[index]
  const section = SECTIONS.find((s) => s.slug === slide.section)!
  const count = SLIDES.length

  const go = useCallback(
    (next: number) => {
      const clamped = Math.max(0, Math.min(count - 1, next))
      setPosition(([current]) =>
        clamped === current
          ? [current, 0]
          : [clamped, clamped > current ? 1 : -1]
      )
    },
    [count]
  )

  // The address bar follows the slide so any moment of the deck is a link
  // that can be pasted back. `replaceState` keeps the history stack clean:
  // Back leaves the deck instead of rewinding twenty slides.
  useEffect(() => {
    if (!started) return
    const href = slideHref(slide)
    if (window.location.pathname !== href) {
      window.history.replaceState(null, "", href)
    }
  }, [slide, started])

  useEffect(() => {
    if (!started) return
    document.title = `${slide.title} – ${section.title} – Portfolio review`
  }, [slide, section, started])

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return
      if (isTypingTarget(event.target)) return

      if (!started) {
        if (KEYS_ENTER.has(event.key)) {
          event.preventDefault()
          setStarted(true)
        }
        return
      }

      if (KEYS_NEXT.has(event.key)) {
        event.preventDefault()
        go(index + 1)
      } else if (KEYS_PREV.has(event.key)) {
        event.preventDefault()
        go(index - 1)
      } else if (event.key === "Home") {
        event.preventDefault()
        go(0)
      } else if (event.key === "End") {
        event.preventDefault()
        go(count - 1)
      } else if (event.key === "n" || event.key === "N") {
        setNotesOpen((open) => !open)
      } else if (event.key === "Escape") {
        setNotesOpen(false)
      } else if (event.key === "f" || event.key === "F") {
        if (document.fullscreenElement) {
          void document.exitFullscreen()
        } else {
          void document.documentElement.requestFullscreen?.()
        }
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [count, go, index, started])

  // Scrolling past the end of a slide turns the page. A slide that is taller
  // than the stage scrolls normally first. Reaching the edge does not count:
  // the gesture that brought the slide there is swallowed, so the page only
  // turns on a fresh wheel once it is already at the edge, and a cooldown
  // keeps trackpad inertia from turning several pages at once.
  const stageRef = useRef<HTMLDivElement>(null)
  const wheelRef = useRef({ sum: 0, lockedUntil: 0, lastMoving: 0 })

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return

    function onWheel(event: WheelEvent) {
      if (Math.abs(event.deltaY) < Math.abs(event.deltaX)) return
      const scroller = stage!.querySelector<HTMLElement>("[data-slide-scroll]")
      if (!scroller) return

      const now = performance.now()
      const state = wheelRef.current
      const down = event.deltaY > 0
      const atEnd = down
        ? scroller.scrollTop + scroller.clientHeight >=
          scroller.scrollHeight - 1
        : scroller.scrollTop <= 0

      if (!atEnd) {
        state.sum = 0
        state.lastMoving = now
        return
      }

      if (now - state.lastMoving < 600) {
        state.lockedUntil = now + 1000
        state.sum = 0
        return
      }

      if (now < state.lockedUntil) {
        event.preventDefault()
        return
      }

      state.sum += event.deltaY
      if (Math.abs(state.sum) < 120) return

      state.sum = 0
      state.lockedUntil = now + 900
      event.preventDefault()
      if (!started) {
        if (down) setStarted(true)
        return
      }
      go(index + (down ? 1 : -1))
    }

    stage.addEventListener("wheel", onWheel, { passive: false })
    return () => stage.removeEventListener("wheel", onWheel)
  }, [go, index, started])

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative h-dvh w-full overflow-hidden bg-background text-foreground">
        <motion.div
          className="absolute inset-x-0 top-0 z-30 h-px origin-left bg-foreground"
          animate={{ scaleX: started ? (index + 1) / count : 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          aria-hidden
        />

        {/* --stage-top is where a slide's first line sits: below the header
            and the stripe, past the slide's own top padding. The chapter nav
            hangs from it so it starts on the same line as the content. */}
        <div className="relative isolate mx-auto flex h-full max-w-4xl flex-col border-x border-line [--stage-top:calc(var(--header-height)+4rem)]">
          <header className="screen-line-bottom z-20 flex h-(--header-height) shrink-0 items-center justify-between gap-4 px-4">
            <Button
              className="h-7 gap-2 border-none px-0 tracking-wider text-muted-foreground hover:text-foreground hover:no-underline"
              variant="link"
              size="sm"
              nativeButton={false}
              render={
                <Link href="/">
                  <ArrowLeftIcon />
                  toribryan.com
                </Link>
              }
            />

            <div className="flex items-center gap-1.5">
              {started && (
                <>
                  <p className="mr-2 text-xs text-muted-foreground tabular-nums max-sm:hidden">
                    {String(index + 1).padStart(2, "0")}
                    <span className="mx-1 text-border">/</span>
                    {String(count).padStart(2, "0")}
                  </p>
                  <Button
                    className="h-7 gap-1.5 px-2"
                    variant={notesOpen ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => setNotesOpen((open) => !open)}
                    aria-pressed={notesOpen}
                  >
                    <FileTextIcon />
                    Notes
                    <Kbd className="max-sm:hidden">N</Kbd>
                  </Button>
                  <Button
                    className="size-7"
                    variant="outline"
                    size="icon-sm"
                    onClick={() => go(index - 1)}
                    disabled={index === 0}
                    aria-label="Previous slide"
                  >
                    <ArrowLeftIcon />
                  </Button>
                  <Button
                    className="size-7"
                    variant="outline"
                    size="icon-sm"
                    onClick={() => go(index + 1)}
                    disabled={index === count - 1}
                    aria-label="Next slide"
                  >
                    <ArrowRightIcon />
                  </Button>
                </>
              )}
              <ThemeToggle />
            </div>
          </header>

          <div className="screen-line-bottom stripe-divider h-8 shrink-0" />

          <main ref={stageRef} className="relative min-h-0 flex-1">
            <AnimatePresence initial={false}>
              {started ? (
                <AnimatePresence
                  key="deck"
                  mode="sync"
                  custom={direction}
                  initial={greeting}
                >
                  <motion.section
                    key={stageKey(slide)}
                    // As wide as the viewport, not the column, so a slide's
                    // hairlines can run across the screen the way the
                    // site's do. The column is re-centred inside.
                    className="absolute inset-y-0 left-1/2 w-screen -translate-x-1/2 overflow-x-hidden overflow-y-auto"
                    data-slide-scroll
                    custom={direction}
                    variants={slideVariants}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                    aria-label={`${section.title}: ${slide.title}`}
                  >
                    <div className="mx-auto flex min-h-full w-full max-w-4xl flex-col px-4 md:px-8">
                      {renderSlide(slide)}
                    </div>
                  </motion.section>
                </AnimatePresence>
              ) : (
                <Greeting
                  key="greeting"
                  audience={audience}
                  onEnter={() => setStarted(true)}
                />
              )}
            </AnimatePresence>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-linear-to-t from-background to-transparent" />
          </main>

          {started && (
            <>
              <nav
                className="absolute top-(--stage-top) right-full mr-6 hidden w-48 rounded-xl border border-line bg-background px-3 xl:block"
                aria-label="Chapters"
              >
                <LineNav
                  items={SECTIONS.map((s) => ({
                    title: s.title,
                    href: slideHref(SLIDES[firstSlideOfSection(s.slug)]),
                  }))}
                  activeHref={slideHref(
                    SLIDES[firstSlideOfSection(slide.section)]
                  )}
                  scrollActiveIntoView={false}
                  onItemClick={(item, event) => {
                    event.preventDefault()
                    go(SLIDES.findIndex((s) => slideHref(s) === item.href))
                  }}
                />
              </nav>

              <DeckScrubber index={index} onSelect={go} />
            </>
          )}

          <AnimatePresence>
            {notesOpen && (
              <motion.aside
                className="absolute inset-x-4 bottom-4 z-40 mx-auto max-w-2xl"
                initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: 16, filter: "blur(4px)" }}
                transition={{ duration: 0.35, ease: EASE }}
                aria-label="Speaker notes"
              >
                <div className="flex flex-col gap-3 rounded-xl border border-line bg-background p-4 shadow-lg">
                  <div className="flex items-center justify-between">
                    <p className="text-xs tracking-wide text-muted-foreground uppercase">
                      Notes · {slide.title}
                    </p>
                    <Button
                      className="size-6"
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => setNotesOpen(false)}
                      aria-label="Close notes"
                    >
                      <XIcon />
                    </Button>
                  </div>
                  <ul className="flex flex-col gap-2 text-sm/relaxed text-pretty">
                    {slide.notes.map((note) => (
                      <li key={note} className="flex gap-2">
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-muted-foreground" />
                        {note}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>
        </div>
      </div>
    </MotionConfig>
  )
}

/**
 * Every slide of the deck as a tick in the right gutter, the current one
 * marked. Hovering magnifies the rail and previews the slide under the
 * pointer; a click jumps to it.
 */
function DeckScrubber({
  index,
  onSelect,
}: {
  index: number
  onSelect: (index: number) => void
}) {
  const chapters = SLIDES.map((s, i) => ({
    id: `${s.section}/${s.slug}`,
    title: s.title,
    meta: `${String(i + 1).padStart(2, "0")} · ${
      SECTIONS.find((section) => section.slug === s.section)?.title
    }`,
  }))

  return (
    <div className="absolute top-1/2 left-full ml-6 hidden -translate-y-1/2 rounded-xl border border-line bg-background px-3 py-2 xl:block">
      <ChapterScrubber
        chapters={chapters}
        side="right"
        currentIndex={index}
        rowHeight={9}
        restLength={12}
        peakLength={32}
        label="Slides"
        onSelect={(_, i) => onSelect(i)}
      />
    </div>
  )
}
