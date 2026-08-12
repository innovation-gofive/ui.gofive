"use client"

import * as React from "react"
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"

function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto"
    >
      <table
        data-slot="table"
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  )
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:border-b", className)}
      {...props}
    />
  )
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  )
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
        className,
      )}
      {...props}
    />
  )
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
        className,
      )}
      {...props}
    />
  )
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "h-10 px-3 text-left align-middle text-[12.5px] font-semibold whitespace-nowrap text-muted-foreground [&:has([role=checkbox])]:pr-0",
        className,
      )}
      {...props}
    />
  )
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "p-3 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0",
        className,
      )}
      {...props}
    />
  )
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("mt-4 text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

// ── DataTable ───────────────────────────────────────────────────────
export interface DataTableColumn<T> {
  key: string
  header: React.ReactNode
  /** Cell renderer. Defaults to `String(row[key])`. */
  cell?: (row: T) => React.ReactNode
  /** Enable click-to-sort on this column. */
  sortable?: boolean
  /** Value used for sorting. Defaults to `row[key]`. */
  sortValue?: (row: T) => string | number
  className?: string
  headClassName?: string
}

export interface DataTableProps<T> extends React.ComponentProps<"table"> {
  columns: DataTableColumn<T>[]
  rows: T[]
  /** Stable row identity — index by default. */
  rowKey?: (row: T, index: number) => React.Key
  /** Freeze the header while the body scrolls. Needs a bounded height on `containerClassName`. */
  stickyHeader?: boolean
  onRowClick?: (row: T) => void
  empty?: React.ReactNode
  containerClassName?: string
}

/** Client-side sorting over a plain array — no data-grid dependency. */
function DataTable<T>({
  columns,
  rows,
  rowKey,
  stickyHeader = false,
  onRowClick,
  empty = "No results.",
  className,
  containerClassName,
  ...props
}: DataTableProps<T>) {
  const [sort, setSort] = React.useState<{ key: string; desc: boolean } | null>(
    null,
  )

  const sorted = React.useMemo(() => {
    if (!sort) return rows
    const col = columns.find((c) => c.key === sort.key)
    if (!col) return rows
    const value = (row: T) =>
      col.sortValue
        ? col.sortValue(row)
        : ((row as Record<string, unknown>)[col.key] as string | number)
    // Copy first: Array.prototype.sort mutates, and `rows` is the caller's array.
    return [...rows].sort((a, b) => {
      const av = value(a)
      const bv = value(b)
      if (av === bv) return 0
      const cmp = av > bv ? 1 : -1
      return sort.desc ? -cmp : cmp
    })
  }, [rows, columns, sort])

  const toggleSort = (key: string) =>
    setSort((s) => (s?.key === key ? { key, desc: !s.desc } : { key, desc: false }))

  return (
    <div
      data-slot="data-table-container"
      className={cn("relative w-full overflow-auto", containerClassName)}
    >
      <table
        data-slot="data-table"
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      >
        <TableHeader
          className={cn(
            stickyHeader && "sticky top-0 z-10 bg-background shadow-[0_1px_0_0_var(--color-border)]",
          )}
        >
          <TableRow>
            {columns.map((col) => {
              const active = sort?.key === col.key
              return (
                <TableHead key={col.key} className={col.headClassName}>
                  {col.sortable ? (
                    <button
                      type="button"
                      onClick={() => toggleSort(col.key)}
                      aria-sort={
                        active ? (sort.desc ? "descending" : "ascending") : "none"
                      }
                      className={cn(
                        "-mx-1 inline-flex items-center gap-1 rounded px-1 py-0.5 outline-none transition-colors hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50",
                        active && "text-foreground",
                      )}
                    >
                      {col.header}
                      {active ? (
                        sort.desc ? (
                          <ArrowDown className="size-3.5" />
                        ) : (
                          <ArrowUp className="size-3.5" />
                        )
                      ) : (
                        <ChevronsUpDown className="size-3.5 opacity-50" />
                      )}
                    </button>
                  ) : (
                    col.header
                  )}
                </TableHead>
              )
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center text-muted-foreground"
              >
                {empty}
              </TableCell>
            </TableRow>
          ) : (
            sorted.map((row, i) => (
              <TableRow
                key={rowKey ? rowKey(row, i) : i}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={onRowClick && "cursor-pointer"}
              >
                {columns.map((col) => (
                  <TableCell key={col.key} className={col.className}>
                    {col.cell
                      ? col.cell(row)
                      : String((row as Record<string, unknown>)[col.key] ?? "")}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </table>
    </div>
  )
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  DataTable,
}
