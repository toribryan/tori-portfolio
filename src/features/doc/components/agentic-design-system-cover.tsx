import { SpriteCover } from "./sprite-cover"

/** The box with a question mark over it, and the mark hops. */
export function AgenticDesignSystemCover({ loop = false }: { loop?: boolean }) {
  return (
    <SpriteCover
      art={{ width: 2106, height: 1106 }}
      base={{
        light: "/cover-agenticds-base.webp",
        dark: "/cover-agenticds-base-dark.webp",
      }}
      sprite={{
        light: "/cover-agenticds-mark.webp",
        dark: "/cover-agenticds-mark-dark.webp",
        box: [950, 20, 270, 412],
        cell: 10,
      }}
      loop={loop}
    />
  )
}
