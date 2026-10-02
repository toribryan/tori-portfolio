"use client"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/base/ui/tabs"

/**
 * Full pages of a flow, one tab each. Every page links to its full-size file.
 *
 * Props are strings because expression attributes don't survive the MDX
 * pipeline (see `mdx-figure.tsx`): `labels`, `srcs` and `fulls` are
 * comma-separated and line up one to one.
 */
export function PageGallery({
  labels,
  srcs,
  fulls,
  alt,
  caption,
}: {
  labels: string
  srcs: string
  fulls?: string
  alt: string
  caption?: React.ReactNode
}) {
  const split = (value: string) => value.split(",").map((part) => part.trim())
  const names = split(labels)
  const images = split(srcs)
  const full = fulls ? split(fulls) : images

  return (
    <figure className="not-prose my-8">
      <Tabs defaultValue={names[0]}>
        <div className="overflow-x-auto">
          <TabsList>
            {names.map((name) => (
              <TabsTrigger key={name} value={name}>
                {name}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        {names.map((name, index) => (
          <TabsContent key={name} value={name}>
            <a
              href={full[index]}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <img
                className="w-full rounded-xl inset-ring-1 inset-ring-black/15 dark:inset-ring-white/15"
                src={images[index]}
                alt={`${alt}: ${name}`}
                loading="lazy"
              />
            </a>
          </TabsContent>
        ))}
      </Tabs>

      {caption && (
        <figcaption className="mt-3 text-sm text-pretty text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
