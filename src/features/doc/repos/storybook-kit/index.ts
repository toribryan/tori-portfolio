/**
 * The storybook-kit documents the case study's viewer shows: copies of the
 * files in github.com/toribryan/storybook-kit, kept with the site so the page
 * builds without fetching them. Refresh them when those files change.
 */
export const STORYBOOK_KIT = {
  name: "storybook-kit",
  dir: "src/features/doc/repos/storybook-kit",
  open: "README.md",
  readable: [
    "README.md",
    "docs/getting-started.md",
    "plans/001-brief.md",
    "LICENSE",
  ],
}
