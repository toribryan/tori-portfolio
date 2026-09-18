/**
 * Every outbound destination the deck offers, in one place, so a reviewer
 * can be handed a link mid-conversation without anyone hunting for it.
 */
export const REVIEW_LINKS = {
  portfolio: "https://www.toribryan.com",
  resume: "/resume.pdf",
  authorProof: {
    caseStudy: "/work/author-proof",
    product: "https://proctorio.com/solutions/origin",
  },
  modernCareHomes: {
    caseStudy: "/work/modern-care-homes",
    live: "https://www.moderncarehomes.com/",
    storybook: "https://design.moderncarehomes.com",
  },
  integrityConsole: {
    caseStudy: "/work/bab-design-system",
    storybook: "/storybook/bab/index.html",
  },
  /** The token visualiser from the foundations slide, published as a component. */
  tokenFlow: "https://21st.dev/@iamtoribryan/components/token-flow",
  designSystemOverhaul: "/work/design-system-overhaul",
  agenticDesignSystem: "/work/agentic-design-system",
} as const
