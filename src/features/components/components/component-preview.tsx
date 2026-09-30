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

import { PreviewSwitch } from "./doc-view"

const SOURCE_DIR = path.join(process.cwd(), "src/components/fibo")

/**
 * The live component, and for developers its source behind a second tab, the
 * way registry sites show a demo. The source is the installed file, read from disk at build and
 * highlighted through the same pipeline as a fenced block.
 */
export function ComponentPreview({ name }: { name: string }) {
  const entry = COMPONENTS[name]
  if (!entry) {
    throw new Error(`No component registered as "${name}"`)
  }

  const source = fs.readFileSync(path.join(SOURCE_DIR, entry.source), "utf-8")

  const preview = <entry.Preview />
  const frame = "rounded-xl border border-line bg-background p-4 sm:p-6"

  return (
    <PreviewSwitch
      preview={<div className={`not-prose my-6 ${frame}`}>{preview}</div>}
      tabs={
        <Tabs defaultValue="preview" className="not-prose my-6">
          <TabsList>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
          </TabsList>
          <TabsContent value="preview" className={frame}>
            {preview}
          </TabsContent>
          <TabsContent value="code" className="[&_pre]:max-h-[32rem]">
            <MDX code={"```tsx\n" + source + "\n```"} />
          </TabsContent>
        </Tabs>
      }
    />
  )
}
