import Link from "next/link"

import { ArrowRightIcon } from "@/components/animated-icons/arrow-right-icon"
import { Button } from "@/components/base/ui/button"
import { DocCardList } from "@/features/doc/components/doc-card-list"
import { getWorkDocs } from "@/features/doc/data/documents"
import {
  Panel,
  PanelHeader,
  PanelTitle,
  PanelTitleSup,
} from "@/features/portfolio/components/panel"
import { PanelTitleCopy } from "@/features/portfolio/components/panel-title-copy"

const ID = "projects"

/** Cards on the home page: two rows of the two-column grid. The rest are on /projects. */
const SHOWN = 4

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
        <DocCardList
          docs={projects.slice(0, SHOWN)}
          basePath="/work"
          emptyMessage="No projects published yet."
        />
      </div>

      <div className="screen-line-top flex justify-center py-4">
        <Button
          className="gap-2 pr-2.5 pl-3"
          variant="outline"
          size="sm"
          nativeButton={false}
          render={<Link href="/projects" />}
        >
          View all
          <ArrowRightIcon />
        </Button>
      </div>
    </Panel>
  )
}
