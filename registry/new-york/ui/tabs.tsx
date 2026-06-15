"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

type TabsVariant = "underline" | "pill" | "segmented" | "vertical"

interface TabsContextValue {
  value: string | undefined
  setValue: (value: string) => void
  variant: TabsVariant
}

const TabsContext = React.createContext<TabsContextValue | null>(null)

function useTabsContext(component: string) {
  const ctx = React.useContext(TabsContext)
  if (!ctx) {
    throw new Error(`${component} must be used within <Tabs>`)
  }
  return ctx
}

// ── Tabs (container) ───────────────────────────────────────────────
// Navigation tabs with four looks — underline, pill, segmented, and
// vertical. Controlled via `value`/`onValueChange` or uncontrolled via
// `defaultValue`. Compose with <TabsList> and <TabsTrigger>.
export interface TabsProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  variant?: TabsVariant
  children: React.ReactNode
}

function Tabs({
  value,
  defaultValue,
  onValueChange,
  variant = "underline",
  className,
  children,
  ...props
}: TabsProps) {
  const isControlled = value !== undefined
  const [internal, setInternal] = React.useState<string | undefined>(
    defaultValue,
  )
  const current = isControlled ? value : internal

  const setValue = React.useCallback(
    (next: string) => {
      if (!isControlled) setInternal(next)
      onValueChange?.(next)
    },
    [isControlled, onValueChange],
  )

  const ctx = React.useMemo<TabsContextValue>(
    () => ({ value: current, setValue, variant }),
    [current, setValue, variant],
  )

  return (
    <TabsContext.Provider value={ctx}>
      <div
        data-slot="tabs"
        data-variant={variant}
        className={cn(variant === "vertical" && "flex gap-4", className)}
        {...props}
      >
        {children}
      </div>
    </TabsContext.Provider>
  )
}

// ── TabsList ───────────────────────────────────────────────────────
const LIST_CLASSES: Record<TabsVariant, string> = {
  underline: "flex items-center gap-0 border-b border-border",
  pill: "inline-flex items-center gap-1 rounded-[10px] bg-muted p-1",
  segmented:
    "inline-flex items-center overflow-hidden rounded-lg border border-border",
  vertical: "flex min-w-[180px] flex-col gap-0.5",
}

function TabsList({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { variant } = useTabsContext("TabsList")
  return (
    <div
      role="tablist"
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(LIST_CLASSES[variant], className)}
      {...props}
    />
  )
}

// ── TabsTrigger ────────────────────────────────────────────────────
const TRIGGER_CLASSES: Record<TabsVariant, string> = {
  underline:
    "-mb-px gap-1.5 border-b-2 border-transparent px-4 py-2.5 text-[13.5px] font-medium text-muted-foreground hover:text-foreground data-[state=active]:border-primary data-[state=active]:font-semibold data-[state=active]:text-primary",
  pill: "gap-1.5 rounded-md px-3.5 py-2 text-[13px] font-medium text-muted-foreground hover:text-foreground data-[state=active]:bg-background data-[state=active]:font-semibold data-[state=active]:text-foreground data-[state=active]:shadow-sm",
  segmented:
    "gap-1.5 border-r border-border px-4 py-2 text-[13px] text-foreground last:border-r-0 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
  vertical:
    "w-full justify-start gap-2 rounded-md px-3 py-2 text-[13px] text-foreground hover:bg-muted data-[state=active]:bg-primary/10 data-[state=active]:font-semibold data-[state=active]:text-primary",
}

export interface TabsTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
  /** Optional count rendered as a pill after the label. */
  badge?: React.ReactNode
}

function TabsTrigger({
  value,
  badge,
  className,
  children,
  onClick,
  ...props
}: TabsTriggerProps) {
  const { value: current, setValue, variant } = useTabsContext("TabsTrigger")
  const selected = current === value

  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      data-slot="tabs-trigger"
      data-state={selected ? "active" : "inactive"}
      onClick={(e) => {
        onClick?.(e)
        if (!e.defaultPrevented) setValue(value)
      }}
      className={cn(
        "inline-flex items-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 [&_svg]:size-4 [&_svg]:shrink-0",
        TRIGGER_CLASSES[variant],
        className,
      )}
      {...props}
    >
      {children}
      {badge != null && (
        <span
          data-slot="tabs-badge"
          className={cn(
            "ml-0.5 inline-flex items-center justify-center rounded-full px-1.5 text-[11px] leading-5",
            selected
              ? "bg-primary/10 text-primary"
              : "bg-muted text-muted-foreground",
            variant === "segmented" &&
              selected &&
              "bg-primary-foreground/20 text-primary-foreground",
          )}
        >
          {badge}
        </span>
      )}
    </button>
  )
}

// ── TabsContent ────────────────────────────────────────────────────
export interface TabsContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  value: string
}

function TabsContent({ value, className, ...props }: TabsContentProps) {
  const { value: current } = useTabsContext("TabsContent")
  if (current !== value) return null
  return (
    <div role="tabpanel" data-slot="tabs-content" className={className} {...props} />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
