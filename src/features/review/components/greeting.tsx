"use client"

import { ArrowLeftIcon, ArrowRightIcon, FileTextIcon } from "lucide-react"
import { motion } from "motion/react"

import { Kbd } from "@/components/ui/kbd"
import { SpecialText } from "@/components/ui/special-text"

import { EASE } from "./slide-primitives"

const fade = {
  hidden: { opacity: 0, y: 10, filter: "blur(3px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)" },
}

/**
 * The door into the deck: a hello, the hotkeys, and nothing to read. Any
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
  return (
    <motion.div
      className="absolute inset-0 z-10 flex cursor-pointer flex-col items-center justify-center gap-6 bg-background px-6 text-center select-none"
      initial="hidden"
      animate="show"
      exit={{
        opacity: 0,
        y: -24,
        filter: "blur(6px)",
        transition: { duration: 0.3, ease: "easeIn" },
      }}
      transition={{ staggerChildren: 0.12, delayChildren: 0.1 }}
      onClick={(event) => {
        if ((event.target as HTMLElement).closest("a, button")) return
        onEnter()
      }}
    >
      <motion.p
        className="text-xs tracking-wide text-muted-foreground uppercase"
        variants={fade}
        transition={{ duration: 0.5, ease: EASE }}
      >
        Portfolio review
      </motion.p>

      <h1 className="font-heading text-4xl/none font-medium tracking-normal md:text-6xl/none lg:text-7xl/none">
        <SpecialText delay={0.35} speed={22}>
          {`hello ${audience}!`}
        </SpecialText>
      </h1>

      <motion.div
        className="mt-6 flex flex-col items-center gap-3"
        initial={{ opacity: 0, y: 10, filter: "blur(3px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.5, ease: EASE, delay: 1.9 }}
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
            <span>Notes</span>
          </span>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Click anywhere, or press Enter, to begin
        </p>
      </motion.div>
    </motion.div>
  )
}
