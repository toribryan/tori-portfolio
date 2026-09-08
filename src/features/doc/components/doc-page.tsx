import type { Route } from "next"
import Image from "next/image"
import Link from "next/link"
import { getTableOfContents } from "fumadocs-core/content/toc"
import { ArrowLeftIcon, ArrowRightIcon, ExternalLinkIcon } from "lucide-react"

import { cleanTableOfContents } from "@/lib/toc"
import { cn } from "@/lib/utils"
import { Button } from "@/components/base/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/base/ui/tooltip"
import { Prose } from "@/components/base/ui/typography"
import { MDX } from "@/components/mdx"
import { LinkButton } from "@/components/mdx-link-button"
import { TOCInline } from "@/components/toc-inline"
import {
  findNeighbour,
  getDocsByCategory,
  LATEST_CATEGORY,
  WORK_CATEGORY,
} from "@/features/doc/data/documents"
import type { Doc } from "@/features/doc/types/document"

/** What the neighbour tooltips call the thing you're moving between. */
const NEIGHBOUR_NOUN: Record<string, string> = {
  [LATEST_CATEGORY]: "post",
  [WORK_CATEGORY]: "project",
}

/** Route each category's docs live under, for the neighbour links. */
const CATEGORY_BASE_PATH: Record<string, string> = {
  [LATEST_CATEGORY]: "/latest",
  [WORK_CATEGORY]: "/work",
}

/**
 * Shared shell for every MDX doc route — Latest posts and case studies. Callers own metadata and JSON-LD; this owns the reading layout.
 */
export async function DocPage({
  doc,
  backHref,
  backLabel,
}: {
  doc: Doc
  backHref: string
  backLabel: string
}) {
  const toc = cleanTableOfContents(await getTableOfContents(doc.content))
  const m = doc.metadata
  const liveLabel = m.liveLabel ?? "Visit site"

  // Walk the doc's own category, in the order its list page shows. Docs that
  // point their row elsewhere or aren't readable yet are skipped: an arrow
  // should never land a reader on a redirect or a placeholder.
  const category = m.category ?? ""
  const siblings = getDocsByCategory(category).filter(
    (sibling) => !sibling.metadata.href && !sibling.metadata.comingSoon
  )
  const { previous, next } = findNeighbour(siblings, doc.slug)
  const noun = NEIGHBOUR_NOUN[category] ?? "page"
  const basePath = CATEGORY_BASE_PATH[category]

  const facts = [
    ["Company", m.company],
    ["Reach", m.reach],
    ["Role", m.role],
    ["Team", m.team],
    ["Type", m.type],
    // `period` stays in frontmatter — the Projects card and the Latest rows
    // use it as their date, falling back to `createdAt` when it's absent.
    ["Status", m.status],
  ].filter(([, value]) => Boolean(value)) as [string, string][]

  // Outcome is deliberately absent here: it renders above the facts table as
  // the results strip, so the payoff sits above the fold instead of closing a
  // block a reader has to scroll to reach.
  const brief = [
    ["Problem", m.problem],
    ["Solution", m.solution],
    ["Task", m.task],
    ["Process", m.process],
  ].filter(([, value]) => Boolean(value)) as [string, string][]

  // Prefer the authored figures. Docs without a `results` block still promote
  // their `outcome` prose, so every case study leads with what changed.
  const results = m.results?.filter((r) => r.value && r.label) ?? []

  // One size for the whole strip. Short values are figures and get display
  // size; a phrase would wrap badly set that large, so any phrase in the strip
  // brings every value down a step rather than sitting small beside its
  // neighbours.
  const resultsAreFigures = results.every(({ value }) => value.length <= 10)

  return (
    <>
      <div className="screen-line-bottom flex items-center justify-between p-2 pl-4">
        <Button
          className="h-7 gap-2 border-none px-0 tracking-wider text-muted-foreground hover:text-foreground hover:no-underline"
          variant="link"
          size="sm"
          nativeButton={false}
          render={
            <Link href={backHref as Route}>
              <ArrowLeftIcon />
              {backLabel}
            </Link>
          }
        />

        <div className="flex items-center gap-2">
          {m.liveUrl && (
            <Button
              className="h-7 gap-2"
              variant="outline"
              size="sm"
              nativeButton={false}
              render={
                <a href={m.liveUrl} target="_blank" rel="noopener">
                  {liveLabel}
                  <ExternalLinkIcon />
                </a>
              }
            />
          )}

          {basePath && previous && (
            <NeighbourLink
              doc={previous}
              basePath={basePath}
              label={`Previous ${noun}`}
              icon={<ArrowLeftIcon />}
            />
          )}

          {basePath && next && (
            <NeighbourLink
              doc={next}
              basePath={basePath}
              label={`Next ${noun}`}
              icon={<ArrowRightIcon />}
            />
          )}
        </div>
      </div>

      <h1 className="screen-line-bottom overflow-x-clip px-4 py-6 font-heading text-4xl font-medium tracking-normal text-balance">
        {m.title}
      </h1>

      {m.image && (
        <div className="screen-line-bottom p-4">
          <Image
            className="w-full rounded-xl object-cover inset-ring-1 inset-ring-black/15 dark:inset-ring-white/15"
            src={m.image}
            alt={m.title}
            width={1200}
            height={630}
            quality={100}
            priority
            // The optimizer can't reach gated images — see doc-card.tsx.
            unoptimized
          />
          {m.imageCredit && (
            <p className="mt-2 text-xs text-muted-foreground">
              {m.imageCreditUrl ? (
                <a
                  className="underline underline-offset-4"
                  href={m.imageCreditUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {m.imageCredit}
                </a>
              ) : (
                m.imageCredit
              )}
            </p>
          )}
        </div>
      )}

      <Prose className="px-4 pt-8 pb-4">
        <p className="lead text-muted-foreground">{m.description}</p>

        {results.length > 0 ? (
          <dl
            className={cn(
              "not-prose my-6 grid grid-cols-2 gap-x-6 gap-y-5 border-y border-line py-5",
              results.length === 3 && "sm:grid-cols-3",
              results.length >= 4 && "sm:grid-cols-4"
            )}
          >
            {results.map(({ value, label }) => (
              <div key={label} className="flex flex-col gap-1">
                <dt
                  className={cn(
                    "font-heading font-medium tabular-nums",
                    resultsAreFigures
                      ? "text-3xl leading-none"
                      : "text-2xl leading-tight text-balance"
                  )}
                >
                  {value}
                </dt>
                <dd className="font-mono text-xs leading-relaxed tracking-wide text-pretty text-muted-foreground">
                  {label}
                </dd>
              </div>
            ))}
          </dl>
        ) : (
          m.outcome && (
            <div className="not-prose my-6 flex flex-col gap-1 border-y border-line py-4">
              <p className="font-mono text-xs tracking-wide text-muted-foreground uppercase">
                Outcome
              </p>
              <p className="text-sm leading-relaxed text-pretty">{m.outcome}</p>
            </div>
          )
        )}

        {facts.length > 0 && (
          <dl
            className={cn(
              "not-prose my-6 grid grid-cols-1 gap-x-6 gap-y-3 rounded-xl bg-surface-warm p-4 text-sm sm:grid-cols-2",
              "inset-ring-1 inset-ring-border/64"
            )}
          >
            {facts.map(([label, value]) => (
              <div key={label} className="flex flex-col gap-0.5">
                <dt className="font-mono text-xs tracking-wide text-muted-foreground uppercase">
                  {label}
                </dt>
                <dd className="text-surface-foreground">{value}</dd>
              </div>
            ))}
          </dl>
        )}

        {m.skills && m.skills.length > 0 && (
          <ul className="not-prose mb-6 flex flex-wrap gap-1.5">
            {m.skills.map((skill) => (
              <li
                key={skill}
                className={cn(
                  "rounded-md bg-surface-warm px-2 py-0.5 font-mono text-xs text-muted-foreground",
                  "inset-ring-1 inset-ring-border/64"
                )}
              >
                {skill}
              </li>
            ))}
          </ul>
        )}

        {brief.length > 0 && (
          <div className="not-prose my-6 flex flex-col gap-4 border-l-2 border-line pl-4">
            {brief.map(([label, value]) => (
              <div key={label} className="flex flex-col gap-1">
                <p className="font-mono text-xs tracking-wide text-muted-foreground uppercase">
                  {label}
                </p>
                <p className="text-sm leading-relaxed text-pretty">{value}</p>
              </div>
            ))}
          </div>
        )}

        <TOCInline items={toc} />

        <div>
          <MDX code={doc.content} />
        </div>

        {m.gallery && m.gallery.length > 0 && (
          <div className="not-prose mt-8 flex flex-col gap-4">
            {m.gallery.map((src) => (
              <Image
                key={src}
                className="w-full rounded-xl inset-ring-1 inset-ring-black/15 dark:inset-ring-white/15"
                src={src}
                alt=""
                width={1200}
                height={630}
                quality={100}
                loading="lazy"
                unoptimized
              />
            ))}
          </div>
        )}

        {/* Closing CTA for docs that send the reader to shipped work. Pages
            without a `liveUrl` can place their own <LinkButton> in the body. */}
        {m.liveUrl && <LinkButton href={m.liveUrl}>{liveLabel}</LinkButton>}
      </Prose>
    </>
  )
}

/**
 * One step through the category, as an icon button with the destination's
 * title in the tooltip. Icon-only keeps the header row from wrapping on a
 * phone; the label rides along for screen readers.
 */
function NeighbourLink({
  doc,
  basePath,
  label,
  icon,
}: {
  doc: Doc
  basePath: string
  label: string
  icon: React.ReactNode
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            className="size-7"
            variant="outline"
            size="icon-sm"
            nativeButton={false}
            render={
              <Link
                href={`${basePath}/${doc.slug}` as Route}
                aria-label={`${label}: ${doc.metadata.title}`}
              >
                {icon}
              </Link>
            }
          />
        }
      />

      <TooltipContent className="px-3 py-1.5">
        <p className="font-medium">{label}</p>
        <p className="text-background/70">{doc.metadata.title}</p>
      </TooltipContent>
    </Tooltip>
  )
}
