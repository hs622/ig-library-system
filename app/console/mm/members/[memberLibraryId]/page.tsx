import { Card, CardContent, CardTitle } from "@/components/ui/card" 
import dynamic from "next/dynamic"
import { Suspense } from "react"

const DynamicMemberEditForm = dynamic(
  () => import("@/components/users/edit-form").then(mod => mod.MemberEditForm),
  { ssr: true }
)
export default async function Page({ params }: { params: Promise<{ memberLibraryId: string | string[] | undefined }> }) {

  const resolvedParams = await params
  const memberLibraryId = resolvedParams.memberLibraryId

  return (
    <div className="p-4 w-full" suppressHydrationWarning>
      <Card>
        <CardContent>
          <CardTitle>Member Edit Form</CardTitle>
          <Suspense fallback={"loading..."}>
            <DynamicMemberEditForm memberLibraryId={String(memberLibraryId)} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}