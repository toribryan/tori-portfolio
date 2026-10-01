"use client"

import { useImperativeHandle, useRef } from "react"
import { motion, useAnimation } from "motion/react"

import { useAnimateOnHover } from "./use-animate-on-hover"

export type ArrowRightIconHandle = {
  startAnimation: () => void
  stopAnimation: () => void
}

export type ArrowRightIconProps = React.ComponentPropsWithoutRef<"svg"> & {
  ref?: React.Ref<ArrowRightIconHandle>
  duration?: number
}

export function ArrowRightIcon({
  ref,
  duration = 0.4,
  ...props
}: ArrowRightIconProps) {
  const controls = useAnimation()
  const svgRef = useRef<SVGSVGElement>(null)

  useAnimateOnHover(svgRef, controls)

  useImperativeHandle(ref, () => {
    return {
      startAnimation: () => controls.start("animate"),
      stopAnimation: () => controls.start("normal"),
    }
  })

  return (
    <svg
      ref={svgRef}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <motion.path
        d="M5 12h14"
        variants={{
          normal: {
            d: "M5 12h14",
          },
          animate: {
            d: ["M5 12h14", "M5 12h9", "M5 12h14"],
          },
        }}
        initial="normal"
        animate={controls}
        transition={{
          duration,
        }}
      />
      <motion.path
        d="m12 5 7 7-7 7"
        variants={{
          normal: {
            translateX: 0,
          },
          animate: {
            translateX: [0, -3, 0],
          },
        }}
        initial="normal"
        animate={controls}
        transition={{
          duration,
        }}
      />
    </svg>
  )
}
