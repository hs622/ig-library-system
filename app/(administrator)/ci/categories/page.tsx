import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Plus } from "lucide-react";
import CategoryTable from "./datatable/category-table";
import { CategorySearchInput } from "./datatable/search-input";
// import { RefreshButton } from "./datatable/refresh-button";
import { getBaseUrl } from "@/lib/get-base-url";

interface PageProps {
  searchParams: Promise<{ search?: string }>;
}

export default async function Page({ searchParams }: PageProps) {
  const { search } = await searchParams;

  const baseUrl = await getBaseUrl();
  const params = new URLSearchParams();
  if (search) params.set("search", search);

  const res = await fetch(`${baseUrl}/api/categories?${params.toString()}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }

  const { categories, nextCursor, hasMore } = await res.json();

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] gap-4 p-4">
      <div className="col-span-2 flex flex-col flex-1 min-h-0">
        <div className="flex justify-between py-2 shrink-0">
          <CategorySearchInput />
          <ButtonGroup>
            {/* <RefreshButton /> */}
            <Button variant="outline">
              <Plus />
            </Button>
          </ButtonGroup>
        </div>

        <div className="flex-1 min-h-0">
          <CategoryTable
            key={search ?? ""}
            initialData={categories}
            initialCursor={nextCursor}
            initialHasMore={hasMore}
            search={search}
          />
        </div>
      </div>
    </div>
  );
}