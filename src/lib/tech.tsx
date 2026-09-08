import {
  ClaudeIcon,
  CursorIcon,
  FigmaIcon,
  FramerIcon,
  GitHubIcon,
  LoomIcon,
  NextJsIcon,
  NotionIcon,
  ObsidianIcon,
  PostHogIcon,
  ReactIcon,
  ShadcnIcon,
  StorybookIcon,
  TailwindCssIcon,
  TsIcon,
  VercelIcon,
  WebflowIcon,
  WebStormIcon,
} from "@/components/icons"

export type TechEntry = {
  title: string
  href: string
  /** Omit for a tool we have no brand mark for. The badge renders text only. */
  icon?: React.ReactElement
}

/**
 * A brand mark that ships as an SVG file under /public rather than as an icon
 * component.
 *
 * Drawn as a CSS mask instead of an `<img>` so the shape takes its color from
 * the badge like every other mark. An `<img>` paints its own colors and can't
 * be tinted, which is what used to leave half the Stack panel in full brand
 * color and the other half muted.
 *
 * Only for marks with no monochrome glyph in `@/components/icons`. A file that
 * draws its logo as a colored tile with the glyph knocked out of it masks into
 * a solid blob, so those live in `icons.tsx` as single-path components.
 *
 * Size and color come from `TechBadge` by way of the `data-mark` attribute,
 * the same way it sizes and tints an `<svg>` child.
 */
function BrandMark({ src }: { src: string }) {
  return (
    <span
      data-mark
      aria-hidden
      className="block bg-current [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain]"
      style={{ maskImage: `url(${src})`, WebkitMaskImage: `url(${src})` }}
    />
  )
}

/**
 * Every tool that can appear as a badge, keyed by slug.
 *
 * One catalog, two consumers: the home page Stack panel picks from it by key
 * (`features/portfolio/data/tech-stack.tsx` says which keys and under which
 * categories) and MDX reaches it through `<Tech name="…" />`. A tool added
 * here is immediately available to both, and being listed here does not put it
 * on the home page. Only the Stack data file decides that.
 */
export const TECH = {
  figma: {
    title: "Figma",
    href: "https://figma.com",
    icon: <FigmaIcon />,
  },
  adobe: {
    title: "Adobe",
    href: "https://adobe.com",
    icon: <BrandMark src="/Adobe.svg" />,
  },
  framer: {
    title: "Framer",
    href: "https://framer.com",
    icon: <FramerIcon />,
  },
  webflow: {
    title: "Webflow",
    href: "https://webflow.com",
    icon: <WebflowIcon />,
  },
  "claude-code": {
    title: "Claude Code",
    href: "https://claude.com/claude-code",
    icon: <ClaudeIcon />,
  },
  cursor: {
    title: "Cursor",
    href: "https://cursor.com",
    icon: <CursorIcon />,
  },
  nextjs: {
    title: "Next.js",
    href: "https://nextjs.org",
    icon: <NextJsIcon />,
  },
  react: {
    title: "React",
    href: "https://react.dev",
    icon: <ReactIcon />,
  },
  typescript: {
    title: "TypeScript",
    href: "https://www.typescriptlang.org",
    icon: <TsIcon />,
  },
  tailwindcss: {
    title: "Tailwind CSS",
    href: "https://tailwindcss.com",
    icon: <TailwindCssIcon />,
  },
  "shadcn-ui": {
    title: "shadcn/ui",
    href: "https://ui.shadcn.com",
    icon: <ShadcnIcon />,
  },
  storybook: {
    title: "Storybook",
    href: "https://storybook.js.org",
    icon: <StorybookIcon />,
  },
  vercel: {
    title: "Vercel",
    href: "https://vercel.com",
    icon: <VercelIcon />,
  },
  mobbin: {
    title: "Mobbin",
    href: "https://mobbin.com",
  },
  usertesting: {
    title: "UserTesting",
    href: "https://www.usertesting.com",
    icon: <BrandMark src="/UserTesting.svg" />,
  },
  loom: {
    title: "Loom",
    href: "https://loom.com",
    icon: <LoomIcon />,
  },
  posthog: {
    title: "PostHog",
    href: "https://posthog.com",
    icon: <PostHogIcon />,
  },
  github: {
    title: "GitHub",
    href: "https://github.com",
    icon: <GitHubIcon />,
  },
  webstorm: {
    title: "WebStorm",
    href: "https://www.jetbrains.com/webstorm",
    icon: <WebStormIcon />,
  },
  vscode: {
    title: "VS Code",
    href: "https://code.visualstudio.com",
    icon: <BrandMark src="/vscode.svg" />,
  },
  notion: {
    title: "Notion",
    href: "https://notion.com",
    icon: <NotionIcon />,
  },
  obsidian: {
    title: "Obsidian",
    href: "https://obsidian.md",
    icon: <ObsidianIcon />,
  },
} satisfies Record<string, TechEntry>

export type TechKey = keyof typeof TECH

/**
 * Read one entry from the catalog.
 *
 * Go through this rather than indexing `TECH` directly. `satisfies` keeps each
 * entry's literal type so `TechKey` stays a union of real keys, but it also
 * means an entry with no `icon` makes `icon` absent from the union, and
 * `TECH[key].icon` stops type-checking. Widening to `TechEntry` here gives
 * callers the optional property back without giving up the key inference.
 */
export function getTech(key: TechKey): TechEntry {
  return TECH[key]
}
