"use client"

import { useImperativeHandle, useRef } from "react"
import { motion, useAnimation } from "motion/react"

import { useAnimateOnHover } from "./use-animate-on-hover"

export type ArrowLeftIconHandle = {
  startAnimation: () => void
  stopAnimation: () => void
}

export type ArrowLeftIconProps = React.ComponentPropsWithoutRef<"svg"> & {
  ref?: React.Ref<ArrowLeftIconHandle>
  duration?: number
}

export function ArrowLeftIcon({
  ref,
  duration = 0.4,
  ...props
}: ArrowLeftIconProps) {
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
        d="m12 19-7-7 7-7"
        variants={{
          normal: {
            translateX: 0,
          },
          animate: {
            translateX: [0, 3, 0],
          },
        }}
        initial="normal"
        animate={controls}
        transition={{
          duration,
        }}
      />
      <motion.path
        d="M19 12H5"
        variants={{
          normal: {
            d: "M19 12H5",
          },
          animate: {
            d: ["M19 12H5", "M19 12H10", "M19 12H5"],
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
