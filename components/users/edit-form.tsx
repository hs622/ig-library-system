"use client"

import { useFetch } from "@/hooks/useFetch"
import { zodResolver } from "@hookform/resolvers/zod"
import React from "react"
import { Controller, useForm } from "react-hook-form"
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from "../ui/field"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { formatCNICNumber, formatContactNumber } from "@/lib/hepler"
import { Skeleton } from "../ui/skeleton"
import { Button } from "../ui/button"
import { Spinner } from "../ui/spinner"
import { toast } from "sonner"
import { IEditMemberFormSchema, EditMemberFormSchema } from "@/types/edit-member-form"

export function MemberEditForm({ memberLibraryId }: { memberLibraryId: string }) {

  const { data, error, isLoading, success } = useFetch<IEditMemberFormSchema>({
    endpoint: `/users/${memberLibraryId}`
  })

  const {
    control,
    handleSubmit,
    register,
    reset,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<IEditMemberFormSchema>({
    resolver: zodResolver(EditMemberFormSchema),
  })

  if (error && errors) {
    toast.error(error ?? "Something went wrong!", {
      position: "top-center"
    })
  }

  React.useEffect(() => {
    if (success && data) {
      reset({
        fullName: data.fullName,
        fatherName: data.fatherName,
        email: data.email,
        address: data.address,
        cnicNumber: formatCNICNumber(data.cnicNumber),
        contactNumber: formatContactNumber(data.contactNumber),
        suggestionForImprovement: data.suggestionForImprovement
      })
    }
  }, [success, data, reset])

  async function handleMemberEditForm(data: IEditMemberFormSchema) {
    console.log(data)
    // const response = await editLibraryMember(memberLibraryId, data)
    // if (response) {
    //   console.log({ response })
    // }
  }

  return (
    <div className="pt-5">
      {isLoading ? (
        <div className="flex flex-col gap-4">
          <FieldGroup>
            <FieldSet className="grid sm:grid-cols-2 gap-4">
              <Field>
                <FieldLabel>
                  <Skeleton className="h-6 w-20" />
                </FieldLabel>
                <div>
                  <Skeleton className="h-10 w-full" />
                </div>
              </Field>
              <Field>
                <FieldLabel>
                  <Skeleton className="h-6 w-20" />
                </FieldLabel>
                <div>
                  <Skeleton className="h-10 w-full" />
                </div>
              </Field>
            </FieldSet>
          </FieldGroup>
          <FieldGroup>
            <FieldSet className="grid sm:grid-cols-2 gap-4">
              <Field>
                <FieldLabel>
                  <Skeleton className="h-6 w-20" />
                </FieldLabel>
                <div>
                  <Skeleton className="h-10 w-full" />
                </div>
              </Field>
              <Field>
                <FieldLabel>
                  <Skeleton className="h-6 w-20" />
                </FieldLabel>
                <div>
                  <Skeleton className="h-10 w-full" />
                </div>
              </Field>
            </FieldSet>
          </FieldGroup>
          <FieldGroup>
            <FieldSet>
              <Field>
                <FieldLabel>
                  <Skeleton className="h-8 w-20" />
                </FieldLabel>
                <div>
                  <Skeleton className="h-40 w-full" />
                </div>
              </Field>
            </FieldSet>
          </FieldGroup>
        </div>
      ) : (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(handleMemberEditForm)} noValidate>
          <FieldGroup>
            <FieldSet className="grid sm:grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="member-edit-form-full-name">Full Name</FieldLabel>
                <Input id="member-edit-form-full-name" type="text" {...register("fullName")} />
                {errors.fullName && <FieldError className="text-red-400">{errors.fullName?.message}</FieldError>}
              </Field>
              <Field>
                <FieldLabel htmlFor="member-edit-form-father-husband-name">Father/Husband Name</FieldLabel>
                <Input id="member-edit-form-father-husband-name" type="text"  {...register("fatherName")} />
                {errors.fatherName && <FieldError className="text-red-400">{errors.fatherName?.message}</FieldError>}
              </Field>
            </FieldSet>
          </FieldGroup>
          <FieldGroup>
            <FieldSet className="grid sm:grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="member-edit-form-email">Guardain/Personal Email</FieldLabel>
                <Input id="member-edit-form-email" type="text"  {...register("email")} />
                {errors.email && <FieldError className="text-red-400">{errors.email?.message}</FieldError>}
              </Field>
              <Field>
                <FieldLabel htmlFor="member-edit-form-contact">Guardain/Personal Contact</FieldLabel>
                <Input id="member-edit-form-contact" type="text"  {...register("contactNumber")} />
                {errors.contactNumber && <FieldError className="text-red-400">{errors.contactNumber?.message}</FieldError>}
              </Field>
            </FieldSet>
          </FieldGroup>
          <FieldGroup>
            <FieldSet className="grid sm:grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="member-edit-form-cnic">B-Form/CNIC Number</FieldLabel>
                <Input
                  id="member-edit-form-cnic"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoFocus
                  maxLength={15}
                  {...register("cnicNumber", {
                    onChange: (event) => {
                      const formatted = formatCNICNumber(event.target.value);
                      setValue("cnicNumber", formatted, { shouldValidate: true })
                    }
                  })} />
                {errors.cnicNumber && <FieldError className="text-red-400">{errors.cnicNumber?.message}</FieldError>}
              </Field>
              <Field>
                <FieldLabel htmlFor="member-edit-form-">Address</FieldLabel>
                <Input id="member-edit-form-" type="text" {...register("address")} />
                {errors.address && <FieldError className="text-red-400">{errors.address?.message}</FieldError>}
              </Field>
            </FieldSet>
          </FieldGroup>
          <FieldGroup>
            <FieldSet className="">
              <Controller
                name="suggestionForImprovement"
                control={control}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                  >
                    <FieldLabel htmlFor="member-edit-form-suggestion-for-improvement" >Suggestion</FieldLabel>
                    <Textarea
                      id="member-edit-form-suggestion-for-improvement"
                      aria-invalid={fieldState.invalid}
                      {...field}
                      className="resize-none h-40"
                      disabled
                    />
                    {errors.suggestionForImprovement && <FieldError className="text-red-400">{errors.suggestionForImprovement?.message}</FieldError>}
                  </Field>
                )}
              />
            </FieldSet>
          </FieldGroup>

          <Button type="submit" variant={"outline"} className="" disabled={isSubmitting}>
            {isSubmitting ? (
              <Spinner /> + "updating..."
            ) : ("update")}
          </Button>
        </form>
      )}
    </div>
  )
}