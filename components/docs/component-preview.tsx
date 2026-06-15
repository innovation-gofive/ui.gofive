"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CodeBlock } from "@/components/docs/code-block"
import { cn } from "@/lib/utils"

export function ComponentPreview({
  children,
  code,
  className,
}: {
  children: React.ReactNode
  code?: string
  className?: string
}) {
  const frame = (
    <div
      className={cn(
        "flex min-h-[180px] w-full items-center justify-center rounded-xl border bg-background p-8",
        className
      )}
    >
      {children}
    </div>
  )

  if (!code) return <div className="mt-4">{frame}</div>

  return (
    <Tabs defaultValue="preview" className="mt-4 gap-2">
      <TabsList>
        <TabsTrigger value="preview">Preview</TabsTrigger>
        <TabsTrigger value="code">Code</TabsTrigger>
      </TabsList>
      <TabsContent value="preview">{frame}</TabsContent>
      <TabsContent value="code">
        <CodeBlock code={code} />
      </TabsContent>
    </Tabs>
  )
}
