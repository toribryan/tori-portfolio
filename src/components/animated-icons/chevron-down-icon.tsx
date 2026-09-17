"use client"

import { useImperativeHandle } from "react"
import { motion, useAnimation } from "motion/react"

export type ChevronDownIconHandle = {
  startAnimation: () => void
  stopAnimation: () => void
}

export type ChevronDownIconProps = React.ComponentPropsWithoutRef<"svg"> & {
  ref?: React.Ref<ChevronDownIconHandle>
  duration?: number
}

// Each step of the chevron is its own 2px segment rather than one polyline, so
// there is no single `d` to interpolate between down and up. Flipping the whole
// group gets to the same place and keeps every segment on the pixel grid.
const STEPS = [
  "M12 16.99L12 17",
  "M10 14.99L10 15",
  "M14 14.99L14 15",
  "M16 12.99L16 13",
  "M8 12.99L8 13",
  "M6 10.99L6 11",
  "M18 10.99L18 11",
  "M20 8.98999L20 8.99999",
  "M4 8.98999L4 8.99999",
]

export function ChevronDownIcon({
  ref,
  duration = 0.3,
  ...props
}: ChevronDownIconProps) {
  const controls = useAnimation()

  useImperativeHandle(ref, () => {
    return {
      startAnimation: () => controls.start("animate"),
      stopAnimation: () => controls.start("normal"),
    }
  })

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="square"
      shapeRendering="crispEdges"
      aria-hidden
      {...props}
    >
      <motion.g
        variants={{
          normal: { rotate: 0 },
          animate: { rotate: 180 },
        }}
        initial="normal"
        animate={controls}
        transition={{ duration }}
        style={{ transformOrigin: "12px 12px" }}
      >
        {STEPS.map((d) => (
          <path key={d} d={d} />
        ))}
      </motion.g>
    </svg>
  )
}
