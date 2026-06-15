import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export type PropRow = { prop: string; type: string; default?: string; desc: string }

export function PropsTable({ rows }: { rows: PropRow[] }) {
  return (
    <div className="my-4 overflow-hidden rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>Prop</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Default</TableHead>
            <TableHead>Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map(r => (
            <TableRow key={r.prop}>
              <TableCell className="font-mono font-medium whitespace-nowrap">{r.prop}</TableCell>
              <TableCell className="font-mono text-[12px] text-muted-foreground whitespace-nowrap">{r.type}</TableCell>
              <TableCell className="font-mono text-[12px] text-muted-foreground whitespace-nowrap">{r.default ?? "—"}</TableCell>
              <TableCell className="leading-relaxed text-muted-foreground">{r.desc}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
