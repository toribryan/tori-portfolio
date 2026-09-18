import { remarkHeading } from "fumadocs-core/mdx-plugins/remark-heading"
import type { MDXRemoteProps } from "next-mdx-remote/rsc"
import { MDXRemote } from "next-mdx-remote/rsc"
import rehypeExternalLinks from "rehype-external-links"
import rehypeSlug from "rehype-slug"
import remarkGfm from "remark-gfm"

import { UTM_PARAMS } from "@/config/site"
import { rehypeAddQueryParams } from "@/lib/rehype-add-query-params"
import {
  rehypeCodeRawString,
  rehypeHighlightCode,
  rehypeHighlightCodeRawString,
} from "@/lib/rehype-code-block"
import { cn } from "@/lib/utils"
import { Code } from "@/components/base/ui/typography"
import { ComponentPreview } from "@/features/components/components/component-preview"
import { InstallCommand } from "@/features/components/components/install-command"

import { Callout } from "./callout"
import { Heading } from "./heading"
import { BrandLink } from "./mdx-brand-link"
import { mdxCodeBlockComponents } from "./mdx-code-block"
import { Compare } from "./mdx-compare"
import { Embed } from "./mdx-embed"
import { Figure } from "./mdx-figure"
import { InboxRegions } from "./mdx-inbox-regions"
import { LinkButton } from "./mdx-link-button"
import { Pipeline, Stage } from "./mdx-pipeline"
import { PipelineHero } from "./mdx-pipeline-hero"
import { SkillCommandsVisual } from "./mdx-skill-commands"
import { StoryEmbed } from "./mdx-story-embed"
import { Tech } from "./mdx-tech"
import { ToolLabel } from "./mdx-tool-label"
import { Video } from "./mdx-video"

const components: MDXRemoteProps["components"] = {
  h1: (props: React.ComponentProps<"h1">) => <Heading as="h1" {...props} />,
  h2: (props: React.ComponentProps<"h2">) => <Heading as="h2" {...props} />,
  h3: (props: React.ComponentProps<"h3">) => <Heading as="h3" {...props} />,
  h4: (props: React.ComponentProps<"h4">) => <Heading as="h4" {...props} />,
  h5: (props: React.ComponentProps<"h5">) => <Heading as="h5" {...props} />,
  h6: (props: React.ComponentProps<"h6">) => <Heading as="h6" {...props} />,

  ...mdxCodeBlockComponents,
  code: Code,

  // Markdown images. Kept as a plain <img> rather than next/image because doc
  // authors don't declare intrinsic dimensions in markdown syntax.
  img: ({ className, alt, ...props }: React.ComponentProps<"img">) => (
    <img
      className={cn(
        "w-full rounded-xl inset-ring-1 inset-ring-black/15 dark:inset-ring-white/15",
        className
      )}
      alt={alt ?? ""}
      loading="lazy"
      {...props}
    />
  ),

  BrandLink,
  Callout,
  ComponentPreview,
  InstallCommand,
  Embed,
  Compare,
  Figure,
  InboxRegions,
  Pipeline,
  PipelineHero,
  Stage,
  SkillCommandsVisual,
  StoryEmbed,
  LinkButton,
  Tech,
  ToolLabel,
  Video,

  Steps: ({ className, ...props }: React.ComponentProps<"div">) => (
    <div
      className={cn(
        "relative md:ml-3 md:pl-7 prose-h3:text-base",
        "before:pointer-events-none before:absolute before:top-0 before:left-0 before:hidden before:h-full before:w-px before:-translate-x-1/2 before:bg-line before:md:flex",
        className
      )}
      {...props}
    />
  ),
  Step: ({ className, ...props }: React.ComponentProps<"h3">) => (
    <h3 className={cn("step font-medium", className)} {...props} />
  ),
}

const options: MDXRemoteProps["options"] = {
  mdxOptions: {
    remarkPlugins: [remarkGfm, remarkHeading],
    rehypePlugins: [
      [rehypeExternalLinks, { target: "_blank", rel: "nofollow noopener" }],
      rehypeSlug,
      rehypeCodeRawString,
      rehypeHighlightCode,
      rehypeHighlightCodeRawString,
      [rehypeAddQueryParams, UTM_PARAMS],
    ],
  },
}

export function MDX({ code }: { code: string }) {
  return <MDXRemote source={code} components={components} options={options} />
}
