import { getBaseUrl } from "@/lib/get-base-url";
import { Metadata } from "next"
import UserTable from "./datatable/user-table";
import { MemberSearchInput } from "./datatable/headers";
import { AddDepositDialog } from "@/components/users/add-users-dialog";
import { AddUserDrawer } from "@/components/user-drawer";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "IGLS — Members"
}

interface PageProps {
  searchParams: Promise<{ search?: string }>;
}

export default async function Page({ searchParams }: PageProps) {

  const { search } = await searchParams;

  const baseUrl = await getBaseUrl()
  const params = new URLSearchParams();
  if (search) params.set("search", search)

  const res = await fetch(`${baseUrl}/api/users?${params.toString()}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Members")
  }

  const { members, nextCursor, hasMore } = await res.json()

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] gap-4 p-4">
      <div className="col-span-2 flex flex-col flex-1 min-h-0">
        <div className="flex justify-between py-2 shrink-0">
          <div className="flex items-center gap-4">
            <MemberSearchInput />
          </div>

          <div className="flex gap-4">
            header right
          </div>
        </div>

        <div className="flex-1 min-h-0">
          <Suspense fallback={"loading..."}>
            <UserTable
              key={search ?? ""}
              initialData={members}
              initialCursor={nextCursor}
              initialHasMore={hasMore}
              search={search}
            />
          </Suspense>
        </div>
      </div>
      <Suspense fallback={"loading..."}>
        <AddDepositDialog module="user-funds" />
      </Suspense>
      <Suspense fallback={"loading..."}>
        <AddUserDrawer module="user-view" />
      </Suspense>
    </div>
  )
}