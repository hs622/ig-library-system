"use client"

import React from "react"
import QrCodeReader from "./qr-code-reader"

export default function Page() {
  const [value, setValue] = React.useState<string | null>(null)

  return (
    <div className="flex h-screen justify-center">
      <QrCodeReader  onScan={
        (value) => setValue(value)
      }/>

      <div>
        {value}
      </div>
    </div>
  )
}