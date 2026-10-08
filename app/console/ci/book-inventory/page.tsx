import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Plus } from "lucide-react";
import { BookSearchInput, BulkQRCodeGeneratingForPrinting, DeleteBulkResources, ExportBulkDataButton, ImportBulkDataButton } from "./datatable/header";
import { BookDetailsDrawer } from "@/components/drawers/book-details-drawer";
import DeleteBulkResourcesDialog from "@/components/delete-bulk-resources.dialog";
import DeleteResourceDialog from "@/components/delete-resource.dialog";
import { Books } from "@/app/actions/query/books.query";
import QRCodeDrawer from "@/components/drawers/qr-code-drawer";
// import { ImportExcelData } from "@/components/dialog/import-excel-data";
import BookTable from "./datatable/book-table";
import { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

interface PageProps {
  searchParams: Promise<{ search?: string }>;
}

export const metadata: Metadata = {
  title: "IGEN — Book Invertory",
  description: ""
}

export default async function Page({ searchParams }: PageProps) {

  const { search } = await searchParams;
  const response = await Books({
    searchParams: Promise.resolve({ search }),
  });

  if (!response.success) {
    // Surface the error instead of silently rendering an empty table.
    // Swap for your error-boundary/toast pattern if you have one.
    throw new Error(response.error);
  }

  const { books, nextCursor, hasMore, totalCount } = response.data;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] gap-4 p-4">
      <div className="col-span-2 flex flex-col flex-1 min-h-0">
        <div className="flex justify-between py-2 shrink-0">
          <div className="flex items-center gap-4">
            <BookSearchInput />

            {/* <BookSearchTags /> */}
          </div>

          <div className="flex gap-4">

            <ButtonGroup>
              <ImportBulkDataButton />
              <ExportBulkDataButton />
            </ButtonGroup>

            <ButtonGroup>
              <BulkQRCodeGeneratingForPrinting />
              <DeleteBulkResources />
            </ButtonGroup>
            <ButtonGroup>
              {/* <RefreshButton /> */}
              <Button variant="outline" asChild>
                <Link href={"/console/ci/book-inventory/new"}>
                  <Plus />
                </Link>
              </Button>
            </ButtonGroup>
          </div>
        </div>

        <div className="flex-1 min-h-0">
          <Suspense fallback={"loading..."}>
            <BookTable
              key={search ?? ""}
              initialData={books}
              initialCursor={nextCursor}
              initialHasMore={hasMore}
              totalCount={totalCount}
              search={search}
            />
          </Suspense>
        </div>
      </div>

      <QRCodeDrawer />
      {/* <ImportExcelData /> */}
      <BookDetailsDrawer />
      <DeleteResourceDialog />
      <DeleteBulkResourcesDialog />
    </div>
  );
}