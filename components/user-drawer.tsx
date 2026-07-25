"use client";

import {
  Drawer,
  DrawerContent,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { DrawerResource, useDrawer } from "@/store/useDrawerStore";
import { useFetch } from "@/hooks/useFetch";
import { IDepositSchema, IMemberFormSchema } from "@/types/zod";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { RotateCcw } from "lucide-react";
import { formatReadableDate } from "@/lib/format-date";
import { calculateAge, formatCNICNumber, formatContactNumber } from "@/lib/hepler";
import Image from "next/image";
import { Skeleton } from "./ui/skeleton";
import { GreenLamp } from "./lights";

type IMemberDetails = IMemberFormSchema & { role: string, financialRecords: (IDepositSchema & { _id: string, createdAt: string })[] }

export function AddUserDrawer({ module }: { module: string }) {

  const isOpen = useDrawer(s => s.isOpen)
  const resource = useDrawer(s => s.resource)
  const closeDrawer = useDrawer(s => s.closeDrawer)

  return (
    <Drawer
      open={isOpen && (resource?.dialog == module)}
      onOpenChange={closeDrawer}
    >
      <IsLoadedContent resource={resource} />
    </Drawer>
  );
}

function IsLoadedContent({ resource }: { resource: DrawerResource | null }) {

  const { data, error, isLoading, refetch } = useFetch<IMemberDetails>({
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
    <DrawerContent className="max-h-[80vh] h-full w-full">

      {/* header with skeleton */}
      {isLoading ? (
        <div className="flex justify-between items-center px-16 border-b">
          <div className="flex items-center gap-4 pb-4">
            <div className="flex flex-col gap-2 font-bold capitalize">
              <Skeleton className="h-8 w-60" />
              <Skeleton className="h-4 w-40" />
            </div>
            <div>
              <Skeleton className="h-4 w-20" />
            </div>
          </div>

          <div>
            <Skeleton className="h-9 w-9" />
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-center px-16 border-b">
          <div className="flex items-center gap-4 pb-4">
            <div>
              <div className="text-3xl font-bold capitalize">
                {data?.fullName.toLowerCase()}
              </div>
              <div className="text-md font-medium capitalize">
                {data?.fatherName.toLowerCase()}
              </div>
            </div>
            <div>
              <Badge variant={"outline"}>
                Status
                <GreenLamp className="h-3 w-3" />
              </Badge>
            </div>
          </div>

          <div>
            <Button variant={"outline"} onClick={refetch} className="cursor-pinter">
              <RotateCcw />
            </Button>
          </div>
        </div>
      )}

      {/* <div className="">
                <div>
                  {isJunior
                    ? <Badge variant={"outline"}>Junior</Badge>
                    : <Badge variant={"outline"}>Senior</Badge>
                  }
                </div>
              </div> */}

      {/* body with skeleton */}
      <div className="px-16 py-6 grid md:grid-cols-2 h-full w-full">
        <div className="h-full border-r">
          <ScrollArea className="h-160 pr-6">
            {isLoading ? (
              <div className="flex flex-col gap-6">
                <div>
                  <Skeleton className="h-8 w-60" />

                  <div className="pt-2 grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-1">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-6 w-30" />
                    </div>
                  </div>
                  <div className="pt-2 grid grid-cols-3 gap-2">
                    <div className="flex flex-col gap-1">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-6 w-30" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-6 w-30" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-6 w-40" />
                    </div>
                  </div>
                  <div className="pt-2 grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-1">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-6 w-70" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-6 w-40" />
                    </div>
                  </div>
                </div>

                <div>
                  <div className="pb-2">
                    <Skeleton className="h-8 w-40" />
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {Array.from({ length: 5 }, (_, index) => (
                      <Skeleton key={index} className="h-4 w-18" />
                    ))}
                  </div>
                </div>

                <div>
                  <div className="pb-2">
                    <Skeleton className="h-8 w-40" />
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {Array.from({ length: 5 }, (_, index) => (
                      <Skeleton key={index} className="h-4 w-18" />
                    ))}
                  </div>
                </div>

                <div>
                  <div className="pb-2">
                    <Skeleton className="h-8 w-40" />
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {Array.from({ length: 5 }, (_, index) => (
                      <Skeleton key={index} className="h-4 w-18" />
                    ))}
                  </div>
                </div>

                <div className="">
                  <div className="text-xl pb-2">
                    <Skeleton className="h-8 w-40" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Skeleton className="h-4 w-[90%]" />
                    <Skeleton className="h-4 w-[80%]" />
                    <Skeleton className="h-4 w-[70%]" />
                    <Skeleton className="h-4 w-[60%]" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                <div>
                  <div className="text-xl font-bold">Personal Details</div>

                  <div className="pt-2 grid grid-cols-2 gap-2">
                    <div className="">
                      <div className="text-sm font-extralight">Email</div>
                      <div className="font-semibold lowercase">{data?.email}</div>
                    </div>
                  </div>
                  <div className="pt-2 grid grid-cols-3 gap-2">
                    <div className="">
                      <div className="text-sm font-extralight">Role</div>
                      <div className="capitalize font-semibold" >{data?.role}</div>
                    </div>
                    <div className="">
                      <div className="text-sm font-extralight">Gender</div>
                      <div className="capitalize font-semibold">{data?.gender}</div>
                    </div>
                    <div className="">
                      <div className="text-sm font-extralight">{isJunior ? "B-Form" : "CNIC"}</div>
                      <div className="capitalize font-extrabold">{formatCNICNumber(String(data?.cnicNumber))}</div>
                    </div>
                  </div>
                  <div className="pt-2 grid grid-cols-2 gap-2">
                    <div className="">
                      <div className="text-sm font-extralight">Address</div>
                      <div className="capitalize font-semibold" >{data?.address}</div>
                    </div>
                    <div className="">
                      <div className="text-sm font-extralight">{isJunior ? "Guardian Number" : "Contact Number"}</div>
                      <div className="capitalize font-semibold">+92-{formatContactNumber(String(data?.contactNumber))}</div>
                    </div>
                  </div>
                </div>

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
                  <div className="text-xl pb-2">
                    Genres
                  </div>
                  <div className="flex gap-1 flex-wrap">
                    {data?.genre.trim().split(/[;,|]/).map((item, i) => (
                      <Badge variant={"outline"} key={i} className="capitalize" >{item.toLowerCase()}</Badge>
                    ))}
                  </div>
                </div>

                <div className="">
                  <div className="text-xl pb-2">
                    Activities
                  </div>
                  <div className="flex gap-1 flex-wrap">
                    {data?.genre.trim().split(",").map((item, i) => (
                      <Badge variant={"outline"} key={i} className="capitalize">{item.toLowerCase()}</Badge>
                    ))}
                  </div>
                </div>

                <div className="">
                  <div className="text-xl pb-2">
                    Suggestion
                  </div>
                  <div className="w-full text-wrap lowercase first-letter:uppercase">
                    {data?.suggestionForImpovement}
                  </div>
                </div>

                {/* <div className="p-4">
                  {isLoading ? "loading" : ""}
                  <pre>{JSON.stringify(data, null, 2)}</pre>
                  {error ? error : ""}
                </div> */}
              </div>
            )}
          </ScrollArea>
        </div>


        {isLoading ? (
          <div className="pl-6">
            <div className="pb-4">
              <Skeleton className="h-8 w-46" />
            </div>

            <div className="overflow-hidden flex flex-col gap-2">
              {Array.from({ length: 5 }, (_, index) => (
                <div key={index} className="overflow-hidden grid grid-cols-3">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-30" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="pl-6">
            <div className="text-xl font-bold pb-4">Financial Records</div>

            <div className="overflow-hidden flex flex-col gap-2">
              {data?.financialRecords && data?.financialRecords.map((record, i) => (
                <div key={i} className="overflow-hidden grid grid-cols-3">
                  <div className="capitalize w-30">
                    {record.reason.replaceAll("-", " ")}
                  </div>
                  <div className="">
                    Rs. {record.amount}
                  </div>
                  <div>
                    {formatReadableDate(record.createdAt)}
                  </div>
                </div>
              ))}
            </div>

            <div className="h-140">
              {!data?.financialRecords.length && (
                <div className="flex justify-center items-center h-full">
                  <div className="flex flex-col items-center justify-center">
                    <Image
                      width={1000}
                      height={1000}
                      className={"object-center size-38"}
                      src={"/not-paid.png"}
                      alt="not-paid"
                    />
                    <div className="text-center">No transations found.</div>
                  </div>

                </div>
              )}
            </div>
          </div>
        )}
      </div>

    </DrawerContent>
  )
}