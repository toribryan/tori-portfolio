export type NichePart = {
  /** The part's file name in fibo; its doc page and registry item are keyed on it. */
  name: string
  title: string
  description: string
  /** `false` keeps the part off the home page; it still has a card on /components. */
  home?: boolean
}

/**
 * fibo's special components, as its components.meta.json names them. Each is
 * installed from fibo.toribryan.com/r into `src/components/fibo/` and has a
 * doc page at `/components/<name>`. Parts for real product work come first,
 * then the playful ones, and the cards keep this order.
 */
export const NICHE_PARTS: NichePart[] = [
  {
    name: "filter-menu",
    title: "Filter menu",
    description:
      "A filter menu of fields and values that turns into a search as you type.",
  },
  {
    name: "chapter-scrubber",
    title: "Chapter scrubber",
    description:
      "A rail of marks that swell under the pointer like the Dock, previewing the chapter at the crest.",
  },
  {
    name: "reactions",
    title: "Reactions",
    description: "Lets people respond to content with an emoji in one tap.",
  },
  {
    name: "pixel-snail",
    title: "Pixel snail",
    description:
      "A one-color pixel snail that crawls on a loop while something loads.",
  },
  {
    name: "integration-visual",
    title: "Integration visual",
    description:
      "A hub and the tools wired into it, with pulses along the routes.",
  },
  {
    name: "command-menu",
    title: "Command menu",
    description:
      "A Cmd+K palette with nested pages, recent commands, ranked search and a preview pane.",
  },
  {
    name: "token-flow",
    title: "Token flow",
    description:
      "Walks a color token from raw value to primitive to semantic role.",
    home: false,
  },
]

export function nicheStorybookUrl(name: string) {
  return `https://fibo.toribryan.com/?path=/docs/special-components-${name}--docs`
}
