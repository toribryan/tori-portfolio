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

function Chapter({
  title,
  aside,
  after,
  children,
}: {
  title?: string
  /** Beside the copy, in the smaller cut. */
  aside?: ReactNode
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
          {title ? <h3>{title}</h3> : null}
          {children}
        </div>
        {aside}
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

      <Chapter aside={<Plate name="bunny" />}>
        <p>
          For the past year I&apos;ve been studying the history of the golden
          ratio, and whether it still holds up today as a blueprint for
          proportional design. I wanted fibo&apos;s branding to tie in with my
          personal brand, so I made what I&apos;ve learned its anchor.
        </p>
        <p>
          That&apos;s where fibo, my pixel bunny mascot, comes in. Learn more
          about his lore below.
        </p>
      </Chapter>

      <Chapter title="Where he comes from" after={<FiboFarm />}>
        <p>
          fibo is named after Leonardo of Pisa, the Italian mathematician better
          known as Fibonacci. The nickname came centuries after him, short for{" "}
          <em>filius Bonacci</em>, &ldquo;son of Bonacci.&rdquo; He grew up
          partly in North Africa, where his father worked as a merchant
          official, and there he learned the Hindu-Arabic numerals that traders
          were already using.
        </p>
        <p>
          In 1202 he published <em>Liber Abaci</em>, the &ldquo;Book of
          Calculation,&rdquo; which made the case to Europe for those numerals
          over Roman ones. Among its worked problems is a thought experiment
          about rabbits. Start with one newborn pair. Each pair takes a month to
          grow up, then has a new pair every month after that, and none of them
          ever die. How many pairs are there after a year?
        </p>
        <p>
          The answer grows into a famous sequence of numbers. Mathematicians in
          India had described the same numbers centuries earlier, in the study
          of poetic meter, but the rabbits are how Europe met them. They were
          named after Fibonacci in the 1870s.
        </p>
        <p>
          Below, each row is a month and each rabbit is a pair. A brace joins a
          pair to the baby pair it just had, and a single line follows a pair
          still too young. Watch the first six months play out.
        </p>
      </Chapter>

      <Chapter title="The sequence">
        <ul>
          <li>Start with 1 and 1.</li>
          <li>Add the last two numbers to get the next one.</li>
          <li>1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, and on forever.</li>
          <li>
            Divide any number by the one before it and you get closer and closer
            to 1.618, the golden ratio, φ.
          </li>
        </ul>
      </Chapter>

      <Chapter
        title="Organic and mechanical"
        aside={<Plate name="sunflower" />}
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
