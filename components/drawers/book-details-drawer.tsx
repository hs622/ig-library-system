"use client";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Button } from "../ui/button";
import { useDrawerStore } from "@/store/use-drawer-store";
import { ArrowLeft, Pencil } from "lucide-react";
import React from "react";
import { ButtonGroup } from "../ui/button-group";
import Link from "next/link";
import QRCodeWithSequence from "../QRCode/qr-code-generator";
import { Book } from "@/app/actions/query/book.query"; 
import { ICreateBookSchema } from "@/types/book.zod";

export function BookDetailsDrawer() {

  const [data, setData] = React.useState<ICreateBookSchema & { category: { title: string }, _id: string } | null>(null)
  const { isOpen, selectedBook, closeDrawer } = useDrawerStore();

  React.useEffect(() => {
    if (!isOpen) return;

    async function fetchBook() {
      const response = await Book({
        searchParams: Promise.resolve({ bookId: selectedBook?._id })
      })

      if (!response.success) {
        throw new Error(response.error);
      }

      if (response.success) {
        const bookWithCategory = JSON.parse(response.data)
        setData(bookWithCategory as ICreateBookSchema & { category: { title: string }, _id: string })
      }
    }

    fetchBook()
  }, [isOpen, selectedBook])

  return (
    <Drawer
      direction="left"
      open={isOpen}
      onOpenChange={(open) => !open && closeDrawer()}
    >
      <DrawerContent
        className="max-w-200! w-full p-4 overflow-hidden"
      >
        <div className="flex flex-col h-full max-w-full">
          <DrawerHeader className="px-0 pt-0 flex flex-row justify-between items-center">
            <div className="flex items-center">
              <DrawerClose asChild>
                <Button type="button" className="cursor-pointer" variant={"nothing"}>
                  <ArrowLeft />
                </Button>
              </DrawerClose>
              <div>
                <DrawerTitle className="capitalize trancate">{data?.title}</DrawerTitle>
                <DrawerDescription className="capitalize">
                  {data?.category?.title ?? "Uncategorized"}
                </DrawerDescription>
              </div>
            </div>

            <ButtonGroup>
              <Button variant={"outline"} asChild>
                <Link href={`/ci/book-inventory/${selectedBook?._id}`}>
                  <Pencil />
                </Link>
              </Button>
            </ButtonGroup>
          </DrawerHeader>

          <div className="flex flex-col justify-between h-full">
            <div className="flex flex-col gap-4 py-4">
              <div className="">
                <h2 className="text-5xl font-bold text-wrap capitalize ">{data?.title}</h2>
                <small className="">{data?.code ?? "NA"}</small>
              </div>

              <div className="">
                <h4 className="text-md text-gray-500">Short Description</h4>
                <p className="text-md">
                  {data?.shortDescription}
                  lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit fuga voluptas, non architecto aliquam, nemo enim similique sapiente velit iure, a beatae dolore deserunt sequi.
                </p>
              </div>

              <div className="">
                <small className="text-accent-foregroundx">Author Details</small>
                <div className="flex gap-4 py-1">
                  <div>
                    <h4 className="text-gray-500">Author</h4>
                    <h6 className="capitalize ">{data?.authorName}</h6>
                  </div>
                </div>
              </div>

              <div>
                <small className="text-accent-foregroundx">Book Details</small>
                <div className="grid grid-cols-3 gap-4 py-1 w-[70%]">
                  <div>
                    <h4 className="text-gray-500">Code</h4>
                    <h6 className="capitalize ">{data?.code ?? "NA"}</h6>
                  </div>
                  <div>
                    <h4 className="text-gray-500">ISBN-10</h4>
                    <h6 className="capitalize ">{data?.isbn10 ?? "NA"}</h6>
                  </div>
                  <div>
                    <h4 className="text-gray-500">ISBN-13</h4>
                    <h6 className="capitalize ">{data?.isbn13 ?? "NA"}</h6>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 py-1 w-[70%]">
                  <div>
                    <h4 className="text-gray-500">Publication Year</h4>
                    <h6 className="capitalize ">{data?.publicationYear ?? "NA"}</h6>
                  </div>
                  <div>
                    <h4 className="text-gray-500">Publisher Name</h4>
                    <h6 className="capitalize ">{data?.publisherName ?? "NA"}</h6>
                  </div>
                  <div>
                    <h4 className="text-gray-500">Category</h4>
                    <h6 className="capitalize ">{data?.category?.title ?? "NA"}</h6>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end w-full">
              {data?._id ? (
                <QRCodeWithSequence
                  value={selectedBook?._id ?? ""}
                  sequence={data?.code ?? "Not Available"}
                  size={160}
                />
              ) : (
                <React.Fragment>
                  Couldn&apls;t found resource ID
                </React.Fragment>
              )}
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}