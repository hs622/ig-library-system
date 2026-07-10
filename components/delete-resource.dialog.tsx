"use client"

import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Field, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Spinner } from "./ui/spinner";
import React from "react";
import { useDeleteDialogStore } from "@/hooks/use-delete-dialog-store"; 
import DeleteBookAction from "@/app/actions/deleteBookAction";
import { DeleteConfirmationDialog } from "@/types/delete-confirmation-form.zod";

export default function DeleteResourceDialog() {

  const { isOpen, resource, closeDialog } = useDeleteDialogStore()

  const deletingConfirmationDialog = React.useMemo(
    () => DeleteConfirmationDialog.refine((value) => value.confirmation == resource?.title, {
      message: `Please type ${resource?.title} exactly to confirm.`
    }), [resource?.title]
  );

  type IDeletingConfirmationDialog = z.infer<typeof deletingConfirmationDialog>;

  const {
    register,
    reset,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<IDeletingConfirmationDialog>({
    resolver: zodResolver(deletingConfirmationDialog)
  })

  const confirmationValue = watch("confirmation")
  const isMatch = confirmationValue === resource?.title

  const handleForm = async (data: IDeletingConfirmationDialog) => {
    console.log({ data })
    await DeleteBookAction({ confirmation: data.confirmation, module: resource?.title ?? "", resourceId: resource?.resourceId ?? "" })
    // reset()
    // closeDialog()
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={closeDialog}
    >
      <DialogContent className="w-full max-w-lg">
        <DialogHeader>
          <DialogTitle>Delete a Resource?</DialogTitle>
          <DialogDescription>Are your sure want to delete the <span className="font-bold">{resource?.title}</span></DialogDescription>
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