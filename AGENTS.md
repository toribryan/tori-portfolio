# tori-portfolio

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

The Components page is archived: its `/components` list and detail routes and
the nav link were removed, but the MDX and `getComponentDocs` remain so it can
be restored by reverting that commit.

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
  before calling `trackEvent`. It forwards to OpenPanel and PostHog; PostHog
  initialises in `src/instrumentation-client.ts` and is inert without
  `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN`.

## Password gate

`src/middleware.ts` gates every route behind `SITE_PASSWORD`. When the variable
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
  `iron.mdx` and `modern.mdx` use the latter. Both only matter once the
  archived Components page is restored.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
