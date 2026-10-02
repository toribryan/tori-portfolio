# toribryan.com

Tori Bryan's portfolio — Next.js 16 (App Router) + React 19 + Tailwind CSS 4.

Built on the [chanhdai.com](https://github.com/ncdai/chanhdai.com) portfolio
template (MIT), stripped to the portfolio slice and rebranded. **Attribution in
`src/components/site-footer-cad.tsx` is required by `TRADEMARK.md` — do not
remove it.** The remaining `chanhdai`/`ncdai` strings in `icons.tsx`,
`site-footer-cad.tsx` and the `prose-ncdai` utility are intentional.

## Development

```
npm run dev           # dev server on :3000
npm run build         # production build
npm run check-types   # tsc --noEmit
npm run lint          # eslint
npm run format:write  # prettier
```

Node version is pinned in `.nvmrc` (24.16.0). Before calling work done, run
`check-types` **and** `build` — typed routes mean some errors only surface once
`next build` regenerates `.next/types`. A bare `tsc` on a clean tree will report
false `Route` errors until then.

## Content lives in MDX, not in TypeScript

All page content is file-based under `src/features/doc/content/<category>/*.mdx`.
The category is derived from the folder name, never declared in frontmatter.

| Folder        | Route            | Holds                           |
| ------------- | ---------------- | ------------------------------- |
| `components/` | none (archived)  | One doc per brand design system |
| `latest/`     | `/latest/[slug]` | Posts and creative retros       |
| `work/`       | `/work/[slug]`   | Case studies                    |

fibo's special components are a separate feature. The parts themselves are
installed as source from fibo's registry into `src/components/fibo/` (`npx
shadcn@latest add https://fibo.toribryan.com/r/<name>.json --path
src/components/fibo`); re-run that to update one, and check its imports still
point at `@/components/fibo/`; the install also drops a stray `utils.ts`
and a `cn` package, and writes dark values for fibo's extra roles into
`globals.css` that this site mixes itself, so revert those, but keep `--warning` and the two `--sticker-*` tokens
that Sticker avatar needs, which this site declares itself. Four parts carry
local changes. `filter-menu.tsx`
has a `container` prop for where its popup renders, and keeps focus and
scrolling inside the menu so opening it never scrolls the page; the home
page cover needs both. `token-flow.tsx` carries an `orientation` prop so the
Design System Overhaul card cover can stack its tiers at any width. `chapter-scrubber.tsx` fits its preview to the screen: on a
narrow one it opens on the side with more room and narrows to fit, and it
closes once the rail scrolls out of view. `command-menu.tsx` has a `modal` prop:
`false` opens it without locking the page's scroll or moving focus, which the
home page cover needs, and then opening an item's page doesn't pull focus
into it either (focusing scrolls the page to the menu, which dropped the
command menu doc mid-page on load). Its preview pane also shows by the dialog's own width
(`@xl/command-menu`) rather than the viewport's, so the pane stays in the
scaled cover on a phone. Put
these back after reinstalling; fibo's own filter menu has since gained a
`container` prop, so check what it already covers first. `src/features/portfolio/data/fibo-niche.ts`
lists them, which drives the home page section, `/components` and the
docs; `home: false` keeps a part off the home page (Token flow, Reactions, whose slot Floating nav took, Pixel snail, whose slot Sticker avatar took, and Integration visual, whose slot the Command menu took after Data table joined). Each has a doc at `/components/[slug]`, ported from fibo's Storybook:
`src/features/components/content/<slug>.mdx` is the body,
`examples/<slug>.tsx` holds its live examples (named after the fibo stories
they port), and `data/registry.tsx` wires the lead preview and links. The
MDX renders with JS expressions allowed, since fibo's doc blocks take
arrays and elements as props; `components/doc-blocks.tsx` and
`doc-parts.tsx` are everything it can use. Adding one means installing the
part, a `fibo-niche.ts` entry, an MDX file, an examples module and a home
page cover in `features/portfolio/components/components/covers.tsx`.
Each entry has a `shelf`, `special` or `base`, which groups `/components` and
picks the Storybook URL. Data table is the one base part so far; it brings
fibo's Table, Checkbox, Avatar, Tooltip, Button, Menu, Sheet, Input, Select
and Pagination into `src/components/fibo/`, written from their registry JSON
rather than the CLI, so they can't land in `components/ui/`. Its badges use
`success-subtle`, `warning-subtle` and `info-subtle`, which this site mixes
in `globals.css` like `destructive-subtle`.

fibo has two pages here. `/components` lists the special components with an
install block per package manager (`fibo-install.tsx`); `/components/all`
redirects there. `/fibo` is the lore: `FiboHero` with `variant="page"` (an
`h1`, and buttons out to the Storybook, Figma and GitHub), then
`fibo-story.tsx`, with the rabbit farm (`fibo-farm.tsx`) that steps through
Fibonacci's puzzle and the dither plates in `public/images/fibo/`. On the
home page the hero's buttons go to those two pages instead.

The phone nav is fibo's Floating nav (`src/components/fibo/floating-nav.tsx`,
installed and documented like the parts above).
The site uses its compact `size="sm"`; the file matches the registry as is.
`nav-mobile-bar.tsx` shows `MOBILE_NAV` from `config/site.ts` in it as words
(items with no icon), with a round menu button beside it (`nav-mobile.tsx`)
listing every page in `MOBILE_MENU`; the two hide together on scroll. Below `sm` it replaces the header's
links, so `ScrollToTop` only shows from `sm` up. If `shadcn add` stops on
pnpm's ignored-build warning before writing the file, copy `files[0].content`
from the item's JSON into `src/components/fibo/` instead.

`src/components/ui/token-flow.tsx`, the site's own copy, still backs the
archived review deck; `.21st/token-flow.tsx` is generated from it by `npm run
sync:token-flow` for 21st.dev.

The portfolio review deck is archived: its `/review` route was removed, but
`src/features/review/` remains, since case studies use its slides through
`components/mdx-review-artifacts.tsx`, and the deck can be restored by
reverting that commit.

The brand design system docs under `components/` are archived: their list
and detail routes and the nav link were removed, but the MDX and
`getComponentDocs` remain so they can be restored by reverting that commit.
They are unrelated to fibo's special components, which now own the
`/components/[slug]` route.

`src/features/doc/data/documents.ts` reads them; `src/features/doc/types/document.ts`
is the frontmatter contract. **To add content, add an MDX file** — there is no
array to update and no registration step. Adding a new top-level folder creates
a new category, but it needs a route and a `get*` helper to surface.

Résumé-style sections (experience, education, awards, certifications, tech stack,
social links, user profile) are the exception: those stay as typed arrays in
`src/features/portfolio/data/`, each with a matching type in `../types/`.

Do not reintroduce a `projects.tsx`-style array for anything that has MDX docs —
project content is single-sourced from `content/work/` on purpose.

## Layout

- `src/app/(app)/(pages)/` — list pages (`/latest`)
- `src/app/(app)/(docs)/` — doc detail routes, both delegate to
  `features/doc/components/doc-page.tsx` for the reading layout
- `src/features/doc/` — content layer, cards, doc shell
- `src/features/portfolio/` — home page sections and their data
- `src/components/` — shared UI; `base/ui/` is Base UI, `ui/` is local
- `src/registry/` — vendored components from the template's registry
- `src/config/site.ts` — nav, site metadata, UTM params
- `src/styles/globals.css` — design tokens, `prose-ncdai`, code-block styles

Import alias is `@/*` → `./src/*`.

## Conventions

- MDX renders through `src/components/mdx.tsx` (GFM, `rehype-pretty-code` +
  shiki, anchored headings). Code-block CSS already exists in `globals.css` and
  expects `rehype-pretty-code`'s markup — don't swap the highlighter casually.
- Markdown bodies must avoid bare `{` and `<`; MDX parses them as JSX.
- Every image path in frontmatter or MDX resolves against `public/`. Check the
  file exists — a missing one renders a broken card, not a build error.
- New sections follow the `Panel` / `PanelHeader` / `PanelTitle` pattern from
  `features/portfolio/components/panel.tsx`.
- Analytics events are a closed enum in `src/lib/events.ts`; add the name there
  before calling `trackEvent`.

## Password gate

`src/proxy.ts` gates every route behind `SITE_PASSWORD`. When the variable
is unset the site is open — that's deliberate, so dev and preview builds work
without a secret. `src/lib/site-auth.ts` holds the token logic; the session
cookie is an expiring HMAC (`<expiry>.<signature>`), not a hash of the password.

Two things to preserve if you touch it: the `?next=` path is validated against
open-redirects in `src/app/api/login/route.ts`, and comparisons go through the
constant-time `safeEqual` rather than `===`.

## Known gaps

- No `/work` index route — cards link straight to `/work/[slug]`.
- A component doc can set `href` in frontmatter to say "my story is told
  elsewhere", and `comingSoon: true` marks one as not yet written. `bab.mdx`
  uses the former (its reference lives in `content/work/bab-design-system.mdx`);
  `iron.mdx` and `modern.mdx` use the latter. On Projects cards, `href`
  already works: `work/fibo.mdx` sends its card to `/fibo`.
  `comingSoon` only matters once the archived Components page is restored.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
