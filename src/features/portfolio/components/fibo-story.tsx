import type { ReactNode } from "react"

import {
  Panel,
  PanelContent,
  PanelHeader,
  PanelTitle,
} from "@/features/portfolio/components/panel"

import { PanelTitleCopy } from "./panel-title-copy"

const ID = "story"

const PLATES = {
  bunny: {
    alt: "A soft photograph of a white rabbit's eye in a small window, with a dithered pixel rabbit building out around it.",
    caption: "The rabbit, rebuilt in pixels around a photograph of one.",
  },
  sunflower: {
    alt: "A photograph of bees on a sunflower's seed head in a small window, with a dithered pixel sunflower building out around it.",
    caption:
      "A sunflower, whose seeds spiral in Fibonacci numbers, dissolving into dither.",
  },
}

/*
 * The launch cards from fibo's brand kit. Each animation starts on the photo
 * alone and builds the dither out around it; the resolved still stands in
 * when motion is reduced.
 */
function Plate({ name }: { name: keyof typeof PLATES }) {
  const { alt, caption } = PLATES[name]
  return (
    <figure className="m-0 flex flex-col gap-2">
      <picture>
        <source
          srcSet={`/images/fibo/${name}-dither.png`}
          media="(prefers-reduced-motion: reduce)"
        />
        <img
          src={`/images/fibo/${name}-dither.gif`}
          alt={alt}
          width={1080}
          height={1350}
          loading="lazy"
          className="block h-auto w-full rounded-xl border border-line"
        />
      </picture>
      <figcaption className="text-sm text-muted-foreground">
        {caption}
      </figcaption>
    </figure>
  )
}

function Chapter({
  title,
  plate,
  children,
}: {
  title: string
  plate?: keyof typeof PLATES
  children: ReactNode
}) {
  return (
    <PanelContent className="screen-line-bottom last:screen-line-bottom-none">
      {/* Copy and plate split on the golden section, like the brand's cards. */}
      <div className="grid items-start gap-6 sm:grid-cols-[1.618fr_1fr]">
        <div className="typeset typeset-description">
          <h3>{title}</h3>
          {children}
        </div>
        {plate ? <Plate name={plate} /> : null}
      </div>
    </PanelContent>
  )
}

/** fibo's lore: where the rabbit comes from and what he stands for. */
export function FiboStory() {
  return (
    <Panel id={ID}>
      <PanelHeader>
        <PanelTitle>
          <a href={`#${ID}`}>The story</a>
          <PanelTitleCopy id={ID} />
        </PanelTitle>
      </PanelHeader>

      <Chapter title="Where he comes from">
        <p>
          fibo is a rabbit made of pixels, and he gives this design system its
          name. fibo is short for Fibonacci. In <em>Liber Abaci</em>, published
          in 1202, Fibonacci posed a puzzle about rabbits. Every grown pair has
          a new pair each month, and no rabbit ever dies. Count the pairs month
          by month and you get 1, 1, 2, 3, 5, 8: each number is the sum of the
          two before it. Divide any number by the one before it and the answer
          creeps toward 1.618, the golden ratio.
        </p>
        <p>
          So a rabbit started the sequence, and a rabbit became the mascot. He
          knows his history, too. Click him too many times and he warns you
          there&apos;ll be eight of him by next month.
        </p>
      </Chapter>

      <Chapter title="Organic and mechanical" plate="bunny">
        <p>
          The golden ratio comes from nature. It&apos;s nature&apos;s own
          algorithm, and I&apos;m using it to build something mechanical. While
          making fibo I found an accidental contrast at the center of the
          project: organic and mechanical, two opposites in one place.
        </p>
        <p>
          That&apos;s why the rabbit is pixel art. He&apos;s an animal, a part
          of nature, rebuilt out of pixels.
        </p>
      </Chapter>

      <Chapter title="The sunflower" plate="sunflower">
        <p>
          A sunflower&apos;s seeds spiral out from the center in Fibonacci
          numbers, so the sunflower is the second face of fibo. Each image
          blends a photograph with a dithered pixel animation until the two read
          as one picture: nature on one side, the machine on the other, and me
          as the point where they meet.
        </p>
        <p>
          I call the look soft cyber eco-core. It grew out of my interest in
          cyberfeminism and, for fibo, turned softer and closer to nature.
        </p>
      </Chapter>

      <Chapter title="Where to find him">
        <ul>
          <li>
            In the hero above, fibo builds himself up pixel by pixel, idles and
            hops, and watches your pointer. Poke him and he flinches. Click too
            fast and he hides behind his ears.
          </li>
          <li>The hero is a golden rectangle, cut on 0.618.</li>
          <li>
            fibo never draws a spiral. Spirals only appear where nature made
            them, in photographs.
          </li>
        </ul>
      </Chapter>
    </Panel>
  )
}
