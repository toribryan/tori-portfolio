"use client"

import { useState } from "react"
import Image from "next/image"
import { AnimatePresence, motion } from "motion/react"

import { cn } from "@/lib/utils"

const SPRING = { type: "spring", stiffness: 300, damping: 30 } as const

function initials(name: string) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

/**
 * A portrait that grows into a card on hover or focus. The portrait stays
 * where it is; the card opens underneath it, top left anchored, so the face
 * never moves and the copy arrives beside it.
 */
export function AvatarHoverCard({
  src,
  alt,
  name,
  subtitle,
  description,
  footer,
  size = "md",
  className,
}: {
  /** Portrait path under `public/`. Left out, the card shows initials. */
  src?: string
  alt?: string
  name: string
  /** The line under the name: a handle, a role, a situation. */
  subtitle?: string
  description?: string
  /** Anything below the copy: a button row, a caption. */
  footer?: React.ReactNode
  size?: "sm" | "md" | "lg"
  className?: string
}) {
  const [open, setOpen] = useState(false)

  const portraitSize = {
    sm: "size-16",
    md: "size-24",
    lg: "size-32",
  }[size]

  const cardWidth = {
    sm: "w-56",
    md: "w-72",
    lg: "w-80",
  }[size]

  const portrait = (
    <span className="relative flex size-full shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface-warm inset-ring-1 inset-ring-border/64">
      {src ? (
        <Image
          className="size-full object-cover"
          src={src}
          alt={alt ?? name}
          width={256}
          height={256}
          unoptimized
        />
      ) : (
        <span className="font-heading text-2xl font-medium text-muted-foreground">
          {initials(name)}
        </span>
      )}
    </span>
  )

  return (
    <div
      className={cn("relative inline-block", className)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false)
      }}
      tabIndex={0}
      aria-expanded={open}
    >
      <motion.div
        className={cn("relative rounded-full", portraitSize)}
        animate={{ padding: open ? 8 : 0 }}
        transition={SPRING}
      >
        {portrait}
      </motion.div>

      <AnimatePresence>
        {open && (
          <motion.div
            className={cn(
              "absolute top-0 left-0 z-50 overflow-hidden rounded-xl border border-line bg-background shadow-lg",
              cardWidth
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className={cn("p-2", portraitSize)}>{portrait}</div>

            <motion.div
              className="flex flex-col gap-3 p-4 pt-1"
              initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: 10, filter: "blur(4px)" }}
              transition={{ delay: 0.1, duration: 0.2 }}
            >
              <div>
                <motion.p
                  className="font-heading text-lg/tight font-medium"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  {name}
                </motion.p>
                {subtitle && (
                  <motion.p
                    className="mt-0.5 text-sm text-muted-foreground"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.18 }}
                  >
                    {subtitle}
                  </motion.p>
                )}
              </div>

              {description && (
                <motion.p
                  className="text-sm/relaxed text-pretty text-foreground/80"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {description}
                </motion.p>
              )}

              {footer && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                >
                  {footer}
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
