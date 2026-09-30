"use client"

import { CreateCategoryFormValidation, ICreateCategoryFormValidation } from "@/types/add-category-form.zod"
import { zodResolver } from "@hookform/resolvers/zod"
import React from "react"
import { Controller, useFieldArray, useForm } from "react-hook-form"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from "../ui/field"
import { Input } from "../ui/input"
import { CategorySuggestionDropdown } from "./category-suggestion"
import { Button } from "../ui/button"
import { Spinner } from "../ui/spinner"
import { Switch } from "../ui/switch"
import { useCreateDialog } from "@/store/use-create-dialog-store"
import { AddCategory_v2 } from "@/app/actions/addCategories"
import { toast } from "sonner"
import { mutateCategory } from "@/app/actions/mutation/create.category"
import { Checkbox } from "../ui/checkbox"
import { generateCode } from "@/lib/hepler"
import { ArrowLeft, Minus, Plus } from "lucide-react"
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "../ui/input-group"
import { ButtonGroup } from "../ui/button-group"

export function AddCategoryDialog() {

  const [step, setStep] = React.useState<number>(1)
  const [direction, setDirection] = React.useState<"forward" | "backward">(
    "forward"
  );

  const { isOpen, closeDialog } = useCreateDialog()
  const {
    control,
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    setValue,
    reset,
    trigger,
    getValues,
  } = useForm<ICreateCategoryFormValidation>({
    resolver: zodResolver(CreateCategoryFormValidation),
    defaultValues: {
      typeOfCategory: false,
      childCategories: [
        { name: "", code: "" }
      ]
    }
  })

  React.useEffect(() => {
    if (errors.childCategories?.root) {
      toast.error("Error", {
        description: errors.childCategories?.root?.message,
        position: "bottom-right",
      })
    }
  }, [errors])

  const handleForm = async (data: ICreateCategoryFormValidation) => {
    console.log({ data })
    const response = await mutateCategory(data)
    console.log({ response })

    if (response.success) {
      onOpenChange()
      toast.success("Success", {
        description: response.message,
        position: "bottom-center"
      })

      return
    } else toast.error("Error", {
      description: response.errors as string,
      position: "bottom-right"
    })
  }

  const { fields, append, remove } = useFieldArray({
    control,
    name: "childCategories",
  })

  function onOpenChange() {
    reset()
    setStep(1)
    closeDialog()
  }

  const generatingCodeThroughTitle = ({ event, KeyName }: {
    event: React.ChangeEvent<HTMLInputElement>,
    KeyName: "code" | `childCategories.${number}.code`
  }) => {

    setTimeout(() => {
      setValue(
        KeyName,
        (KeyName === "code")
          ? `${generateCode(event.target.value).toUpperCase()}`
          : `${getValues("code")}-${generateCode(event.target.value).toUpperCase()}`
      )
    }, 200)
  }

  const handleNext = async () => {
    const isValid = await trigger("category")
    if (!isValid) return;

    setDirection("forward");
    setStep(2);
  }

  const goBack = () => {
    setDirection("backward");
    setStep(1);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onOpenChange}
    >
      <DialogContent>

        <div className="overflow-hidden">
          <div
            key={step}
            className={
              direction === "forward"
                ? "animate-step-in-right"
                : "animate-step-in-left"
            }
          >
            <DialogHeader className="flex flex-row items-center pb-4">
              {step > 1 && <button onClick={goBack}><ArrowLeft /></button>}
              <div className="flex flex-col gap-2">
                <DialogTitle>{step == 1 ? "New Category" : "Add Child Categories"}</DialogTitle>
                <DialogDescription>
                  {step == 1 ? "Form for adding new category or attach to existing one." : "Add the child categories that belong to this parent category."}
                </DialogDescription>
              </div>
            </DialogHeader>

            <form onSubmit={handleSubmit(handleForm)} noValidate className="flex flex-col gap-6 p-1">
              {step == 1 && (
                <React.Fragment>
                  <FieldGroup>
                    <FieldSet>
                      <Field>
                        <div className="flex justify-between">
                          <FieldLabel htmlFor="name-1">Category Title</FieldLabel>
                        </div>
                        <Input id="name-1" {...register("category")} aria-invalid={!!errors.category} onChange={(event) => generatingCodeThroughTitle({ event, KeyName: "code" })} />
                        {errors.category && <div className="text-sm text-red-500">{errors.category.message}</div>}
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="name-1">Category Code</FieldLabel>
                        <Input id="name-1" {...register("code")} aria-invalid={!!errors.code} readOnly disabled />
                        {errors.code && <div className="text-sm text-red-500">{errors.code.message}</div>}
                      </Field>
                    </FieldSet>
                  </FieldGroup>

                  <FieldGroup>
                    <FieldSet>

                      <Controller
                        name={"typeOfCategory"}
                        control={control}
                        render={({ field, fieldState }) => {

                          return (
                            <Field
                              orientation={"horizontal"}
                              data-invalid={fieldState.invalid}
                            >
                              <div className="flex items-center gap-2">
                                <Checkbox
                                  id="category_type-checkbox"
                                  name={field.name}
                                  checked={field.value}
                                  aria-invalid={fieldState.invalid}
                                  onCheckedChange={checked => {
                                    console.log(checked)
                                    return field.onChange(checked === true)
                                  }}
                                />
                                <FieldLabel htmlFor="category_type-checkbox">It&apos;s a parent category?</FieldLabel>
                              </div>
                              {fieldState.error && <FieldError className="bg-red-400">{fieldState.error.message}</FieldError>}
                            </Field>
                          )
                        }}
                      >
                      </Controller>

                    </FieldSet>
                  </FieldGroup>

                  <Controller
                    name={"typeOfCategory"}
                    control={control}
                    render={({ field }) => (
                      field.value ? (
                        <Button type="button" onClick={handleNext}>
                          Next
                        </Button>
                      ) : (
                        <Button type="submit" variant={"outline"} disabled={isSubmitting}>
                          {isSubmitting ? <React.Fragment>
                            <Spinner />creating...
                          </React.Fragment> : "Create"}
                        </Button>
                      )
                    )}
                  />
                </React.Fragment>
              )}

              {step == 2 && (
                <React.Fragment>
                  <FieldGroup>
                    <FieldLabel htmlFor={`child-categories`}>Child Categories</FieldLabel>
                    <FieldSet className="p-1 max-h-50 overflow-y-scroll scrollbar-none">
                      {fields.map((field, index) => (
                        <Field key={field.id}>
                          <div className="flex gap-2">
                            <InputGroup>
                              <InputGroupInput
                                id={`child-category-${index + 1}`} {...register(`childCategories.${index}.name`)}
                                aria-invalid={!!errors.childCategories?.[index]}
                                placeholder="e.g. Fiction"
                                onChange={(event) => generatingCodeThroughTitle({ event, KeyName: `childCategories.${index}.code` })}
                              />
                              <InputGroupAddon align="inline-end">
                                <InputGroupText>{getValues(`childCategories.${index}.code`)}</InputGroupText>
                              </InputGroupAddon>
                            </InputGroup>
                            <ButtonGroup>
                              <Button variant={"outline"} type="button" onClick={() => append({ name: "", code: "" })}><Plus /></Button>
                              <Button variant={"outline"} type="button" onClick={() => remove(index)} disabled={fields.length <= 1}><Minus /></Button>
                            </ButtonGroup>
                          </div>

                          {errors.childCategories?.[index] && <FieldError className="text-red-400">{errors.childCategories?.[index]?.message}</FieldError>}
                        </Field>
                      ))}
                    </FieldSet>
                  </FieldGroup>

                  <Button type="submit" variant={"outline"} disabled={isSubmitting}>
                    {isSubmitting ? <React.Fragment>
                      <Spinner />creating...
                    </React.Fragment> : "Create"}
                  </Button>
                </React.Fragment>
              )}
            </form>
          </div>
        </div>

      </DialogContent>
    </Dialog >
  )
} 