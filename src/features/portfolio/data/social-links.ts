import type { SocialProfile } from "@/features/portfolio/types/social-links"

/**
 * Keyed registry of social profiles — the single source of truth. Icons are
 * bound separately in `social-link-icons.tsx` (keyed by the same `SocialName`),
 * so adding a profile here forces the icon map to stay in sync at compile time.
 *
 * Only LinkedIn carried over from the Astro site — it was the sole social
 * profile linked anywhere in it. Add more here and bind an icon in
 * `social-link-icons.tsx`.
 */
export const SOCIAL = {
  linkedin: {
    title: "LinkedIn",
    handle: "victorialbryan",
    href: "https://linkedin.com/in/victorialbryan/",
    sameAs: true,
  },
  x: {
    title: "X",
    handle: "iamtoribryan",
    href: "https://x.com/iamtoribryan",
    sameAs: true,
  },
  github: {
    title: "GitHub",
    handle: "toribryan",
    href: "https://github.com/toribryan",
    sameAs: true,
  },
  twentyFirstDev: {
    title: "21st.dev",
    handle: "iamtoribryan",
    href: "https://iamtoribryan.21st.dev",
    sameAs: true,
  },
} satisfies Record<string, SocialProfile>

export type SocialName = keyof typeof SOCIAL

export type SocialLink = SocialProfile & { name: SocialName }

export const SOCIAL_LINKS: SocialLink[] = (
  Object.entries(SOCIAL) as [SocialName, SocialProfile][]
).map(([name, profile]) => ({ name, ...profile }))
