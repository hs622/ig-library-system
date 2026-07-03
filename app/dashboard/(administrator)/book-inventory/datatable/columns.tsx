'use client'

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox"
import { IBookSchema } from "@/types/zod";
import { formatReadableDate } from "@/lib/format-date";

export type BookRow = IBookSchema & { _id: string; createdAt: string };

export const BookColumns: ColumnDef<BookRow>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        aria-label="Select all"
        className="translate-y-0.5"
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        aria-label="Select row"
        className="translate-y-0.5"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    ),
    enableHiding: false,
    enableSorting: false,
    size: 40
  },
  {
    id: "title",
    accessorKey: "title",
    header: "Title",
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "author",
    accessorKey: "authorName",
    header: "Author",
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "publicationYear",
    accessorKey: "publicationYear",
    header: "Publication Year",
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "category",
    accessorKey: "category",
    header: "Category",
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "createdAt",
    accessorKey: "createdAt",
    header: "Ingested At",
    cell: ({ row }) => formatReadableDate(row.original.createdAt),
    enableSorting: false,
    enableHiding: false,
  },
]