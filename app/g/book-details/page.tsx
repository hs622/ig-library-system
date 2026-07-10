"use client"

import QrCodeReader from "./qr-code-reader"

export default function Page() {

  return (
    <div className="flex h-screen justify-center">
      <QrCodeReader  onScan={
        (value) => console.log(value)
      }/>
    </div>
  )
}