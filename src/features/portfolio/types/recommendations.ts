export type Recommendation = {
  name: string
  role: string
  /** Month given, as `YYYY-MM`. */
  date: string
  /** A verbatim excerpt from the full recommendation on LinkedIn. */
  quote: string
  /** The whole recommendation, verbatim. The recommendations page shows the quote until it's in. */
  text?: string
  /** Their LinkedIn profile, linked from their name on the recommendations page. */
  profile?: string
}
