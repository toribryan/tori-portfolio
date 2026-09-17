"use client"

import { useCallback, useImperativeHandle, useRef } from "react"
import type { Variants } from "motion/react"
import { motion, useAnimation } from "motion/react"

import { cn } from "@/lib/utils"

export type SunMediumIconHandle = {
  startAnimation: () => void
  stopAnimation: () => void
}

export type SunMediumIconProps = React.ComponentPropsWithoutRef<"div"> & {
  ref?: React.Ref<SunMediumIconHandle>
  size?: number
}

const pathVariants: Variants = {
  normal: { opacity: 1 },
  animate: (i: number) => ({
    opacity: [0, 1],
    transition: { delay: i * 0.05, duration: 0.3 },
  }),
}

const CORE = [
  "M11 17L13 17",
  "M15 15H15.01",
  "M9 15H9.01",
  "M17 11L17 13",
  "M6.99999 11L7 13",
  "M15 9H15.01",
  "M9 9H9.01",
  "M11 7.00001L13 7",
]

const RAYS = [
  "M12 21L12 23",
  "M20 20H20.01",
  "M4 20H4.01",
  "M18 18H18.01",
  "M6 18H6.01",
  "M23.005 11.995L21.005 11.995",
  "M3.005 11.995L1.005 11.995",
  "M18 6H18.01",
  "M6 6H6.01",
  "M20 4H20.01",
  "M4 4H4.01",
  "M12 1L12 3",
]

export function SunMediumIcon({
  ref,
  onMouseEnter,
  onMouseLeave,
  className,
  size = 24,
  ...props
}: SunMediumIconProps) {
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
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="square"
        shapeRendering="crispEdges"
      >
        {CORE.map((d) => (
          <path key={d} d={d} />
        ))}
        {RAYS.map((d, index) => (
          <motion.path
            key={d}
            d={d}
            animate={controls}
            variants={pathVariants}
            custom={index + 1}
          />
        ))}
      </svg>
    </div>
  )
}
