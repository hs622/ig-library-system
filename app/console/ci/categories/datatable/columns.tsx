'use client'

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InfoIcon, Trash2 } from "lucide-react";
import { ButtonGroup } from "@/components/ui/button-group";
import { ICategorySchema } from "@/types/category.zod";
import { Switch } from "@/components/ui/switch";

export type CategoryRow = ICategorySchema;

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
      className: "w-[200px] uppercase"
    },
    cell: ({ row }) => (
      <div className="flex items-end gap-2">
        <div className="capitalize">{row.original.title}</div>
        <div className="text-xs text-gray-400">{row.original.code}</div>
      </div>
    ),
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
    cell: ({ row }) => (
      <Switch size="sm" checked={row.original.visiable} aria-readonly/>
    ),
    enableSorting: true,
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