"use client"

import { useCallback, useImperativeHandle, useRef } from "react"
import type { Transition, Variants } from "motion/react"
import { motion, useAnimation } from "motion/react"

import { cn } from "@/lib/utils"

export type MoonIconHandle = {
  startAnimation: () => void
  stopAnimation: () => void
}

export type MoonIconProps = React.ComponentPropsWithoutRef<"div"> & {
  ref?: React.Ref<MoonIconHandle>
  size?: number
}

const CRESCENT = [
  "M13 9L13 9.01",
  "M15 11L15 11.01",
  "M21 17L21 17.01",
  "M23 15L23 15.01",
  "M9 1L9 1.01",
  "M7 3L7 3.01",
  "M9 19H7",
  "M21 13H17",
  "M11 3L11 7",
  "M3 10L3 13",
  "M14 21L11 21",
  "M5 5L5 8",
  "M19 19L16 19",
  "M5 15L5 17",
]

const svgVariants: Variants = {
  normal: {
    rotate: 0,
  },
  animate: {
    rotate: [0, -10, 10, -5, 5, 0],
  },
}

const svgTransition: Transition = {
  duration: 1.2,
  ease: "easeInOut",
}

export function MoonIcon({
  ref,
  onMouseEnter,
  onMouseLeave,
  className,
  size = 24,
  ...props
}: MoonIconProps) {
  const controls = useAnimation()
  const isControlledRef = useRef(false)

  useImperativeHandle(ref, () => {
    isControlledRef.current = true

    return {
      startAnimation: () => controls.start("animate"),
      stopAnimation: () => controls.start("normal"),
    }
  })

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isControlledRef.current) {
        controls.start("animate")
      } else {
        onMouseEnter?.(e)
      }
    },
    [controls, onMouseEnter]
  )

  const handleMouseLeave = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isControlledRef.current) {
        controls.start("normal")
      } else {
        onMouseLeave?.(e)
      }
    },
    [controls, onMouseLeave]
  )
  return (
    <div
      className={cn(className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="square"
        shapeRendering="crispEdges"
        variants={svgVariants}
        animate={controls}
        transition={svgTransition}
      >
        {CRESCENT.map((d) => (
          <path key={d} d={d} />
        ))}
      </motion.svg>
    </div>
  )
}
