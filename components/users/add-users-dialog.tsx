"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog"
import { useCreateDialog } from "@/store/use-create-dialog-store"
import AddFunds from "./add-funds-form"

const options: string[] = [
  "annual fee",
  "book fee",
  "activity fee",
  "course fee",
  "donation"
] as const

export function AddInitialDepsitDialog(
  { module }: { module: string }
) {

  const isOpen = useCreateDialog(s => s.isOpen)
  const resource = useCreateDialog(s => s.resource)
  const closeDialog = useCreateDialog(s => s.closeDialog)

  return (
    <Dialog
      open={(isOpen && resource?.dialog == module)}
      onOpenChange={closeDialog}
    >
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Add Funds</DialogTitle>
          <DialogDescription>
          </DialogDescription>
        </DialogHeader>
        <AddFunds options={options} />
      </DialogContent>
    </Dialog>
  )
}