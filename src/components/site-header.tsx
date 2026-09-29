import dynamic from "next/dynamic"
import Image from "next/image"
import Link from "next/link"

import { MAIN_NAV } from "@/config/site"
import { Separator } from "@/components/base/ui/separator"
import { NavDesktop } from "@/components/nav-desktop"
import { ResumeMenu } from "@/components/resume-menu"
import { ThemeToggle } from "@/components/theme-toggle"

const BrandContextMenu = dynamic(
  () => import("@/components/brand-context-menu")
)

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 max-w-screen overflow-x-clip bg-background px-2">
      <div className="screen-line-top screen-line-bottom mx-auto flex h-(--header-height) items-center gap-2 border-r border-line pr-2 group-has-data-[slot=layout-wide]/layout:container after:z-1 after:bg-border sm:gap-4 md:max-w-3xl">
        <BrandContextMenu>
          <Link href="/" aria-label="Home">
            {/* A photo rather than the pixel mark: the mark still carries the
                favicon and app icons, but the header wants a face. */}
            <Image
              className="size-8 shrink-0 rounded-md object-cover select-none"
              src="/images/header/nav-photo.webp"
              alt=""
              width={128}
              height={128}
              priority
              unoptimized
            />
          </Link>
        </BrandContextMenu>

        <div className="flex-1" />

        <NavDesktop items={MAIN_NAV} />

        {/* Outside the nav so it stays on small screens, where the nav hides
            and the résumé is still the thing a recruiter came for. */}
        <ResumeMenu
          placement="header"
          side="bottom"
          className="group/resume inline-flex items-center gap-1 text-sm font-medium tracking-wide text-muted-foreground transition-[color] hover:text-foreground aria-expanded:text-foreground"
        />

        <div className="flex items-center">
          {MAIN_NAV.length > 0 && (
            <Separator
              orientation="vertical"
              className="mr-2 max-sm:hidden data-vertical:h-5 data-vertical:self-center"
            />
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
