"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"

type TabsVariant = "underline" | "pill" | "segmented" | "vertical"

interface TabsContextValue {
  value: string | undefined
  setValue: (value: string) => void
  variant: TabsVariant
  /** Arrow keys move focus only; Enter/Space then selects. */
  activationMode: "automatic" | "manual"
  /** Namespaces the trigger/panel ids that link them via aria-controls. */
  baseId: string
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
  /**
   * "automatic" (default) selects a tab as soon as an arrow key lands on it,
   * matching the WAI-ARIA tabs pattern; "manual" only moves focus.
   */
  activationMode?: "automatic" | "manual"
  children: React.ReactNode
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(function Tabs(
  {
    value,
    defaultValue,
    onValueChange,
    variant = "underline",
    activationMode = "automatic",
    className,
    children,
    ...props
  },
  ref,
) {
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

  const baseId = React.useId()
  const ctx = React.useMemo<TabsContextValue>(
    () => ({ value: current, setValue, variant, activationMode, baseId }),
    [current, setValue, variant, activationMode, baseId],
  )

  return (
    <TabsContext.Provider value={ctx}>
      <div
        ref={ref}
        data-slot="tabs"
        data-variant={variant}
        className={cn(variant === "vertical" && "flex gap-4", className)}
        {...props}
      >
        {children}
      </div>
    </TabsContext.Provider>
  )
})

// ── TabsList ───────────────────────────────────────────────────────
const LIST_CLASSES: Record<TabsVariant, string> = {
  underline: "flex items-center gap-0 border-b border-border",
  pill: "inline-flex items-center gap-1 rounded-[10px] bg-muted p-1",
  segmented:
    "inline-flex items-center overflow-hidden rounded-lg border border-border",
  vertical: "flex min-w-[180px] flex-col gap-0.5",
}

const TabsList = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function TabsList({ className, children, ...props }, forwardedRef) {
  const { variant, value } = useTabsContext("TabsList")
  const listRef = React.useRef<HTMLDivElement>(null)
  // The list measures itself for the sliding indicator and still has to hand
  // the node to the caller.
  React.useImperativeHandle(forwardedRef, () => listRef.current as HTMLDivElement)
  const [indicator, setIndicator] = React.useState<{
    left: number
    top: number
    width: number
    height: number
  } | null>(null)

  // The underline/pill variants get a single element that slides under the
  // active trigger instead of each trigger toggling its own border/background.
  const hasIndicator = variant === "underline" || variant === "pill"

  React.useLayoutEffect(() => {
    if (!hasIndicator) return
    const list = listRef.current
    if (!list) return

    const measure = () => {
      const active = list.querySelector<HTMLElement>(
        '[data-slot="tabs-trigger"][data-state="active"]',
      )
      if (!active) {
        setIndicator(null)
        return
      }
      setIndicator({
        left: active.offsetLeft,
        top: active.offsetTop,
        width: active.offsetWidth,
        height: active.offsetHeight,
      })
    }

    measure()
    // Re-measure when the list or any trigger changes size (badges loading,
    // container resize, font swaps).
    const ro = new ResizeObserver(measure)
    ro.observe(list)
    list
      .querySelectorAll('[data-slot="tabs-trigger"]')
      .forEach((el) => ro.observe(el))
    return () => ro.disconnect()
  }, [hasIndicator, value, variant, children])

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-orientation={variant === "vertical" ? "vertical" : "horizontal"}
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(hasIndicator && "relative", LIST_CLASSES[variant], className)}
      {...props}
    >
      {hasIndicator && indicator && (
        <span
          aria-hidden
          data-slot="tabs-indicator"
          className={cn(
            "pointer-events-none absolute z-0 transition-[transform,width,height] duration-200 ease-out motion-reduce:transition-none",
            variant === "underline" && "bottom-0 left-0 h-0.5 rounded-full bg-primary",
            variant === "pill" && "top-0 left-0 rounded-md bg-background shadow-sm",
          )}
          style={
            variant === "pill"
              ? {
                  width: indicator.width,
                  height: indicator.height,
                  transform: `translate(${indicator.left}px, ${indicator.top}px)`,
                }
              : {
                  width: indicator.width,
                  transform: `translateX(${indicator.left}px)`,
                }
          }
        />
      )}
      {children}
    </div>
  )
})

// ── ScrollableTabsList ─────────────────────────────────────────────
// A <TabsList> for bars too wide to fit — horizontal scrolling with arrow
// buttons that appear only on the side that still has content. The buttons are
// aria-hidden: the tabs themselves already answer to arrow keys (roving focus),
// so these are a pointer affordance, not a second control.
function ScrollableTabsList({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const wrapRef = React.useRef<HTMLDivElement>(null)
  const [edges, setEdges] = React.useState({ start: false, end: false })

  const measure = React.useCallback(() => {
    const el = wrapRef.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    setEdges({
      start: el.scrollLeft > 1,
      // 1px of slack: fractional layout widths never land exactly on `max`.
      end: el.scrollLeft < max - 1,
    })
  }, [])

  React.useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    measure()
    el.addEventListener("scroll", measure, { passive: true })
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    for (const child of el.children) ro.observe(child)
    return () => {
      el.removeEventListener("scroll", measure)
      ro.disconnect()
    }
  }, [measure, children])

  const nudge = (dir: 1 | -1) => {
    const el = wrapRef.current
    if (!el) return
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" })
  }

  return (
    <div data-slot="scrollable-tabs" className="relative flex items-center">
      {edges.start && (
        <ArrowButton side="start" onClick={() => nudge(-1)} />
      )}
      <div
        ref={wrapRef}
        data-slot="scrollable-tabs-viewport"
        // The scrollbar itself is hidden; the arrows and swipe are the affordance.
        className="w-full overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <TabsList className={cn("w-max min-w-full", className)} {...props}>
          {children}
        </TabsList>
      </div>
      {edges.end && <ArrowButton side="end" onClick={() => nudge(1)} />}
    </div>
  )
}

function ArrowButton({
  side,
  onClick,
}: {
  side: "start" | "end"
  onClick: () => void
}) {
  return (
    <button
      type="button"
      tabIndex={-1}
      aria-hidden
      data-slot="scrollable-tabs-arrow"
      data-side={side}
      onClick={onClick}
      className={cn(
        "absolute top-0 bottom-0 z-[2] flex w-8 items-center bg-gradient-to-r from-background via-background to-transparent text-muted-foreground transition-colors hover:text-foreground",
        side === "start"
          ? "left-0 justify-start"
          : "right-0 justify-end bg-gradient-to-l",
      )}
    >
      {side === "start" ? (
        <ChevronLeft className="size-4" />
      ) : (
        <ChevronRight className="size-4" />
      )}
    </button>
  )
}

// ── TabsTrigger ────────────────────────────────────────────────────
const TRIGGER_CLASSES: Record<TabsVariant, string> = {
  // underline + pill no longer draw their own active border/background —
  // <TabsList> renders a single sliding indicator behind the active trigger.
  underline:
    "-mb-px gap-1.5 border-b-2 border-transparent px-4 py-2.5 text-[13.5px] font-medium text-muted-foreground hover:text-foreground data-[state=active]:font-semibold data-[state=active]:text-primary",
  pill: "gap-1.5 rounded-md px-3.5 py-2 text-[13px] font-medium text-muted-foreground hover:text-foreground data-[state=active]:font-semibold data-[state=active]:text-foreground",
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

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  function TabsTrigger(
    { value, badge, className, children, onClick, onKeyDown, ...props },
    ref,
  ) {
  const { value: current, setValue, variant, activationMode, baseId } =
    useTabsContext("TabsTrigger")
  const selected = current === value

  // Roving tabindex: one stop for the whole tablist, arrows move within it.
  const move = (el: HTMLElement, dir: 1 | -1 | "first" | "last") => {
    const list = el.closest('[role="tablist"]')
    if (!list) return
    const tabs = [
      ...list.querySelectorAll<HTMLButtonElement>(
        '[data-slot="tabs-trigger"]:not([disabled])',
      ),
    ]
    if (!tabs.length) return
    const i = tabs.indexOf(el as HTMLButtonElement)
    const next =
      dir === "first"
        ? tabs[0]
        : dir === "last"
          ? tabs[tabs.length - 1]
          : tabs[(i + dir + tabs.length) % tabs.length]
    next.focus()
    if (activationMode === "automatic") next.click()
  }

  const vertical = variant === "vertical"

  return (
    <button
      ref={ref}
      type="button"
      role="tab"
      id={`${baseId}-tab-${value}`}
      aria-controls={`${baseId}-panel-${value}`}
      aria-selected={selected}
      // Only the selected tab is in the tab order; arrows reach the rest.
      tabIndex={selected ? 0 : -1}
      data-slot="tabs-trigger"
      data-state={selected ? "active" : "inactive"}
      onKeyDown={(e) => {
        onKeyDown?.(e)
        if (e.defaultPrevented) return
        const prevKey = vertical ? "ArrowUp" : "ArrowLeft"
        const nextKey = vertical ? "ArrowDown" : "ArrowRight"
        if (e.key === nextKey) {
          e.preventDefault()
          move(e.currentTarget, 1)
        } else if (e.key === prevKey) {
          e.preventDefault()
          move(e.currentTarget, -1)
        } else if (e.key === "Home") {
          e.preventDefault()
          move(e.currentTarget, "first")
        } else if (e.key === "End") {
          e.preventDefault()
          move(e.currentTarget, "last")
        }
      }}
      onClick={(e) => {
        onClick?.(e)
        if (!e.defaultPrevented) setValue(value)
      }}
      className={cn(
        "relative z-[1] inline-flex items-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 [&_svg]:size-4 [&_svg]:shrink-0",
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
})

// ── TabsContent ────────────────────────────────────────────────────
export interface TabsContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  value: string
}

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  function TabsContent({ value, className, ...props }, ref) {
    const { value: current, baseId } = useTabsContext("TabsContent")
    if (current !== value) return null
    return (
      <div
        ref={ref}
        role="tabpanel"
        id={`${baseId}-panel-${value}`}
        aria-labelledby={`${baseId}-tab-${value}`}
        // Panels are focusable so keyboard users can reach content that has no
        // focusable child of its own.
        tabIndex={0}
        data-slot="tabs-content"
        className={cn(
          // mt-2 matches shadcn's spacing, which callers already expect.
          "mt-2 outline-none animate-in fade-in-0 slide-in-from-bottom-1 duration-200 motion-reduce:animate-none",
          className,
        )}
        {...props}
      />
    )
  },
)

export { Tabs, TabsList, ScrollableTabsList, TabsTrigger, TabsContent }
