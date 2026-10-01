import type { TokenRow } from "@/components/fibo/token-flow"

// fibo's own tokens, as globals.css resolves them in each theme.
export const ROWS: TokenRow[] = [
  {
    base: "oklch(0.205 0 0)",
    primitive: "neutral-900",
    semantic: "bg-primary",
    use: "Primary actions, headings",
    dark: { base: "oklch(0.985 0 0)", primitive: "neutral-50" },
  },
  {
    base: "oklch(0.505 0.213 27.518)",
    primitive: "red-700",
    semantic: "text-destructive",
    use: "Errors and irreversible actions",
    dark: { base: "oklch(0.704 0.191 22.216)", primitive: "red-400" },
  },
  {
    base: "oklch(0.922 0 0)",
    primitive: "neutral-200",
    semantic: "border-border",
    use: "Hairlines and inputs",
    dark: { base: "oklch(1 0 0 / 10%)", primitive: "white / 10%" },
  },
]

export const [PRIMARY, DESTRUCTIVE, BORDER] = ROWS as [
  TokenRow,
  TokenRow,
  TokenRow,
]

// Palette steps charted as if each step were a role, for the don't.
export const RAMP: TokenRow[] = [
  ["oklch(0.922 0 0)", "neutral-200"],
  ["oklch(0.205 0 0)", "neutral-900"],
].map(([base, primitive]) => ({
  base: base!,
  primitive: primitive!,
  semantic: `bg-${primitive}`,
}))
