"use client"

import { copyToClipboardWithEvent } from "@/utils/copy"
import { decodeEmail } from "@/utils/string"
import { addQueryParams } from "@/utils/url"
import { useTiks } from "@rexa-developer/tiks/react"
import {
  ArrowRightIcon,
  ChevronDownIcon,
  ComponentIcon,
  DiamondIcon,
  MousePointerClickIcon,
  PlayIcon,
  TypeIcon,
} from "lucide-react"
import { useHotkeys } from "react-hotkeys-hook"
import { toast } from "sonner"

import { UTM_PARAMS } from "@/config/site"
import { toggleOnSound } from "@/lib/soundcn/toggle-on"
import { cn } from "@/lib/utils"
import { useSound } from "@/hooks/soundcn/use-sound"
import { useIsClient } from "@/hooks/use-is-client"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/base/ui/tabs"
import { CopyButton } from "@/components/copy-button"
import { SOCIAL_LINKS } from "@/features/portfolio/data/social-links"
import { USER } from "@/features/portfolio/data/user"

import { scrollToSection } from "./scroll-to-section"
import { VerifiedIcon } from "./verified-icon"

// Figma's component purple and selection blue, stepped for each theme.
const COMPONENT = "text-[#8638E5] dark:text-[#C29CFF]"
const BLUE = "#0D99FF"
const STRING = "text-[#A64B58] dark:text-[#E39AA4]"

/*
 * The right panel of the inspector, built from sections Figma really has, so
 * every piece of the portfolio sits where a designer would look for it:
 * component properties for who I am, prototype interactions for where to go,
 * and Export for the résumé.
 */

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="border-b border-line py-2.5 last:border-b-0">
      <h2 className="px-3 pb-2 text-[11px] font-semibold text-foreground">
        {title}
      </h2>
      {children}
    </section>
  )
}

// A component property row: the property's type icon and name on the left,
// its control on the right, the way Figma lays them out.
function Property({
  icon: Icon,
  name,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>
  name: string
  children: React.ReactNode
}) {
  return (
    <div className="grid grid-cols-[5.5rem_1fr] items-center gap-2 px-3 py-1">
      <dt className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
        <Icon className="size-3 shrink-0" aria-hidden />
        {name}
      </dt>
      <dd className="min-w-0 text-[11px] text-foreground">{children}</dd>
    </div>
  )
}

// Figma draws a variant as a dropdown. This one shows the value only, so it is
// not a control and carries no focus.
function VariantField({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex items-center justify-between gap-1 rounded-sm bg-muted px-2 py-1">
      <span className="min-w-0">{children}</span>
      <ChevronDownIcon
        className="size-3 shrink-0 text-muted-foreground"
        aria-hidden
      />
    </span>
  )
}

function Interaction({
  href,
  action,
  target,
  onClick,
  external,
}: {
  href?: string
  action: string
  target: string
  onClick?: React.MouseEventHandler<HTMLAnchorElement>
  external?: boolean
}) {
  return (
    <li>
      <a
        href={href}
        onClick={onClick}
        {...(external ? { target: "_blank", rel: "noopener" } : {})}
        className="group/row mx-1.5 flex items-center gap-1.5 rounded-sm px-1.5 py-1 text-[11px] transition-colors hover:bg-accent"
      >
        <MousePointerClickIcon
          className="size-3 shrink-0 text-muted-foreground"
          aria-hidden
        />
        <span className="text-muted-foreground">On click</span>
        <ArrowRightIcon
          className="size-3 shrink-0 text-muted-foreground"
          aria-hidden
        />
        <span className="text-muted-foreground">{action}</span>
        <span className="truncate font-medium text-foreground">{target}</span>
      </a>
    </li>
  )
}

function Interactions() {
  const isClient = useIsClient()
  const email = decodeEmail(USER.emailB64)

  const { success } = useTiks()
  const [playCopy] = useSound(toggleOnSound, { volume: 0.3, interrupt: true })

  useHotkeys("shift+e", () => {
    copyToClipboardWithEvent(email, {
      name: "copy_email",
      properties: { method: "keyboard", key: "shift+e" },
    })
    success()
    playCopy()
    toast.success("Email copied")
  })

  return (
    <ul className="flex flex-col">
      <Interaction
        href="#projects"
        onClick={scrollToSection}
        action="Navigate to"
        target="Projects"
      />
      {/* The address is decoded only in the browser, so it never sits in the
          HTML for scrapers. Shift + E copies it. */}
      <Interaction
        href={isClient ? `mailto:${email}` : undefined}
        action="Open link:"
        target="Email"
      />
      {SOCIAL_LINKS.map((item) => (
        <Interaction
          key={item.name}
          href={addQueryParams(item.href, UTM_PARAMS)}
          action="Open link:"
          target={item.title}
          external
        />
      ))}
    </ul>
  )
}

function DesignTab() {
  return (
    <>
      <Section title="Properties">
        <dl className="flex flex-col">
          <Property icon={DiamondIcon} name="role">
            <VariantField>{USER.discipline}</VariantField>
          </Property>
          <Property icon={DiamondIcon} name="available">
            <span className="flex items-center gap-2">
              {/* Figma's boolean property, drawn on or off. */}
              <span
                className={cn(
                  "relative h-3.5 w-6 shrink-0 rounded-full",
                  !USER.availability && "bg-muted-foreground/40"
                )}
                style={
                  USER.availability ? { backgroundColor: BLUE } : undefined
                }
                aria-hidden
              >
                <span
                  className={cn(
                    "absolute top-0.5 size-2.5 rounded-full bg-white",
                    USER.availability ? "right-0.5" : "left-0.5"
                  )}
                />
              </span>
              <span className="truncate">
                {USER.availability ?? "Not looking right now"}
              </span>
            </span>
          </Property>
          <Property icon={TypeIcon} name="location">
            <span className="block truncate rounded-sm bg-muted px-2 py-1">
              {USER.address}
            </span>
          </Property>
        </dl>
      </Section>

      <Section title="Interactions">
        <Interactions />
      </Section>

      <Section title="Export">
        <div className="flex items-center gap-2 px-3">
          <span className="flex items-center gap-1 rounded-sm bg-muted px-2 py-1 text-[11px]">
            PDF
            <ChevronDownIcon
              className="size-3 text-muted-foreground"
              aria-hidden
            />
          </span>
          <span className="flex-1 truncate text-[11px] text-muted-foreground">
            résumé
          </span>
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener"
            aria-label="Export résumé as PDF"
            className="rounded-md border border-line px-2.5 py-1 text-[11px] font-medium text-foreground transition-colors hover:bg-accent"
          >
            Export
          </a>
        </div>
      </Section>
    </>
  )
}

function PrototypeTab() {
  return (
    <>
      <Section title="Flow starting point">
        <p className="mx-3 flex items-center gap-1.5 rounded-sm bg-muted px-2 py-1 text-[11px] text-foreground">
          <PlayIcon className="size-3" aria-hidden />
          Hero
        </p>
      </Section>
      <Section title="Interactions">
        <Interactions />
      </Section>
    </>
  )
}

function DevTab() {
  // The same names and values as the Design tab's properties, the way a
  // component's Figma properties and code props should line up.
  const available = USER.availability
    ? "\n  available"
    : "\n  available={false}"
  const code = `<Tori\n  role="${USER.discipline}"${available}\n  location="${USER.address}"\n/>`

  return (
    <>
      <Section title="Code">
        <div className="relative mx-3">
          <pre className="overflow-x-auto rounded-md bg-muted px-3 py-2.5 font-mono text-[11px] leading-5 text-muted-foreground">
            <code>
              {"<"}
              <span className={COMPONENT}>Tori</span>
              {"\n  role="}
              <span className={STRING}>&quot;{USER.discipline}&quot;</span>
              {USER.availability ? "\n  available" : "\n  available={false}"}
              {"\n  location="}
              <span className={STRING}>&quot;{USER.address}&quot;</span>
              {"\n/>"}
            </code>
          </pre>
          <CopyButton
            className="absolute top-1.5 right-1.5 text-muted-foreground"
            variant="ghost"
            size="icon-xs"
            text={code}
          />
        </div>
      </Section>
      <Section title="Inspect">
        <dl className="flex flex-col">
          <Property icon={TypeIcon} name="type">
            Nohemi and Geist
          </Property>
          <Property icon={TypeIcon} name="portrait">
            176 × 176, pixel art
          </Property>
          <Property icon={TypeIcon} name="built with">
            Next.js, Tailwind, Base UI
          </Property>
        </dl>
      </Section>
    </>
  )
}

export function HeroProperties() {
  const tab = "h-9 rounded-none px-0 text-[11px] font-medium"

  return (
    <div className="flex min-w-0 flex-col">
      <Tabs defaultValue="design" className="gap-0">
        <TabsList className="h-9 w-full justify-start gap-4 rounded-none border-b border-line bg-transparent px-3">
          <TabsTrigger value="design" className={tab}>
            Design
          </TabsTrigger>
          <TabsTrigger value="prototype" className={tab}>
            Prototype
          </TabsTrigger>
          <TabsTrigger value="dev" className={tab}>
            Dev
          </TabsTrigger>
        </TabsList>

        <div className="border-b border-line px-3 py-3">
          <p className={cn("flex items-center gap-1.5 text-[11px]", COMPONENT)}>
            <ComponentIcon className="size-3" aria-hidden />
            Main component
          </p>
          <h1 className="mt-1 flex items-center gap-2 font-heading text-2xl font-medium tracking-tight">
            {USER.displayName}
            <VerifiedIcon
              className="size-4.5 shrink-0 select-none"
              aria-hidden
            />
          </h1>
        </div>

        <TabsContent value="design">
          <DesignTab />
        </TabsContent>
        <TabsContent value="prototype">
          <PrototypeTab />
        </TabsContent>
        <TabsContent value="dev">
          <DevTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
