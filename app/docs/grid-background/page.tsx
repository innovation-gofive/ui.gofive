"use client"

import { useState, type ComponentProps } from "react"
import { GridBackground, type GridBackgroundDirection } from "@/registry/new-york/ui/grid-background"
import { DocPage, DocH2, DocH3 } from "@/components/docs/doc-page"
import { InstallTabs } from "@/components/docs/install-tabs"
import { CodeBlock } from "@/components/docs/code-block"
import { ComponentPreview } from "@/components/docs/component-preview"
import { PropsTable } from "@/components/docs/props-table"

const toc = [
  { title: "Installation", href: "#installation" },
  { title: "Usage", href: "#usage" },
  { title: "Examples", href: "#examples" },
  { title: "Interactive", href: "#interactive", depth: 1 },
  { title: "Directions", href: "#directions", depth: 1 },
  { title: "Cell size and colour", href: "#size-color", depth: 1 },
  { title: "Fade", href: "#fade", depth: 1 },
  { title: "Static", href: "#static", depth: 1 },
  { title: "Without reveal", href: "#no-reveal", depth: 1 },
  { title: "Notes", href: "#notes" },
  { title: "API Reference", href: "#api-reference" },
]

const DIRECTIONS: GridBackgroundDirection[] = ["diagonal", "up", "down", "left", "right"]

function Frame({ label, ...props }: ComponentProps<typeof GridBackground> & { label: string }) {
  return (
    <GridBackground className="h-40 w-full rounded-lg border" {...props}>
      <div className="flex h-full items-center justify-center">
        <span className="rounded-md bg-background/80 px-2 py-1 text-sm font-medium text-foreground">{label}</span>
      </div>
    </GridBackground>
  )
}

export default function GridBackgroundPage() {
  return (
    <DocPage
      breadcrumb={["Motion", "Grid Background"]}
      title="Grid Background"
      description="A decorative hairline grid that drifts slowly behind its children, fades toward the edges and can be uncovered by a growing circle on first view."
      toc={toc}
    >
      <DocH2 id="installation">Installation</DocH2>
      <InstallTabs component="@gofive/grid-background" />

      <DocH2 id="usage">Usage</DocH2>
      <CodeBlock
        className="mt-4"
        code={`import { GridBackground } from "@/components/ui/grid-background"`}
      />
      <ComponentPreview className="p-0">
        <GridBackground className="w-full rounded-xl py-16">
          <div className="mx-auto max-w-sm text-center">
            <h3 className="text-lg font-semibold text-foreground">Build something sharp</h3>
            <p className="mt-1 text-sm text-muted-foreground">Content sits above the grid and stays fully interactive.</p>
          </div>
        </GridBackground>
      </ComponentPreview>

      <DocH2 id="examples">Examples</DocH2>

      <DocH3 id="interactive">Interactive</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">Direction, size, speed and fade update the grid live; replay restarts the reveal.</p>
      <InteractiveExample />

      <DocH3 id="directions">Directions</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Pick the drift with <code>direction</code>. The grid moves exactly one cell per loop, so it never jumps.
      </p>
      <ComponentPreview className="items-stretch">
        <div className="grid w-full gap-4 sm:grid-cols-2">
          {DIRECTIONS.map((d) => (
            <Frame key={d} label={d} direction={d} reveal={false} />
          ))}
        </div>
      </ComponentPreview>

      <DocH3 id="size-color">Cell size and colour</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Lines use the <code>border</code> token by default. Pass any CSS colour, such as a theme variable, to override it.
      </p>
      <ComponentPreview className="items-stretch">
        <div className="grid w-full gap-4 sm:grid-cols-2">
          <Frame label="size 24" size={24} reveal={false} />
          <Frame label="size 80" size={80} reveal={false} />
          <Frame label="color primary" color="var(--primary)" reveal={false} />
          <Frame label="color muted-foreground" color="var(--muted-foreground)" reveal={false} />
        </div>
      </ComponentPreview>

      <DocH3 id="fade">Fade</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">A smaller <code>fade</code> gives a tighter vignette; larger values keep lines near the corners.</p>
      <ComponentPreview className="items-stretch">
        <div className="grid w-full gap-4 sm:grid-cols-2">
          <Frame label="fade 40" fade={40} reveal={false} />
          <Frame label="fade 120" fade={120} reveal={false} />
        </div>
      </ComponentPreview>

      <DocH3 id="static">Static</DocH3>
      <p className="mt-2 text-sm text-muted-foreground"><code>speed=&#123;0&#125;</code> turns the drift off and leaves a still grid.</p>
      <ComponentPreview className="items-stretch">
        <Frame label="speed 0" speed={0} reveal={false} />
      </ComponentPreview>

      <DocH3 id="no-reveal">Without reveal</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        With <code>reveal</code> (the default) the grid is uncovered once, the first time 20% of it scrolls into view. Turn it off to show the grid immediately.
      </p>
      <ComponentPreview className="items-stretch">
        <div className="grid w-full gap-4 sm:grid-cols-2">
          <Frame label="reveal" reveal />
          <Frame label="no reveal" reveal={false} />
        </div>
      </ComponentPreview>

      <DocH2 id="notes">Notes</DocH2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
        <li>The grid is decorative and <code>aria-hidden</code>; it ignores pointer events, so children stay interactive.</li>
        <li>With <code>prefers-reduced-motion: reduce</code> the grid is shown at once and does not drift.</li>
        <li>The container clips overflow and has no intrinsic size. Give it height or padding, and portal overlays out of it.</li>
        <li>The reveal plays once, the first time the grid is in view. Remount (change the <code>key</code>) to replay it.</li>
      </ul>

      <DocH2 id="api-reference">API Reference</DocH2>
      <DocH3 id="api-grid-background">GridBackground</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Also accepts all <code>div</code> props, spread onto the root (<code>data-slot=&quot;grid-background&quot;</code>).
        Inner parts carry <code>grid-background-grid</code>, <code>-reveal</code>, <code>-lines</code> and <code>-content</code> slots.
      </p>
      <PropsTable rows={[
        { prop: "children", type: "ReactNode", default: "—", desc: "Content rendered above the grid" },
        { prop: "size", type: "number", default: "48", desc: "Cell size in px (minimum 8); also the drift distance per loop" },
        { prop: "color", type: "string", default: "border token", desc: "Line colour; any CSS colour" },
        { prop: "speed", type: "number", default: "3", desc: "Seconds to travel one cell. 0 or less keeps the grid still" },
        { prop: "direction", type: '"up" | "down" | "left" | "right" | "diagonal"', default: '"diagonal"', desc: "Which way the grid appears to move" },
        { prop: "reveal", type: "boolean", default: "true", desc: "Uncover the grid with a growing circle on first view" },
        { prop: "fade", type: "number", default: "70", desc: "Percent of the centre-to-corner distance where the edge fade reaches transparent (30–150)" },
        { prop: "className", type: "string", default: "—", desc: "Extra classes on the container, used for size, padding and rounding" },
      ]} />
      <DocH3 id="api-types">GridBackgroundDirection</DocH3>
      <PropsTable rows={[
        { prop: "GridBackgroundDirection", type: '"up" | "down" | "left" | "right" | "diagonal"', default: "—", desc: "Exported union type for the direction prop" },
      ]} />
    </DocPage>
  )
}

function InteractiveExample() {
  const [direction, setDirection] = useState<GridBackgroundDirection>("diagonal")
  const [size, setSize] = useState(48)
  const [speed, setSpeed] = useState(3)
  const [fade, setFade] = useState(70)
  const [replay, setReplay] = useState(0)

  return (
    <ComponentPreview className="flex-col items-stretch gap-4">
      <div className="grid gap-3 text-sm text-foreground sm:grid-cols-2">
        <label className="flex items-center justify-between gap-3">
          Direction
          <select
            value={direction}
            onChange={(e) => setDirection(e.target.value as GridBackgroundDirection)}
            className="h-8 rounded-md border bg-background px-2 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            {DIRECTIONS.map((d) => <option key={d}>{d}</option>)}
          </select>
        </label>
        <Slider label={`Size ${size}px`} min={16} max={96} value={size} onChange={setSize} />
        <Slider label={`Speed ${speed}s`} min={0} max={10} value={speed} onChange={setSpeed} />
        <Slider label={`Fade ${fade}%`} min={30} max={150} value={fade} onChange={setFade} />
        <button
          type="button"
          onClick={() => setReplay((n) => n + 1)}
          className="h-8 rounded-md border bg-background px-3 hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none sm:col-span-2"
        >
          Replay reveal
        </button>
      </div>
      <GridBackground
        key={replay}
        className="h-56 w-full rounded-lg border"
        direction={direction}
        size={size}
        speed={speed}
        fade={fade}
      >
        <div className="flex h-full items-center justify-center">
          <span className="rounded-md bg-background/80 px-2 py-1 text-sm font-medium text-foreground">Live preview</span>
        </div>
      </GridBackground>
    </ComponentPreview>
  )
}

function Slider({ label, min, max, value, onChange }: { label: string; min: number; max: number; value: number; onChange: (n: number) => void }) {
  return (
    <label className="flex items-center justify-between gap-3">
      <span className="tabular-nums">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-40 accent-primary"
      />
    </label>
  )
}
