"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { BookEditSchema, IBookEditSchema } from "@/types/zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import React from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { UpdateBookAction } from "@/app/actions/updateBookAction"
import { toast } from "sonner"
import { BookRow } from "../datatable/columns"


export default function BookEditForm({ document }: { document: BookRow }) {
  const pathname = usePathname()
  const bookId = pathname.replace("/", "").split("/").at(-1)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<IBookEditSchema>({
    resolver: zodResolver(BookEditSchema),
    values: {
      title: document?.title as string,
      authorName: document?.authorName as string,
      isbn13: document?.isbn13 as number,
      isbn10: document?.isbn10 as number,
      publicationYear: document?.publicationYear as number,
      publisherName: document?.publisherName as string,
      shortDescription: document?.shortDescription as string,
      categoryId: document._id
    },
  })

  const handleForm = async (payload: IBookEditSchema) => {
    let addons: (IBookEditSchema & { _id: string }) | null = null;
    addons = { ...payload, _id: bookId! }
    const res = await UpdateBookAction(addons)

    if (res.statusCode == 200) {
      return toast.success(res?.message, {
        position: "bottom-center"
      })
    }

    toast.error(res?.message, {
      position: "bottom-center",
    })
    return reset()
  }

  return (
    <Card className="w-full">
      <form onSubmit={handleSubmit(handleForm)} noValidate>
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
      </form>
    </Card>
  )
}
