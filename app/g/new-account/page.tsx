import { Metadata } from "next"
import NewMemberForm from "./new-member-form"

export const metadata: Metadata = {
  title: "IGLS — New Account"
}

export default async function Page() {

  return (
    <div className="w-full h-dvh overflow-hidden md:h-screen p-2 sm:p-4">
      <NewMemberForm />
    </div>
  )
}