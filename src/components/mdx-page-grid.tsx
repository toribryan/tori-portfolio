"use client"

import { useState } from "react"
import { Dialog } from "@base-ui/react/dialog"
import { ChevronLeftIcon, ChevronRightIcon, XIcon } from "lucide-react"

/**
 * Full pages of a flow as a grid of thumbnails. Opening one shows it large,
 * and the viewer steps through every page with its arrows or the arrow keys.
 *
 * Props are strings because expression attributes don't survive the MDX
 * pipeline (see `mdx-figure.tsx`): `labels`, `srcs` and `fulls` are
 * comma-separated and line up one to one. `fulls` are the larger files the
 * viewer shows.
 */
export function PageGrid({
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
  const thumbs = split(srcs)
  const large = fulls ? split(fulls) : thumbs
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)
  const step = (by: number) =>
    setIndex((current) => (current + by + names.length) % names.length)

  return (
    <figure className="not-prose my-8">
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {names.map((name, i) => (
            <li key={name}>
              <Dialog.Trigger
                className="group/page flex w-full flex-col gap-1.5 text-left"
                onClick={() => setIndex(i)}
              >
                <img
                  className="aspect-[1600/1031] w-full rounded-lg object-cover object-top inset-ring-1 inset-ring-black/15 transition-opacity group-hover/page:opacity-85 dark:inset-ring-white/15"
                  src={thumbs[i]}
                  alt={`${alt}: ${name}`}
                  loading="lazy"
                />
                <span className="text-xs text-muted-foreground">
                  {i + 1} · {name}
                </span>
              </Dialog.Trigger>
            </li>
          ))}
        </ul>

        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" />
          <Dialog.Popup
            className="fixed inset-3 z-50 flex flex-col gap-3 outline-none md:inset-8"
            onKeyDown={(event) => {
              if (event.key === "ArrowRight") step(1)
              if (event.key === "ArrowLeft") step(-1)
            }}
          >
            <div className="flex items-center justify-between gap-3 text-sm text-white">
              <Dialog.Title className="font-medium">
                {names[index]}
                <span className="ml-2 font-normal text-white/60">
                  {index + 1} / {names.length}
                </span>
              </Dialog.Title>
              <Dialog.Close
                className="flex size-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
                aria-label="Close"
              >
                <XIcon className="size-4" />
              </Dialog.Close>
            </div>

            <div className="relative flex min-h-0 flex-1 items-center justify-center">
              <img
                key={large[index]}
                className="max-h-full max-w-full rounded-lg object-contain"
                src={large[index]}
                alt={`${alt}: ${names[index]}`}
              />
              <button
                type="button"
                className="absolute left-0 flex size-10 items-center justify-center rounded-full bg-white/90 text-black shadow-md hover:bg-white md:left-2"
                onClick={() => step(-1)}
                aria-label="Previous page"
              >
                <ChevronLeftIcon className="size-5" />
              </button>
              <button
                type="button"
                className="absolute right-0 flex size-10 items-center justify-center rounded-full bg-white/90 text-black shadow-md hover:bg-white md:right-2"
                onClick={() => step(1)}
                aria-label="Next page"
              >
                <ChevronRightIcon className="size-5" />
              </button>
            </div>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>

      {caption && (
        <figcaption className="mt-3 text-sm text-pretty text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
