"use client"

import * as React from "react"
import {
  createPaginatedRowModel,
  createSortedRowModel,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  columnVisibilityFeature,
  tableFeatures,
  useTable,
  type ColumnDef,
  type RowData,
} from "@tanstack/react-table"
import {
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Settings2,
} from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table"
import { Checkbox } from "./checkbox"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover"

// ── DataTable ───────────────────────────────────────────────────────
// The presentational <Table> plus the behaviour every list screen re-implements:
// sorting, pagination, row selection and column visibility, on TanStack Table.
//
// Built against @tanstack/react-table **v9** — `useTable` with features
// registered through `tableFeatures`, not v8's `useReactTable` + `get*RowModel`
// options. v8 will not run this file; the registry item pins the version.
//
//   <DataTable columns={columns} data={rows} selectable pageSize={20} />

// Registered once at module scope: features and their row-model slots must be
// stable, or every render invalidates the models built from them.
const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
  rowSelectionFeature,
  columnVisibilityFeature,
})

type Features = typeof features

export type DataTableColumn<TData extends RowData> = ColumnDef<
  Features,
  TData,
  unknown
>

export interface DataTableProps<TData extends RowData>
  extends React.ComponentProps<"div"> {
  columns: DataTableColumn<TData>[]
  data: TData[]
  /** Add a leading checkbox column and expose the selection count. */
  selectable?: boolean
  /** Rows per page. Pass 0 to render every row and hide the pager. */
  pageSize?: number
  /** Show the column-visibility menu. */
  columnToggle?: boolean
  onRowSelectionChange?: (selectedRows: TData[]) => void
  /** Shown in place of the body when there is nothing to list. */
  emptyState?: React.ReactNode
}

function DataTable<TData extends RowData>({
  columns,
  data,
  selectable = false,
  pageSize = 10,
  columnToggle = false,
  onRowSelectionChange,
  emptyState,
  className,
  ...props
}: DataTableProps<TData>) {
  const paginated = pageSize > 0

  const allColumns = React.useMemo<DataTableColumn<TData>[]>(() => {
    if (!selectable) return columns
    const selectColumn = {
      id: "__select",
      enableSorting: false,
      enableHiding: false,
      size: 36,
      header: ({ table }) => (
        <Checkbox
          aria-label="Select all rows on this page"
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          aria-label="Select row"
          checked={row.getIsSelected()}
          onCheckedChange={(v) => row.toggleSelected(!!v)}
        />
      ),
    } as DataTableColumn<TData>
    return [selectColumn, ...columns]
  }, [columns, selectable])

  const table = useTable({
    features,
    columns: allColumns,
    data,
    initialState: paginated ? { pagination: { pageIndex: 0, pageSize } } : undefined,
  })

  // Report selection upward as rows, not as the internal id map.
  // Both the table instance and the callback are fresh objects on every render,
  // so neither can be a dependency — the effect would re-run, hand the parent a
  // new array, and re-render forever. The dependency is the selection *by
  // value*; the rest is read through refs at the moment it fires.
  const onSelectRef = React.useRef(onRowSelectionChange)
  const tableRef = React.useRef(table)
  // Refs are synced in an effect, never during render. Declared first, so it
  // commits before the notifier below reads them.
  React.useEffect(() => {
    onSelectRef.current = onRowSelectionChange
    tableRef.current = table
  })

  const selectionKey = Object.keys(table.state.rowSelection ?? {})
    .sort()
    .join(",")

  React.useEffect(() => {
    onSelectRef.current?.(
      tableRef.current.getSelectedRowModel().rows.map((r) => r.original as TData),
    )
  }, [selectionKey])

  const rows = table.getRowModel().rows
  const hideableColumns = table
    .getAllColumns()
    .filter((c) => c.getCanHide?.() !== false && c.id !== "__select")

  return (
    <div data-slot="data-table" className={cn("flex flex-col gap-3", className)} {...props}>
      {(columnToggle || selectable) && (
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-muted-foreground">
            {selectable &&
              `${table.getSelectedRowModel().rows.length} of ${data.length} selected`}
          </span>
          {columnToggle && (
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  data-slot="data-table-columns"
                  className="inline-flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-medium transition-colors hover:bg-muted focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                  <Settings2 className="size-3.5" />
                  Columns
                </button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-48 p-1.5">
                {hideableColumns.map((column) => (
                  <label
                    key={column.id}
                    className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-muted"
                  >
                    <Checkbox
                      checked={column.getIsVisible()}
                      onCheckedChange={(v) => column.toggleVisibility(!!v)}
                    />
                    {String(column.columnDef.header ?? column.id)}
                  </label>
                ))}
              </PopoverContent>
            </Popover>
          )}
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id}>
                {group.headers.map((header) => {
                  const sortable = header.column.getCanSort?.()
                  const sorted = header.column.getIsSorted?.()
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : sortable ? (
                        <button
                          type="button"
                          onClick={header.column.getToggleSortingHandler?.()}
                          // aria-sort belongs on the cell, so the button just
                          // labels itself and the header carries the state.
                          className="inline-flex items-center gap-1 rounded-md transition-colors hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
                        >
                          <table.FlexRender header={header} />
                          {sorted === "asc" ? (
                            <ArrowUp className="size-3.5" />
                          ) : sorted === "desc" ? (
                            <ArrowDown className="size-3.5" />
                          ) : (
                            <ChevronsUpDown className="size-3.5 opacity-40" />
                          )}
                        </button>
                      ) : (
                        <table.FlexRender header={header} />
                      )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={allColumns.length}
                  className="h-24 text-center text-sm text-muted-foreground"
                >
                  {emptyState ?? "No results."}
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected?.() ? "selected" : undefined}
                >
                  {row.getAllCells().map((cell) => (
                    <TableCell key={cell.id}>
                      <table.FlexRender cell={cell} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {paginated && table.getPageCount() > 1 && (
        <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>
            Page {table.state.pagination.pageIndex + 1} of {table.getPageCount()}
          </span>
          <div className="flex items-center gap-1">
            <PagerButton
              label="Previous page"
              disabled={!table.getCanPreviousPage()}
              onClick={() => table.previousPage()}
            >
              <ChevronLeft />
            </PagerButton>
            <PagerButton
              label="Next page"
              disabled={!table.getCanNextPage()}
              onClick={() => table.nextPage()}
            >
              <ChevronRight />
            </PagerButton>
          </div>
        </div>
      )}
    </div>
  )
}

function PagerButton({
  label,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="inline-flex size-7 items-center justify-center rounded-lg border transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none [&_svg]:size-4"
      {...props}
    >
      {children}
    </button>
  )
}

export { DataTable, features as dataTableFeatures }
