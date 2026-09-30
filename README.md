# toribryan.com

The source for [toribryan.com](https://www.toribryan.com) — the portfolio of
Tori Bryan, a Staff Product Designer working at the seam of product design and
engineering.

Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · TypeScript · MDX

## Getting started

Requires Node 24.16.0 (see `.nvmrc`).

```bash
npm install
npm run dev
```

The site runs at http://localhost:3000.

| Script                 | What it does               |
| ---------------------- | -------------------------- |
| `npm run dev`          | Dev server                 |
| `npm run build`        | Production build           |
| `npm run start`        | Serve the production build |
| `npm run check-types`  | `tsc --noEmit`             |
| `npm run lint`         | ESLint                     |
| `npm run format:write` | Prettier                   |

Pages prerender statically; only the login route and its form handler run on
demand. Copy `.env.example` to `.env.local` for configuration —
`NEXT_PUBLIC_APP_URL` overrides the canonical origin used in metadata and
JSON-LD, and analytics IDs are optional and inert when unset.

## Password gate

Set `SITE_PASSWORD` and every route redirects to `/login` until the password is
entered. Leave it unset and the site is open, which is what keeps local dev and
preview deploys usable without a secret.

```bash
# .env.local
SITE_PASSWORD=your-password-here
```

A successful login sets an httpOnly cookie holding an expiring HMAC token —
`<expiry>.<signature>`, signed with the password — so a leaked cookie expires on
its own and can't be cracked back into the password. Sessions last 30 days.
**Changing `SITE_PASSWORD` invalidates every existing session**, which is how you
sign everyone out.

On Vercel, set it in Project Settings → Environment Variables. Gating a preview
deploy but not production is just a matter of which environments you set it in.

## What's where

```
src/
  app/(app)/(pages)/    list pages — /components, /latest
  app/(app)/(docs)/     doc detail routes — /components/[slug], /latest/[slug], /work/[slug]
  features/doc/         MDX content layer, cards, and the shared doc page shell
    content/            ← all long-form content lives here
  features/portfolio/   home page sections and their data
  components/           shared UI (base/ui = Base UI, ui = local)
  config/site.ts        nav and site metadata
  styles/globals.css    design tokens and prose styles
```

## Adding content

Content is file-based MDX. The folder a file sits in determines its category and
its route — there's no index to register it in.

```
src/features/doc/content/
  components/   → /components/<slug>    one doc per brand design system
  latest/       → /latest/<slug>        posts and creative retros
  work/         → /work/<slug>          case studies
```

Drop in a new `.mdx` file with frontmatter and it appears:

```mdx
---
title: "Proctor Coverage"
description: "Embedded analytics that turn proctor coverage into evidence."
image: "/case-studies/proctor-coverage-timeline.svg"
createdAt: "2025-04-01"
updatedAt: "2025-04-01"
company: "Proctorio"
role: "Lead Product Designer"
period: "04.2025 – 09.2025"
skills: ["Figma", "Claude Code", "Azure"]
---

## Context

Body copy, tables, images and fenced code all render.
```

`title`, `description`, `createdAt` and `updatedAt` are required; everything else
is optional and drives the facts block, cover card, and metadata. The full
contract with per-field notes is `src/features/doc/types/document.ts`.

Images resolve against `public/`. Sorting is newest-first by `createdAt`, with
`pinned: true` floating an entry to the top.

Résumé sections — experience, education, awards, certifications, tech stack —
are typed arrays in `src/features/portfolio/data/` rather than MDX.

## Credits

Built on the [chanhdai.com](https://github.com/ncdai/chanhdai.com) portfolio by
[Chánh Đại](https://github.com/ncdai), used under the MIT License and rebranded
in line with its `TRADEMARK.md`. The attribution in the site footer is part of
that agreement — see `ATTRIBUTION.md`.

## License

`LICENSE` is the upstream MIT license, © Chánh Đại — it covers the template code
this site is built on, and it has to stay. It says nothing about the writing,
case studies, and images added here, which are Tori Bryan's own work.

If this repo ever goes public, that's worth making explicit rather than leaving
to inference.
