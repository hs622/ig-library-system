"use client"

import { useForm } from "react-hook-form"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSelectedResourceIds } from "@/store/use-resource-selection-store"
import { Field, FieldLabel } from "./ui/field"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import React from "react"
import { Spinner } from "./ui/spinner"
import { useDeleteBulkDialogStore } from "@/store/use-delete-dialog-store"
import { IDeleteConfirmationDialog } from "@/types/zod"
import { DeleteConfirmationDialog } from "@/types/delete-confirmation-form.zod"

export default function DeleteBulkResourcesDialog() {

  const { isOpen, resource, closeDialog } = useDeleteBulkDialogStore()
  const selectedResourceIds = useSelectedResourceIds()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    // reset
  } = useForm<IDeleteConfirmationDialog>({
    resolver: zodResolver(DeleteConfirmationDialog)
  })

  const confirmationValue = watch("confirmation")
  const isMatch = confirmationValue === resource?.title

  const handleForm = (data: IDeleteConfirmationDialog) => {
    console.log(data)
    console.log(selectedResourceIds)
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={closeDialog}
    >
      <DialogContent className="w-full max-w-lg">
        <DialogHeader>
          <DialogTitle>Delete Resources?</DialogTitle>
          <DialogDescription>Are your sure want to delete all these resources.</DialogDescription>
        </DialogHeader>
        <form id="delete-resource-form" onSubmit={handleSubmit(handleForm)} noValidate>
          <Field>
            <FieldLabel htmlFor="deleting-dialog-form-confirmation">{`Type "${resource?.title}" to comfirm your action.`}</FieldLabel>
            <Input id="deleting-dialog-form-confirmation" type={"text"} {...register("confirmation")} />
            {errors.confirmation && <div className="text-sm text-accent">{errors.confirmation.message}</div>}
          </Field>
        </form>
        <DialogFooter>
          <Button type="button" variant={"destructive"} onClick={() => closeDialog()} disabled={isSubmitting}>Cancel</Button>
          <Button type="submit" form="delete-resource-form" variant={"outline"} disabled={!isMatch || isSubmitting} className="cursor-pointer">
            {isSubmitting ? <React.Fragment><Spinner />Deleting...</React.Fragment> : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}