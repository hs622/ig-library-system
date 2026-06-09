"use client";

import { Button } from "@/components/ui/button";
// import { Combobox, ComboboxChip, ComboboxChips, ComboboxChipsInput, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList, ComboboxValue } from "@/components/ui/combobox";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { BookSchema, IBookSchema } from "@/types/zod";
import { zodResolver } from "@hookform/resolvers/zod"
// import { ChevronDownIcon } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form"
// import { format } from "date-fns"
// import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
// import MultipleInput from "@/components/inputs/multiple-input";
import { Spinner } from "@/components/ui/spinner";



export default function AddBook() {

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<IBookSchema>({
    resolver: zodResolver(BookSchema)
  })

  const handleForm = (data: IBookSchema) => {
    console.log(data)

    reset()
  }

  return (
    <form onSubmit={handleSubmit(handleForm)} className="flex flex-col gap-6" noValidate>

      <FieldGroup>
        <FieldSet>
          <Field className="gap-1">
            <FieldLabel htmlFor="add-book-category">Category</FieldLabel>
            <Input id="add-book-category" type="text" {...register("category")} />
            {/* <Field>
              <FieldLabel htmlFor="add-book-category">category</FieldLabel>
              <Controller
                name="categoryID"
                control={control}
                render={
                  <Combobox>
                    <ComboboxInput placeholder="category" />
                    <ComboboxContent>
                      
                    </ComboboxContent>
                  </Combobox>
                }
              />
            </Field> */}
            {errors.category && <div className="text-xs text-red-400">{errors.category.message}</div>}
          </Field>
          {/* <Field className="gap-1">
            <FieldLabel htmlFor="add-book-sub-category">Sub Category</FieldLabel>
            
          </Field> */}
        </FieldSet>
      </FieldGroup>

      <FieldGroup>
        <FieldSet className="grid grid-cols-2 gap-4">
          <Field className="gap-1">
            <FieldLabel htmlFor="add-book-title">Title</FieldLabel>
            <Input id="add-book-title" type="text" {...register("title")} />
            {errors.title && <div className="text-red-400 text-xs">{errors.title.message}</div>}
          </Field>
          <Field className="gap-1">
            <FieldLabel htmlFor="add-book-author">Author Name</FieldLabel>
            <Input id="add-book-title" type="text" {...register("authorName")} />
            {errors.authorName && <div className="text-red-400 text-xs">{errors.authorName.message}</div>}
          </Field>
        </FieldSet>
      </FieldGroup>

      <FieldGroup>
        <FieldSet className="grid grid-cols-2 gap-4">
          <Field className="gap-1">
            <FieldLabel htmlFor="add-book-isbn-13">ISNB 13 (optional)</FieldLabel>
            <Input id="add-book-isbn-13" type="number" {...register("isbn13", { valueAsNumber: true })} />
            {errors.isbn13 && <div className="text-red-400 text-xs">{errors.isbn13.message}</div>}
          </Field>
          <Field className="gap-1">
            <FieldLabel htmlFor="add-book-isbn-10">ISNB 10 (optional)</FieldLabel>
            <Input id="add-book-isbn-10" type="number" {...register("isbn10", { valueAsNumber: true })} />
            {errors.isbn10 && <div className="text-red-400 text-xs">{errors.isbn10.message}</div>}
          </Field>
        </FieldSet>
      </FieldGroup>

      <FieldGroup>
        <FieldSet className="grid grid-cols-2 gap-4">
          <Field className="gap-1">
            <FieldLabel htmlFor="add-book-publication-year">Publication Year</FieldLabel>
            <Input id="add-book-publication-year" placeholder="YYYY" type="string" {...register("publicationYear")} />
            {errors.publicationYear && <div className="text-red-400 text-xs">{errors.publicationYear.message}</div>}
          </Field>
          <Field className="gap-1">
            <FieldLabel htmlFor="add-book-publisher-name">Publisher Name</FieldLabel>
            <Input id="add-book-publisher-name" type="text" {...register("publisherName")} />
            {errors.publisherName && <div className="text-red-400 text-xs">{errors.publisherName.message}</div>}
          </Field>
        </FieldSet>
      </FieldGroup>

      {/* <FieldGroup>
          <FieldSet>
            <Field className="gap-1">
              <FieldLabel htmlFor="add-book-tags">Tags</FieldLabel>
              <MultipleInput />
            </Field>
          </FieldSet>
        </FieldGroup> */}


      {/* ref={anchor} */}
      {/* anchor={anchor} */}
      {/* <Combobox
          multiple
          autoHighlight
          // items={frameworks}
          // defaultValue={[frameworks[0]]}
        >
          <ComboboxChips  className="w-full max-w-xs">
            <ComboboxValue>
              {(values) => (
                <React.Fragment>
                  {values.map((value: string) => (
                    <ComboboxChip key={value}>{value}</ComboboxChip>
                  ))}
                  <ComboboxChipsInput />
                </React.Fragment>
              )}
            </ComboboxValue>
          </ComboboxChips>
          <ComboboxContent >
            <ComboboxEmpty>No items found.</ComboboxEmpty>
            <ComboboxList>
              {(item) => (
                <ComboboxItem key={item} value={item}>
                  {item}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox> */}


      <FieldGroup>
        <FieldSet>
          <Field className="gap-1">
            <FieldLabel htmlFor="add-book-short-description" >Short Description</FieldLabel>
            <Textarea id="add-book-short-description" className="resize-none h-25" {...register("shortDescription")} />
            {errors.shortDescription && <div className="text-xs text-red-400">{errors.shortDescription.message}</div>}
          </Field>
        </FieldSet>
      </FieldGroup>


      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Spinner />}
          save
        </Button>
      </div>
    </form>
  )
}