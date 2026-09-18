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
  /** Short phrases rotated in UI (e.g., homepage flip effect) */
  flipSentences: string[]
  /** General location for display */
  address: string
  /** base64 encoded (https://t.io.vn/base64-string-converter) */
  emailB64: string
  /** Personal/homepage URL */
  website: string
  /** Primary/current role shown on profile */
  jobTitle: string
  /** Broader discipline shown in the Overview, e.g. "Product + Design Engineering". */
  discipline: string
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
  /** The pixel avatar in the home page header, reused wherever the site speaks as its owner. */
  headerAvatar: string
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
