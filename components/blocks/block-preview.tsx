"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowUpRight, Monitor, Smartphone, Tablet } from "lucide-react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CodeBlock } from "@/components/docs/code-block"
import { cn } from "@/lib/utils"
import type { BlockComponentLink } from "@/lib/blocks"

const DEVICES = {
  desktop: { label: "Desktop", width: "100%", icon: Monitor },
  tablet: { label: "Tablet", width: "768px", icon: Tablet },
  mobile: { label: "Mobile", width: "390px", icon: Smartphone },
} as const

type Device = keyof typeof DEVICES

export function BlockPreview({
  slug,
  name,
  description,
  componentsUsed,
  code,
}: {
  slug: string
  name: string
  description: string
  componentsUsed: BlockComponentLink[]
  code: string
}) {
  const [device, setDevice] = React.useState<Device>("desktop")
  const href = `/blocks/${slug}`

  return (
    <section id={slug} className="scroll-mt-24">
      <div className="mb-3">
        <h2 className="text-lg font-semibold tracking-tight">{name}</h2>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>
      </div>

      <Tabs defaultValue="preview" className="gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <TabsList>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5 rounded-lg border bg-background p-0.5">
              {(Object.keys(DEVICES) as Device[]).map((key) => {
                const { label, icon: Icon } = DEVICES[key]
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setDevice(key)}
                    aria-label={label}
                    aria-pressed={device === key}
                    className={cn(
                      "flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground",
                      device === key && "bg-muted text-foreground",
                    )}
                  >
                    <Icon className="size-4" />
                  </button>
                )
              })}
            </div>
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border bg-background px-2.5 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
            >
              <ArrowUpRight className="size-3.5" />
              Full screen
            </a>
          </div>
        </div>

        <TabsContent value="preview">
          <div className="overflow-hidden rounded-xl border bg-muted/30">
            <div className="flex justify-center">
              <iframe
                src={href}
                title={name}
                loading="lazy"
                className="h-[680px] w-full border-0 bg-background transition-[width] duration-300 ease-out"
                style={{ width: DEVICES[device].width, maxWidth: "100%" }}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="code">
          <CodeBlock code={code} language="tsx" />
        </TabsContent>
      </Tabs>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="text-xs text-muted-foreground">Built with</span>
        {componentsUsed.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="inline-flex items-center rounded-full border bg-background px-2.5 py-0.5 text-xs font-medium text-foreground/80 transition-colors hover:border-primary hover:text-primary"
          >
            {c.label}
          </Link>
        ))}
      </div>
    </section>
  )
}
