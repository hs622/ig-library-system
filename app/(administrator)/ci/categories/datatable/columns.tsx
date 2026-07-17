'use client'

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox"
import { ICategorySchema } from "@/types/zod";
import { formatReadableDate } from "@/lib/format-date";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InfoIcon, Trash2 } from "lucide-react";
import { ButtonGroup } from "@/components/ui/button-group";

export type CategoryRow = ICategorySchema & { _id: string; createdAt: string };

export const CategoryColumns: ColumnDef<CategoryRow>[] = [
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
    meta: {
      className: "w-[200px]"
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "isParent",
    accessorKey: "isParent",
    header: "Type",
    cell: ({ row }) => (row.original.isParent ? <Badge variant={"outline"}>Parent</Badge> : <Badge variant={"outline"}>Child</Badge>),
    enableSorting: true,
    enableHiding: false,
  },
  {
    id: "isAccosciated",
    accessorKey: "isAccosciated",
    header: "No. of Books",
    enableSorting: true,
    enableHiding: false,
  },
  {
    id: "Visiable",
    accessorKey: "Visiable",
    header: "Visiablity",
    enableSorting: true,
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
  {
    id: "actions",
    accessorKey: "actions",
    header: "",
    cell: ({ row }) => {
      return (
        <ButtonGroup>
          <Button size={"xs"} variant={"outline"}>
            <InfoIcon />
          </Button>
          <Button size={"xs"} variant={"outline"}>
            <Trash2 />
          </Button>
        </ButtonGroup>
      )
    }
  }
]