'use client'

import { ColumnDef, Row } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button";
import { InfoIcon, Pencil, Trash2 } from "lucide-react";
import { ButtonGroup } from "@/components/ui/button-group";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDrawerStore } from "@/store/use-drawer-store";
import { useDeleteDialogStore } from "@/store/use-delete-dialog-store";
import { IBookTableColumnType } from "@/types/book.zod";
import { Badge } from "@/components/ui/badge";


export const BookColumns = () => {
  const BookColumns: ColumnDef<IBookTableColumnType>[] = [
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
            className="translate-y-0.5 cursor-pointer"
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
          />
        )
      },
      meta: {
        className: "max-w-4 cursor-pointer"
      },
      enableHiding: false,
      enableSorting: false,
    },
    {
      id: "title",
      accessorKey: "title",
      header: "Title",
      meta: {
        className: "max-w-20 overflow-hidden truncate",
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "author",
      accessorKey: "authorName",
      header: "Author",
      meta: {
        className: "max-w-15 overflow-hidden truncate border-x",
      },
      enableSorting: true,
      enableHiding: false,
    },
    {
      id: "publicationYear",
      accessorKey: "publicationYear",
      header: "Publication Year",
      meta: {
        className: "max-w-10 border-x",
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "category",
      accessorKey: "category",
      header: "Category",
      meta: {
        className: "max-w-10 truncate border-x",
      },
      cell: ({ row }) => (
        <span className="capitalize">{row.original.category}</span>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "tags",
      accessorKey: "tags",
      header: "Tags",
      cell: ({ row }) => (
        <div key={row.id} className="flex gap-1">
          {row.original.tags?.map(tag => (
            <Badge variant={"outline"} key={tag}>{tag}</Badge>
          ))}
        </div>
      ),
      meta: {
        className: "max-w-20 overflow-hidden truncate"
      }
    },
    {
      id: "actions",
      accessorKey: "actions",
      header: "",
      meta: {
        className: "border-x",
      },
      cell: ({ row }) => ActionGroup(row)
    }
  ]

  return BookColumns;
}

const ActionGroup = (row: Row<IBookTableColumnType>) => {
  const openDrawer = useDrawerStore((s) => s.openDrawer);
  const { openDialog } = useDeleteDialogStore()
  const pathname = usePathname()

  const { category, ...bookWithoutCategory } = row.original

  return (
    <ButtonGroup>
      <Button className="cursor-pointer" variant={"outline"} size={"xs"} asChild>
        <Link href={`${pathname}/${row.original._id}`}>
          <Pencil />
        </Link>
      </Button>
      <Button className="cursor-pointer" variant={"outline"} size={"xs"} onClick={() => openDrawer(bookWithoutCategory)}>
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