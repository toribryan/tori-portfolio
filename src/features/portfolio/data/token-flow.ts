import type { TokenRow } from "@/components/ui/token-flow"

/** The site's own colour tokens, one row per tier walk, as the token flow draws them. */
export const TOKEN_ROWS: TokenRow[] = [
  {
    base: "oklch(0.141 0.005 285.823)",
    primitive: "zinc-950",
    semantic: "bg-primary",
    use: "Primary actions, headings",
    dark: { base: "oklch(0.985 0 0)", primitive: "zinc-50" },
  },
  {
    base: "oklch(0.723 0.219 149.579)",
    primitive: "green-500",
    semantic: "text-success",
    use: "Resolved, healthy, within threshold",
  },
  {
    base: "oklch(0.92 0.004 286.32)",
    primitive: "zinc-200",
    semantic: "border-border",
    use: "Hairlines and inputs",
    dark: { base: "oklch(0.274 0.006 286.033)", primitive: "zinc-800" },
  },
]
