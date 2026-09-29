import { DocCardList } from "@/features/doc/components/doc-card-list"
import { getWorkDocs } from "@/features/doc/data/documents"
import {
  Panel,
  PanelHeader,
  PanelTitle,
  PanelTitleSup,
} from "@/features/portfolio/components/panel"
import { PanelTitleCopy } from "@/features/portfolio/components/panel-title-copy"

import { LoadMore } from "./load-more"

const ID = "projects"

/** Cards per page of "Load more": two rows of the two-column grid. */
const PAGE = 4

export function Projects() {
  // fibo has its own hero and niche shelf above.
  const projects = getWorkDocs().filter((doc) => doc.slug !== "fibo")

  return (
    <Panel id={ID}>
      <PanelHeader>
        <PanelTitle>
          <a href={`#${ID}`}>Projects</a>
          <PanelTitleSup>({projects.length})</PanelTitleSup>
          <PanelTitleCopy id={ID} />
        </PanelTitle>
      </PanelHeader>

      <div className="px-2 pb-4">
        {projects.length === 0 ? (
          <DocCardList
            docs={[]}
            basePath="/work"
            emptyMessage="No projects published yet."
          />
        ) : (
          <LoadMore
            pages={Array.from(
              { length: Math.ceil(projects.length / PAGE) },
              (_, i) => (
                <DocCardList
                  key={i}
                  docs={projects.slice(i * PAGE, (i + 1) * PAGE)}
                  basePath="/work"
                />
              )
            )}
          />
        )}
      </div>
    </Panel>
  )
}
