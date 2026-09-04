import type { User } from "@/features/portfolio/types/user"

export const USER: User = {
  firstName: "Tori",
  lastName: "Bryan",
  displayName: "Tori Bryan",
  username: "toribryan",
  // Pronouns aren't stated anywhere in the source repo, so this is left unset
  // rather than guessed. Add it here and it will flow into the profile header
  // and the JSON-LD Person node.
  // pronouns: "",
  // Feeds the site meta description (see config/site.ts), so it needs to read
  // as a description of the work. The personal line lives in flipSentences.
  bio: "Product Designer specializing in design systems. Five years building products, component libraries, and the tooling that connects design to production code.",
  flipSentences: [
    "questioning everything, all the time.",
    "designing systems + shipping them",
  ],
  address: "Arizona, United States",
  emailB64: "dG9yaWJyeWFuLmRlc2lnbkBnbWFpbC5jb20=", // toribryan.design@gmail.com
  website: "https://toribryan.com",
  jobTitle: "Design Engineer",
  /** Shown in the Overview; broader than the job title under the name. */
  discipline: "Product + Design Engineering",
  jobs: [
    {
      title: "Staff Product Designer",
      company: "Proctorio",
      website: "https://proctorio.com",
      experienceId: "proctorio",
    },
  ],
  about: `- I’m a Product Designer who specializes in design systems and ships the front end I design.
- Five years building B2B products, component libraries, and the tooling that connects design to production code. 
- Always exploring new tools and ways to create. Currently learning the drums, and studying the history of the golden ratio and its relevance to design today.
`,
  avatar: "/images/about/photo-1.jpg",
  avatarVariants: {
    lightOff: "/images/about/photo-1.jpg",
    lightOn: "/images/about/photo-1.jpg",
    darkOff: "/images/about/photo-1.jpg",
    darkOn: "/images/about/photo-1.jpg",
  },
  /**
   * The 1200x630 social card, not a photo: it is what renders when the link is
   * texted or pasted into Slack. It has to stay reachable while the password
   * gate is on, so it is exempt from the matcher in `src/middleware.ts`.
   */
  ogImage: "/og-cover.png",
  keywords: [
    "tori bryan",
    "toribryan",
    "product designer",
    "staff product designer",
    "design systems",
    "edtech design",
    "proctorio",
    "design engineering",
    "designops",
  ],
  timeZone: "America/Phoenix",
  dateCreated: "2026-01-01",
}
