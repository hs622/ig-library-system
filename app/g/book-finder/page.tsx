"use client"

import React from "react"
import QrCodeReader from "./qr-code-reader"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BookRow } from "@/app/(administrator)/ci/book-inventory/datatable/columns"
import { toast } from "sonner"
import { Camera } from "lucide-react"
import { ButtonGroup } from "@/components/ui/button-group"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/buttons/theme-button-3"

export default function Page() {
  const [value, setValue] = React.useState<string | null>(null)
  const [book, setBook] = React.useState<BookRow & { deletedAt: string } | null>(null)
  const [errors, setErrors] = React.useState<string | null>(null)
  const [paused, setPaused] = React.useState<boolean>(false)
  const { _id, deletedAt,   ...bookWithId } = book || {}

  React.useEffect(() => {
    if (value === null) return

    let cancelled = false

    const fetchBookdetails = async () => {
      try {
        const response = await fetch(`/api/books?bookId=${value}`)
        if (!response.ok) throw new Error("Couldn't find the book.")

        const jsonDecoded = await response.json()
        if (cancelled) return

        setBook(jsonDecoded.book)
        setPaused(true)
      } catch (error) {
        if (cancelled) return
        const message = error instanceof Error ? error.message : "something went wrong."
        setErrors(message)
        toast.error(message, { position: "top-center" })
      }
    }

    fetchBookdetails()

    return () => {
      cancelled = true
    }
  }, [value])

  const resume = React.useCallback(() => setPaused(false), []);

  return (
    <Card className="h-full">
      <CardContent className="flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-xl font-bold uppercase">
              Book Finder
            </div>
            <div>
              Search book details through QR Code.
            </div>
          </div>

          <ButtonGroup>
            <ModeToggle />
            <Button
              variant={"outline"}
              type="button"
              onClick={resume}
              className="cursor-pointer"
              disabled={!paused}
            >
              <Camera />
            </Button>
          </ButtonGroup>
        </div>

        <div className="flex justify-center w-full">
          <div className="size-64 oveerflow-hidden">
            <QrCodeReader
              setPaused={setPaused}
              paused={paused}
              onScan={
                (value) => setValue(value)
              } />
          </div>
        </div>

        <ScrollArea className="h-inherit p-2">
          <pre>
            {JSON.stringify(bookWithId, null, 2)}
          </pre>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}