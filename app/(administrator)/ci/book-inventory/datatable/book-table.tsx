"use client";

import { Card } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import React from "react";
import { Loader2 } from "lucide-react";
import { BookColumns, BookRow } from "./columns";
import { useResourceSelectionStore } from "@/hooks/use-book-selection-store";

interface BookTableProps {
  initialData: BookRow[];
  initialCursor: string | null;
  initialHasMore: boolean;
  search?: string;
}

export default function BookTable({
  initialData,
  initialCursor,
  initialHasMore,
  search,
}: BookTableProps) {
  const [data, setData] = React.useState<BookRow[]>(initialData);
  const [cursor, setCursor] = React.useState<string | null>(initialCursor);
  const [hasMore, setHasMore] = React.useState(initialHasMore);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const rowSelection = useResourceSelectionStore((s) => s.rowSelection)
  const setRowSelection = useResourceSelectionStore((s) => s.setRowSelection)
  const clearSelection = useResourceSelectionStore((s) => s.clearSelection)

  const loadingRef = React.useRef(false);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
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
      loadingRef.current = false;
      setLoading(false);
    }
  }, [cursor, hasMore, search]);

  React.useEffect(() => {
    const sentinel = sentinelRef.current;
    const root = scrollContainerRef.current;
    if (!sentinel || !root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      {
        root, // scope intersection to the scrollable table, not the page
        rootMargin: "100px",
        threshold: 0,
      },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  React.useEffect(() => {
    return () => clearSelection()
  }, [clearSelection])

  const table = useReactTable({
    data,
    columns: BookColumns(),
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row._id,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    state: { rowSelection }
  });

  return (
    <Card
      ref={scrollContainerRef}
      className="p-0! max-h-full h-fit overflow-y-auto"
    >
      <Table className="table-fixed min-w-full">
        <TableHeader className="sticky top-0 bg-background z-10">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
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
              <TableCell colSpan={BookColumns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {hasMore && (
        <div ref={sentinelRef} className="flex items-center justify-center py-4">
          {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
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

      {!hasMore && data.length > 0 && (
        <div className="py-2 text-center text-sm text-muted-foreground">
          No more books.
        </div>
      )}
    </Card>
  );
}