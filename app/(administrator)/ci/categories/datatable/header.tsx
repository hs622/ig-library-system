"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";   
import { useCreateDialog } from "@/store/use-create-dialog-store";
import { Plus } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";

export function CategorySearchInput() {
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
      placeholder="search with title"
      className="max-w-52"
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}

export function AddCreateDialogTirgger() {

  const openDialog = useCreateDialog(s => s.openDialog)

  return (
    <Button variant={"outline"} type="button" onClick={() => openDialog}>
      <Plus />
    </Button>
  )
}