"use client"

import { Field, FieldGroup, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import AddMoreCategoryInput from "./add-more-category-button"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { Spinner } from "@/components/ui/spinner"
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { AddCategorySchema, IAddCategorySchema } from "@/types/zod"
import { AddCategory } from "@/app/actions/addCategories"

export default function AddCategoryForm() {

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<IAddCategorySchema>({
    resolver: zodResolver(AddCategorySchema)
  })

  const handleFrom = async (data: IAddCategorySchema) => {
    const res = await AddCategory(data)
    console.log(res)
  }

  return (
    <form onSubmit={handleSubmit(handleFrom)} noValidate>
      <FieldGroup>
        <FieldSet>
          <Field>
            <Label htmlFor="add-category-form-field">Category</Label>
            <Input id="add-category-form-field" type="text" {...register("category")} />
            {errors.category && <div className="text-red-400 text-xs">{errors.category.message}</div>}
          </Field>

          <AddMoreCategoryInput control={control} />
        </FieldSet>
      </FieldGroup>

      <div className="text-right py-6">
        <Button type="submit" variant={"outline"} disabled={isSubmitting}>
          {isSubmitting && <Spinner />}
          save
        </Button>
      </div>
    </form>
  )
}