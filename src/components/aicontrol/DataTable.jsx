import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export default function DataTable({ columns, rows, loading, emptyLabel = "No records." }) {
  if (loading) return <Skeleton className="h-40 w-full" />;
  if (!rows?.length) {
    return <p className="text-sm text-muted-foreground py-10 text-center border border-dashed border-border rounded-lg">{emptyLabel}</p>;
  }
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((c) => (
              <TableHead key={c.key} className="whitespace-nowrap">{c.label}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              {columns.map((c) => (
                <TableCell key={c.key} className={`whitespace-nowrap max-w-[280px] truncate ${c.className || ""}`}>
                  {c.render ? c.render(row) : (row[c.key] ?? "—")}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}