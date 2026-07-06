import BookEditForm from "./form";
import PageProps from "@/types/props";

export default async function Page({ params, searchParams }: PageProps) {

  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const slug = resolvedParams.bookId;
  const query = resolvedSearchParams;

  
      
  return (
    <div className="px-4">
      <BookEditForm />
    </div>
  )
}
 
