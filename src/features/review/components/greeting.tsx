"use client"

import { useEffect, useState } from "react"
import { ArrowLeftIcon, ArrowRightIcon, FileTextIcon } from "lucide-react"
import { motion } from "motion/react"

import { Kbd } from "@/components/ui/kbd"
import { SpecialText } from "@/components/ui/special-text"

import { EASE } from "./slide-primitives"

const fade = {
  hidden: { opacity: 0, y: 10, filter: "blur(3px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)" },
}

/** How the hello is scrambled in: when it starts, and milliseconds per step. */
const HELLO_DELAY = 0.35
const HELLO_SPEED = 22

/** How long after the hello settles everything else arrives. */
const INSTRUCTIONS_PAUSE = 1

/**
 * The door into the deck: a hello, the hotkeys, and nothing else to read. Any
 * click on the stage enters; so do Enter, Space and the right arrow, which
 * the deck handles so the same keys keep working once inside.
 */
export function Greeting({
  audience,
  onEnter,
}: {
  /** Who is being greeted, e.g. the company name. */
  audience: string
  onEnter: () => void
}) {
  const hello = `hello ${audience}!`
  // `SpecialText` spends four steps on each character.
  const settled = HELLO_DELAY + (hello.length * 4 * HELLO_SPEED) / 1000

  // The deck mounts this inside a presence that skips initial animations, so
  // the rest of the screen is held hidden by state until the hello has landed.
  const [helloSettled, setHelloSettled] = useState(false)
  useEffect(() => {
    const timer = window.setTimeout(
      () => setHelloSettled(true),
      (settled + INSTRUCTIONS_PAUSE) * 1000
    )
    return () => window.clearTimeout(timer)
  }, [settled])

  const arrival = {
    variants: fade,
    initial: false,
    animate: helloSettled ? "show" : "hidden",
  }

  return (
    <motion.div
      className="absolute inset-0 z-10 flex cursor-pointer flex-col items-center justify-center gap-6 bg-background px-6 text-center select-none"
      exit={{
        opacity: 0,
        y: -24,
        filter: "blur(6px)",
        transition: { duration: 0.3, ease: "easeIn" },
      }}
      onClick={(event) => {
        if ((event.target as HTMLElement).closest("a, button")) return
        onEnter()
      }}
    >
      <motion.p
        className="text-xs tracking-wide text-muted-foreground uppercase"
        {...arrival}
        transition={{ duration: 0.5, ease: EASE }}
      >
        Portfolio review
      </motion.p>

      <h1 className="font-heading text-4xl/none font-medium tracking-normal md:text-6xl/none lg:text-7xl/none">
        <SpecialText delay={HELLO_DELAY} speed={HELLO_SPEED}>
          {hello}
        </SpecialText>
      </h1>

      <motion.div
        className="mt-6 flex flex-col items-center gap-3"
        {...arrival}
        transition={{ duration: 0.5, ease: EASE, delay: 0.12 }}
      >
        <p className="text-xs tracking-wide text-muted-foreground uppercase">
          Hotkeys
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Kbd>
              <ArrowLeftIcon />
            </Kbd>
            <Kbd>
              <ArrowRightIcon />
            </Kbd>
            <span className="ml-1">Navigate between slides</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Kbd>N</Kbd>
            <FileTextIcon className="size-4" />
            <span>Notes for the slide you are on</span>
          </span>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Click anywhere, or press Enter, to begin
        </p>
      </motion.div>
    </motion.div>
  )
}
