export type NichePart = {
  /** The part's file name in fibo; its doc page and registry item are keyed on it. */
  name: string
  title: string
  description: string
  /** fibo's shelf: playful, specific special parts, or standard base ones. */
  shelf: "special" | "base"
  /** `false` keeps the part off the home page; it still has a card on /components. */
  home?: boolean
}

/**
 * The fibo parts this site shows, as fibo's components.meta.json names them:
 * its special components, and the base ones worth a page of their own. Each
 * is installed from fibo.toribryan.com/r into `src/components/fibo/` and has
 * a doc page at `/components/<name>`. Parts for real product work come first,
 * then the playful ones, and the cards keep this order.
 */
export const NICHE_PARTS: NichePart[] = [
  {
    name: "data-table",
    title: "Data table",
    shelf: "base",
    description:
      "A table for lists people work through: selection, bulk actions, locked rows, pinned columns and a phone layout.",
  },
  {
    name: "filter-menu",
    title: "Filter menu",
    shelf: "special",
    description:
      "A filter menu of fields and values that turns into a search as you type.",
  },
  {
    name: "chapter-scrubber",
    title: "Chapter scrubber",
    shelf: "special",
    description:
      "A rail of marks that swell under the pointer like the Dock, previewing the chapter at the crest.",
  },
  {
    name: "floating-nav",
    title: "Floating nav",
    shelf: "special",
    description:
      "A pill of destinations that floats above the bottom of a phone screen and steps aside while you scroll.",
  },
  {
    name: "reactions",
    title: "Reactions",
    shelf: "special",
    description: "Lets people respond to content with an emoji in one tap.",
    home: false,
  },
  {
    name: "sticker-avatar",
    title: "Sticker avatar",
    shelf: "special",
    description:
      "An avatar cut out like a die-cut sticker, with a paper edge that follows its shape and a status told by shape.",
  },
  {
    name: "pixel-snail",
    title: "Pixel snail",
    shelf: "special",
    description:
      "A one-color pixel snail that crawls on a loop while something loads.",
    home: false,
  },
  {
    name: "integration-visual",
    title: "Integration visual",
    shelf: "special",
    description:
      "A hub and the tools wired into it, with pulses along the routes.",
  },
  {
    name: "command-menu",
    title: "Command menu",
    shelf: "special",
    description:
      "A Cmd+K palette with nested pages, recent commands, ranked search and a preview pane.",
  },
  {
    name: "token-flow",
    title: "Token flow",
    shelf: "special",
    description:
      "Walks a color token from raw value to primitive to semantic role.",
    home: false,
  },
]

export function nicheStorybookUrl(name: string) {
  const shelf = NICHE_PARTS.find((part) => part.name === name)?.shelf
  const tier = shelf === "base" ? "base-components" : "special-components"
  return `https://fibo.toribryan.com/?path=/docs/${tier}-${name}--docs`
}
