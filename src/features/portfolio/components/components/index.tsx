import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { Button } from "@/components/base/ui/button"
import { NICHE_PARTS } from "@/features/portfolio/data/fibo-niche"

import { Panel, PanelHeader, PanelTitle, PanelTitleSup } from "../panel"
import { PanelTitleCopy } from "../panel-title-copy"
import { ComponentCardList } from "./component-card-list"

const ID = "components"

/**
 * fibo's special components, branching off the fibo hero above. It sits
 * flush under the hero and shares the hero's bottom line.
 */
export function Components() {
  return (
    <Panel id={ID} className="screen-line-top-none">
      <PanelHeader>
        <PanelTitle>
          <a href={`#${ID}`}>Components</a>
          <PanelTitleSup>({NICHE_PARTS.length})</PanelTitleSup>
          <PanelTitleCopy id={ID} />
        </PanelTitle>
      </PanelHeader>

      <ComponentCardList />

      <div className="screen-line-top flex justify-center py-4">
        <Button
          className="gap-2 pr-2.5 pl-3"
          variant="outline"
          size="sm"
          nativeButton={false}
          render={<Link href="/components/all" />}
        >
          View all
          <ArrowRightIcon />
        </Button>
      </div>
    </Panel>
  )
}
