import type { Recommendation } from "@/features/portfolio/types/recommendations"

/**
 * Excerpts from the recommendations on LinkedIn, pinned to the hero canvas as
 * comments. Quotes are verbatim; trim, don't reword.
 */
export const RECOMMENDATIONS: Recommendation[] = [
  {
    name: "Jeff Beene",
    role: "Creative Dev",
    date: "2026-09",
    quote:
      "Tori is one of those people who makes a team noticeably better just by being a part of it.",
  },
  {
    name: "Filip Erak",
    role: "Software Developer",
    date: "2026-09",
    quote:
      "What stood out most was how well she understood the way developers think and work.",
  },
  {
    name: "Justin Savage",
    role: "Software Engineer",
    date: "2026-09",
    quote:
      "She vastly improved our design system and frequently collaborated with my team to make the process more effective.",
  },
  {
    name: "Jackson McCaslin",
    role: "Frontend Developer",
    date: "2023-09",
    quote:
      "She is one of the few designers I’ve met who has taken up the challenge of learning to code so she can understand the engine that will power her work and design for it even better.",
  },
  {
    name: "Caroline Hoffman",
    role: "Marketing & Event Management",
    date: "2023-05",
    quote:
      "Her motivating energy is one of my favorite parts of coming to work!",
  },
  {
    name: "Jerize Bravo",
    role: "Digital Designer",
    date: "2023-03",
    quote:
      "Her ideas are creative, and her execution is beautiful and thinking outside the box is her speciality.",
  },
]

/** The anchor for a recommendation on the recommendations page. */
export function recommendationId(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-")
}
