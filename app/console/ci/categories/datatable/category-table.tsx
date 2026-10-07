"use client";

import { Card } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import React from "react";
import { Loader2 } from "lucide-react";
import { CategoryColumns } from "./columns";
import { toast } from "sonner";
import { useCategoryTableStore } from "@/store/category-table-store";
import { ICategorySchema } from "@/types/category.zod";

interface CategoryTableProps {
  initialData: string;
  initialCursor: string | null;
  initialHasMore: boolean;
  totalCount: number;
  search?: string;
}

export default function CategoryTable({
  initialData,
  initialCursor,
  initialHasMore,
  totalCount,
  search,
}: CategoryTableProps) {

  const data = useCategoryTableStore(s => s.data)
  const isLoading = useCategoryTableStore(s => s.isLoading)
  const page = useCategoryTableStore(s => s.page)
  const pageSize = useCategoryTableStore(s => s.pageSize)
  const error = useCategoryTableStore(s => s.error)
  const cursor = useCategoryTableStore(s => s.cursor)
  const hasMore = useCategoryTableStore(s => s.hasMore)

  const setData = useCategoryTableStore(s => s.setData)
  const setTotal = useCategoryTableStore(s => s.setTotal)
  const setIsLoading = useCategoryTableStore(s => s.setLoading)
  const setError = useCategoryTableStore(s => s.setError)
  const setHasMore = useCategoryTableStore(s => s.setHasMore)
  const setCursor = useCategoryTableStore(s => s.setCursor)

  React.useEffect(() => {
    setData(
      JSON.parse(initialData) as ICategorySchema[]
    )
    setCursor(initialCursor)
    setHasMore(initialHasMore)
    setTotal(totalCount)
  }, [initialData, initialCursor, initialHasMore, totalCount, setData, setCursor, setHasMore, setTotal,])

  const loadingRef = React.useRef(false);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const sentinelRef = React.useRef<HTMLDivElement>(null);

  const loadMore = React.useCallback(async () => {
    if (loadingRef.current || !hasMore || !cursor) return;
    loadingRef.current = true;
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({ cursor });
      if (search) params.set("search", search);

      const res = await fetch(`/api/categories?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to load more categories");

      const json = await res.json();
      setData([...data, ...json.categories]);

      setCursor(json.nextCursor);
      setHasMore(json.hasMore);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      loadingRef.current = false;
      setIsLoading(false);
    }
  }, [cursor, hasMore, search]);

  React.useEffect(() => {
    if (!hasMore) {
      toast.info("Info", {
        description: "No more books",
        position: "bottom-right",
      })
    }
  }, [hasMore])

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

  const table = useReactTable({
    data,
    columns: CategoryColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Card
      ref={scrollContainerRef}
      className="p-0! max-h-full h-fit overflow-y-auto"
    >
      <Table>
        <TableHeader className="sticky top-0 bg-background z-10">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
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
              <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={CategoryColumns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {hasMore && (
        <div
          ref={sentinelRef}
          className="flex flex-col items-center justify-center gap-2 py-4"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={loadMore}
              disabled={isLoading}
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
  );
}