"use client";

import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import React from "react";
import { BookColumns } from "./columns";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Books } from "@/app/actions/query/books.query";
import { useBookTableStore } from "@/store/book-table-store";
import { IBookTableColumnType } from "@/types/book.zod";

interface BookTableProps {
  initialData: string;
  initialCursor: string | null;
  initialHasMore: boolean;
  totalCount: number;
  search?: string;
}

export default function BookTable({
  initialData,
  initialCursor,
  initialHasMore,
  totalCount,
  search,
}: BookTableProps) {

  const data = useBookTableStore(s => s.data)
  const cursor = useBookTableStore(s => s.cursor)
  const hasMore = useBookTableStore(s => s.hasMore)
  const isLoading = useBookTableStore(s => s.isLoading)
  const isError = useBookTableStore(s => s.error)

  const setData = useBookTableStore(s => s.setData)
  const setTotal = useBookTableStore(s => s.setTotal)
  const setCursor = useBookTableStore(s => s.setCursor)
  const setHasMore = useBookTableStore(s => s.setHasMore)
  const setLoading = useBookTableStore(s => s.setLoading)
  const setError = useBookTableStore(s => s.setError)

  const rowSelection = useBookTableStore(s => s.rowSelection)
  const clearSelection = useBookTableStore(s => s.clearSelection) 
  const setRowSelection = useBookTableStore(s => s.setRowSelection) 

  React.useEffect(() => {
    setData(
      JSON.parse(initialData) as IBookTableColumnType[]
    );
    setCursor(initialCursor);
    setHasMore(initialHasMore);
    setTotal(totalCount);
  }, [initialData, initialCursor, initialHasMore, totalCount, setData, setCursor, setHasMore, setError, setTotal]);

  const loadingRef = React.useRef(false);
  const sentinelRef = React.useRef<HTMLDivElement>(null);

  const loadMore = React.useCallback(async () => {
    if (loadingRef.current || !hasMore || !cursor) return;
    loadingRef.current = true;
    setLoading(true);
    setError(null); 

    try {
      const params: { [key: string]: string | undefined } = { cursor };
      if (search) params.search = search;

      const response = await Books({
        searchParams: Promise.resolve(params),
      });

      if (!response.success) throw new Error(response.error);

      const { books, nextCursor, hasMore: more } = response.data;
      const booksObject = JSON.parse(books) as IBookTableColumnType[]

      setData([...data, ...booksObject]);
      setCursor(nextCursor);
      setHasMore(more); 

    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [cursor, hasMore, search]);

  React.useEffect(() => {
    return () => clearSelection()
  }, [clearSelection])

  const table = useReactTable({
    data,
    columns: BookColumns(),
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => String(`${row._id}_${row.code}`),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    state: { rowSelection }
  }); 

  return (
    <React.Fragment>
      <Card className="h-[95%] p-0 overflow-hidden rounded-lg">
        <Table className="w-full table-auto">
          <TableHeader className="sticky top-0 bg-background z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
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
                <TableCell colSpan={BookColumns().length} className="h-42 text-center">
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
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : (
              <Button
                variant="outline"
                onClick={loadMore}
                disabled={isLoading}
                className="w-full"
              >
                Load more
              </Button>
            )}
          </div>
        )}
        {isError && (
          <div className="flex items-center justify-center gap-2 py-4 text-sm text-destructive">
            {isError}
            <button onClick={loadMore} className="underline">
              Retry
            </button>
          </div>
        )}
      </Card>

      <div className="pt-4">
        Showing {data.length} out of {totalCount} results.
      </div>
    </React.Fragment>
  );
}
