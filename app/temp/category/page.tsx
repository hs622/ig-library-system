import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Field, FieldGroup, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import getClientPromise from "@/lib/mongodb"
import { Plus } from "lucide-react"
import { Metadata } from "next"
import React from "react"
import AddMoreCategoryInput from "./add-more-category-button"
import AddCategoryForm from "./form"


export const metadata: Metadata = {
  title: "Category",
  description: ""
}

export default function Page() {

  return (
    <React.Fragment>
      <div className="flex justify-center items-center h-screen">
        <Card className="min-w-4xl">
          <CardContent>
            <AddCategoryForm/>
          </CardContent>
        </Card>
      </div>
    </React.Fragment>
  )
}