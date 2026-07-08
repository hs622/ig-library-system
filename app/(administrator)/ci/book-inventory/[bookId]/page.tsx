import { ObjectId } from "mongodb";
import BookEditForm from "./form";
import PageProps from "@/types/props";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getBaseUrl } from "@/lib/get-base-url";
import { CategoryDropdown } from "./category.dropdown";

export default async function Page({ params }: PageProps) {

  const resolvedParams = await params;
  // const resolvedSearchParams = await searchParams;

  const bookId = resolvedParams.bookId;
  // const query = resolvedSearchParams;

  const baseUrl = await getBaseUrl();

  const res = await fetch(`${baseUrl}/api/books?bookId=${bookId}`, {
    cache: 'no-cache'
  })
  if (!res.ok) throw new Error("Failed to fetch book")
  const data = await res.json()

  if (bookId && !ObjectId.isValid(bookId)) {
    return (
      <div className="px-4">
        <Card className="h-[calc(100dvh-64px)]">
          <CardContent className="flex justify-center items-center">
            Couldn&apos;t find the book!
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="px-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-4">
            {data.book.title}
            <div className="rounded-full w-4 h-4 dark:bg-green-300 bg-green-600 text-xs text-center" ></div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 w-full">
              <BookEditForm document={data.book} />
            </div>
            <Card className="col-span-1">
              <CardContent>
                <CategoryDropdown selectedCategoryId={data.book._id} />
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

