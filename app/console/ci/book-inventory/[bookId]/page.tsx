import { ObjectId } from "mongodb"; 
import PageProps from "@/types/page.properties";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; 
import { Book } from "@/app/actions/query/book.query";
import { notFound } from "next/navigation";
import EditBookForm from "@/components/forms/edit-book-form";

export default async function Page({ params }: PageProps) {

  const resolvedParams = await params;
  const bookId = resolvedParams.bookId;

  const response = await Book({
    // select: "title,shortDescription,category,category.title|code"
    searchParams: Promise.resolve({ bookId })
  })

  if (!response.success) {
    return notFound()
  }

  const data = JSON.parse(response.data)

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
    <div className="h-dvh p-4 overflow-hidden">
      <Card className="h-full gap-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-4 capitalize">
            {data?.title}
            <div className="rounded-full w-4 h-4 dark:bg-green-300 bg-green-600 text-xs text-center" ></div>
          </CardTitle>
        </CardHeader>
        <CardContent className="h-full overflow-y-scroll scrollbar-none">
          <EditBookForm data={response.data} />
        </CardContent>
      </Card>
    </div>
  )
}

