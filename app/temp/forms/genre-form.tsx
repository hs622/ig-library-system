"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { categorySchema, IcategorySchema } from "@/types/zod";
import { useForm } from "react-hook-form";
import { Spinner } from "@/components/ui/spinner";
import { zodResolver } from "@hookform/resolvers/zod";

export default function AddcategoryForm() {

  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    reset
  } = useForm<IcategorySchema>({
    resolver: zodResolver(categorySchema)
  })

  const handleForm = (data: IcategorySchema) => {
    alert(data.category)
    reset()
  }

  return (
    <form onSubmit={handleSubmit(handleForm)}>
      <FieldGroup>
        <FieldSet>
          <Field>
            <FieldLabel htmlFor="adding-category" >category</FieldLabel>
            <Input id="adding-category" type="text" className="bg-muted" {...register("category")} />
            {errors.category && <div className="text-xs text-red-400">{errors.category.message}</div>}
          </Field>
        </FieldSet>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Spinner />}
          save
        </Button>
      </FieldGroup>
    </form>
  )
}