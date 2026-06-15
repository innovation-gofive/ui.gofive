"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CodeBlock } from "@/components/docs/code-block"

const MANAGERS = ["npm", "pnpm", "yarn", "bun"] as const
type Manager = (typeof MANAGERS)[number]

const RUNNER: Record<Manager, string> = {
  pnpm: "pnpm dlx",
  npm: "npx",
  yarn: "yarn dlx",
  bun: "bunx --bun",
}

export function InstallTabs({ component }: { component: string }) {
  return (
    <Tabs defaultValue="npm" className="mt-4 gap-2">
      <TabsList>
        {MANAGERS.map(m => (
          <TabsTrigger key={m} value={m}>
            {m}
          </TabsTrigger>
        ))}
      </TabsList>
      {MANAGERS.map(m => (
        <TabsContent key={m} value={m}>
          <CodeBlock code={`${RUNNER[m]} shadcn@latest add ${component}`} />
        </TabsContent>
      ))}
    </Tabs>
  )
}
