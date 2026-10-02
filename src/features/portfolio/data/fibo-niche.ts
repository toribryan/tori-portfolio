export type NichePart = {
  /** The part's file name in fibo; its doc page and registry item are keyed on it. */
  name: string
  title: string
  description: string
  /** fibo's shelf: playful, specific special parts, or standard base ones. */
  shelf: "special" | "base"
  /** `false` keeps the part off the home page; it still has a card on /components. */
  home?: boolean
  /** The part's page in fibo's Figma library, as a node id. Left out until it has one. */
  figma?: string
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
    figma: "230-2",
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
    figma: "371-4",
    title: "Chapter scrubber",
    shelf: "special",
    description:
      "A rail of marks that swell under the pointer like the Dock, previewing the chapter at the crest.",
  },
  {
    name: "floating-nav",
    figma: "601-74",
    title: "Floating nav",
    shelf: "special",
    description:
      "A pill of destinations that floats above the bottom of a phone screen and steps aside while you scroll.",
  },
  {
    name: "typing-indicator",
    figma: "567-9878",
    title: "Typing indicator",
    shelf: "base",
    description:
      "Says who's typing in a conversation, naming up to three people.",
    home: false,
  },
  {
    name: "map-pin",
    figma: "601-75",
    title: "Map pin",
    shelf: "special",
    description:
      "A dot, icon or labeled pill for a point on a map, with a preview card that springs open on click or tap.",
    home: false,
  },
  {
    name: "reactions",
    figma: "169-18",
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
    name: "command-menu",
    figma: "526-6",
    title: "Command menu",
    shelf: "special",
    description:
      "A Cmd+K palette with nested pages, recent commands, ranked search and a preview pane.",
  },
  {
    name: "integration-visual",
    figma: "371-5",
    title: "Integration visual",
    shelf: "special",
    description:
      "A hub and the tools wired into it, with pulses along the routes.",
    home: false,
  },
  {
    name: "token-flow",
    figma: "371-6",
    title: "Token flow",
    shelf: "special",
    description:
      "Walks a color token from raw value to primitive to semantic role.",
    home: false,
  },
]

const FIGMA_LIBRARY =
  "https://www.figma.com/design/LJZ5Tt4Ba7NPPi8Xnq8i0e/Fibo-DS"

export function nicheFigmaUrl(name: string) {
  const node = NICHE_PARTS.find((part) => part.name === name)?.figma
  return node ? `${FIGMA_LIBRARY}?node-id=${node}` : undefined
}

export function nicheStorybookUrl(name: string) {
  const shelf = NICHE_PARTS.find((part) => part.name === name)?.shelf
  const tier = shelf === "base" ? "base-components" : "special-components"
  return `https://fibo.toribryan.com/?path=/docs/${tier}-${name}--docs`
}
