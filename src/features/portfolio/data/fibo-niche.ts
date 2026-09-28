export type NichePart = {
  /** The part's file name in fibo; its doc page and registry item are keyed on it. */
  name: string
  title: string
  description: string
  /** `use` for parts built for real product work, `fun` for the playful ones. */
  row: "use" | "fun"
}

/**
 * fibo's special components, as its components.meta.json names them. Each is
 * installed from fibo.toribryan.com/r into `src/components/fibo/` and has a
 * doc page at `/components/<name>`.
 */
export const NICHE_PARTS: NichePart[] = [
  {
    name: "filter-menu",
    title: "Filter menu",
    description:
      "A filter menu of fields and values that turns into a search as you type.",
    row: "use",
  },
  {
    name: "chapter-scrubber",
    title: "Chapter scrubber",
    description:
      "A rail of marks that swell under the pointer like the Dock, previewing the chapter at the crest.",
    row: "use",
  },
  {
    name: "reactions",
    title: "Reactions",
    description: "Lets people respond to content with an emoji in one tap.",
    row: "use",
  },
  {
    name: "pixel-snail",
    title: "Pixel snail",
    description:
      "A one-colour pixel snail that crawls on a loop while something loads.",
    row: "fun",
  },
  {
    name: "integration-visual",
    title: "Integration visual",
    description:
      "A hub and the tools wired into it, with pulses along the routes.",
    row: "fun",
  },
  {
    name: "token-flow",
    title: "Token flow",
    description:
      "Walks a colour token from raw value to primitive to semantic role.",
    row: "fun",
  },
]

export const NICHE_ROWS = [
  { row: "use", label: "In use" },
  { row: "fun", label: "For fun" },
] as const

export function nicheStorybookUrl(name: string) {
  return `https://fibo.toribryan.com/?path=/docs/niche-${name}--docs`
}
