"use client";

import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { useSelectedResourceIds } from "@/store/use-resource-selection-store";
import { useDeleteBulkDialogStore } from "@/store/use-delete-dialog-store";
import { Trash2 } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";

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
      className="max-w-52"
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
      <Trash2 /> {selectedIds.length}
    </Button>
  )
}

export function refetchData() { }

export function BookSearchTags() {

  return (
    <Combobox>
      <Button variant={"outline"} className="border-dotted">Tags</Button>
    </Combobox>
  )
}