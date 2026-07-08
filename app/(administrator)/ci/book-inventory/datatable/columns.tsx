'use client'

import { ColumnDef, Row } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox"
import { IBookSchema } from "@/types/zod";
import { formatReadableDate } from "@/lib/format-date";
import { Button } from "@/components/ui/button";
import { Copy, InfoIcon, Pencil, Trash2 } from "lucide-react";
import { ButtonGroup } from "@/components/ui/button-group";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDrawerStore } from "@/hooks/use-drawer-store";
import { useDeleteDialogStore } from "@/hooks/use-delete-dialog-store";

export type BookRow = IBookSchema & { _id: string; createdAt: string };

export const BookColumns = () => {
  const BookColumns: ColumnDef<BookRow>[] = [
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
      cell: ({ row }) => {
        return (
          <Checkbox
            aria-label="Select row"
            className="translate-y-0.5"
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
          />
        )
      },
      enableHiding: false,
      enableSorting: false,
      size: 40
    },
    {
      id: "title",
      accessorKey: "title",
      header: "Title",
      meta: {
        className: "w-[20px] truncate border-b",
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "author",
      accessorKey: "authorName",
      header: "Author",
      meta: {
        className: "w-[20px] truncate border-l border-b",
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "publicationYear",
      accessorKey: "publicationYear",
      header: "Publication Year",
      meta: {
        className: "w-[20px] truncate border",
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "category",
      accessorKey: "category",
      header: "Category",
      meta: {
        className: "w-[20px] truncate border",
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "createdAt",
      accessorKey: "createdAt",
      header: "Ingested At",
      cell: ({ row }) => formatReadableDate(row.original.createdAt),
      meta: {
        className: "w-[20px] truncate border-l border-b",
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "actions",
      accessorKey: "actions",
      header: "",
      meta: {
        className: "border-b",
      },
      cell: ({ row }) => ActionGroup(row)
    }
  ]

  return BookColumns;
}

const ActionGroup = (row: Row<BookRow>) => {
  const openDrawer = useDrawerStore((s) => s.openDrawer);
  const { openDialog } = useDeleteDialogStore()
  const pathname = usePathname()

  return (
    <ButtonGroup>
      <Button className="cursor-pointer" variant={"outline"} size={"xs"} asChild>
        <Link href={`${pathname}/${row.original._id}`}>
          <Pencil />
        </Link>
      </Button>
      <Button className="cursor-pointer" variant={"outline"} size={"xs"} onClick={() => openDrawer(row.original)}>
        <InfoIcon />
      </Button>
      <Button className="cursor-pointer" variant={"outline"} size={"xs"} onClick={() => {
        const { title, _id } = row.original
        return openDialog({ resourceId: _id, title, module: "books" })
      }}>
        <Trash2 />
      </Button>
      {/* <Button className="cursor-pointer" variant={"outline"} size={"xs"}>
        <Copy />
      </Button> */}
    </ButtonGroup>
  )
}