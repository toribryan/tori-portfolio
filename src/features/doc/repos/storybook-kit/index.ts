/**
 * The storybook-kit repo as the case study's viewer shows it: every file in
 * the repo, less its lockfile and dependencies, and copies of the three
 * documents it can open. The repo isn't public yet, so the copies stand in;
 * refresh them from ~/Developer/storybook-kit when those files change.
 */
export const STORYBOOK_KIT = {
  name: "storybook-kit",
  dir: "src/features/doc/repos/storybook-kit",
  open: "README.md",
  readable: ["README.md", "docs/getting-started.md", "plans/001-brief.md"],
  files: [
    "AGENTS.md",
    "CLAUDE.md",
    "README.md",
    "docs/getting-started.md",
    "plans/001-brief.md",
    "plans/README.md",
    "template/.storybook/main.ts",
    "template/.storybook/manager-head.html",
    "template/.storybook/manager.tsx",
    "template/.storybook/preview.tsx",
    "template/.storybook/theme-sync.ts",
    "template/.storybook/theme.ts",
    "template/brand.config.ts",
    "template/package.json",
    "template/public/favicon.svg",
    "template/src/components/button.mdx",
    "template/src/components/button.stories.tsx",
    "template/src/components/button.tsx",
    "template/src/docs/blocks/anatomy.tsx",
    "template/src/docs/blocks/color-tokens.tsx",
    "template/src/docs/blocks/data-attributes.tsx",
    "template/src/docs/blocks/doc-link.tsx",
    "template/src/docs/blocks/docs-container.tsx",
    "template/src/docs/blocks/figma-icon.tsx",
    "template/src/docs/blocks/guidelines.tsx",
    "template/src/docs/blocks/page-cards.tsx",
    "template/src/docs/blocks/typography.tsx",
    "template/src/docs/docs.css",
    "template/src/foundations/colors.mdx",
    "template/src/foundations/typography.stories.tsx",
    "template/src/lib/utils.ts",
    "template/src/pages/welcome.mdx",
    "template/src/styles/globals.css",
    "template/tsconfig.json",
    "template/vite.config.ts",
  ],
}
