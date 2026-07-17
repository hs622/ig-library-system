"use client"

import React from "react";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { MemberColumns } from "./columns";
import { IMemberSchema } from "@/types/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useResourceSelectionStore } from "@/store/use-resource-selection-store";

interface MemberTableProps {
  initialData: IMemberSchema[];
  initialCursor: string | null;
  initialHasMore: boolean;
  search?: string;
}


export default function UserTable({
  initialData,
  initialCursor,
  initialHasMore,
  search
}: MemberTableProps) {
  const [data, setData] = React.useState<IMemberSchema[]>(initialData);
  const [cursor, setCursor] = React.useState<string | null>(initialCursor);
  const [hasMore, setHasMore] = React.useState(initialHasMore);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const rowSelection = useResourceSelectionStore(s => s.rowSelection)
  const setRowSelection = useResourceSelectionStore(s => s.setRowSelection)
  const clearSelection = useResourceSelectionStore(s => s.clearSelection)

  const loadingRef = React.useRef(false);
  const sentinelRef = React.useRef<HTMLDivElement>(null);

  const loadMore = React.useCallback(async () => {
    if (loadingRef.current || !hasMore || !cursor) return;
    loadingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({ cursor });
      if (search) params.set("search", search);

      const res = await fetch(`/api/books?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to load more books");

      const json = await res.json();
      setData((prev) => [...prev, ...json.books]);
      setCursor(json.nextCursor);
      setHasMore(json.hasMore);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      // loadingRef.current = false;
      setLoading(false);
    }
  }, [cursor, hasMore, search]);
  
  React.useEffect(() => {
    return () => clearSelection()
  }, [clearSelection])

  const table = useReactTable({
    data,
    columns: MemberColumns(),
    getCoreRowModel: getCoreRowModel(),

    getRowId: (row) => row._id,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    state: { rowSelection }
  })


  return (
    <Card className=" h-fit p-0 overflow-hidden">
      <Table className="w-full table-auto">
        <TableHeader>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <TableHead
                  key={header.id}
                  className={`${header.column.columnDef.meta?.className}`}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id} data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={`${cell.column.columnDef.meta?.className}`}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={MemberColumns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {hasMore && (
        <div
          ref={sentinelRef}
          className="mx-4 flex flex-col items-center justify-center gap-2 pb-4"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          ) : (
            <Button
              variant="outline"
              onClick={loadMore}
              disabled={loading}
              className="w-full"
            >
              Load more
            </Button>
          )}
        </div>
      )}
      {error && (
        <div className="flex items-center justify-center gap-2 py-4 text-sm text-destructive">
          {error}
          <button onClick={loadMore} className="underline">
            Retry
          </button>
        </div>
      )}
    </Card>
  )
}