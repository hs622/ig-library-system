'use client'

import { ColumnDef, Row } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox"
import { IMemberSchema } from "@/types/zod";
import { Button } from "@/components/ui/button";
import { DollarSign, Info } from "lucide-react";
import { ButtonGroup } from "@/components/ui/button-group";
import { Badge } from "@/components/ui/badge";
import { calculateAge } from "@/lib/hepler";
import { useCreateDialog } from "@/store/use-create-dialog-store";
import { formatReadableDate } from "@/lib/format-date";
import { useDrawer } from "@/store/useDrawerStore";

export const MemberColumns = () => {
  const MemberColumns: ColumnDef<IMemberSchema>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <div className="size-full p-2">
          <Checkbox
            aria-label="Select all"
            className="translate-y-0.5 cursor-pointer"
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          />
        </div>
      ),
      cell: ({ row }) => {
        return (
          <div className="size-full p-2" onClick={(value) => row.toggleSelected(!!value)}>
            <Checkbox
              aria-label="Select row"
              className="translate-y-0.5 cursor-pointer"
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
            />
          </div>
        )
      },
      meta: {
        className: "w-4 sm:max-w-4 cursor-pointer p-0!"
      },
      enableHiding: false,
      enableSorting: false,
    },
    {
      id: "fullName",
      accessorKey: "fullName",
      header: "Name",
      cell: ({ row }) => <span className="capitalize">{row.original.fullName.trim().toLocaleLowerCase()}</span>,
      meta: {
        className: "w-10 sm:max-w-20 truncate",
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "fatherName",
      accessorKey: "fatherName",
      header: "Father/Husband Name",
      cell: ({ row }) => <span className="capitalize">{row.original.fatherName.trim().toLocaleLowerCase()}</span>,
      meta: {
        className: "w-10 sm:max-w-20 truncate border-x",
      },
      enableSorting: false,
      enableHiding: false
    },
    // {
    //   id: "Email",
    //   accessorKey: "email",
    //   header: "Email",
    //   meta: {
    //     className: "w-6 truncate border-x",
    //   },
    //   enableSorting: true,
    //   enableHiding: false,
    // },
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
        className: "w-10 sm:max-w-20 border-x",
      },
      enableSorting: false,
      enableHiding: false,
    },
    // {
    //   id: "contactNumber",
    //   accessorKey: "contactNumber",
    //   header: "Number",
    //   cell: ({ row }) => <div key={row.id} className="text-sm">+92-{formatContactNumber(row.original.contactNumber)}</div>,
    //   meta: {
    //     className: "w-4 border-x",
    //   },
    //   enableSorting: false,
    //   enableHiding: false,
    // },
    {
      id: "gender",
      accessorKey: "gender",
      header: "Gender",
      cell: ({ row }) => <Badge variant={"outline"}>{row.original.gender}</Badge>,
      meta: {
        className: "w-10 sm:max-w-50 truncate border-x",
      },
      enableSorting: false,
      enableHiding: false,
    },
    // {
    //   id: "areaOfInterest",
    //   accessorKey: "areaOfInterest",
    //   header: "Interests",
    //   cell: ({ row }) => {
    //     const length = row.original.areaOfInterest.length
    //     const limited = length <= 2
    //       ? row.original.areaOfInterest
    //       : row.original.areaOfInterest.slice(0, 2)

    //     return (
    //       <div className="flex gap-1">
    //         {limited.map((item, i) => <Badge key={item + i} variant={"outline"} >{item.replaceAll("-", " ")}</Badge>)}
    //         {length - 2 > 0 && <Badge variant={"outline"} >{`${Number(length - 2)}+`}</Badge>}
    //       </div>
    //     )
    //   },
    //   meta: {
    //     className: "w-6 border-x",
    //   },
    //   enableSorting: false,
    //   enableHiding: false,
    // },
    {
      id: "createdAt",
      accessorKey: "createdAt",
      header: "Joined At",
      cell: ({ row }) => formatReadableDate(row.original.createdAt),
      meta: {
        className: "w-10 sm:max-w-20 truncate border-x",
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "actions",
      accessorKey: "actions",
      header: "",
      meta: {
        className: "w-10 sm:max-w-30 border-x",
      },
      cell: ({ row }) => ActionGroup(row)
    }
  ]

  return MemberColumns;
}

const ActionGroup = (row: Row<IMemberSchema>) => {
  const openDialog = useCreateDialog((s) => s.openDialog);
  const openDrawer = useDrawer(s => s.openDrawer)

  return (
    <ButtonGroup>
      <Button
        className="cursor-pointer" variant={"outline"}
        size={"xs"}
        onClick={() => openDrawer({ module: "users", resourceId: row.original._id, dialog: "user-view" })}
      >
        <Info />
      </Button>
      <Button
        className="cursor-pointer" variant={"outline"}
        size={"xs"}
        onClick={() => openDialog({ module: "users", resourceId: row.original._id, dialog: "user-funds" })}
      >
        <DollarSign />
      </Button>
      {/* <Button className="cursor-pointer text-red-400 hover:bg-red-400" variant={"outline"} size={"xs"} onClick={() => {
        const { _id } = row.original
        return openDialog({ resourceId: _id, module: "user", dialog: "user-trash" })
      }}>
        <Trash2 />
      </Button> */}
      {/* <Button className="cursor-pointer" variant={"outline"} size={"xs"}>
        <Copy />
      </Button> */}
    </ButtonGroup>
  )
}