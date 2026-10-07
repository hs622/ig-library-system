"use client"

import { useResourceSelectionStore } from "@/store/use-resource-selection-store";
import QRBatchPrint from "../QRCode/qr-code-batch-printing";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "../ui/drawer";
import { useDrawerGlobalStore } from "@/store/drawer-global-store";
import { cn } from "@/lib/utils";
import { useBookTableStore, useSelectedResourceIds } from "@/store/book-table-store";


export default function QRCodeDrawer() {

  const isOpen = useDrawerGlobalStore(s => s.isOpen)
  const width = useDrawerGlobalStore(s => s.width)
  const height = useDrawerGlobalStore(s => s.height)

  const closeDrawer = useDrawerGlobalStore(s => s.closeDrawer)

  const rowSelection = useBookTableStore((s) => s.rowSelection)
  const ids = Object.keys(rowSelection).map<string>(id => id.split("_").at(0)!)
  const codes = Object.keys(rowSelection).map<string>(code => code.split("_").at(-1)!)

  return (
    <Drawer
      open={isOpen}
      onOpenChange={closeDrawer}
    >
      <DrawerContent className={cn("m-0 p-4", `h-[${height}vh] w-[${width}vw]`)}>
        <DrawerHeader className="text-sm">
          <DrawerTitle>Are you absolutely sure?</DrawerTitle>
          <DrawerDescription>This action cannot be undone.</DrawerDescription>
        </DrawerHeader>
        <QRBatchPrint resourceIds={ids} resourceTags={codes} />
      </DrawerContent>
    </Drawer>
  );
}