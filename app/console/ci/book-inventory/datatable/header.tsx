"use client";

import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { useDeleteBulkDialogStore } from "@/store/use-delete-dialog-store";
import { ArrowDown, ArrowUp, QrCodeIcon, Trash2 } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { useDrawerGlobalStore } from "@/store/drawer-global-store";
import { useSelectedResourceIds } from "@/store/book-table-store";
import { useDialogGlobalStore } from "@/store/dailog-global-store";

export function BookSearchInput() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = React.useState(searchParams.get("search") ?? "");

  React.useEffect(() => {
    const handle = setTimeout(() => {
      const params = new URLSearchParams();
      if (value) params.set("search", value);
      router.push(`${pathname}?${params.toString()}`);
    }, 400);

    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <Input
      placeholder="Search with title"
      className="max-w-full"
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}

export function DeleteBulkResources() {
  const selectedIds = useSelectedResourceIds()
  const { openDialog } = useDeleteBulkDialogStore()

  return (
    <Button type="button" variant={"outline"} disabled={selectedIds.length < 1} onClick={() => openDialog({
      module: "books",
      title: "discard all resources"
    })}>
      <Trash2 />
    </Button>
  )
}

export function BulkQRCodeGeneratingForPrinting() {
  const selectedIds = useSelectedResourceIds()
  const openDrawer = useDrawerGlobalStore(s => s.openDrawer)
  const setHeight = useDrawerGlobalStore(s => s.setHeight)
  React.useEffect(() => setHeight(90), [setHeight])

  return (
    <Button type="button" variant={"outline"} disabled={selectedIds.length < 1} onClick={openDrawer}>
      <QrCodeIcon />
    </Button>
  )
}

export function ImportBulkDataButton() {

  const openDialog = useDialogGlobalStore(s => s.openDialog)
  const setDescription = useDialogGlobalStore(s => s.setDescription)
  const setTitle = useDialogGlobalStore(s => s.setTitle)
  const setKey = useDialogGlobalStore(s => s.setKey)

  setKey("import-excel-data")
  setTitle("Upload file")
  setDescription("Import bulk data")

  return (
    <Button variant={"outline"} onClick={() => openDialog()} aria-label="import">
      <ArrowUp />
    </Button>
  )
}

export function ExportBulkDataButton() {

  return (
    <Button variant={"outline"} className="">
      <ArrowDown />
    </Button>
  )
}

export function refetchData() {

}

export function BookSearchTags() {

  return (
    <Combobox>
      <Button variant={"outline"} className="border-dotted">Tags</Button>
    </Combobox>
  )
}