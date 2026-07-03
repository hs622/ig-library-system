import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Plus } from "lucide-react";
import BookTable from "./datatable/book-table";
import { BookSearchInput } from "./datatable/search-input";
// import { RefreshButton } from "./datatable/refresh-button";
import { getBaseUrl } from "@/lib/get-base-url";

interface PageProps {
  searchParams: Promise<{ search?: string }>;
}

export default async function BookInventory({ searchParams }: PageProps) {
  const { search } = await searchParams;

  const baseUrl = await getBaseUrl();
  const params = new URLSearchParams();
  if (search) params.set("search", search);

  const res = await fetch(`${baseUrl}/api/books?${params.toString()}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch books");
  }

  const { books, nextCursor, hasMore } = await res.json();

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] gap-4 p-4">
      <div className="col-span-2 flex flex-col flex-1 min-h-0">
        <div className="flex justify-between py-2 shrink-0">
          <BookSearchInput />
          <ButtonGroup>
            {/* <RefreshButton /> */}
            <Button variant="outline">
              <Plus />
            </Button>
          </ButtonGroup>
        </div>

        <div className="flex-1 min-h-0">
          <BookTable
            key={search ?? ""}
            initialData={books}
            initialCursor={nextCursor}
            initialHasMore={hasMore}
            search={search}
          />
        </div>
      </div>
    </div>
  );
}