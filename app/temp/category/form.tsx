"use client"

import { Field, FieldGroup, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import AddMoreCategoryInput from "./add-more-category-button"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { Spinner } from "@/components/ui/spinner" 
import { zodResolver } from "@hookform/resolvers/zod"
import { IAddCategorySchema } from "@/types/zod"
import { AddCategory } from "@/app/actions/addCategories"
import { toast } from "sonner"
import { AddCategorySchema } from "@/types/add-category-form.zod"

export default function AddCategoryForm() {

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<IAddCategorySchema>({
    resolver: zodResolver(AddCategorySchema)
  })

  const handleFrom = async (data: IAddCategorySchema) => {
    const res = await AddCategory(data)
    console.log(res)

    if (res.statusCode == 200) {
      reset()
      return toast.success(res.message, {
        position: "bottom-center",
        closeButton: true
      })
    }

    return toast.error(res.message, {
      position: "bottom-center",
      closeButton: true
    })
  }

  return (
    <form onSubmit={handleSubmit(handleFrom)} noValidate>
      <FieldGroup>
        <FieldSet>
          <Field>
            <Label htmlFor="add-category-form-field">Category</Label>
            <Input id="add-category-form-field" type="text" {...register("category")}/>
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