import announcements from "../annonucements.json" 
import { MoveLeft } from "lucide-react"
import Link from "next/link"

export default async function page({ params }: { params: Promise<{ announcementId: string | string[] | undefined }> }) {

  const resolvedParams = await params
  const announcementId = resolvedParams.announcementId

  const announcement = announcements.filter(announcement => announcement.announcementId === announcementId).at(0)

  return (
    <div className="mx-auto w-[60vw] py-12 overflow-hidden">

      <div className="pt-14 pb-6">
        <Link href={"/g/announcements"} className="flex gap-2 text-md">
          <MoveLeft />
          Announcement
        </Link>
        <div className="text-3xl font-semibold">{announcement?.title}</div>
      </div>

      <div className="mb-10" dangerouslySetInnerHTML={{ __html: String(announcement?.description) }} />

      {/* <div dir="rtl" dangerouslySetInnerHTML={{ __html: String(UrdrDescription) }} /> */}


    </div>
  )
}