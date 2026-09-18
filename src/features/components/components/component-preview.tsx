import fs from "fs"
import path from "path"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/base/ui/tabs"
import { MDX } from "@/components/mdx"
import { COMPONENTS } from "@/features/components/data/registry"

const PUBLISHED_DIR = path.join(process.cwd(), ".21st")

/**
 * The live component and its source behind two tabs, the way registry sites
 * show a demo. The source is the published file, read from disk at build and
 * highlighted through the same pipeline as a fenced block.
 */
export function ComponentPreview({ name }: { name: string }) {
  const entry = COMPONENTS[name]
  if (!entry) {
    throw new Error(`No component registered as "${name}"`)
  }

  const source = fs.readFileSync(
    path.join(PUBLISHED_DIR, entry.source),
    "utf-8"
  )

  return (
    <Tabs defaultValue="preview" className="not-prose my-6">
      <TabsList>
        <TabsTrigger value="preview">Preview</TabsTrigger>
        <TabsTrigger value="code">Code</TabsTrigger>
      </TabsList>
      <TabsContent
        value="preview"
        className="rounded-xl border border-line bg-background p-4 sm:p-6"
      >
        <entry.Preview />
      </TabsContent>
      <TabsContent value="code" className="[&_pre]:max-h-[32rem]">
        <MDX code={"```tsx\n" + source + "\n```"} />
      </TabsContent>
    </Tabs>
  )
}
