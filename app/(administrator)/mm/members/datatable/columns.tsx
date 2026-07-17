'use client'

import { ColumnDef, Row } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox"
import { IMemberSchema } from "@/types/zod";
import { Button } from "@/components/ui/button";
import { DollarSign, Pencil } from "lucide-react";
import { ButtonGroup } from "@/components/ui/button-group";
import { usePathname } from "next/navigation";
import Link from "next/link";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { calculateAge, formatContactNumber } from "@/lib/hepler";
import { useCreateDialog } from "@/store/use-create-dialog-store";

export const MemberColumns = () => {
  const MemberColumns: ColumnDef<IMemberSchema>[] = [
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
      meta: {
        className: "w-2"
      },
      enableHiding: false,
      enableSorting: false,
    },
    {
      id: "fullName",
      accessorKey: "fullName",
      header: "Name",
      meta: {
        className: "w-8 lg:w-10 truncate",
      },
      enableSorting: false,
      enableHiding: false,
      size: 40,
      minSize: 40,
    },
    {
      id: "Email",
      accessorKey: "email",
      header: "Email",
      meta: {
        className: "w-6 truncate border-x",
      },
      enableSorting: true,
      enableHiding: false,
    },
    {
      id: "dob",
      accessorKey: "dob",
      header: "Age Group",
      cell: ({ row }) => {
        const age = Number(
          calculateAge(new Date(
            row.original.dob.year, row.original.dob.month, row.original.dob.day
          ))
        )
        return (
          <div key={row.id}>
            {age >= 18
              ? <Badge variant={"outline"}>Senior</Badge>
              : <Badge variant={"outline"}>Junior</Badge>
            }
          </div>
        )
      },
      meta: {
        className: "w-6 border-x",
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "contactNumber",
      accessorKey: "contactNumber",
      header: "Number",
      cell: ({ row }) => <div key={row.id} className="text-sm">+92-{formatContactNumber(row.original.contactNumber)}</div>,
      meta: {
        className: "w-4 border-x",
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "gender",
      accessorKey: "gender",
      header: "Gender",
      meta: {
        className: "w-6 truncate border-x",
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "areaOfInterest",
      accessorKey: "areaOfInterest",
      header: "Interests",
      cell: ({ row }) => (
        <div>
          {
            row.original.areaOfInterest.map((interest, i) => (
              <Badge key={interest + i} variant={"outline"} >{interest.replaceAll("-", " ")}</Badge>
            ))
          }
        </div>
      ),
      meta: {
        className: "w-6 border-x",
      },
      enableSorting: false,
      enableHiding: false,
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

  return MemberColumns;
}

const ActionGroup = (row: Row<IMemberSchema>) => {
  const openDialog = useCreateDialog((s) => s.openDialog);
  // const { openDialog } = useDeleteDialogStore()
  const pathname = usePathname()

  return (
    <ButtonGroup>
      <Button className="cursor-pointer" variant={"outline"} size={"xs"} asChild>
        <Link href={`${pathname}/${row.original._id}`}>
          <Pencil />
        </Link>
      </Button>
      <Button className="cursor-pointer" variant={"outline"} size={"xs"} onClick={() => openDialog({ module: "users", resourceId: row.original._id })}>
        <DollarSign />
      </Button>
      {/* <Button className="cursor-pointer" variant={"outline"} size={"xs"} onClick={() => {
        const { title, _id } = row.original
        return openDialog({ resourceId: _id, title, module: "books" })
      }}>
        <Trash2 />
      </Button> */}
      {/* <Button className="cursor-pointer" variant={"outline"} size={"xs"}>
        <Copy />
      </Button> */}
    </ButtonGroup>
  )
}