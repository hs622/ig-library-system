"use client"

import React, { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { Check, ChevronsUpDown, Loader2, Paperclip } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"
import { Input } from "@/components/ui/input"
import { usePathname } from "next/navigation"
import { Spinner } from "@/components/ui/spinner"
import { AttachCategory } from "@/app/actions/attachCategoryToBook"
import { CategoryForm, ICategoryForm } from "@/types/zod"
import { Document } from "mongodb"

interface Category {
  _id: string
  title: string
}

export function CategoryDropdown({ selectedCategoryId }: { selectedCategoryId: string }) {

  const pathname = usePathname()
  const bookId = pathname.replace("/", "").split("/").at(-1)

  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [document, setDocument] = React.useState<Document | null>()


  const { control, handleSubmit, register, formState: { isSubmitting }, reset } = useForm<ICategoryForm>({
    resolver: zodResolver(CategoryForm),
    values: {
      categoryId: selectedCategoryId,
      bookId: bookId!
    }
  })

  useEffect(() => {
    let isMounted = true

    async function fetchCategories() {
      try {
        const res = await fetch("/api/categories?type=child")
        if (!res.ok) throw new Error("Failed to fetch categories")
        const data = await res.json()

        // Handle common wrapper shapes defensively
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.categories)
            ? data.categories
            : Array.isArray(data?.data)
              ? data.data
              : null

        if (list === null) {
          console.warn("Unexpected /api/categories response shape:", data)
        }

        if (isMounted) setCategories(list ?? [])
      } catch (error) {
        console.error(error)
        if (isMounted) setCategories([])
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    fetchCategories()
    return () => {
      isMounted = false
    }
  }, [])

  const handleForm = async (data: ICategoryForm) => {
    const doc = await AttachCategory(data)
    setDocument(doc.data)
    reset()
  }

  return (
    <form onSubmit={handleSubmit(handleForm)}>
      <Input type="hidden" value={bookId} {...register("bookId")} />
      <FieldGroup>
        <FieldSet>
          <Field>
            <div className="flex justify-between">
              <FieldLabel htmlFor="edit-book-form-attach-category">Category</FieldLabel>
              <Button type="submit" variant={"outline"} disabled={isSubmitting} size={"sm"}>
                {isSubmitting ? <Spinner /> : <Paperclip />}
              </Button>
            </div>
            <Controller
              name="categoryId"
              control={control}
              render={({ field, fieldState }) => {

                const selectedCategory = categories.find(
                  (category) => category._id === field.value
                )

                return (
                  <div className="flex flex-col gap-1.5">
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={open}
                          disabled={isLoading}
                          className={cn(
                            "w-full justify-between font-normal",
                            !field.value && "text-muted-foreground",
                            fieldState.error && "border-destructive"
                          )}
                        >
                          {isLoading ? (
                            <span className="flex items-center gap-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Loading categories...
                            </span>
                          ) : (
                            selectedCategory?.title ?? "Select category..."
                          )}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                        <Command>
                          <CommandInput placeholder="Search category..." />
                          <CommandList>
                            <CommandEmpty>No category found.</CommandEmpty>
                            <CommandGroup>
                              {categories.map((category) => (
                                <CommandItem
                                  key={category._id}
                                  value={category.title}
                                  onSelect={() => {
                                    field.onChange(category._id)
                                    setOpen(false)
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      field.value === category._id
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {category.title}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    {fieldState.error && (
                      <p className="text-sm text-destructive">
                        {fieldState.error.message}
                      </p>
                    )}
                  </div>
                )
              }}
            />
          </Field>
        </FieldSet>
      </FieldGroup>

      <div className="">

        <pre>
          {JSON.stringify(document, null, 2)}
        </pre>
      </div>
    </form>
  )
}