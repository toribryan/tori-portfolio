"use client"

import { useEffect, useRef, useState, useSyncExternalStore } from "react"
import { ArrowRightIcon } from "lucide-react"
import { useInView, useReducedMotion } from "motion/react"
import { useTheme } from "next-themes"

import { cn } from "@/lib/utils"
import { TokenFlow, type TokenRow } from "@/components/fibo/token-flow"
import { ScaledStage } from "@/features/portfolio/components/components/covers"

function subscribeToNothing() {
  return () => {}
}

const OVERHAUL_ROW: TokenRow = {
  base: "#218358",
  primitive: "green-700",
  semantic: "text-success",
  dark: { base: "#3DD68C", primitive: "green-400" },
}

/**
 * The overhaul in one colour: the legacy system's single-tier token beside
 * the same colour as a raw value, a primitive and a semantic role, stacked
 * top to bottom. The cover follows the site's theme and switches wholesale
 * to the other one, its chain scrambling into the other values, while the
 * card is hovered or focused, or on a loop with `loop`. The legacy token has
 * no second theme to change to, so it stays put.
 */
export function DesignSystemOverhaulCover({
  loop = false,
}: {
  loop?: boolean
}) {
  const frame = useRef<HTMLDivElement>(null)
  const [engaged, setEngaged] = useState(false)
  const [flipped, setFlipped] = useState(false)
  const inView = useInView(frame, { amount: 0.5 })
  const reduceMotion = useReducedMotion()
  const { resolvedTheme } = useTheme()
  // The server can't know the theme, so the class waits for the client.
  const mounted = useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false
  )
  const site = resolvedTheme === "dark" ? "dark" : "light"
  const other = site === "dark" ? "light" : "dark"
  const switched = loop ? flipped : engaged

  // Alternates between the two themes while the cover is on screen.
  useEffect(() => {
    if (!loop || !inView || reduceMotion) return
    const timer = setInterval(() => setFlipped((value) => !value), 3200)
    return () => clearInterval(timer)
  }, [loop, inView, reduceMotion])

  // The cover is inert, so it listens on the card or hero around it.
  useEffect(() => {
    const card = frame.current?.closest("[data-cover-host]")
    if (!card || loop) return
    const on = () => setEngaged(true)
    const off = () => setEngaged(false)
    card.addEventListener("pointerenter", on)
    card.addEventListener("pointerleave", off)
    card.addEventListener("focusin", on)
    card.addEventListener("focusout", off)
    return () => {
      card.removeEventListener("pointerenter", on)
      card.removeEventListener("pointerleave", off)
      card.removeEventListener("focusin", on)
      card.removeEventListener("focusout", off)
    }
  }, [loop])

  return (
    // The theme's class scopes its tokens to the cover, so the plate, chips
    // and labels switch along with the chain's values.
    <div
      ref={frame}
      className={cn(
        "absolute inset-0 bg-[color-mix(in_oklab,var(--muted)_60%,var(--background))] text-foreground transition-colors duration-500 motion-reduce:transition-none [&_*]:transition-[color,background-color,border-color] [&_*]:duration-500 motion-reduce:[&_*]:transition-none",
        mounted && (switched ? other : site)
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle, var(--foreground) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
        aria-hidden
      />
      <ScaledStage width={440}>
        <div className="flex h-full items-center justify-center gap-6">
          <div className="flex flex-col items-center gap-3">
            <p className="font-mono text-[10px] tracking-wide text-muted-foreground uppercase">
              Before
            </p>
            <span className="inline-flex h-6 items-center gap-1.5 rounded-full border border-border bg-card pr-2 pl-1.5 font-mono text-xs whitespace-nowrap text-card-foreground">
              <span
                className="size-2.5 shrink-0 rounded-full ring-1 ring-border"
                style={{ background: OVERHAUL_ROW.base }}
              />
              green/apple
            </span>
          </div>

          <ArrowRightIcon
            className="mt-6 size-4 shrink-0 text-muted-foreground"
            aria-hidden
          />

          <div className="flex gap-3">
            {/* One label per chip: chips and wires are both h-6, spaced 6px
                apart. The hidden heading keeps them level with the chain. */}
            <div
              className="flex flex-col items-end gap-3 font-mono tracking-wide text-muted-foreground uppercase"
              aria-hidden
            >
              <p className="invisible text-[10px]">After</p>
              <div className="flex flex-col items-end gap-9 text-[9px]">
                {["Base", "Primitive", "Semantic"].map((tier) => (
                  <span key={tier} className="flex h-6 items-center">
                    {tier}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-center gap-3">
              <p className="font-mono text-[10px] tracking-wide text-muted-foreground uppercase">
                After
              </p>
              <TokenFlow
                rows={[OVERHAUL_ROW]}
                orientation="vertical"
                theme={switched ? other : undefined}
                className="rounded-none border-0 bg-transparent px-0 py-0 [&>div:first-child]:hidden"
              />
            </div>
          </div>
        </div>
      </ScaledStage>
    </div>
  )
}
