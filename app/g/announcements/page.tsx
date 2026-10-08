import AnnouncementCard from "@/components/announcement-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Home, MoveLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import announcements from "./annonucements.json"

export default function page() {

  return (
    <React.Fragment>
      <div className="h-dvh sm:h-lvh w-[80vw] mx-auto">
        <div className="py-20">
          <div className="text-6xl font-bold">
            Announcements
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {announcements.map(announcement => (
            <AnnouncementCard 
              key={announcement.announcementId} 
              thumbnailSrc={announcement.cover_image}
              thumbnailAlt={announcement.title.toLowerCase().replaceAll(" ", "-")}
              title={announcement.title} 
              description={announcement.shortDescription}
              link={`/g/announcements/${announcement.announcementId}`}
            />
          ))}
        </div>

        

      </div>
    </React.Fragment>
  )
} 