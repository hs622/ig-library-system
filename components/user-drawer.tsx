"use client";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useDrawer } from "@/store/useDrawerStore";
import { useFetch } from "@/hooks/useFetch";
import { IDepositSchema, IMemberFormSchema } from "@/types/zod";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { RotateCcw } from "lucide-react";
import { formatReadableDate } from "@/lib/format-date";
import { calculateAge } from "@/lib/hepler";

export function AddUserDrawer({ module }: { module: string }) {

  const isOpen = useDrawer(s => s.isOpen)
  const resource = useDrawer(s => s.resource)
  const closeDrawer = useDrawer(s => s.closeDrawer)

  const { data, error, isLoading, refetch } = useFetch<IMemberFormSchema & { financialRecords: (IDepositSchema & { _id: string, createdAt: string })[] }>({
    endpoint: `/users/${resource?.resourceId}`,
    searchParams: "w=finance"
  })

  const age = calculateAge(new Date(
    Number(data?.dob.year),
    Number(data?.dob.month),
    Number(data?.dob.day)
  )) ?? 0
  const isJunior = age <= 18 ? true : false

  return (
    <Drawer
      open={isOpen && (resource?.dialog == module)}
      onOpenChange={closeDrawer}
    >
      <DrawerContent className="max-h-[80vh] h-full">
        <ScrollArea className="h-full">

          {/* header */}
          <div className="flex justify-between items-center px-16 border-b">
            <div className="pb-4">
              <div className="text-3xl font-bold">
                {data?.fullName}
              </div>
              <div className="text-md font-medium">
                {data?.fatherName}
              </div>
            </div>

            <div>
              <Button variant={"outline"} onClick={refetch} className="cursor-pinter">
                <RotateCcw />
              </Button>
            </div>
          </div>

          {/* body */}
          <div className="px-16 py-6 grid md:grid-cols-2">
            <div className="flex flex-col gap-4 border-r">
              <div>
                <div className="text-lg pb-2">
                  Area of interest
                </div>
                <div className="flex gap-2 flex-wrap">
                  {data?.areaOfInterest?.map((item, i) => (
                    <Badge variant={"outline"} key={i}>{item}</Badge>
                  ))}
                </div>
              </div>

              <div className="">
                <div>
                  {isJunior
                    ? <Badge variant={"outline"}>Junior</Badge>
                    : <Badge variant={"outline"}>Senior</Badge>
                  }
                </div>
                <div>

                </div>
              </div>

              <div className="p-4">
                {isLoading ? "loading" : ""}
                <pre>{JSON.stringify(data, null, 2)}</pre>
                {error ? error : ""}
              </div>
            </div>

            <div className="px-6">
              <div className="text-xl font-bold pb-4">Financial Records</div>
              <div className="overflow-hidden ml-4 flex flex-col gap-2">
                {data?.financialRecords && data?.financialRecords.map((record, i) => (
                  <div key={i} className="overflow-hidden grid grid-cols-3">
                    <div className="w-30">
                      {record.reason}
                    </div>
                    <div className="">
                      Rs {record.amount}
                    </div>
                    <div>
                      {formatReadableDate(record.createdAt)}
                    </div>
                  </div>
                ))}
              </div>

              <div>
                {!data?.financialRecords && (
                  <div>
                    Not Financial Records found
                  </div>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* <DrawerFooter>
          <DrawerClose asChild>
            <Button variant={"outline"}>Close</Button>
          </DrawerClose>
        </DrawerFooter> */}
        {/* </div> */}
      </DrawerContent>
    </Drawer>
  );
}