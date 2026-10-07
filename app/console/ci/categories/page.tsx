import { ButtonGroup } from "@/components/ui/button-group";
import CategoryTable from "./datatable/category-table";
import { AddCreateDialogTirgger, CategorySearchInput } from "./datatable/header";
import { getBaseUrl } from "@/lib/get-base-url";
import RefreshButton from "./datatable/refresh-button";
import { AddCategoryDialog } from "@/components/category/add-category-dialog";

interface PageProps {
  searchParams: Promise<{ search?: string }>;
}

export default async function Page({ searchParams }: PageProps) {

  const { search } = await searchParams;
 
  const params = new URLSearchParams();
  if (search) params.set("search", search);

  const query = params.toString();
  const response = await fetch(
    `${await getBaseUrl()}/api/categories${query ? `?${query}` : ""}`,
    { cache: "no-store" },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }

  const { categories, nextCursor, hasMore, totalCount } = await response.json();

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] gap-4 p-4">
      <div className="col-span-2 flex flex-col flex-1 min-h-0">
        <div className="flex justify-between py-2 shrink-0">
          <CategorySearchInput />
          <ButtonGroup>
            <AddCreateDialogTirgger />
            <RefreshButton />
          </ButtonGroup>
        </div>

        <div className="flex-1 min-h-0">
          <CategoryTable
            key={search ?? ""}
            initialData={JSON.stringify(categories)}
            initialCursor={nextCursor}
            initialHasMore={hasMore}
            totalCount={totalCount}
            search={search}
          />
        </div>
      </div>

      <AddCategoryDialog />
    </div>
  );
}