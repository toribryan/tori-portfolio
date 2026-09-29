import { BriefcaseBusinessIcon, MapPinIcon } from "lucide-react"

import { LinkedInIcon } from "@/components/icons"
import { SOCIAL } from "@/features/portfolio/data/social-links"
import { USER } from "@/features/portfolio/data/user"

import { Panel, PanelContent } from "../panel"
import { CurrentLocalTimeItem } from "./current-local-time-item"
import { EmailItem } from "./email-item"
import {
  IntroItem,
  IntroItemContent,
  IntroItemIcon,
  IntroItemLink,
} from "./intro-item"

/**
 * The facts under the header in two columns: what I do, where I am and how to
 * reach me on the left, and whether I'm available, my local time and my
 * LinkedIn on the right, paired so each row reads across.
 */
export function Overview() {
  return (
    <Panel>
      <h2 className="sr-only">Overview</h2>

      <PanelContent className="grid gap-x-4 gap-y-2.5 sm:grid-cols-2">
        <IntroItem>
          <IntroItemIcon>
            <BriefcaseBusinessIcon />
          </IntroItemIcon>
          <IntroItemContent>{USER.discipline}</IntroItemContent>
        </IntroItem>

        {USER.availability && (
          <IntroItem>
            <IntroItemIcon>
              <span className="size-2 rounded-full bg-green-500" />
            </IntroItemIcon>
            <IntroItemContent>{USER.availability}</IntroItemContent>
          </IntroItem>
        )}

        <IntroItem>
          <IntroItemIcon>
            <MapPinIcon />
          </IntroItemIcon>
          <IntroItemContent>
            <IntroItemLink
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(USER.address)}`}
              aria-label={`Location: ${USER.address}`}
            >
              {USER.address}
            </IntroItemLink>
          </IntroItemContent>
        </IntroItem>

        <CurrentLocalTimeItem timeZone={USER.timeZone} />

        <EmailItem emailB64={USER.emailB64} />

        <IntroItem>
          <IntroItemIcon>
            <LinkedInIcon className="size-3.5" />
          </IntroItemIcon>
          <IntroItemContent>
            <IntroItemLink href={SOCIAL.linkedin.href}>LinkedIn</IntroItemLink>
          </IntroItemContent>
        </IntroItem>
      </PanelContent>

      <div className="pointer-events-none absolute inset-y-0 left-1/2 -z-1 w-px -translate-x-2.25 border-r border-dashed border-line max-sm:hidden" />
    </Panel>
  )
}
