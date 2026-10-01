import dynamic from "next/dynamic"
import Image from "next/image"
import Link from "next/link"

import { MAIN_NAV } from "@/config/site"
import { USER } from "@/features/portfolio/data/user"
import { Separator } from "@/components/base/ui/separator"
import { HeaderLead } from "@/components/header-lead"
import { NavDesktop } from "@/components/nav-desktop"
import { ThemeToggle } from "@/components/theme-toggle"

const BrandContextMenu = dynamic(
  () => import("@/components/brand-context-menu")
)

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 max-w-screen overflow-x-clip bg-background px-2">
      <div className="screen-line-top screen-line-bottom mx-auto flex h-(--header-height) items-center gap-2 border-x border-line pr-2 group-has-data-[slot=layout-wide]/layout:container after:z-1 after:bg-border sm:gap-4 md:max-w-3xl">
        <HeaderLead>
          <BrandContextMenu>
            <Link href="/" aria-label="Home">
              <Image
                className="size-8 shrink-0 select-none"
                src={USER.headerAvatar}
                alt=""
                width={165}
                height={166}
                priority
                unoptimized
              />
            </Link>
          </BrandContextMenu>
        </HeaderLead>

        <div className="flex-1" />

        <NavDesktop items={MAIN_NAV} />

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
