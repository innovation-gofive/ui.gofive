"use client"

import * as React from "react"
import { ResponsivePopover as PopoverPrimitive } from "./responsive-popover"
import { ChevronRight, ChevronDown, Check, Search, Folder, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

// ── Data model ──────────────────────────────────────────────────────
export interface TreeNode {
  value: string
  label: string
  children?: TreeNode[]
  count?: number
  disabled?: boolean
}

// ── Shared popover panel ────────────────────────────────────────────
const PANEL_CLASS =
  "z-50 origin-(--radix-popover-content-transform-origin) rounded-xl border bg-popover p-3 text-popover-foreground shadow-lg outline-none animate-in fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"

const TRIGGER_CLASS =
  "flex h-[38px] w-full items-center gap-2 rounded-lg border bg-card px-3 text-sm outline-none transition-[color,box-shadow] data-[state=open]:border-ring data-[state=open]:ring-ring/50 data-[state=open]:ring-[3px] disabled:pointer-events-none disabled:opacity-50"

// ── Tree helpers ────────────────────────────────────────────────────
function isLeaf(node: TreeNode): boolean {
  return !node.children || node.children.length === 0
}

// collect all selectable (non-disabled) leaf values under a node
function leafValues(node: TreeNode): string[] {
  if (isLeaf(node)) return node.disabled ? [] : [node.value]
  return (node.children ?? []).flatMap(leafValues)
}

// flatten the tree to a value → node map and value → path (labels) map
function buildIndex(data: TreeNode[]) {
  const nodeByValue = new Map<string, TreeNode>()
  const pathByValue = new Map<string, string[]>()
  const walk = (nodes: TreeNode[], trail: string[]) => {
    for (const n of nodes) {
      const next = [...trail, n.label]
      nodeByValue.set(n.value, n)
      pathByValue.set(n.value, next)
      if (n.children) walk(n.children, next)
    }
  }
  walk(data, [])
  return { nodeByValue, pathByValue }
}

// filter a tree by label, keeping ancestors of matches
function filterTree(nodes: TreeNode[], query: string): TreeNode[] {
  const q = query.trim().toLowerCase()
  if (!q) return nodes
  const recurse = (list: TreeNode[]): TreeNode[] => {
    const out: TreeNode[] = []
    for (const n of list) {
      const selfMatch = n.label.toLowerCase().includes(q)
      const kids = n.children ? recurse(n.children) : []
      if (selfMatch || kids.length > 0) {
        out.push({ ...n, children: n.children ? kids : undefined })
      }
    }
    return out
  }
  return recurse(nodes)
}

function collectFolderValues(nodes: TreeNode[]): string[] {
  const out: string[] = []
  const walk = (list: TreeNode[]) => {
    for (const n of list) {
      if (!isLeaf(n)) {
        out.push(n.value)
        walk(n.children!)
      }
    }
  }
  walk(nodes)
  return out
}

// ── Chevron / icon column ───────────────────────────────────────────
function NodeIcon({ node, expanded }: { node: TreeNode; expanded: boolean }) {
  if (isLeaf(node)) {
    return <span className="size-4 shrink-0" aria-hidden />
  }
  return (
    <span className="flex size-4 shrink-0 items-center justify-center text-muted-foreground">
      {expanded ? (
        <ChevronDown className="size-3.5" />
      ) : (
        <ChevronRight className="size-3.5" />
      )}
    </span>
  )
}

// ── TreeSelect (single) ─────────────────────────────────────────────
export interface TreeSelectProps {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  data: TreeNode[]
  placeholder?: string
  searchable?: boolean
  defaultExpanded?: string[]
  disabled?: boolean
  breadcrumb?: boolean
  className?: string
  align?: "start" | "center" | "end"
}

function TreeSelect({
  value,
  defaultValue,
  onValueChange,
  data,
  placeholder = "Select…",
  searchable = false,
  defaultExpanded,
  disabled,
  breadcrumb = true,
  className,
  align = "start",
}: TreeSelectProps) {
  const isControlled = value !== undefined
  const [internal, setInternal] = React.useState(defaultValue)
  const current = isControlled ? value : internal

  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const [expanded, setExpanded] = React.useState<Set<string>>(
    () => new Set(defaultExpanded ?? [])
  )

  const { pathByValue } = React.useMemo(() => buildIndex(data), [data])
  const filtered = React.useMemo(
    () => (searchable ? filterTree(data, query) : data),
    [data, query, searchable]
  )

  // auto-expand all when searching
  const effectiveExpanded = React.useMemo(() => {
    if (searchable && query.trim()) return new Set(collectFolderValues(filtered))
    return expanded
  }, [searchable, query, filtered, expanded])

  const toggleExpand = (val: string) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(val)) next.delete(val)
      else next.add(val)
      return next
    })
  }

  const select = (val: string) => {
    if (!isControlled) setInternal(val)
    onValueChange?.(val)
    setOpen(false)
  }

  const path = current ? pathByValue.get(current) : undefined
  const hasValue = path != null

  const renderNode = (node: TreeNode, depth: number): React.ReactNode => {
    const leaf = isLeaf(node)
    const isOpen = effectiveExpanded.has(node.value)
    const selected = current === node.value

    return (
      <div key={node.value} data-slot="tree-node">
        <button
          type="button"
          disabled={node.disabled}
          onClick={() => (leaf ? select(node.value) : toggleExpand(node.value))}
          data-selected={selected || undefined}
          className={cn(
            "flex w-full items-center gap-1.5 rounded-md py-1.5 pr-2 text-left text-sm outline-none transition-colors",
            "hover:bg-accent focus-visible:bg-accent",
            selected && "bg-primary/10 font-semibold text-foreground",
            node.disabled && "pointer-events-none opacity-50"
          )}
          style={{ paddingLeft: depth * 18 + 6 }}
        >
          <NodeIcon node={node} expanded={isOpen} />
          {leaf ? (
            <span className="size-1.5 shrink-0 rounded-full bg-muted-foreground/40" aria-hidden />
          ) : (
            <Folder className="size-4 shrink-0 text-primary" />
          )}
          <span className="min-w-0 flex-1 truncate">{node.label}</span>
          {node.count != null && (
            <span className="shrink-0 font-mono text-[11px] text-muted-foreground/70">
              {node.count}
            </span>
          )}
          {selected && <Check className="size-4 shrink-0 text-primary" />}
        </button>
        {!leaf && isOpen && (
          <div data-slot="tree-children" className="relative">
            <span
              className="absolute bottom-1 top-0 w-px bg-border"
              style={{ left: depth * 18 + 13 }}
              aria-hidden
            />
            {node.children!.map((child) => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild disabled={disabled}>
        <button
          type="button"
          data-slot="tree-select-trigger"
          className={cn(TRIGGER_CLASS, className)}
        >
          {hasValue ? (
            <span className="flex min-w-0 flex-1 items-center gap-1 truncate">
              {breadcrumb && path!.length > 1 && (
                <span className="truncate text-muted-foreground">
                  {path!.slice(0, -1).join(" / ")} /
                </span>
              )}
              <span className="truncate font-semibold text-foreground">
                {path![path!.length - 1]}
              </span>
            </span>
          ) : (
            <span className="flex-1 truncate text-muted-foreground">{placeholder}</span>
          )}
          <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
        </button>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          data-slot="tree-select-popover"
          align={align}
          sideOffset={6}
          className={cn(PANEL_CLASS, "w-(--radix-popover-trigger-width) min-w-[260px] p-2")}
        >
          {searchable && (
            <div className="mb-2 flex items-center gap-2 rounded-lg bg-muted px-2.5 py-1.5">
              <Search className="size-3.5 shrink-0 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search…"
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
          )}
          <div className="max-h-[300px] overflow-y-auto pr-0.5">
            {filtered.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">No results</p>
            ) : (
              filtered.map((node) => renderNode(node, 0))
            )}
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  )
}

// ── TreeMultiSelect ─────────────────────────────────────────────────
export interface TreeMultiSelectProps {
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
  data: TreeNode[]
  placeholder?: string
  searchable?: boolean
  defaultExpanded?: string[]
  showFooter?: boolean
  disabled?: boolean
  className?: string
  align?: "start" | "center" | "end"
}

type NodeState = "checked" | "indeterminate" | "unchecked"

function TreeMultiSelect({
  value,
  defaultValue,
  onValueChange,
  data,
  placeholder = "Select…",
  searchable = false,
  defaultExpanded,
  showFooter = true,
  disabled,
  className,
  align = "start",
}: TreeMultiSelectProps) {
  const isControlled = value !== undefined
  const [internal, setInternal] = React.useState<string[]>(defaultValue ?? [])
  const committed = isControlled ? value! : internal

  // draft selection while the popover is open (only applied on footer Apply)
  const [draft, setDraft] = React.useState<string[]>(committed)
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const [expanded, setExpanded] = React.useState<Set<string>>(
    () => new Set(defaultExpanded ?? [])
  )

  // sync draft with committed when (re)opening — opening only ever happens
  // through the trigger, so the handler covers it
  const changeOpen = (next: boolean) => {
    setOpen(next)
    if (next) setDraft(committed)
  }

  const live = showFooter ? draft : committed
  const liveSet = React.useMemo(() => new Set(live), [live])

  const { nodeByValue, pathByValue } = React.useMemo(() => buildIndex(data), [data])

  const filtered = React.useMemo(
    () => (searchable ? filterTree(data, query) : data),
    [data, query, searchable]
  )
  const effectiveExpanded = React.useMemo(() => {
    if (searchable && query.trim()) return new Set(collectFolderValues(filtered))
    return expanded
  }, [searchable, query, filtered, expanded])

  // compute a node's state from its descendant leaves
  const nodeState = React.useCallback(
    (node: TreeNode): NodeState => {
      const leaves = leafValues(node)
      if (leaves.length === 0) {
        return liveSet.has(node.value) ? "checked" : "unchecked"
      }
      const selected = leaves.filter((l) => liveSet.has(l)).length
      if (selected === 0) return "unchecked"
      if (selected === leaves.length) return "checked"
      return "indeterminate"
    },
    [liveSet]
  )

  const commit = (next: string[]) => {
    if (showFooter) {
      setDraft(next)
      return
    }
    if (!isControlled) setInternal(next)
    onValueChange?.(next)
  }

  const toggleNode = (node: TreeNode) => {
    const leaves = leafValues(node)
    const targets = leaves.length > 0 ? leaves : [node.value]
    const state = nodeState(node)
    const next = new Set(live)
    if (state === "checked") {
      targets.forEach((t) => next.delete(t))
    } else {
      targets.forEach((t) => next.add(t))
    }
    commit([...next])
  }

  const toggleExpand = (val: string) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(val)) next.delete(val)
      else next.add(val)
      return next
    })
  }

  const expandAll = () => setExpanded(new Set(collectFolderValues(data)))

  const apply = () => {
    if (!isControlled) setInternal(draft)
    onValueChange?.(draft)
    setOpen(false)
  }

  const clearAll = () => commit([])

  const removeLeaf = (leaf: string) => {
    const next = committed.filter((v) => v !== leaf)
    if (!isControlled) setInternal(next)
    onValueChange?.(next)
    setDraft(next)
  }

  // chips reflect the committed selection (one chip per selected leaf)
  const chips = React.useMemo(
    () => committed.filter((v) => nodeByValue.get(v) && isLeaf(nodeByValue.get(v)!)),
    [committed, nodeByValue]
  )

  const renderNode = (node: TreeNode, depth: number): React.ReactNode => {
    const leaf = isLeaf(node)
    const isOpen = effectiveExpanded.has(node.value)
    const state = nodeState(node)

    return (
      <div key={node.value} data-slot="tree-node">
        <div
          data-state={state}
          className={cn(
            "group flex w-full items-center gap-1.5 rounded-md py-1.5 pr-2 text-sm transition-colors hover:bg-accent",
            state !== "unchecked" && "text-foreground",
            node.disabled && "pointer-events-none opacity-50"
          )}
          style={{ paddingLeft: depth * 18 + 6 }}
        >
          {/* checkbox */}
          <button
            type="button"
            role="checkbox"
            aria-checked={state === "indeterminate" ? "mixed" : state === "checked"}
            disabled={node.disabled}
            onClick={() => toggleNode(node)}
            className={cn(
              "flex size-[18px] shrink-0 items-center justify-center rounded-[5px] border-[1.5px] border-input bg-background text-primary-foreground outline-none transition-colors",
              "hover:border-primary focus-visible:border-primary focus-visible:ring-ring/50 focus-visible:ring-[3px]",
              state === "checked" && "border-primary bg-primary",
              state === "indeterminate" && "border-primary bg-primary"
            )}
          >
            {state === "checked" && <Check className="size-3 stroke-[3.5]" />}
            {state === "indeterminate" && <Minus className="size-3 stroke-[3.5]" />}
          </button>
          {/* chevron (folders) */}
          <button
            type="button"
            onClick={() => !leaf && toggleExpand(node.value)}
            disabled={leaf}
            className="flex flex-1 items-center gap-1.5 overflow-hidden text-left outline-none disabled:cursor-default"
          >
            <NodeIcon node={node} expanded={isOpen} />
            {leaf ? (
              <span
                className="size-1.5 shrink-0 rounded-full bg-muted-foreground/40"
                aria-hidden
              />
            ) : (
              <Folder className="size-4 shrink-0 text-primary" />
            )}
            <span className="min-w-0 flex-1 truncate">{node.label}</span>
            {node.count != null && (
              <span className="shrink-0 font-mono text-[11px] text-muted-foreground/70">
                {node.count}
              </span>
            )}
          </button>
        </div>
        {!leaf && isOpen && (
          <div data-slot="tree-children" className="relative">
            <span
              className="absolute bottom-1 top-0 w-px bg-border"
              // centred on the parent checkbox, clear of the children's boxes
              style={{ left: depth * 18 + 15 }}
              aria-hidden
            />
            {node.children!.map((child) => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={changeOpen}>
      <PopoverPrimitive.Trigger asChild disabled={disabled}>
        <button
          type="button"
          data-slot="tree-multi-select-trigger"
          className={cn(
            TRIGGER_CLASS,
            "h-auto min-h-[38px] flex-wrap py-1.5",
            className
          )}
        >
          {chips.length === 0 ? (
            <span className="flex-1 truncate py-0.5 text-muted-foreground">{placeholder}</span>
          ) : (
            <span className="flex min-w-0 flex-1 flex-wrap items-center gap-1">
              {chips.map((leaf) => {
                const path = pathByValue.get(leaf)
                const label = path ? path.join(" / ") : leaf
                return (
                  <span
                    key={leaf}
                    className="inline-flex max-w-full items-center gap-1 rounded-md bg-muted px-1.5 py-0.5 text-[12px] font-medium text-foreground"
                  >
                    <span className="truncate">{label}</span>
                    <span
                      role="button"
                      tabIndex={-1}
                      aria-label={`Remove ${label}`}
                      onClick={(e) => {
                        e.stopPropagation()
                        removeLeaf(leaf)
                      }}
                      className="grid size-3.5 shrink-0 place-items-center rounded-sm text-muted-foreground hover:bg-foreground/10 hover:text-foreground"
                    >
                      <Minus className="size-3 rotate-45" />
                    </span>
                  </span>
                )
              })}
            </span>
          )}
          {chips.length > 0 && (
            <span className="ml-auto shrink-0 self-center font-mono text-[11px] text-muted-foreground">
              {chips.length} selected
            </span>
          )}
          <ChevronDown className="size-4 shrink-0 self-center text-muted-foreground" />
        </button>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          data-slot="tree-multi-select-popover"
          align={align}
          sideOffset={6}
          className={cn(PANEL_CLASS, "w-(--radix-popover-trigger-width) min-w-[300px] p-0")}
        >
          {searchable && (
            <div className="border-b p-2">
              <div className="flex items-center gap-2 rounded-lg bg-muted px-2.5 py-1.5">
                <Search className="size-3.5 shrink-0 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search…"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
              </div>
            </div>
          )}
          <div className="flex items-center justify-between px-3 pb-1 pt-2.5 text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground">
            <span>Hierarchy</span>
            <button
              type="button"
              onClick={expandAll}
              className="font-medium normal-case tracking-normal text-primary hover:underline"
            >
              Expand all
            </button>
          </div>
          <div className="max-h-[300px] overflow-y-auto px-2 pb-2">
            {filtered.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">No results</p>
            ) : (
              filtered.map((node) => renderNode(node, 0))
            )}
          </div>
          {showFooter && (
            <div className="flex items-center justify-between gap-2 border-t px-3 py-2">
              <button
                type="button"
                onClick={clearAll}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Clear all
              </button>
              <button
                type="button"
                onClick={apply}
                className="inline-flex h-8 items-center rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground outline-none transition-colors hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring"
              >
                Apply ({draft.length})
              </button>
            </div>
          )}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  )
}

export { TreeSelect, TreeMultiSelect }
