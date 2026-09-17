import { Fragment } from "react"
import { urlToName } from "@/utils/url"
import { BriefcaseBusinessIcon, LinkIcon, MapPinIcon } from "lucide-react"

import { SOCIAL_ICONS } from "@/features/portfolio/components/social-link-icons"
import { SOCIAL_LINKS } from "@/features/portfolio/data/social-links"
import { USER } from "@/features/portfolio/data/user"

import { Panel, PanelContent } from "../panel"
import { EmailItem } from "./email-item"
import {
  IntroItem,
  IntroItemContent,
  IntroItemIcon,
  IntroItemLink,
} from "./intro-item"

/**
 * The identity block under the header: what I do and where, on the left; where
 * to find me, on the right.
 *
 * The grid fills row-major, so the two columns have to interleave in the
 * source — emitting all of one column and then the other would stack them into
 * the wrong cells. They're built as two lists and zipped, with a spacer where
 * one side runs out, so adding a fourth profile doesn't shunt the layout.
 */
export function Overview() {
  const left = [
    <IntroItem key="address">
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
    </IntroItem>,

    <EmailItem key="email" emailB64={USER.emailB64} />,

    <IntroItem key="website">
      <IntroItemIcon>
        <LinkIcon />
      </IntroItemIcon>
      <IntroItemContent>
        <IntroItemLink
          href={USER.website}
          aria-label={`Personal website: ${urlToName(USER.website)}`}
        >
          {urlToName(USER.website)}
        </IntroItemLink>
      </IntroItemContent>
    </IntroItem>,
  ]

  const right = SOCIAL_LINKS.map((profile) => (
    <IntroItem key={profile.name}>
      <IntroItemIcon>{SOCIAL_ICONS[profile.name]}</IntroItemIcon>
      <IntroItemContent>
        <IntroItemLink
          href={profile.href}
          aria-label={`${profile.title}: ${profile.handle}`}
        >
          {urlToName(profile.href)}
        </IntroItemLink>
      </IntroItemContent>
    </IntroItem>
  ))

  const rows = Math.max(left.length, right.length)

  return (
    <Panel>
      <h2 className="sr-only">Overview</h2>

      <PanelContent className="grid gap-x-4 gap-y-2.5 sm:grid-cols-2">
        <IntroItem className="sm:col-span-2">
          <IntroItemIcon>
            <BriefcaseBusinessIcon />
          </IntroItemIcon>
          <IntroItemContent>{USER.discipline}</IntroItemContent>
        </IntroItem>

        {Array.from({ length: rows }, (_, i) => (
          <Fragment key={i}>
            {left[i] ?? <div aria-hidden />}
            {right[i] ?? <div aria-hidden />}
          </Fragment>
        ))}
      </PanelContent>

      <div className="pointer-events-none absolute inset-y-0 left-1/2 -z-1 w-px -translate-x-2.25 border-r border-dashed border-line max-sm:hidden" />
    </Panel>
  )
}
