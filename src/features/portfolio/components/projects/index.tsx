import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/components/base/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/base/ui/collapsible"
import {
  Panel,
  PanelHeader,
  PanelTitle,
  PanelTitleSup,
} from "@/features/portfolio/components/panel"
import { PanelTitleCopy } from "@/features/portfolio/components/panel-title-copy"
import { DocCardList } from "@/features/doc/components/doc-card-list"
import { getWorkDocs } from "@/features/doc/data/documents"

const ID = "projects"

/** Cards shown before "Load more" — three rows of the two-column grid. */
const MAX = 6

export function Projects() {
  const projects = getWorkDocs()

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
          docs={projects.slice(0, MAX)}
          basePath="/work"
          emptyMessage="No projects published yet."
        />

        {projects.length > MAX && (
          <Collapsible className="group/collapsible">
            <CollapsibleContent>
              <DocCardList docs={projects.slice(MAX)} basePath="/work" />
            </CollapsibleContent>

            <div className="flex items-center justify-center pt-4">
              <CollapsibleTrigger
                render={
                  <Button
                    className="gap-2 pr-2.5 pl-3"
                    variant="outline"
                    size="sm"
                  >
                    <span className="hidden group-data-closed/collapsible:block">
                      Load more
                    </span>

                    <span className="hidden group-data-open/collapsible:block">
                      Show less
                    </span>

                    <ChevronDownIcon className="group-data-open/collapsible:rotate-180" />
                  </Button>
                }
              />
            </div>
          </Collapsible>
        )}
      </div>
    </Panel>
  )
}
