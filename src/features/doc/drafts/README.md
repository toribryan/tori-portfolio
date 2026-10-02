# Drafts

Posts and case studies that are written but not published.

`getMDXData` in `../data/documents.ts` only reads category folders under
`../content/`, so nothing here reaches the site: not the list pages, not
`/latest/[slug]`, not the sitemap, not the home page. That is the whole reason
this folder sits outside `content/` rather than inside it as `content/_drafts/`.
A folder under `content/` would become its own category and its docs would
still be reachable through `getDocBySlug`, which the doc routes call directly.

To publish, move the file back into the matching `content/<category>/` folder.
Check `order` against its new neighbors when you do, since it competes with
them for position.
