/**
 * Tori Bryan's mark — a pixel-art avatar, supplied as `pixel-avatar.svg`.
 *
 * This replaces the template author's mark, which his TRADEMARK.md excludes
 * from the MIT grant.
 *
 * The source file painted every path a fixed `#3D3D3A`, which all but
 * disappears against the dark theme. Fills are `currentColor` here instead, so
 * the mark takes its color from context — `text-foreground` in the header,
 * `text-background` over the hero photo.
 *
 * Drawn on a 128-unit grid. Rendered sizes that are clean fractions of that
 * (32px in the header, 96px over the photo) keep the pixel edges sharp.
 */

type MarkPath = {
  d: string
  /** The body path is a single shape with cut-outs; it needs even-odd fill. */
  evenOdd?: boolean
}

const MARK_PATHS: MarkPath[] = [
  { d: "M89 98H69V92H89V98Z" },
  { d: "M69 92H64V87H69V92Z" },
  { d: "M94 92H89V87H94V92Z" },
  {
    d: "M95 21H102V27H107V15H113V41H119V47H113V78H119V84H114V124H123V131H7V122H13V86H7V79H1V54H7V77H16V83H31V77H37V46H13V54H7V46H13V40H20V21H26V40H32V27H38V21H46V15H95V21ZM49 118H63V124H90V111H49V118ZM46 74V104H101V99H106V83H85V77H76V83H49V74H46ZM55 77H64V71H70V63H55V77ZM91 77H99V71H106V63H91V77ZM51 46H46V68H49V57H76V72H85V57H106V46H101V40H82V46H76V51H64V45H76V40H51V46Z",
    evenOdd: true,
  },
  { d: "M125 78H119V47H125V78Z" },
  { d: "M19 72H13V60H19V72Z" },
  { d: "M25 60H19V54H25V60Z" },
  { d: "M34 21H26V15H34V21Z" },
  { d: "M40 15H34V9H40V15Z" },
  { d: "M107 15H101V9H107V15Z" },
  { d: "M101 9H40V3H101V9Z" },
]

export function BrandMark(props: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 128 128"
      aria-hidden
      {...props}
    >
      {MARK_PATHS.map(({ d, evenOdd }) => (
        <path
          key={d}
          fill="currentColor"
          fillRule={evenOdd ? "evenodd" : undefined}
          clipRule={evenOdd ? "evenodd" : undefined}
          d={d}
        />
      ))}
    </svg>
  )
}

export function getMarkSVG() {
  const paths = MARK_PATHS.map(({ d, evenOdd }) =>
    evenOdd
      ? `<path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="${d}"/>`
      : `<path fill="currentColor" d="${d}"/>`
  )

  return `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 128 128">${paths.join("")}</svg>`
}
