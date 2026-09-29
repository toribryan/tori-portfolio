"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowRightIcon } from "lucide-react"
import { useTheme } from "next-themes"

import { TokenFlow, type TokenRow } from "@/components/fibo/token-flow"
import { ScaledStage } from "@/features/portfolio/components/components/covers"

const OVERHAUL_ROW: TokenRow = {
  base: "#218358",
  primitive: "green-700",
  semantic: "action-primary",
  use: "every primary action",
  dark: { base: "#3DD68C", primitive: "green-400" },
}

/**
 * The overhaul in one colour: the legacy system's single-tier token beside
 * the same colour as a raw value, a primitive and a semantic role, stacked
 * top to bottom. The chain follows the site's theme and scrambles into the
 * other theme's values while the card is hovered or focused; the legacy
 * token has no second theme to change to, so it stays put.
 */
export function DesignSystemOverhaulCover() {
  const frame = useRef<HTMLDivElement>(null)
  const [engaged, setEngaged] = useState(false)
  const { resolvedTheme } = useTheme()
  const other = resolvedTheme === "dark" ? "light" : "dark"

  // The cover is inert, so it listens on the card around it.
  useEffect(() => {
    const card = frame.current?.closest("[data-doc-card]")
    if (!card) return
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
  }, [])

  return (
    <div ref={frame} className="absolute inset-0">
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
                showUse
                theme={engaged ? other : undefined}
                className="rounded-none border-0 bg-transparent px-0 py-0 [&>div:first-child]:hidden"
              />
            </div>
          </div>
        </div>
      </ScaledStage>
    </div>
  )
}
