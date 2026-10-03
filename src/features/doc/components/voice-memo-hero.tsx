"use client"

import {
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type PointerEvent,
} from "react"
import Link from "next/link"
import { Maximize2Icon, RotateCwIcon } from "lucide-react"
import { animate, motion, useMotionValue, useReducedMotion } from "motion/react"
import { flushSync } from "react-dom"
import { toast } from "sonner"

import {
  decodeAudioData,
  playSound,
  soundSource,
} from "@/lib/soundcn/sound-engine"
import type { SoundAsset } from "@/lib/soundcn/sound-types"
import {
  cardSlideSound,
  click8bitSound,
  dropSound,
  maximizeSound,
} from "@/lib/soundcn/voice-memo"
import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/base/ui/button"
import { VoiceMemo } from "@/components/fibo/voice-memo"

import {
  Body,
  QUICK,
  Shadow,
  SIZE,
  SPRING,
  type Axis,
  type Pose,
} from "./voice-memo-device"

// On its page, square to the screen, the way you'd hold it up to read.
const STRAIGHT: Pose = { x: 0, y: 0 }

// Degrees a millisecond at release, about 1,800 pixels a second, past which
// a flick spins the device through a few fast turns.
const SPIN_SPEED = 1
// Two and a half turns lands it on its other face.
const SPIN_TURNS = 900
const SPIN = { duration: 0.8, ease: [0.16, 1, 0.3, 1] } as const

/**
 * Rotation for the device, with a drag that turns it, coasts when let go and
 * settles on whichever face is nearest. Drag sideways to turn it about its
 * upright axis, or pull the top down or push it up to tip it over towards
 * you or away. A hard flick spins it instead, and calls `onSpin`. A drag
 * never also counts as a press, so the device can be a button underneath.
 *
 * `axis` is the axis the back is mounted on. Turned over sideways, the back
 * has to sit turned about the upright axis to land the right way up; tipped
 * over top first, about the level one. Each drag starts by moving it to the
 * drag's axis while the device rests, which looks the same on screen, as
 * either mounting shows the back upright once it's over.
 */
function useTurn(rest: Pose, { onSpin }: { onSpin?: () => void } = {}) {
  const reduceMotion = useReducedMotion()
  const rx = useMotionValue(rest.x)
  const ry = useMotionValue(rest.y)
  const [back, setBack] = useState(false)
  const [axis, setAxis] = useState<Axis>("y")
  const rotation = { x: rx, y: ry }
  const other = (a: Axis): Axis => (a === "x" ? "y" : "x")

  const nearest = (a: Axis, value: number) =>
    Math.round((value - rest[a]) / 180) * 180 + rest[a]
  const turnedOver = (a: Axis, value: number) =>
    Math.abs(Math.round((value - rest[a]) / 180)) % 2 === 1

  // Lands the turning axis on its nearest face and levels the other.
  const settle = (a: Axis, target: number, spin = false) => {
    const transition = reduceMotion ? QUICK : SPRING
    animate(rotation[a], target, spin ? SPIN : transition)
    animate(rotation[other(a)], rest[other(a)], transition)
    setBack(turnedOver(a, target))
  }

  // Puts the turn on axis `a`, keeping the same face showing. Only from
  // rest, where the swap can't be seen.
  const mount = (a: Axis) => {
    if (a === axis) return true
    const current = rotation[axis].get()
    const resting =
      Math.abs(current - nearest(axis, current)) < 1 &&
      Math.abs(rotation[other(axis)].get() - rest[other(axis)]) < 1
    if (!resting) return false
    // The new mounting has to be on screen before the angles that need it,
    // or the back shows upside down for a frame.
    flushSync(() => setAxis(a))
    rotation[axis].set(rest[axis])
    rotation[a].set(rest[a] + (back ? 180 : 0))
    return true
  }

  const flip = (direction = 1) => {
    if (!mount("y")) return
    settle("y", nearest("y", ry.get()) + 180 * direction)
  }

  const drag = useRef<{
    id: number
    x: number
    y: number
    rx: number
    ry: number
    axis: Axis | null
    last: number
    lastT: number
    velocity: number
  } | null>(null)
  const dragged = useRef(false)

  const handlers = {
    onPointerDown: (event: PointerEvent<HTMLElement>) => {
      if (event.button !== 0) return
      dragged.current = false
      rx.stop()
      ry.stop()
      drag.current = {
        id: event.pointerId,
        x: event.clientX,
        y: event.clientY,
        rx: rx.get(),
        ry: ry.get(),
        axis: null,
        last: 0,
        lastT: event.timeStamp,
        velocity: 0,
      }
    },
    onPointerMove: (event: PointerEvent<HTMLElement>) => {
      const current = drag.current
      if (!current || current.id !== event.pointerId) return
      const dx = event.clientX - current.x
      const dy = event.clientY - current.y
      if (!current.axis) {
        if (Math.hypot(dx, dy) < 6) return
        // Sideways turns it about the upright axis, up or down about the
        // level one. A turn already underway keeps its axis.
        const wanted: Axis = Math.abs(dy) > Math.abs(dx) ? "x" : "y"
        current.axis = mount(wanted) ? wanted : axis
        current.rx = rx.get()
        current.ry = ry.get()
        current.x = event.clientX
        current.y = event.clientY
        // Captured only once it's a drag, so a tap still reaches the button.
        event.currentTarget.setPointerCapture(event.pointerId)
        return
      }
      // Pulling the top down tips it towards you.
      const along = current.axis === "y" ? dx : -dy
      const across = current.axis === "y" ? -dy : dx
      const turn = current[`r${current.axis}`] + along * 0.55
      const tilt = Math.max(-25, Math.min(25, across * 0.2))
      rotation[current.axis].set(turn)
      rotation[other(current.axis)].set(rest[other(current.axis)] + tilt)
      // Degrees a millisecond, smoothed, for the coast after letting go.
      const dt = Math.max(1, event.timeStamp - current.lastT)
      const instant = ((along - current.last) * 0.55) / dt
      current.velocity = current.velocity * 0.6 + instant * 0.4
      current.last = along
      current.lastT = event.timeStamp
    },
    onPointerUp: (event: PointerEvent<HTMLElement>) => {
      const current = drag.current
      if (!current || current.id !== event.pointerId) return
      drag.current = null
      if (!current.axis) return
      dragged.current = true
      const a = current.axis
      const value = rotation[a].get()
      // A flick carries on turning; it lands on whichever face it's nearest
      // once it would have slowed down.
      if (!reduceMotion && Math.abs(current.velocity) > SPIN_SPEED) {
        settle(
          a,
          nearest(a, value + Math.sign(current.velocity) * SPIN_TURNS),
          true
        )
        onSpin?.()
        return
      }
      const coast = reduceMotion ? 0 : current.velocity * 280
      settle(a, nearest(a, value + coast))
    },
    onPointerCancel: () => {
      drag.current = null
      settle(axis, nearest(axis, rotation[axis].get()))
    },
    // The click a drag ends on would otherwise press the button.
    onClickCapture: (event: MouseEvent) => {
      if (!dragged.current) return
      dragged.current = false
      event.preventDefault()
      event.stopPropagation()
    },
  }

  return { rx, ry, axis, back, flip, handlers }
}

// Small on its page, so the transcript has room beside it. On a phone the
// transcript opens underneath, so the device takes most of the width.
const SMALL = "[--w:min(64vw,17rem)] sm:[--w:min(44cqw,13rem)]"

/**
 * The device on its page: a record button you can also pick up. Press it and
 * it slides to the right as the transcript opens on its left, filling in as
 * you talk; press it again to stop, then copy the text or save it as
 * Markdown. Drag it to turn it over. In a narrow column the transcript opens
 * underneath instead.
 */
export function VoiceMemoHero({
  className,
  stageHref,
}: {
  className?: string
  /** Where the device has a page to itself, linked beside Flip. */
  stageHref?: "/voice-memo"
}) {
  const reduceMotion = useReducedMotion()
  // Quiet under reduced motion, like the site's other sounds.
  const play = (sound: SoundAsset) => {
    if (reduceMotion) return
    playSound(soundSource(sound), { volume: 0.5 }).catch(() => {
      // No audio output, or the browser hasn't allowed sound yet. Neither is
      // worth reporting for a decorative sound.
    })
  }
  const { rx, ry, axis, back, flip, handlers } = useTurn(STRAIGHT, {
    onSpin: () => play(maximizeSound),
  })
  const [recording, setRecording] = useState(false)
  const [, setDismissals] = useState(0)

  // A press knocks the device and it rocks back to rest: starting tips its
  // top away, like a button pushed in, and stopping gives it a little twist.
  // Thrown from where it rests, with the knock as the spring's speed, so it
  // settles on the face it shows even if it was still turning.
  const nudge = (starting: boolean) => {
    if (reduceMotion) return
    const knock = { type: "spring", stiffness: 380, damping: 11 } as const
    const nearest = (value: number) => Math.round(value / 180) * 180
    if (starting) {
      animate(rx, nearest(rx.get()), { ...knock, velocity: -140 })
    } else {
      animate(ry, nearest(ry.get()), { ...knock, velocity: 160 })
    }
  }

  // Decoded ahead, so the first press sounds at once.
  useEffect(() => {
    for (const sound of [
      dropSound,
      click8bitSound,
      maximizeSound,
      cardSlideSound,
    ]) {
      decodeAudioData(soundSource(sound)).catch(() => {})
    }
  }, [])

  return (
    <div
      className={cn(
        "not-prose @container flex w-full flex-col items-center gap-6 px-4 pt-14 pb-2",
        SIZE,
        SMALL,
        className
      )}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
          event.preventDefault()
          flip(event.key === "ArrowRight" ? 1 : -1)
        }
      }}
    >
      <VoiceMemo
        title="Voice memo"
        recording={recording}
        onRecordingChange={(next) => {
          setRecording(next)
          play(next ? dropSound : click8bitSound)
          nudge(next)
        }}
        onCopy={() => toast.success("Transcript copied")}
        onDismiss={() => play(cardSlideSound)}
        // The device only glides when it re-renders, and closing the
        // transcript re-renders nothing here; this does, in the same render
        // that removes it.
        onDismissed={() => setDismissals((count) => count + 1)}
        side="bottom"
        // Device first, then the transcript: a column when narrow, and from
        // @xl a row run right to left, so the transcript opens on the left.
        className="flex w-full flex-col items-center gap-[calc(var(--w)*0.22)] @xl:flex-row-reverse @xl:justify-center @xl:gap-12"
        panelClassName={cn(
          "relative top-auto left-auto w-80 max-w-full origin-top before:left-1/2 before:-translate-x-1/2",
          // Beside the device, its notch points right, back at it.
          "@xl:origin-right @xl:before:top-1/2 @xl:before:right-[-7px] @xl:before:left-auto @xl:before:translate-x-0 @xl:before:-translate-y-1/2 @xl:before:border-t @xl:before:border-r @xl:before:border-b-0 @xl:before:border-l-0 @xl:starting:translate-x-2 @xl:starting:translate-y-0",
          // Leaving, it slips back toward the device: up when it sits below,
          // right when it sits beside.
          "data-closing:-translate-y-2 motion-reduce:data-closing:translate-0 @xl:data-closing:translate-x-2 @xl:data-closing:translate-y-0"
        )}
        device={
          // `layout` glides the device to wherever the row puts it, so it
          // slides right as the transcript opens and back when it closes.
          <motion.span
            layout={!reduceMotion}
            // Eases out of rest and into place, so it never lurches.
            transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
            className="relative block aspect-[85/55] w-(--w) cursor-grab touch-none [perspective:1400px] active:cursor-grabbing"
            {...handlers}
          >
            <Shadow ry={ry} />
            <motion.span
              className="block size-full"
              animate={!reduceMotion ? { y: [0, -6, 0] } : undefined}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <Body
                rx={rx}
                ry={ry}
                rest={STRAIGHT}
                axis={axis}
                recording={recording}
              />
            </motion.span>
          </motion.span>
        }
      />

      <div className="mt-[calc(var(--w)*0.16)] flex items-center gap-3 text-sm text-muted-foreground">
        <span className="hidden sm:inline">
          {recording ? "Press again to stop" : "Press to record, drag to turn"}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => flip()}
          aria-label={back ? "Flip to the front" : "Flip to the back"}
        >
          <RotateCwIcon data-icon="inline-start" />
          Flip
        </Button>
        {stageHref ? (
          <Link
            href={stageHref}
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            <Maximize2Icon data-icon="inline-start" />
            Full view
          </Link>
        ) : null}
        <span role="status" className="sr-only">
          {back ? "Showing the back" : "Showing the front"}
        </span>
      </div>
    </div>
  )
}

// On the project page, with a way to the larger, bare page of its own.
export function VoiceMemoProjectHero() {
  return <VoiceMemoHero stageHref="/voice-memo" />
}
