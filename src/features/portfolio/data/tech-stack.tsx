import type { TechStack } from "../types/tech-stack"

/**
 * What the home page Stack panel shows, in order.
 *
 * Titles, links and icons live in the shared catalog at `@/lib/tech`; this
 * file only decides which tools appear here and under which groups. Array
 * order sets both the order of the groups and the order within each group, so
 * moving a line moves the badge.
 *
 * A tool in the catalog that isn't listed here simply doesn't appear on the
 * home page. That's how MDX case studies can badge a tool this panel doesn't
 * carry.
 */
export const TECH_STACK: TechStack[] = [
  { key: "figma", categories: ["Design"] },
  { key: "framer", categories: ["Web"] },
  { key: "adobe", categories: ["Design"] },
  { key: "webflow", categories: ["Web"] },

  { key: "claude-code", categories: ["Prototyping"] },
  { key: "cursor", categories: ["Prototyping"] },

  { key: "react", categories: ["Engineering"] },
  { key: "tailwindcss", categories: ["Engineering"] },
  { key: "shadcn-ui", categories: ["Engineering"] },
  { key: "storybook", categories: ["Engineering"] },

  { key: "usertesting", categories: ["Research"] },
  { key: "loom", categories: ["Research"] },
  { key: "posthog", categories: ["Research"] },

  { key: "github", categories: ["Workflow"] },
  { key: "webstorm", categories: ["Workflow"] },
  { key: "vscode", categories: ["Workflow"] },
  { key: "notion", categories: ["Workflow"] },
  { key: "obsidian", categories: ["Workflow"] },
]
