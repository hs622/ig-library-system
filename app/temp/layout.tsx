import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Add books",
  description: "add books to library management system."
}

export default function TempLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {children}
    </div>
  )
}