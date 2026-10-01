"use client"

import { useImperativeHandle, useRef } from "react"
import { motion, useAnimation } from "motion/react"

import { useAnimateOnHover } from "./use-animate-on-hover"

export type ArrowUpRightIconHandle = {
  startAnimation: () => void
  stopAnimation: () => void
}

export type ArrowUpRightIconProps = React.ComponentPropsWithoutRef<"svg"> & {
  ref?: React.Ref<ArrowUpRightIconHandle>
  duration?: number
}

export function ArrowUpRightIcon({
  ref,
  duration = 0.5,
  ...props
}: ArrowUpRightIconProps) {
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
      <motion.g
        variants={{
          normal: {
            scale: 1,
            translateX: 0,
            translateY: 0,
          },
          animate: {
            scale: [1, 0.85, 1],
            translateX: [0, -4, 0],
            translateY: [0, 4, 0],
            originX: 1,
            originY: 0,
          },
        }}
        initial="normal"
        animate={controls}
        transition={{
          duration,
          ease: "easeInOut",
        }}
      >
        <path d="M7 7H17" />
        <path d="M17 7V17" />
        <path d="M7 17L17 7" />
      </motion.g>
    </svg>
  )
}
