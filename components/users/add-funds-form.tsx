"use client"

import { Controller, useForm } from "react-hook-form";
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from "../ui/field";
import { Input } from "../ui/input";
import { IDepositSchema } from "@/types/zod";
import { DepositSchema } from "@/types/initail-depsit-form.zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import React, { useEffect } from "react";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { AddDeposit } from "@/app/actions/addInitialdepsit";
import { toast } from "sonner";
import { useCreateDialog } from "@/store/use-create-dialog-store";


export default function AddFunds({ options }: {
  options: string[]
}) {

  const resource = useCreateDialog(s => s.resource)
  const closeDialog = useCreateDialog(s => s.closeDialog)

  const {
    register,
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
    reset,
    setValue
  } = useForm<IDepositSchema>({
    resolver: zodResolver(DepositSchema)
  })

  useEffect(() => {
    setValue("userId", resource?.resourceId as string)
  }, [setValue, resource?.resourceId])

  const HandleFeeForm = async (data: IDepositSchema) => {
    const response = await AddDeposit(data)

    if (response.statusCode === 200) {
      reset()
      closeDialog()
      toast.success(response.message, {
        position: "bottom-center"
      })
    }

    if (response.statusCode !== 200)
      toast.error(response.message, {
        position: "bottom-center"
      })
  }

  return (
    <form onSubmit={handleSubmit(HandleFeeForm)} noValidate className="flex flex-col gap-4">
      <FieldGroup>
        <FieldSet>
          <Controller
            name="reason"
            control={control}
            render={({ field }) => (
              <Field>
                <FieldLabel htmlFor="reason">Reason</FieldLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger id="reason" size="sm">
                    <SelectValue className="capitalize" />
                  </SelectTrigger>
                  <SelectContent>
                    {options.map(option => (
                      <SelectItem
                        key={option.toLowerCase().replace(/-/g, "")}
                        value={option.toLowerCase().replace(/\s+/g, "-")}
                        className="capitalize"
                      >
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.reason && <FieldError className="text-red-400">{errors.reason.message}</FieldError>}
              </Field>
            )}
          />
          <Field>
            <FieldLabel htmlFor="amount">Amount</FieldLabel>
            <Input
              id="amount"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              {...register("amount", { valueAsNumber: true })}
            />
            {errors.amount && <FieldError className="text-red-400">{errors.amount.message}</FieldError>}
          </Field>
        </FieldSet>
      </FieldGroup>

      <FieldGroup>
        <Button variant={"outline"} type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? <React.Fragment><Spinner />Submiting...</React.Fragment>
            : "Submit"}
        </Button>
      </FieldGroup>
    </form>
  )
}