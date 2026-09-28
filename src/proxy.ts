import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import { SITE_AUTH_COOKIE, verifySessionToken } from "@/lib/site-auth"

export async function proxy(request: NextRequest) {
  const password = process.env.SITE_PASSWORD

  // No password configured — leave the site open rather than lock everyone
  // out. This is what keeps local dev and preview builds usable without a
  // secret; set SITE_PASSWORD in the environment to turn the gate on.
  if (!password) {
    return NextResponse.next()
  }

  const token = request.cookies.get(SITE_AUTH_COOKIE)?.value

  if (await verifySessionToken(token, password)) {
    return NextResponse.next()
  }

  const loginUrl = new URL("/login", request.url)

  // Send them back where they were headed once they're through the gate.
  // Path only — a full URL here would be an open-redirect.
  const intended = request.nextUrl.pathname + request.nextUrl.search
  if (intended !== "/") {
    loginUrl.searchParams.set("next", intended)
  }

  const response = NextResponse.redirect(loginUrl)

  // An expired or tampered cookie is worse than none: clear it so the browser
  // stops replaying it on every request.
  if (token) {
    response.cookies.delete(SITE_AUTH_COOKIE)
  }

  return response
}

export const config = {
  /**
   * Everything is gated except the login route itself, its form handler, Next's
   * own build output, the icon set, and the social card. Icons have to stay
   * public because the browser fetches them *for the login page* — gate them
   * and the tab shows a broken icon to anyone who hasn't signed in yet.
   *
   * `og-cover.png` is public for the same reason: a link preview is fetched by
   * iMessage or Slack with no cookie, so a gated card renders as a blank box.
   * It is a designed card, not site content, so nothing private leaks.
   *
   * Content under `public/` is otherwise deliberately included: an unlisted
   * case-study image is still private. `sitemap.xml` and `robots.txt` stay
   * gated too, so the URL list isn't readable from outside.
   */
  matcher: [
    "/((?!_next/static|_next/image|login|api/login|favicon|apple-touch-icon|android-chrome|maskable-icon|og-cover|manifest\\.webmanifest).*)",
  ],
}
