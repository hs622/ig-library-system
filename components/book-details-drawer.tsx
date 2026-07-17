"use client";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useDrawerStore } from "@/store/use-drawer-store";
import { Pencil, X } from "lucide-react";
import React from "react";
import { ButtonGroup } from "./ui/button-group";
import Link from "next/link";
import QRCodeWithSequence from "./QRCode/qr-code-generator";

export function BookDetailsDrawer() {
  const { isOpen, selectedBook, closeDrawer } = useDrawerStore();

  return (
    <Drawer
      direction="left"
      open={isOpen}
      onOpenChange={(open) => !open && closeDrawer()}
    >
      <DrawerContent
        aria-describedby="left"
        className="
          data-[vaul-drawer-direction=right]:w-full
          data-[vaul-drawer-direction=right]:sm:max-w-none
          data-[vaul-drawer-direction=right]:md:w-1/2
          h-screen
          p-6
        "
      >
        <div className="flex flex-col h-full max-w-md">
          <DrawerHeader className="px-0 pt-0 flex flex-row justify-between items-center">
            <div>
              <DrawerTitle className="trancate">{selectedBook?.title ?? "Book details"}</DrawerTitle>
              <DrawerDescription>
                {selectedBook?.category?.title ?? "Uncategorized"}
              </DrawerDescription>
            </div>

            <ButtonGroup>
              <Button variant={"outline"} asChild>
                <Link href={`/ci/book-inventory/${selectedBook?._id}`}>
                  <Pencil />
                </Link>
              </Button>
              <DrawerClose asChild>
                <Button type="button" className="cursor-pointer" variant={"outline"}>
                  <X />
                </Button>
              </DrawerClose>
            </ButtonGroup>
          </DrawerHeader>

          <div className="flex-1 overflow-y-auto pb-4 space-y-2 text-sm">
            <p>
              <span className="font-medium">Author:</span> {selectedBook?.authorName}
            </p>
            <p>
              <span className="font-medium">ISBN-10:</span> {selectedBook?.isbn10 ?? "Not available"}
            </p>
            <p>
              <span className="font-medium">ISBN-13:</span> {selectedBook?.isbn13 ?? "Not available"}
            </p>
            <p>
              <span className="font-medium">Publication Year:</span> {selectedBook?.publicationYear}
            </p>
            <p>
              <span className="font-medium">Publisher Name:</span> {selectedBook?.publisherName}
            </p>
            <p>
              <span className="font-medium">Short Description:</span> {selectedBook?.shortDescription}
            </p>
          </div>

          <div className="flex justify-center w-full">
            {selectedBook?._id ? (
              <QRCodeWithSequence
                value={selectedBook?._id ?? ""}
                sequence="SN-98234-A"
                size={160}
              />
            ) : (
              <React.Fragment>
                Couldn&apls;t found resource ID
              </React.Fragment>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}