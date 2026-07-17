"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import React from "react"
import { useForm } from "react-hook-form"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Field, FieldGroup, FieldLabel } from "../ui/field"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Spinner } from "../ui/spinner"
import { useCreateDialog } from "@/store/use-create-dialog-store"
import { toast } from "sonner"
import z from "zod"
import { AddInitialDepsit } from "@/app/actions/addInitialdepsit"

export const InitialDepsitByUser = z.object({
  userId: z.string(),
  amount: z.number()
})

export type IInitialDepsitByUser = z.infer<typeof InitialDepsitByUser>;

export function AddInitialDepsitByUserDialog() {

  const isOpen = useCreateDialog(s => s.isOpen)
  const closeDialog = useCreateDialog(s => s.closeDialog)
  const resource = useCreateDialog(s => s.resource)

  const {
    register,
    formState: { errors, isSubmitting, },
    handleSubmit,
    reset,
    setValue
  } = useForm<IInitialDepsitByUser>({
    resolver: zodResolver(InitialDepsitByUser)
  })

  React.useEffect(() => {
    if (isOpen && resource?.resourceId) {
      setValue("userId", resource.resourceId)
    }
  }, [isOpen, resource, setValue])

  const handleForm = async (data: IInitialDepsitByUser) => {
    const response = await AddInitialDepsit(data)
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
          <DialogTitle>Add Funds</DialogTitle>
          <DialogDescription>
            {/* Form for adding new category or attach to existing one. */}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleForm)} noValidate className="flex flex-col gap-4">
          <FieldGroup>
            <Field>
              <div className="flex justify-between">
                <FieldLabel htmlFor="name-1">Amount</FieldLabel>
              </div>
              <Input id="name-1" type="number" {...register("amount", { valueAsNumber: true })} aria-invalid={!!errors.amount} />
              {errors.amount && <div className="text-sm text-red-500">{errors.amount.message}</div>}
            </Field>
          </FieldGroup>

          <Button type="submit" className="cursor-pointer" variant={"outline"} disabled={isSubmitting}>
            {isSubmitting ? <React.Fragment>
              <Spinner />updating...
            </React.Fragment> : "Update"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}