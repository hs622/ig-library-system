"use client"

import React, { Dispatch, SetStateAction } from "react"
import { UpdateBookAction } from "@/app/actions/mutation/update.book"
import { ITrimmedBookEditWithCategorySchema } from "@/types/book-edit-form.zod"
import { CreateBookSchema, ICreateBookSchema } from "@/types/book.zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, ControllerFieldState, ControllerRenderProps, useForm, UseFormSetValue } from "react-hook-form"
import { toast } from "sonner"
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from "../ui/field"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Button } from "../ui/button"
import { Spinner } from "../ui/spinner"
import { Check, ChevronsUpDown, Loader2, Plus } from "lucide-react"
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor
} from "../ui/combobox"
import { useParams } from "next/navigation"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { cn } from "@/lib/utils"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command"

import { generateCode } from "@/lib/hepler"
import { Categories } from "@/app/actions/query/categories.query"

export default function EditBookForm({ data }: { data: string }) {
  "use no memo"

  const destructure = (): [ICreateBookSchema, { code: string, title: string, _id: string, isParent: boolean }] => {
    const { category, ...dataWithCategory } = JSON.parse(data) as ITrimmedBookEditWithCategorySchema;
    return [dataWithCategory, category]
  }
  const [dataWithCategory, categoryOnly] = destructure()

  const [selectedCategory, setSelectedCategory] = React.useState<{ code: string, title: string, _id: string }>(categoryOnly)
  const [category] = React.useState<{ code: string, title: string, _id: string }>(categoryOnly)
  const [book] = React.useState<ICreateBookSchema>(dataWithCategory)
  const params = useParams<{ bookId: string }>()
  const BID = params.bookId

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    control,
    watch,
    setValue,
    getValues
  } = useForm<ICreateBookSchema>({
    resolver: zodResolver(CreateBookSchema),
  })

  React.useEffect(() => {
    reset({
      title: book?.title,
      authorName: book?.authorName as string,
      isbn13: book?.isbn13 as number,
      isbn10: book?.isbn10 as number,
      publicationYear: book?.publicationYear as number,
      publisherName: book?.publisherName as string,
      shortDescription: book?.shortDescription as string,
      categoryId: book?.categoryId,
      tags: book?.tags,
      code: category?.code ?? `${category?.code}-${generateCode(book?.authorName).toUpperCase()}`,
    })
  }, [book, category, reset])

  const authotName = watch("authorName")
  React.useEffect(
    () => {
      setValue("code", `${selectedCategory?.code}-${generateCode(authotName ?? "").toUpperCase()}`)
    },
    [getValues, setValue, authotName, selectedCategory]
  )

  const handleForm = async (payload: ICreateBookSchema) => {

    // const response = await fetchLength({ collectionName: "books" })

    const res = await UpdateBookAction(BID, payload)
    console.log({ res })

    if (!res.success) {
      toast.error("Error", {
        description: res?.message,
        position: "bottom-right",
      })
    }

    return toast.success("Success", {
      description: res?.message,
      position: "bottom-right"
    })
    return reset()
  }

  return (
    <form onSubmit={handleSubmit(handleForm)} noValidate className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className="pt-2 pb-2 h-full">
          <div className="border rounded-xl h-full flex justify-center items-center md:min-h-80">
            Upload book cover
          </div>
        </div>
        <div className="col-span-1 md:col-span-3 gap-2">
          <small>Book Details</small>
          <div className="flex flex-col gap-2 py-2">
            <FieldGroup >
              <FieldSet>
                <Field>
                  <FieldLabel htmlFor="edit-book-form-title">Title</FieldLabel>
                  <Input type="text" id="edit-book-form-title" {...register("title")} />
                  {errors.title && <div className="text-sm text-red-400">{errors.title.message}</div>}
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
                  <Input type="text" id="edit-book-form-publication-year" {...register("publicationYear")}
                  />
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
          </div>
        </div>
        <div className="md:col-span-2">
          <small>Book metadata</small>
          {/* <CategoryDropdown /> */}
          {/* selecptedCategoryId={data.book._id}  */}

          <div className="flex flex-col gap-2 py-2">
            <FieldGroup>
              <FieldSet className="gap-2">
                <Field>
                  <div className="flex justify-between">
                    <FieldLabel htmlFor="edit-book-form-attach-category">Category</FieldLabel>
                  </div>
                  <Controller
                    name="categoryId"
                    control={control}
                    render={({ field, fieldState }) => <BookCategoryDropdown field={field} fieldState={fieldState} setValue={setValue} setCategory={setSelectedCategory} />}
                  />
                </Field>
                <Field>
                  <FieldLabel>Tags</FieldLabel>
                  <Controller
                    name="tags"
                    control={control}
                    render={({ field, fieldState }) => <BookTagsDropdown field={field} fieldState={fieldState} setValue={setValue} />}
                  />
                </Field>
              </FieldSet>
            </FieldGroup>
          </div>
        </div>
      </div>
      <div className="">
        <small>Author Details</small>
        <div className="grid grid-cols-6 gap-4">
          <div className="col-span-4">
            <div className="flex flex-col gap-2 py-2">
              <FieldGroup>
                <FieldSet>
                  <Field>
                    <FieldLabel htmlFor="edit-book-form-author-name">Author Name</FieldLabel>
                    <Input type="text" id="edit-book-form-author-name" {...register("authorName")} />
                    {errors.authorName && <div className="text-sm text-red-400">{errors.authorName.message}</div>}
                  </Field>
                </FieldSet>
              </FieldGroup>
              <FieldGroup>
                <FieldSet>
                  <Field>
                    <FieldLabel htmlFor="edit-book-form">About</FieldLabel>
                    <Textarea className="resize-none h-52" />
                  </Field>
                </FieldSet>
              </FieldGroup>
            </div>
          </div>


          <FieldGroup className="col-start-5 col-span-2 py-2">
            <FieldSet className="gap-2">
              <Field>
                <FieldLabel className="flex justify-between items-center">
                  Book Code <small>(System Generate)</small>
                </FieldLabel>
                <Input type="text" {...register("code")} disabled />
              </Field>

              {/* {true ? (
                <Alert variant={"destructive"}>
                  <AlertCircleIcon />
                  <AlertTitle></AlertTitle>
                  <AlertDescription>
                    Code consist of few distant values — Two of them are Category and Auhtor&apos;s name.
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert variant={"default"}>
                  <CheckCircle2Icon />
                  <AlertTitle>Code </AlertTitle>
                  <AlertDescription>
                    Code consist of few distant values — Two of them are Category and Auhtor&apos;s name.
                  </AlertDescription>
                </Alert>
              )} */}
            </FieldSet>
          </FieldGroup>
        </div>
      </div>

      <Button variant={"outline"} type="submit" size={"sm"} disabled={isSubmitting} className="">
        {isSubmitting ? <React.Fragment><Spinner /> updating...</React.Fragment> : "Update"}
      </Button>
    </form >
  )
}

const intialSuggestions: string[] = []

function BookTagsDropdown({
  field,
  fieldState,
  setValue
}: {
  field: ControllerRenderProps<ICreateBookSchema, "tags">,
  fieldState: ControllerFieldState,
  setValue: UseFormSetValue<ICreateBookSchema>
}) {

  const anchor = useComboboxAnchor()
  const [items, setItems] = React.useState<string[]>(intialSuggestions)
  const [inputValue, setInputValue] = React.useState<string>("")

  const value = field.value ?? []

  const trimmed = inputValue.trim()
  const exists = items.some(
    (item) => item.toLowerCase() === trimmed.toLowerCase()
  )
  const canCreate = trimmed.length > 0 && !exists

  const displayItems = canCreate ? [...items, trimmed] : items

  const handleValueChange = (next: string[]) => {
    if (canCreate && next.includes(trimmed) && !items.includes(trimmed)) {
      setItems((perv) => [...perv, trimmed])
    }
    setValue("tags", next, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    })
    setInputValue("")
  }

  return (
    <Combobox
      multiple
      items={displayItems}
      value={value}
      onValueChange={handleValueChange}
      inputValue={inputValue}
      onInputValueChange={setInputValue}
    >
      <ComboboxChips ref={anchor} className="w-full max-w-full max-h-30 h-full">
        <ComboboxValue>
          {(values) => (
            <React.Fragment>
              {values.map((v: string) => (
                <ComboboxChip key={v}>{v}</ComboboxChip>
              ))}
              <ComboboxChipsInput
                name={field.name}
                onBlur={field.onBlur}
                ref={field.ref}
              />
            </React.Fragment>
          )}
        </ComboboxValue>
      </ComboboxChips>

      <ComboboxContent anchor={anchor}>
        <ComboboxEmpty>No items found.</ComboboxEmpty>
        <ComboboxList>
          {(item: string) => (
            <ComboboxItem key={item} value={item}>
              {canCreate && item === trimmed ? (
                <React.Fragment>
                  <Plus className="mr-2 size-4" />
                  {`Create ${item}`}
                </React.Fragment>
              ) : (
                item
              )}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>

      {fieldState.error && (
        <FieldError className="text-sm text-destructive mt-1">
          {fieldState.error.message}
        </FieldError>
      )}

    </Combobox>
  )
}

function BookCategoryDropdown({
  field,
  fieldState,
  setValue,
  setCategory
}: {
  field: ControllerRenderProps<ICreateBookSchema, "categoryId">,
  fieldState: ControllerFieldState,
  setValue: UseFormSetValue<ICreateBookSchema>,
  setCategory: Dispatch<SetStateAction<{ title: string, code: string; _id: string }>>
}) {

  const [categories, setCategories] = React.useState<{ title: string, _id: string, code: string }[]>([])
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [open, setOpen] = React.useState<boolean>(false)

  const getData = React.useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await Categories({
        searchParams: Promise.resolve({ type: "child", select: "title,code" })
      })

      if (!response.success) {
        throw new Error(response.error)
      }

      const { categories } = response.data
      const categoriesObj = JSON.parse(categories) as { title: string, _id: string, code: string }[]
      setCategories(categoriesObj)
    } catch (error) {
      console.error(error)
      setCategories([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    getData()
  }, [getData])

  const selectedCategory = categories.find(
    (category) => category._id === field.value
  )

  React.useEffect(() => { setCategory(selectedCategory!) }, [selectedCategory, setCategory])

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
              "w-full justify-between font-normal capitalize",
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
        <PopoverContent className="w-md p-0">
          <Command>
            <CommandInput placeholder="Search category..." className="w-full" />
            <CommandList>
              <CommandEmpty>No category found.</CommandEmpty>
              <CommandGroup>
                {categories.map((category) => (
                  <CommandItem
                    key={category._id}
                    value={category.title}
                    onSelect={() => {
                      field.onChange(category._id)
                      setValue("categoryId", category._id)
                      setOpen(false)
                    }}
                    className="flex justify-between items-center"
                  >
                    <span className="flex capitalize">
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          field.value === category._id
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {category.title}
                    </span>
                    <small className="text-accent-foreground">{category.code}</small>
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
}