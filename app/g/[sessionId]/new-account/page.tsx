import PageProps from "@/types/props"
import { Metadata } from "next"
import NewMemberForm from "./new-member-form"

export const metadata: Metadata = {
  title: "IGLS — New Account"
}

export default async function Page({ params, searchParams }: PageProps) {

  const resolvedParams = await params
  const resolvedSearchParams = await searchParams

  return (
    <div className="w-full h-dvh overflow-hidden md:h-screen p-2 sm:p-4">
      <NewMemberForm />
    </div>
  )
}