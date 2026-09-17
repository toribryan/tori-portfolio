import { getBuildInfo, getStack } from "@/lib/build-info"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/base/ui/separator"
import { LinkedInIcon } from "@/components/icons"
import { ResumeMenu } from "@/components/resume-menu"
import { SiteFooterInteractiveLogotype } from "@/components/site-footer-brand"
import { SOCIAL } from "@/features/portfolio/data/social-links"

// Imported here rather than through `@/config/site`, which client components
// pull in, to keep the manifest out of client bundles.
import packageJson from "../../package.json"

const INSPIRED_BY = [
  { name: "chanhdai.com", href: "https://github.com/ncdai?tab=repositories" },
  { name: "Tailwind CSS" },
  { name: "shadcn/ui" },
  { name: "Vercel" },
  { name: "Geist" },
]

// Not derived from `SITE_INFO.url`: that follows `NEXT_PUBLIC_APP_URL` and
// would read a localhost host in dev.
const SITE_TITLE = "toribryan.com"

const SITE_SUBTITLE = packageJson.description

const COPYRIGHT_HOLDER = "Tori Bryan"

// The layout and code of this site are based on chanhdai.com, which is MIT
// licensed. Saying so in plain text is expressly permitted by, and this credit
// is kept in deference to, its author's brand policy.
const BASED_ON_URL = "https://github.com/ncdai/chanhdai.com"

/** Footer laid out as the title block of a technical drawing. */
export function SiteFooterCad() {
  const linkedinLink = SOCIAL.linkedin

  const build = getBuildInfo()
  const stack = getStack()

  return (
    <footer className="max-w-screen overflow-x-clip px-2">
      <div className="mx-auto border-x border-line group-has-data-[slot=layout-wide]/layout:container md:max-w-3xl">
        <div className="screen-line-top screen-line-bottom after:z-1 after:bg-border">
          <div className="stripe-divider h-12" />
        </div>

        <div className="relative">
          <div className="screen-line-bottom flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-4 py-3 font-mono text-sm">
            <span className="font-medium">{SITE_TITLE}</span>
            <span className="font-sans text-muted-foreground">
              {SITE_SUBTITLE}
            </span>
          </div>

          <dl className="grid grid-cols-2 gap-px bg-line font-mono md:grid-cols-4">
            <Field label="Designed by">
              <a
                className="link-underline"
                href={linkedinLink.href}
                target="_blank"
                rel="noopener"
              >
                {COPYRIGHT_HOLDER}
              </a>
            </Field>

            <Field label="Date">
              <time dateTime={build.date}>{build.date}</time>
            </Field>

            <Field label="Deployed on">Vercel</Field>

            <Field label="Typeface">Geist · Nohemi</Field>

            <Field label="Based on">
              <a
                className="link-underline"
                href={BASED_ON_URL}
                target="_blank"
                rel="noopener"
              >
                chanhdai.com
              </a>
            </Field>

            <Field className="md:col-span-3" label="Stack">
              <ul className="flex flex-col gap-0.5">
                {stack.map((entry) => (
                  <li key={entry}>{entry}</li>
                ))}
              </ul>
            </Field>

            <Field className="col-span-2 md:col-span-4" label="Inspired by">
              {/*
                Cancelling the cell padding and repeating the parent's column
                count and gap lands these columns on the same grid lines as the
                cells above, rather than dividing the padded width.
              */}
              <ol className="-mx-4 grid grid-cols-2 gap-x-px gap-y-0.5 font-sans md:grid-cols-4">
                {INSPIRED_BY.map(({ name, href }, index) => (
                  <li className="flex gap-2 px-4" key={name}>
                    {/* Hidden: the list element already conveys the position. */}
                    <span
                      className="font-mono text-muted-foreground/80"
                      aria-hidden
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {href ? (
                      <a
                        className="link-underline"
                        href={href}
                        target="_blank"
                        rel="noopener"
                      >
                        {name}
                      </a>
                    ) : (
                      name
                    )}
                  </li>
                ))}
              </ol>
            </Field>
          </dl>
        </div>

        <div className="screen-line-top h-4" />

        <div className="screen-line-top screen-line-bottom flex flex-col items-center justify-center gap-x-4 gap-y-3 px-4 py-3 text-sm text-muted-foreground sm:flex-row sm:justify-between">
          <div className="flex flex-col flex-wrap items-center gap-x-3 gap-y-1 sm:flex-row">
            <span>
              © {build.date.slice(0, 4)} {COPYRIGHT_HOLDER}.
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              className="flex items-center transition-[color] hover:text-foreground"
              href={linkedinLink.href}
              target="_blank"
              rel="noopener"
              aria-label="LinkedIn Profile"
            >
              <LinkedInIcon className="size-4" />
            </a>

            <Separator
              orientation="vertical"
              className="data-vertical:h-4 data-vertical:self-center"
            />

            <a
              className="link-underline"
              href="mailto:toribryan.design@gmail.com"
            >
              Email
            </a>

            <Separator
              orientation="vertical"
              className="data-vertical:h-4 data-vertical:self-center"
            />

            <ResumeMenu className="group/resume inline-flex items-center gap-1 link-underline transition-[color] hover:text-foreground aria-expanded:text-foreground" />
          </div>
        </div>
      </div>

      <SiteFooterInteractiveLogotype />

      <div className="h-(--fade-bottom-height)" />
      <div className="pb-[env(safe-area-inset-bottom,0)]" />
    </footer>
  )
}

function Field({
  className,
  label,
  children,
}: {
  className?: string
  label: string
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "flex min-w-0 flex-col gap-1 bg-background px-4 py-3",
        className
      )}
    >
      <dt className="text-[0.625rem]/4 font-medium tracking-wider text-muted-foreground uppercase">
        {label}
      </dt>
      <dd className="text-sm">{children}</dd>
    </div>
  )
}
