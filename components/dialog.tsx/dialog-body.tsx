"use client"

import React from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { useDialog } from "@/store/useDialogStore";
import { Spinner } from "../ui/spinner";


export interface DialogProps {
  title: string,
  description?: string,
  SubmitButtonText?: string,
  CancelButtonText?: string,
  CancelButton?: boolean
  CancelButtonVariant?: "link" | "default" | "outline" | "secondary" | "ghost" | "destructive" | "nothing"
  SubmitButtonVariant?: "link" | "default" | "outline" | "secondary" | "ghost" | "destructive" | "nothing",
}

export default function DialogBody({
  title,
  description,
  CancelButton = true,
  CancelButtonText,
  SubmitButtonText,
  CancelButtonVariant = "destructive",
  SubmitButtonVariant = "outline",
  children,
}: DialogProps & React.ComponentProps<"div">) {

  const isOpen = useDialog(s => s.isOpen)
  const isLoading = useDialog(s => s.isLoading)
  const closeDialog = useDialog(s => s.closeDialog)

  return (
    <Dialog
      open={isOpen}
      onOpenChange={closeDialog}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        {children}

        <DialogFooter>
          {CancelButton && <Button type="button" disabled={isLoading} variant={CancelButtonVariant}>{CancelButtonText}</Button>}
          <Button 
            type="submit" 
            variant={SubmitButtonVariant}
          >
            {isLoading 
              ? <React.Fragment><Spinner />{SubmitButtonText}</React.Fragment>
              : SubmitButtonText
            }
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}