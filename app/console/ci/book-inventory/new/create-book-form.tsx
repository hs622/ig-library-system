"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea" 
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import React from "react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { TagsInput } from "@/components/tags-input" 
import { CreateBookAction_v2 } from "@/app/actions/createBookAction"
import { toast } from "sonner"
import { CreateBookSchema, ICreateBookSchema } from "@/types/book.zod"

export default function CreateBookForm() {

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control
  } = useForm<ICreateBookSchema>({
    resolver: zodResolver(CreateBookSchema),
  })

  const handleForm = async (payload: ICreateBookSchema) => {
    console.log({ payload })
    const response = await CreateBookAction_v2(payload)
    if (response.statusCode !== 200) {
      toast.error(response.message, {
        position: "bottom-center",
      })

      console.log(response.errors)
      return;
    } 

    toast.success(response.message, {
      position: "bottom-center"
    })

    // return reset()
  }

  return (
    <form onSubmit={handleSubmit(handleForm)} noValidate>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <Card className="w-full">
            <CardContent className="flex flex-col gap-2">
              <FieldGroup >
                <FieldSet className="grid grid-cols-2 gap-6">
                  <Field>
                    <FieldLabel htmlFor="edit-book-form-title">Title</FieldLabel>
                    <Input type="text" id="edit-book-form-title" {...register("title")} />
                    {errors.title && <div className="text-sm text-red-400">{errors.title.message}</div>}
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="edit-book-form-author-name">Author Name</FieldLabel>
                    <Input type="text" id="edit-book-form-author-name" {...register("authorName")} />
                    {errors.authorName && <div className="text-sm text-red-400">{errors.authorName.message}</div>}
                  </Field>
                </FieldSet>
              </FieldGroup>

              <FieldGroup>
                <FieldSet className="grid grid-cols-2 gap-6">
                  <Field>
                    <FieldLabel htmlFor="edit-book-form-isbn-13">ISNB 13 (optional)</FieldLabel>
                    <Input type="number" id="edit-book-form-isbn-13" {...register("isbn13")} />
                    {errors.isbn13 && <div className="text-sm text-red-400">{errors.isbn13.message}</div>}
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="edit-book-form-isbn-10">ISBN 10 (optional)</FieldLabel>
                    <Input type="number" id="edit-book-form-isbn-10" {...register("isbn10")} />
                    {errors.isbn10 && <div className="text-sm text-red-400">{errors.isbn10.message}</div>}
                  </Field>
                </FieldSet>
              </FieldGroup>

              <FieldGroup>
                <FieldSet className="grid grid-cols-2 gap-6">
                  <Field>
                    <FieldLabel htmlFor="edit-book-form-publication-year">Publication Year</FieldLabel>
                    <Input type="text" id="edit-book-form-publication-year" {...register("publicationYear")} />
                    {errors.publicationYear && <div className="text-sm text-red-400">{errors.publicationYear.message}</div>}
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="edit-book-form-publication-name">Publication Name</FieldLabel>
                    <Input type="text" id="edit-book-form-publication-name" {...register("publisherName")} />
                    {errors.publisherName && <div className="text-sm text-red-400">{errors.publisherName?.message}</div>}
                  </Field>
                </FieldSet>
              </FieldGroup>

              <FieldGroup>
                <FieldSet>
                  <Field>
                    <FieldLabel htmlFor="edit-book-form">Short Description</FieldLabel>
                    <Textarea className="resize-none h-25" {...register("shortDescription")} />
                    {errors.shortDescription && <div className="text-sm text-red-400">{errors.shortDescription?.message}</div>}
                  </Field>
                </FieldSet>
              </FieldGroup>

              <div className="">
                <Button variant={"outline"} type="submit" size={"sm"} disabled={isSubmitting}>
                  {isSubmitting ? <React.Fragment><Spinner /> saving...</React.Fragment> : "save"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardContent>
            <FieldGroup>
              <FieldSet>
                <Field>
                  <FieldLabel htmlFor="new-book-form-tags">Tags (optional)</FieldLabel>
                  <Controller
                    name="tags"
                    control={control}
                    render={({ field }) => (
                      <TagsInput
                        id="new-book-form-tags"
                        value={field.value ?? []}
                        onChange={field.onChange}
                        placeholder="Type a tag and press Enter"
                      />
                    )}
                  />
                  {errors.tags && <div className="text-sm text-red-400">{errors.tags.message}</div>}
                </Field>
              </FieldSet>
            </FieldGroup>
          </CardContent>
        </Card>
      </div>
    </form>
  )
}
