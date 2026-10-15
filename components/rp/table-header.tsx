"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCreateDialog } from "@/store/use-create-dialog-store";
import { Plus } from "lucide-react";

export function RPTableHeader() {
  const openDialog = useCreateDialog((state) => state.openDialog);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" aria-label="Add role or permission">
          <Plus />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={() => openDialog({ module: "roles", dialog: "add-role" })}>
          Add new role
        </DropdownMenuItem>
        <DropdownMenuItem>Add new permission</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
