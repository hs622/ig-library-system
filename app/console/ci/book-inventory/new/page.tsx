import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Metadata } from "next";
import CreateBookForm from "./create-book-form";
import AddBookForm from "@/components/forms/add-book-form";


export const metadata: Metadata = {
  title: "New Book"
}

export default function Page() {

  return (
    <div className="px-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-4">
            Add New Book 
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AddBookForm />
        </CardContent>
      </Card>
    </div>
  )
}