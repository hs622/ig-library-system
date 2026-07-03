"use client";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

interface BookDrawerProps {
  id: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BookDrawer({
  id,
  open,
  onOpenChange,
}: BookDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-lg">
          <DrawerHeader>
            <DrawerTitle>Book Details</DrawerTitle>
            <DrawerDescription>
              Book ID: {id}
            </DrawerDescription>
          </DrawerHeader>

          <div className="p-4">
            {/* Fetch or render your data here */}
            <p>Content for book: {id}</p>
          </div>

          <DrawerFooter>
            <Button onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}