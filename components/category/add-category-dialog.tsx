"use client"

import { AddCategorySchema_v2 } from "@/types/add-category-form.zod"
import { IAddCategorySchema_v2 } from "@/types/zod"
import { zodResolver } from "@hookform/resolvers/zod"
import React from "react"
import { Control, Controller, useForm } from "react-hook-form"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Field, FieldGroup, FieldLabel } from "../ui/field"
import { Input } from "../ui/input"
import { CategorySuggestionDropdown } from "./category-suggestion"
import { Button } from "../ui/button"
import { Spinner } from "../ui/spinner"
import { Switch } from "../ui/switch"
import { useCreateDialog } from "@/store/use-create-dialog-store"
import { AddCategory_v2 } from "@/app/actions/addCategories"
import { toast } from "sonner"

export function AddCategoryDialog() {

  const { isOpen, closeDialog } = useCreateDialog()

  const {
    control,
    register,
    formState: { errors, isSubmitting, },
    handleSubmit,
    watch,
    setValue,
    reset
  } = useForm<IAddCategorySchema_v2>({
    resolver: zodResolver(AddCategorySchema_v2)
  })

  const handleForm = async (data: IAddCategorySchema_v2) => {
    console.log({ data })
    const response = await AddCategory_v2(data)
    console.log(response)
    if (response.statusCode === 200) {
      onOpenChange()
      toast.success(response.message, {
        position: "bottom-center"
      })
    }

    if (response.statusCode !== 200)
      toast.error(response.message, {
        position: "bottom-center"
      })
  }

  const type = React.useCallback(() => watch("type"), [])
  function onOpenChange() {
    reset()
    closeDialog()
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>New Category</DialogTitle>
          <DialogDescription>
            Form for adding new category or attach to existing one.
          </DialogDescription>
        </DialogHeader>

        <form id="add-category-form" onSubmit={handleSubmit(handleForm)} noValidate className="flex flex-col gap-4">
          <FieldGroup>
            <Field>
              <div className="flex justify-between">
                <FieldLabel htmlFor="name-1">Category Title</FieldLabel>
                <span>Type <SwitchWithController control={control} /></span>
              </div>
              <Input id="name-1" {...register("category")} aria-invalid={!!errors.category} />
              {errors.category && <div className="text-sm text-red-500">{errors.category.message}</div>}
            </Field>
          </FieldGroup>

          {type() && (
            <React.Fragment>
              <Controller
                name="categoryId"
                control={control}
                render={({ field }) => {

                  const onChange = (value: string): void => {
                    setValue("categoryId", value)
                  }
                  return (
                    <CategorySuggestionDropdown
                      onChange={onChange}
                      value={field.value}
                    />
                  )
                }}
              />
              {errors.categoryId && <div className="text-sm text-red-500">{errors.categoryId.message}</div>}
            </React.Fragment>
          )}
        </form>
        <DialogFooter>
          <Button type="submit" form="add-category-form" variant={"outline"} disabled={isSubmitting}>
            {isSubmitting ? <React.Fragment>
              <Spinner />creating...
            </React.Fragment> : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function SwitchWithController(
  { control }: { control: Control<IAddCategorySchema_v2> }
) {
  return (
    <Controller
      name="type"
      control={control}
      render={({ field }) => <Switch size={"sm"} defaultValue={"off"} value={field.value ? "on" : "off"} onCheckedChange={field.onChange} />}
    />
  )
}