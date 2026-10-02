import type { ReactNode } from "react"

import {
  Panel,
  PanelContent,
  PanelHeader,
  PanelTitle,
} from "@/features/portfolio/components/panel"

import { FiboFarm } from "./fibo-farm"
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

/** Plates side by side, stacked on phones. */
function Plates({ names }: { names: (keyof typeof PLATES)[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {names.map((name) => (
        <Plate key={name} name={name} />
      ))}
    </div>
  )
}

function Chapter({
  title,
  after,
  children,
}: {
  title: string
  /** Full width, under the copy. */
  after?: ReactNode
  children: ReactNode
}) {
  return (
    <PanelContent className="screen-line-bottom last:screen-line-bottom-none">
      {/* The copy takes the larger cut of the golden section, like the
          brand's cards. */}
      <div className="grid items-start gap-6 sm:grid-cols-[1.618fr_1fr]">
        <div className="typeset typeset-description">
          <h3>{title}</h3>
          {children}
        </div>
      </div>
      {after ? <div className="mt-6">{after}</div> : null}
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

      <Chapter title="Where he comes from" after={<FiboFarm />}>
        <p>
          fibo is short for Fibonacci, the Italian mathematician. In 1202 he
          wrote a book called <em>Liber Abaci</em>, and tucked inside it is a
          puzzle about rabbits.
        </p>
        <p>The puzzle has four rules:</p>
        <ol>
          <li>Start with one pair of baby rabbits.</li>
          <li>A pair takes a month to grow up.</li>
          <li>
            From the month after that, it has one new baby pair every month.
          </li>
          <li>Nobody ever dies. (It&apos;s a math puzzle, not a farm.)</li>
        </ol>
        <p>
          How many pairs are there after a year? Below, each row is a month and
          each rabbit is a pair. A brace joins a pair to the baby pair it just
          had, and a single line follows a pair still too young. Watch the first
          six months play out.
        </p>
      </Chapter>

      <Chapter
        title="Organic and mechanical"
        after={<Plates names={["bunny", "sunflower"]} />}
      >
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
