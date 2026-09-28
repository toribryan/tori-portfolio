export type Recommendation = {
  name: string
  role: string
  /** Month given, as `YYYY-MM`. */
  date: string
  /** A verbatim excerpt from the full recommendation on LinkedIn. */
  quote: string
}
