import type { AvatarLightsVariants } from "@/features/portfolio/components/avatar-lights"

export type User = {
  firstName: string
  lastName: string
  /** Preferred public-facing name */
  displayName: string
  /** Handle/username used in links or mentions */
  username: string
  gender?: "male" | "female" | "non-binary"
  /** e.g. "he/him", "she/her", "they/them". Optional — omitted when unset. */
  pronouns?: string
  bio: string
  /** Lines shown under the name in the profile header, one per row */
  headerLines: string[]
  /** General location for display */
  address: string
  /** base64 encoded (https://t.io.vn/base64-string-converter) */
  emailB64: string
  /** Personal/homepage URL */
  website: string
  /** Primary/current role shown on profile */
  jobTitle: string
  /** The role shown under the name in the hero, e.g. "Product Designer". */
  discipline: string
  /** Shown in the overview, e.g. "Open to work". Omit to hide it. */
  availability?: string
  /** Work history entries */
  jobs: {
    title: string
    company: string
    website: string
    experienceId?: string
  }[]
  /** Rich about section; supports Markdown */
  about: string
  /** Public URL to avatar image */
  avatar: string
  /** The pixel avatar in the site header, reused wherever the site speaks as its owner. */
  headerAvatar: string
  /** The headshot on the home page profile: a dithered portrait with flickering cells. */
  headshot: string
  /** The same portrait without the flicker, for reduced motion. */
  headshotStill: string
  /** The same portrait on a flat square, for the hero's grid cell. */
  portrait: string
  /** Different avatar variants based on theme and lighting */
  avatarVariants: AvatarLightsVariants
  /** Open Graph image URL for social sharing */
  ogImage: string
  /** SEO keywords list for metadata */
  keywords: string[]
  /** Time zone in IANA format (e.g., "Asia/Ho_Chi_Minh") */
  timeZone: string
  /** Profile/site start date in YYYY-MM-DD */
  dateCreated: string
}
