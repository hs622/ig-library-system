import { Metadata } from "next";

export const metadata: Metadata = {
  title: "IGLS — book deatils"
}

export default function GuestLayout(
  { children }:
    { children: React.ReactNode }
) {

  return (
    <div className="p-4 h-dvh">
      {children}
    </div>
  )
}